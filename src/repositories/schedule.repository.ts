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

  async updateByWorkerId(
    worker_id: string,
    year: number,
    month: number,
    schedule: string
  ): Promise<boolean> {
    try {
      await pool.query(
        `INSERT INTO workers_schedules (worker_id, year, month, schedule)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (worker_id, year, month) 
         DO UPDATE SET schedule = EXCLUDED.schedule`,
        [worker_id, year, month, schedule]
      )
      return true
    } catch (error) {
      console.error('Error in updateByWorkerId:', error)
      return false
    }
  }

  async findByWorkplaceId(
    workplace_id: string,
    year: number,
    month: number
  ): Promise<Schedule[] | null> {
    const { rows } = await pool.query<Schedule>(
      `SELECT 
        ws.worker_id,
        ws.year,
        ws.month,
        ws.schedule
      FROM 
        workers_schedules ws
      JOIN 
        workers w ON ws.worker_id = w.id
      JOIN 
        workers_workplaces ww ON w.id = ww.worker_id
      WHERE 
        ww.workplace_id = $1
        and ws.year = $2
        and ws.month = $3
      ORDER BY 
        w.name, ws.year, ws.month`,
      [workplace_id, year, month]
    )
    return rows || null
  }
}
