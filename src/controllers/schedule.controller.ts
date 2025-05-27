import { RequestHandler } from 'express'
import { Schedule } from '../models/schedule.model.js'
import { ScheduleService } from '../services/schedule.services.js'

export class ScheduleController {
  private scheduleService = new ScheduleService()

  public getByWorkerId: RequestHandler = async (req, res) => {
    try {
      const { worker_id, year, month } = req.body
      const schedule = await this.scheduleService.getByWorkerId(
        worker_id,
        year,
        month
      )
      if (schedule) {
        res.json({ schedule })
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}
