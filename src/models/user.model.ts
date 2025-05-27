export interface User {
  id: string
  login: string
  password_hash: string
  status: 'online' | 'offline'
  created_at: Date
}

export type PublicUser = Omit<User, 'password_hash'>
