import { pool } from '../config/db.js'
import { Request } from '../models/request.model.js'

export class RequestRepository {
  async getAll(): Promise<Request[] | null> {
    const { rows } = await pool.query<Request>(`SELECT * FROM requests`)
    return rows || null
  }

  async create(
    telegram_id: string,
    worker_name: string,
    workplace_name: string
  ): Promise<boolean> {
    try {
      await pool.query(
        `INSERT INTO requests 
        VALUES ($1, $2, $3);`,
        [telegram_id, worker_name, workplace_name]
      )
      return true
    } catch {
      return false
    }
  }

  async delete(telegram_id: string): Promise<boolean> {
    try {
      await pool.query(
        `DELETE FROM requests 
        WHERE telegram_id=$1;`,
        [telegram_id]
      )
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
