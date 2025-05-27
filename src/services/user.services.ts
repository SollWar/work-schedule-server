import { customAlphabet } from 'nanoid'
import { UserRepository } from '../repositories/user.repository.js'
import bcrypt from 'bcrypt'
import { User } from '../models/user.model.js'

export class UserService {
  private repo = new UserRepository()
  private nanoid = customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    12
  )
  private saltRounds = 12

  async register(login: string, password: string): Promise<string> {
    const existing = await this.repo.findByLogin(login)
    if (existing) throw new Error('User exists')
    const id = this.nanoid()
    const hash = await bcrypt.hash(password, this.saltRounds)
    const user: User = {
      id,
      login,
      password_hash: hash,
      status: 'online',
      created_at: new Date(),
    }
    await this.repo.create(user)
    return id
  }

  async idToLogin(): Promise<Record<string, string>> {
    const idToLogin = await this.repo.getAllUserIdToLogin()
    if (!idToLogin) throw new Error('Нет пользователей')
    return idToLogin
  }

  async authenticate(login: string, password: string): Promise<string> {
    const user = await this.repo.findByLogin(login)
    if (!user) throw new Error('Invalid credentials')
    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) throw new Error('Invalid credentials')
    return user.id
  }

  async getById(id: string): Promise<User | null> {
    return this.repo.findById(id)
  }

  async getAllUsers(): Promise<User[]> {
    return this.repo.getAllUsers()
  }
}
