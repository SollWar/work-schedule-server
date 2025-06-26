import { WorkerService } from '../services/worker.services.js'
import { RequestHandler } from 'express'
import { getSession } from '../config/session.js'

export class WorkerController {
  private workerService = new WorkerService()

  public getAllWorkers: RequestHandler = async (req, res) => {
    try {
      const workers = await this.workerService.getAll()
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
      const session = await getSession(req, res)
      //const { telegram_id } = req.query
      const telegram_id = session.id
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

  // id: string,
  //   updates: {
  //     name?: string
  //     color?: string
  //     access_id?: number
  //   }

  public updateWorker: RequestHandler = async (req, res) => {
    try {
      const { id, name, color, access_id } = req.body
      if (typeof id !== 'string') {
        res.status(400).json({ error: 'Недостаточно параметров' })
      } else {
        const access_idNum = Number(access_id)
        const result = await this.workerService.updateWorkerById(id, {
          name,
          color,
          access_id: isNaN(access_idNum) ? undefined : access_idNum,
        })
        res.json(result)
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
