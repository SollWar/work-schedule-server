import { Socket } from 'socket.io'
import { RoomService } from '../services/room.services.js'
import {
  MainClientToServerEvents,
  MainServerToClientEvents,
  SocketData,
} from '../models/main.socket.model.js'
import { Room } from '../models/room.model.js'
import { UserService } from '../services/user.services.js'

export class RoomController {
  private roomService = new RoomService()
  private userService = new UserService()

  async getRooms(
    socket: Socket<
      MainClientToServerEvents,
      MainServerToClientEvents,
      {},
      SocketData
    >,
    ack: (rooms: Room[]) => void
  ) {
    try {
      const userId = socket.data.session?.id
      if (!userId) {
        throw new Error('Unauthorized')
      }
      const rooms = await this.roomService.findAllByUserId(userId)
      ack(rooms!)
    } catch (err) {
      // единый формат ошибок
      // socket.emit('error', { code: 'ROOM_FETCH_FAILED', message: err.message });
      console.log('Ошибка получения комнат')
    }
  }

  async getRoomByid(
    socket: Socket<
      MainClientToServerEvents,
      MainServerToClientEvents,
      {},
      SocketData
    >,
    id: string,
    ack: (rooms: Room) => void
  ) {
    try {
      const userId = socket.data.session?.id
      if (!userId) {
        throw new Error('Unauthorized')
      }
      const room = await this.roomService.getById(id)
      ack(room!)
    } catch (err) {
      // единый формат ошибок
      // socket.emit('error', { code: 'ROOM_FETCH_FAILED', message: err.message });
      console.log('Ошибка получения комнат')
    }
  }

  async createRoom(
    socket: Socket<
      MainClientToServerEvents,
      MainServerToClientEvents,
      {},
      SocketData
    >,
    name: string,
    type: string,
    ack: (result: boolean, room_id: string) => void
  ) {
    try {
      const userId = socket.data.session?.id
      if (!userId) {
        throw new Error('Unauthorized')
      }
      const room_id = await this.roomService.create(userId, type, name)
      const allUsers = await this.userService.getAllUsers()

      allUsers.map((user) => {
        this.roomService.addUserToRoom(user.id, room_id)
      })
      ack(true, room_id)
    } catch (err) {}
  }

  async subscribe(
    socket: Socket<
      MainClientToServerEvents,
      MainServerToClientEvents,
      {},
      SocketData
    >,
    callback: (data: {
      operation: 'create' | 'update' | 'delete'
      user_id: string
      room_id: string
      data: Room
    }) => void
  ) {
    try {
      const userId = socket.data.session?.id
      if (!userId) {
        throw new Error('Unauthorized')
      }

      const { unsubscribe } = await this.roomService.subscribeToRooms(
        userId,
        callback
      )

      return unsubscribe
    } catch (err) {
      console.log('Ошибка подписки на комнаты', err)
      throw err
    }
  }
}
