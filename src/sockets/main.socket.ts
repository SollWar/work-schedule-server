import { Namespace, Socket } from 'socket.io'
import { RoomController } from '../controllers/room.controller.js'
import {
  MainClientToServerEvents,
  MainServerToClientEvents,
  SocketData,
} from '../models/main.socket.model.js'
import { parse } from 'cookie'
import { sessionOptions } from '../config/session.js'
import { unsealData } from 'iron-session'
import { AuthSession } from '../models/auth.model.js'
import { UserController } from '../controllers/user.controller.js'
import { checkAuth } from './utils/checkAuth.js'
import { unsubscribe } from 'diagnostics_channel'
import { voiceRoomStore } from '../temp/voiceRoomStore.js'

export class MainSocketHandler {
  private roomController = new RoomController()
  private userController = new UserController()

  constructor(
    private mainNamespace: Namespace<
      MainClientToServerEvents,
      MainServerToClientEvents,
      {}, // если InterServerEvents нет — используем пустой интерфейс
      SocketData
    >
  ) {}

  registerHandlers() {
    checkAuth(this.mainNamespace)

    this.mainNamespace.on(
      'connection',
      async (
        socket: Socket<
          MainClientToServerEvents,
          MainServerToClientEvents,
          {},
          SocketData
        >
      ) => {
        if (!socket.data.session) return
        const handleUserChanged = (
          usersInVoiceRooms: Record<string, string[]>
        ) => {
          socket.emit('setUsersInVoiceRooms', usersInVoiceRooms)
        }

        voiceRoomStore.on('userChanged', handleUserChanged)

        socket.on('getUsersInVoiceRooms', () => {
          socket.emit('setUsersInVoiceRooms', voiceRoomStore.getAllRooms())
        })

        const unsubscribe = await this.roomController.subscribe(
          socket,
          (event) => {
            this.roomController.getRooms(socket, (ack) => {
              socket.emit('getRooms', ack)
            })
            console.log(event)
          }
        )

        socket.on('getUsersLogin', (callback) => {
          this.userController.getIdToLogin(socket, (ask) => {
            callback(ask)
          })
        })

        this.roomController.getRooms(socket, (ack) => {
          socket.emit('getRooms', ack)
        })
        this.userController.getUser(socket, socket.data.session.id, (ack) => {
          socket.emit('getUser', ack)
        })

        socket.on('setRoom', (id) => {
          this.roomController.getRoomByid(socket, id, (ack) => {})
        })

        socket.on('createRoom', (name, type) => {
          this.roomController.createRoom(
            socket,
            name,
            type,
            (result, room_id) => {
              if (result) {
                socket.emit('roomCreated', room_id)
              }
            }
          )
        })

        socket.on('disconnect', () => {
          console.log(socket.id, 'отключился')
          voiceRoomStore.off('userChanged', handleUserChanged)
          unsubscribe()
        })
      }
    )
  }
}
