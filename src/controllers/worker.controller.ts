import { WorkerService } from '../services/worker.services.js'
import { Worker } from '../models/worker.model.js'
import { RequestHandler } from 'express'

export class WorkerController {
  private workerService = new WorkerService()

  public getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.query
      if (typeof id !== 'string') {
        res.status(400).json({ error: 'Недостаточно параметров' })
      } else {
        const worker = await this.workerService.getById(id)
        if (worker) {
          res.json(worker)
        } else {
          res.status(400).json({ error: 'Worker не найден' })
        }
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  public getByTelegramId: RequestHandler = async (req, res) => {
    try {
      const { telegram_id } = req.query
      if (typeof telegram_id !== 'string') {
        res.status(400).json({ error: 'Недостаточно параметров' })
      } else {
        const worker = await this.workerService.getByTelegramId(telegram_id)
        if (worker) {
          res.json(worker)
        } else {
          res.status(400).json({ error: 'Worker не найден' })
        }
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  public getTelegramIdById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.query
      if (typeof id !== 'string') {
        res.status(400).json({ error: 'Недостаточно параметров' })
      } else {
        const telegramIds = await this.workerService.findTelegramIdById(id)
        if (telegramIds) {
          res.json(telegramIds)
        } else {
          res.status(400).json({ error: 'Worker не найден' })
        }
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  public getByWorkplaceId: RequestHandler = async (req, res) => {
    try {
      const { workplace_id } = req.query
      if (typeof workplace_id !== 'string') {
        res.status(400).json({ error: 'Недостаточно параметров' })
      } else {
        const workers = await this.workerService.getByWorkplaceId(workplace_id)
        if (workers) {
          res.json(workers)
        } else {
          res.status(400).json({ error: 'Worker не найден' })
        }
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}
