import { pool } from '../config/db.js'
import { User } from '../models/user.model.js'

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const { rows } = await pool.query<User>('SELECT * FROM users WHERE id=$1', [
      id,
    ])
    return rows[0] || null
  }

  async findByLogin(login: string): Promise<User | null> {
    const { rows } = await pool.query<User>(
      'SELECT * FROM users WHERE login=$1',
      [login]
    )
    return rows[0] || null
  }

  async getAllUserIdToLogin(): Promise<Record<string, string> | null> {
    const { rows } = await pool.query<Record<string, string>>(
      'SELECT id, login FROM users'
    )
    const result = rows.reduce((acc, row) => {
      acc[row.id] = row.login
      return acc
    }, {} as Record<string, string>)
    return result || null
  }

  async getAllUsers(): Promise<User[]> {
    const { rows } = await pool.query<User>('SELECT * FROM users;')
    return rows
  }

  async create(user: User): Promise<void> {
    await pool.query(
      'INSERT INTO users (id, login, password_hash, was, created_at) VALUES ($1,$2,$3,$4,$5)',
      [user.id, user.login, user.password_hash, user.status, user.created_at]
    )
  }
}
