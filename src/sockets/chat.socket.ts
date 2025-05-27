import { Namespace, Socket } from 'socket.io'
import {
  ChatClientToServerEvents,
  ChatServerToClientEvents,
} from '../models/chat.socket.model.js'
import { SocketData } from '../models/main.socket.model.js'
import { checkAuth } from './utils/checkAuth.js'
import { ChatController } from '../controllers/chat.controller.js'
import { Message } from '../models/chat.model.js'

export class ChatSocketHandler {
  private chatController = new ChatController()
  private history: Message[] = []

  constructor(
    private chatNamespace: Namespace<
      ChatClientToServerEvents,
      ChatServerToClientEvents,
      {}, // если InterServerEvents нет — используем пустой интерфейс
      SocketData
    >
  ) {}

  registerHandlers() {
    checkAuth(this.chatNamespace)

    this.chatNamespace.on(
      'connection',
      (
        socket: Socket<
          ChatClientToServerEvents,
          ChatServerToClientEvents,
          {},
          SocketData
        >
      ) => {
        if (!socket.data.session) return
        console.log(socket.data.session.id, 'подключился к чату', socket.id)
        const socketSubscriptions = new Map<string, () => void>()

        socket.on('sendMessage', (room_id, content) => {
          this.chatController.sendMessage(socket, room_id, content, (ack) => {})
        })

        socket.on('setHistory', async (id) => {
          if (socketSubscriptions.has(id)) {
            socketSubscriptions.get(id)!()
            socketSubscriptions.delete(id)
          }
          this.chatController.getHistory(socket, id, (ack) => {
            this.history = ack
            socket.emit('getHistory', this.history)
          })

          const subscriptions = await this.chatController.subscribe(
            socket,
            id,
            (event) => {
              this.chatController.getHistory(socket, id, (ack) => {
                this.history = ack
                socket.emit('getHistory', this.history)
              })
            }
          )

          socketSubscriptions.set(id, subscriptions)

          socket.on('disconnect', () => {
            console.log(socket.data.session!.id, 'отключился от чата')
            socketSubscriptions.forEach((unsubscribe) => unsubscribe())
            socketSubscriptions.clear()
          })
        })
      }
    )
  }
}
