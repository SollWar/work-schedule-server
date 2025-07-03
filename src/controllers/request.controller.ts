import { RequestServices } from '../services/request.services.js'
import { RequestHandler } from 'express'
import { getSession } from '../config/session.js'

export class RequestController {
  private requestServices = new RequestServices()

  getAllRequests: RequestHandler = async (req, res) => {
    try {
      const requests = await this.requestServices.getAll()
      if (requests) {
        requests.sort((a, b) => a.created_at.localeCompare(b.created_at))
        res.json(requests)
      } else {
        res.status(400).json({ error: 'workers не найдены' })
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  public createRequest: RequestHandler = async (req, res) => {
    try {
      const { telegram_id, worker_name, workplace_name } = req.body
      const result = await this.requestServices.create(
        telegram_id,
        worker_name,
        workplace_name
      )
      res.json(result)
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  public deleteRequest: RequestHandler = async (req, res) => {
    try {
      const { telegram_id } = req.body
      if (typeof telegram_id !== 'string') {
        res.status(400).json({ error: 'Недостаточно параметров' })
      } else {
        const result = await this.requestServices.delete(telegram_id)
        res.json(result)
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}
