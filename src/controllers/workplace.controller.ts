import { RequestHandler } from 'express'
import { Workplace } from '../models/workplace.model.js'
import { WorkplaceService } from '../services/workplace.services.js'

export class WorkplaceController {
  private workplaceService = new WorkplaceService()

  public getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.body
      const workplace = await this.workplaceService.getById(id)
      if (workplace) {
        res.json({ workplace })
      } else {
        res.status(400).json({ error: 'Workplace не найден' })
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  public getByWorkerId: RequestHandler = async (req, res) => {
    try {
      const { worker_id } = req.body
      const workplaces = await this.workplaceService.getByWorkerId(worker_id)
      if (workplaces?.length !== 0) {
        res.json({ workplaces })
      } else {
        res.status(400).json({ error: 'Workplaces не найдены' })
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}
