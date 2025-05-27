import { AuthSession } from './auth.model.js'
import { Room } from './room.model.js'
import { PublicUser, User } from './user.model.js'

export interface MainClientToServerEvents {
  setRoom: (id: string) => void
  createRoom: (name: string, type: string) => void
  getUsersLogin: (callback: (response: Record<string, string>) => void) => void
  getUsersInVoiceRooms: () => void
}

export interface MainServerToClientEvents {
  setUsersInVoiceRooms: (usersInVoiceRooms: Record<string, string[]>) => void
  roomCreated: (room_id: string) => void
  getRooms: (rooms: Room[]) => void
  getUser: (user: PublicUser) => void
}

export interface SocketData {
  session?: AuthSession
}
