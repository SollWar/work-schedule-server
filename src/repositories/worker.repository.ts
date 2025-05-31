import { pool } from '../config/db.js'
import { Worker } from '../models/worker.model.js'

export class WorkerRepository {
  async findById(id: string): Promise<Worker | null> {
    const { rows } = await pool.query<Worker>(
      'SELECT * FROM workers WHERE id=$1',
      [id]
    )
    return rows[0] || null
  }

  async findByTelegramId(telegram_id: string): Promise<Worker | null> {
    const { rows } = await pool.query<Worker>(
      `SELECT w.*
      FROM workers w
      JOIN workers_telegram_auth auth ON w.id = auth.worker_id
      WHERE auth.telegram_id = $1
      `,
      [telegram_id]
    )
    return rows[0] || null
  }

  async findByWorkplaceId(workplace_id: string): Promise<Worker[] | null> {
    const { rows } = await pool.query<Worker>(
      `SELECT w.*, ww.editable
      FROM workers w
      JOIN workers_workplaces ww ON w.id = ww.worker_id
      WHERE ww.workplace_id = $1`,
      [workplace_id]
    )
    return rows || null
  }
}
