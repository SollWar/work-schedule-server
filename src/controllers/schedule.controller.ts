import { RequestHandler } from 'express'
import { Schedule } from '../models/schedule.model.js'
import { ScheduleService } from '../services/schedule.services.js'

export class ScheduleController {
  private scheduleService = new ScheduleService()

  public getByWorkerId: RequestHandler = async (req, res) => {
    try {
      const { worker_id, year, month } = req.query
      if (
        typeof worker_id !== 'string' ||
        typeof year !== 'string' ||
        typeof month !== 'string'
      ) {
        res.status(400).json({ error: 'Недостаточно параметров' })
      } else {
        const yearNum = Number(year)
        const monthNum = Number(month)
        const schedule = await this.scheduleService.getByWorkerId(
          worker_id,
          yearNum,
          monthNum
        )
        if (schedule) {
          res.json(schedule)
        }
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  public getByWorkplaceId: RequestHandler = async (req, res) => {
    try {
      const { workplace_id, year, month } = req.query
      if (
        typeof workplace_id !== 'string' ||
        typeof year !== 'string' ||
        typeof month !== 'string'
      ) {
        res.status(400).json({ error: 'Недостаточно параметров' })
      } else {
        const yearNum = Number(year)
        const monthNum = Number(month)
        const schedules = await this.scheduleService.getByWorkplaceId(
          workplace_id,
          yearNum,
          monthNum
        )
        if (schedules) {
          res.json(schedules)
        }
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}
