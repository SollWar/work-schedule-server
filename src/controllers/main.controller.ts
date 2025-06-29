import { RequestHandler } from 'express'
import { WorkerService } from '../services/worker.services.js'
import { WorkplaceService } from '../services/workplace.services.js'
import { MainData } from '../models/main.model.js'
import { getSession } from '../config/session.js'

export class MainController {
  private workerService = new WorkerService()
  private workplaceService = new WorkplaceService()

  public getMainDataFromTelegramId: RequestHandler = async (req, res) => {
    try {
      const session = await getSession(req, res)
      //const { telegram_id } = req.query
      const telegram_id = session.id
      if (typeof telegram_id !== 'string') {
        res.status(400).json({ error: 'Недостаточно параметров' })
      } else {
        const worker = await this.workerService.getByTelegramId(telegram_id)
        if (worker) {
          if (worker.access_id === 1) {
            const workers = await this.workerService.getAll()
            const workplaces = await this.workplaceService.getAll()
            if (workers && workplaces) {
              workers.sort((a, b) => a.name.localeCompare(b.name))
              workplaces.sort((a, b) => a.name.localeCompare(b.name))
              const mainData: MainData = {
                user: worker,
                availableWorkers: workers,
                availableWorkplaces: workplaces,
              }
              res.json(mainData)
            }
          } else {
            const workplaces = await this.workplaceService.getByWorkerId(
              worker.id
            )
            if (workplaces) {
              workplaces.sort((a, b) => a.name.localeCompare(b.name))
              const mainData: MainData = {
                user: worker,
                availableWorkers: [worker],
                availableWorkplaces: workplaces,
              }
              res.json(mainData)
            } else {
              res.status(400).json({ error: 'Workplaces не найдены' })
            }
          }
        } else {
          res.status(400).json({ error: 'Worker не найден' })
        }
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}
