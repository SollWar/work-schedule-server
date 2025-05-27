import express, { Router } from 'express'
import { WorkerController } from '../controllers/worker.controller.js'

const workerRouter: Router = express.Router()
const worker = new WorkerController()

workerRouter.get('/user', worker.getById)
workerRouter.get('/users', worker.getByWorkplaceId)

export default workerRouter
