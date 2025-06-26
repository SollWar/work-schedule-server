import { RequestHandler } from 'express'
import { Workplace } from '../models/workplace.model.js'
import { WorkplaceService } from '../services/workplace.services.js'

export class WorkplaceController {
  private workplaceService = new WorkplaceService()

  public getAllWorkplaces: RequestHandler = async (req, res) => {
    try {
      const workers = await this.workplaceService.getAll()
      if (workers) {
        res.json(workers)
      } else {
        res.status(400).json({ error: 'workers не найдены' })
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  public getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.query
      if (typeof id !== 'string') {
        res.status(400).json({ error: 'Недостаточно параметров' })
      } else {
        const workplace = await this.workplaceService.getById(id)
        if (workplace) {
          res.json(workplace)
        } else {
          res.status(400).json({ error: 'Workplace не найден' })
        }
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  public getByWorkerId: RequestHandler = async (req, res) => {
    try {
      const { worker_id } = req.query
      if (typeof worker_id !== 'string') {
        res.status(400).json({ error: 'Недостаточно параметров' })
      } else {
        const workplaces = await this.workplaceService.getByWorkerId(worker_id)
        if (workplaces?.length !== 0) {
          res.json(workplaces)
        } else {
          res.status(400).json({ error: 'Workplaces не найдены' })
        }
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}
