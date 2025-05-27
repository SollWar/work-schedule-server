import { Socket } from 'socket.io'
import { Room } from '../models/room.model.js'
import { ChatService } from '../services/chat.services.js'
import {
  ChatClientToServerEvents,
  ChatServerToClientEvents,
} from '../models/chat.socket.model.js'
import { Message } from '../models/chat.model.js'
import { SocketData } from '../models/main.socket.model.js'

export class ChatController {
  private chatService: ChatService = new ChatService()

  async getHistory(
    socket: Socket<
      ChatClientToServerEvents,
      ChatServerToClientEvents,
      {},
      SocketData
    >,
    id: string,
    ack: (messages: Message[]) => void
  ) {
    try {
      const userId = socket.data.session?.id
      if (!userId) {
        throw new Error('Unauthorized')
      }
      const messages = await this.chatService.getAllMessagesByRoomI(id)
      ack(messages!)
    } catch (err) {
      // единый формат ошибок
      // socket.emit('error', { code: 'ROOM_FETCH_FAILED', message: err.message });
      console.log('Ошибка получения истории')
    }
  }

  async sendMessage(
    socket: Socket<
      ChatClientToServerEvents,
      ChatServerToClientEvents,
      {},
      SocketData
    >,
    room_id: string,
    content: string,
    ack: (result: boolean) => void
  ) {
    try {
      const userId = socket.data.session?.id
      if (!userId) {
        throw new Error('Unauthorized')
      }
      const result = await this.chatService.newMessage(userId, room_id, content)
      ack(result)
    } catch (err) {
      // единый формат ошибок
      // socket.emit('error', { code: 'ROOM_FETCH_FAILED', message: err.message });
      console.log('Ошибка получения истории')
    }
  }

  async subscribe(
    socket: Socket<
      ChatClientToServerEvents,
      ChatServerToClientEvents,
      {},
      SocketData
    >,
    id: string,
    callback: (data: {
      operation: 'create' | 'update' | 'delete'
      room_id: string
      message_id: string
      data: Message
    }) => void
  ) {
    try {
      const userId = socket.data.session?.id
      if (!userId) {
        throw new Error('Unauthorized')
      }

      const { unsubscribe } = await this.chatService.subscribeToRoomMessages(
        id,
        callback
      )

      return unsubscribe
    } catch (err) {
      console.log('Ошибка подписки на комнату', err)
      throw err
    }
  }
}
