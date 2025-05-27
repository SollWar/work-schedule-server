import { EventEmitter } from 'events'

export interface VoiceRoomEvents {
  userJoined: (roomId: string, userId: string) => void
  userLeft: (roomId: string, userId: string) => void
}

class VoiceRoomStore extends EventEmitter {
  private rooms: Map<string, Set<string>>

  constructor() {
    super()
    this.rooms = new Map()
  }

  private createRoom(roomId: string): void {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set())
    }
  }

  isRoomExist(roomId: string) {
    return this.rooms.has(roomId)
  }

  addUserToRoom(roomId: string, userId: string): void {
    this.createRoom(roomId)
    this.rooms.get(roomId)!.add(userId)
    this.emit('userChanged', this.getAllRooms())
  }

  removeUser(userId: string): void {
    this.rooms.forEach((users, room) => {
      users.delete(userId)
      this.emit('userChanged', this.getAllRooms())
      if (users.size === 0) {
        this.rooms.delete(room)
      }
    })
  }

  getUsersInRoom(roomId: string): string[] {
    return this.rooms.has(roomId) ? Array.from(this.rooms.get(roomId)!) : []
  }

  getAllRooms(): Record<string, string[]> {
    const result: Record<string, string[]> = {}
    for (const [roomId, users] of this.rooms.entries()) {
      result[roomId] = Array.from(users)
    }
    return result
  }

  isUserInRoom(roomId: string, userId: string): boolean {
    return this.rooms.has(roomId) && this.rooms.get(roomId)!.has(userId)
  }
}

export const voiceRoomStore = new VoiceRoomStore()
