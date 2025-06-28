import express, { Router } from 'express'
import { WorkerController } from '../controllers/worker.controller.js'

const workerRouter: Router = express.Router()
const worker = new WorkerController()

workerRouter.get('/user', worker.getById)
workerRouter.post('/user/update', worker.updateWorker)
workerRouter.post('/user/create', worker.createWorker)
workerRouter.post('/user/delete', worker.deleteWorker)
workerRouter.post('/user/update/workplaces', worker.updateWorkerWorkplacesById)
workerRouter.get('/users', worker.getByWorkplaceId)
workerRouter.get('/allusers', worker.getAllWorkers)
workerRouter.get('/telegram', worker.getTelegramIdById)

export default workerRouter
