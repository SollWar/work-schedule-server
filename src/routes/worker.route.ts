import express, { Router } from 'express'
import { WorkerController } from '../controllers/worker.controller.js'

const workerRouter: Router = express.Router()
const worker = new WorkerController()

workerRouter.get('/worker', worker.getById)
workerRouter.post('/worker/update', worker.updateWorker)
workerRouter.post('/worker/create', worker.createWorker)
workerRouter.delete('/worker/delete', worker.deleteWorker)
workerRouter.post(
  '/worker/update/workplaces',
  worker.updateWorkerWorkplacesById
)
workerRouter.get('/worker/workplace', worker.getByWorkplaceId)
workerRouter.get('/worker/all', worker.getAllWorkers)
workerRouter.get('/worker/telegram', worker.getTelegramIdById)

export default workerRouter
