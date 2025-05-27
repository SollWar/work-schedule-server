import { pool } from '../config/db.js'
import { Workplace } from '../models/workplace.model.js'

export class WorkplaceRepository {
  async findById(id: string): Promise<Workplace | null> {
    const { rows } = await pool.query<Workplace>(
      'SELECT * FROM workplaces WHERE id=$1',
      [id]
    )
    return rows[0] || null
  }

  async findByWorkerId(worker_id: string): Promise<Workplace[] | null> {
    const { rows } = await pool.query<Workplace>(
      `SELECT w.*
      FROM workplaces w
      JOIN workers_workplaces ww ON w.id = ww.workplace_id
      WHERE ww.worker_id = $1;`,
      [worker_id]
    )
    return rows || null
  }
}
