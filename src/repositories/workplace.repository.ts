import { pool } from '../config/db.js'
import { Workplace } from '../models/workplace.model.js'

export class WorkplaceRepository {
  async getAll(): Promise<Workplace[] | null> {
    const { rows } = await pool.query<Workplace>(
      `SELECT *
        FROM workplaces`
    )
    return rows || null
  }

  async findById(id: string): Promise<Workplace | null> {
    const { rows } = await pool.query<Workplace>(
      'SELECT * FROM workplaces WHERE id=$1',
      [id]
    )
    return rows[0] || null
  }

  async findByWorkerId(worker_id: string): Promise<Workplace[] | null> {
    const { rows } = await pool.query<Workplace>(
      `SELECT w.*, ww.editable
      FROM workplaces w
      JOIN workers_workplaces ww ON w.id = ww.workplace_id
      WHERE ww.worker_id = $1;`,
      [worker_id]
    )
    return rows || null
  }

  async createWorplace(
    id: string,
    name: string,
    color: string
  ): Promise<boolean> {
    try {
      await pool.query(`INSERT INTO workplaces VALUES ($1, $2, $3);`, [
        id,
        name,
        color,
      ])
      return true
    } catch (error) {
      console.error('Error in updateWorkerById:', error)
      return false
    }
  }

  async updateWorkplaceById(
    id: string,
    updates: {
      name?: string
      color?: string
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

      values.push(id)

      if (fieldsToUpdate.length === 0) {
        return false
      }

      const query = `
          UPDATE workplaces
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
}
