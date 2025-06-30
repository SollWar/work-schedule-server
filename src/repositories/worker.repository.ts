import { pool } from '../config/db.js'
import { TelegramAuth, Worker } from '../models/worker.model.js'
import { WorkplaceForSetting } from '../models/workplace.model.js'

export class WorkerRepository {
  async getAll(): Promise<Worker[] | null> {
    const { rows } = await pool.query<Worker>(
      `SELECT *
      FROM workers`
    )
    return rows || null
  }

  async findById(id: string): Promise<Worker | null> {
    const { rows } = await pool.query<Worker>(
      'SELECT * FROM workers WHERE id=$1',
      [id]
    )
    return rows[0] || null
  }

  async deleteWorkerById(id: string): Promise<boolean> {
    try {
      await pool.query('DELETE FROM workers WHERE id=$1', [id])
      return true
    } catch (error) {
      console.error('Error in deleteWorkerById:', error)
      return false
    }
  }

  async createWorker(
    id: string,
    name: string,
    color: string,
    access_id: string,
    telegram_id: string
  ): Promise<string> {
    try {
      await pool.query(`INSERT INTO workers VALUES ($1, $2, $3, $4);`, [
        id,
        name,
        color,
        access_id,
      ])
      await pool.query(`INSERT INTO workers_telegram_auth VALUES ($1,$2);`, [
        id,
        telegram_id,
      ])

      return id
    } catch (error) {
      console.error('Error in updateWorkerById:', error)
      return ''
    }
  }

  async findTelegramIdById(id: string): Promise<TelegramAuth[] | null> {
    const { rows } = await pool.query<TelegramAuth>(
      `SELECT telegram_id
      FROM workers_telegram_auth
      WHERE worker_id = $1`,
      [id]
    )
    return rows || null
  }

  async updateWorkerNameById(id: string, newName: string): Promise<boolean> {
    try {
      await pool.query(
        `UPDATE workers
        SET name = $1
        WHERE id=$2;`,
        [id, newName]
      )
      return true
    } catch (error) {
      console.error('Error in updateWorkerNameById:', error)
      return false
    }
  }

  async updateWorkerWorkplacesById(
    workerId: string,
    workplaces: WorkplaceForSetting[]
  ): Promise<boolean> {
    try {
      for (const wp of workplaces) {
        if (wp.enabled) {
          await pool.query(
            `INSERT INTO workers_workplaces (worker_id, workplace_id, editable)
              VALUES ($1, $2, $3)
              ON CONFLICT (worker_id, workplace_id)
              DO UPDATE SET editable = EXCLUDED.editable;`,
            [workerId, wp.id, wp.editable ?? 0]
          )
        } else {
          await pool.query(
            `DELETE FROM workers_workplaces
            WHERE worker_id = $1 AND workplace_id = $2;`,
            [workerId, wp.id]
          )
        }
      }
      return true
    } catch (error) {
      console.error('Error in updateWorkerNameById:', error)
      return false
    }
  }

  async updateWorkerById(
    id: string,
    updates: {
      name?: string
      color?: string
      access_id?: number
    }
  ): Promise<boolean> {
    try {
      const fieldsToUpdate = []
      const values = []
      let paramIndex = 1

      if (updates.name !== undefined) {
        fieldsToUpdate.push(`name = $${paramIndex}`)
        values.push(updates.name)
        paramIndex++
      }
      if (updates.color !== undefined) {
        fieldsToUpdate.push(`color = $${paramIndex}`)
        values.push(updates.color)
        paramIndex++
      }
      if (updates.access_id !== undefined) {
        fieldsToUpdate.push(`access_id = $${paramIndex}`)
        values.push(updates.access_id)
        paramIndex++
      }

      values.push(id)

      if (fieldsToUpdate.length === 0) {
        return false
      }

      const query = `
        UPDATE workers
        SET ${fieldsToUpdate.join(', ')}
        WHERE id = $${paramIndex}
      `

      await pool.query(query, values)
      return true
    } catch (error) {
      console.error('Error in updateWorkerById:', error)
      return false
    }
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
