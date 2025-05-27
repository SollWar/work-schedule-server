import { pool } from '../config/db.js'
import { Schedule } from '../models/schedule.model.js'

export class ScheduleRepository {
  async findByWorkerId(
    worker_id: string,
    year: number,
    month: number
  ): Promise<Schedule | null> {
    const { rows } = await pool.query<Schedule>(
      `SELECT *
      FROM workers_schedules
      WHERE worker_id = $1 and year = $2 and month = $3`,
      [worker_id, year, month]
    )
    return rows[0] || null
  }
}
