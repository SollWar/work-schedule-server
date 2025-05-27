import { pool } from '../config/db.js'
import { Room } from '../models/room.model.js'

export class RoomRepository {
  async findById(id: string): Promise<Room | null> {
    const { rows } = await pool.query<Room>('SELECT * FROM rooms WHERE id=$1', [
      id,
    ])
    return rows[0] || null
  }

  async findAll(): Promise<Room[] | null> {
    const { rows } = await pool.query<Room>('SELECT * FROM rooms')
    return rows || null
  }

  async findAllByUserId(id: string): Promise<Room[] | null> {
    const { rows } = await pool.query<Room>(
      'SELECT rooms.* FROM rooms JOIN user_rooms ON user_rooms.room_id = rooms.id WHERE user_rooms.user_id = $1',
      [id]
    )
    return rows || null
  }

  async create(
    room_id: string,
    owner_id: string,
    type: string,
    name: string
  ): Promise<void> {
    await pool.query('INSERT INTO rooms VALUES ($1, $2 ,$3, $4);', [
      room_id,
      owner_id,
      type,
      name,
    ])
  }

  async addUserToRoom(user_id: string, room_id: string): Promise<void> {
    const query = 'INSERT INTO user_rooms (user_id, room_id) VALUES ($1, $2);'
    const params = [user_id, room_id]
    await pool.query(query, params)
  }

  async subscribeToRooms(
    user_id: string,
    callback: (data: {
      operation: 'INSERT' | 'UPDATE' | 'DELETE'
      user_id: string
      room_id: string
      data: Room
    }) => void
  ) {
    const client = await pool.connect()

    // Подписываемся на канал
    await client.query('LISTEN room_changes')

    // Обработчик уведомлений
    client.on('notification', (msg) => {
      if (msg.channel === 'room_changes') {
        const payload = JSON.parse(msg.payload || '{}')

        // Фильтруем по room_id
        if (payload.user_id === user_id) {
          callback(payload)
        }
      }
    })

    // Возвращаем функцию для отписки
    return {
      unsubscribe: async () => {
        client.removeAllListeners('notification')
        await client.query('UNLISTEN room_changes')
        client.release()
      },
    }
  }
}
