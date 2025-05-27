import { pool } from '../config/db.js'
import { Message } from '../models/chat.model.js'
import { Room } from '../models/room.model.js'

export class ChatRepository {
  async getAllMessagesByRoomId(id: string): Promise<Message[] | null> {
    const query =
      'SELECT messages.* FROM rooms JOIN messages ON messages.room_id = rooms.id WHERE messages.room_id = $1'
    const params = [id]
    const { rows } = await pool.query<Message>(query, params)
    return rows || null
  }

  async createMessage(
    message_id: string,
    user_id: string,
    room_id: string,
    content: string
  ): Promise<boolean> {
    const query = 'INSERT INTO messages VALUES ($1, $2, $3, $4)'
    const params = [message_id, user_id, room_id, content]
    const { rows } = await pool.query(query, params)
    if (rows) return true
    return false
  }

  async subscribeToRoomMessages(
    roomId: string,
    callback: (data: {
      operation: 'INSERT' | 'UPDATE' | 'DELETE'
      room_id: string
      message_id: string
      data: Message
    }) => void
  ) {
    const client = await pool.connect()

    // Подписываемся на канал
    await client.query('LISTEN message_changes')

    // Обработчик уведомлений
    client.on('notification', (msg) => {
      if (msg.channel === 'message_changes') {
        const payload = JSON.parse(msg.payload || '{}')

        // Фильтруем по room_id
        if (payload.room_id === roomId) {
          callback(payload)
        }
      }
    })

    // Возвращаем функцию для отписки
    return {
      unsubscribe: async () => {
        client.removeAllListeners('notification')
        await client.query('UNLISTEN message_changes')
        client.release()
      },
    }
  }
}
