import { customAlphabet } from 'nanoid'
import { Message } from '../models/chat.model.js'
import { Room } from '../models/room.model.js'
import { ChatRepository } from '../repositories/chat.repository.js'
import { RoomRepository } from '../repositories/room.repository.js'

export class ChatService {
  private repo = new ChatRepository()
  private nanoid = customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    12
  )

  async getAllMessagesByRoomI(id: string): Promise<Message[] | null> {
    return this.repo.getAllMessagesByRoomId(id)
  }

  async newMessage(
    user_id: string,
    room_id: string,
    content: string
  ): Promise<boolean> {
    const message_id = this.nanoid()
    return this.repo.createMessage(message_id, user_id, room_id, content)
  }

  async subscribeToRoomMessages(
    id: string,
    callback: (data: {
      operation: 'create' | 'update' | 'delete'
      room_id: string
      message_id: string
      data: Message
    }) => void
  ) {
    return this.repo.subscribeToRoomMessages(id, (event) => {
      switch (event.operation) {
        case 'INSERT':
          callback({
            operation: 'create',
            room_id: event.room_id,
            message_id: event.message_id,
            data: event.data,
          })
          break
        case 'UPDATE':
          callback({
            operation: 'update',
            room_id: event.room_id,
            message_id: event.message_id,
            data: event.data,
          })
          break
        case 'DELETE':
          callback({
            operation: 'delete',
            room_id: event.room_id,
            message_id: event.message_id,
            data: event.data,
          })
          break
      }
    })
  }
}
