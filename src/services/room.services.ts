import { customAlphabet } from 'nanoid'
import { Room } from '../models/room.model.js'
import { RoomRepository } from '../repositories/room.repository.js'

export class RoomService {
  private repo = new RoomRepository()
  private nanoid = customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    12
  )

  async getById(id: string): Promise<Room | null> {
    return this.repo.findById(id)
  }

  async findAll(): Promise<Room[] | null> {
    return this.repo.findAll()
  }

  async findAllByUserId(id: string): Promise<Room[] | null> {
    return this.repo.findAllByUserId(id)
  }

  async create(owner_id: string, type: string, name: string): Promise<string> {
    const room_id = this.nanoid()
    await this.repo.create(room_id, owner_id, type, name)
    return room_id
  }

  async addUserToRoom(user_id: string, room_id: string): Promise<void> {
    return this.repo.addUserToRoom(user_id, room_id)
  }

  async subscribeToRooms(
    user_id: string,
    callback: (data: {
      operation: 'create' | 'update' | 'delete'
      user_id: string
      room_id: string
      data: Room
    }) => void
  ) {
    return this.repo.subscribeToRooms(user_id, (event) => {
      switch (event.operation) {
        case 'INSERT':
          callback({
            operation: 'create',
            user_id: event.user_id,
            room_id: event.room_id,
            data: event.data,
          })
          break
        case 'UPDATE':
          callback({
            operation: 'update',
            user_id: event.user_id,
            room_id: event.room_id,
            data: event.data,
          })
          break
        case 'DELETE':
          callback({
            operation: 'delete',
            user_id: event.user_id,
            room_id: event.room_id,
            data: event.data,
          })
          break
      }
    })
  }
}
