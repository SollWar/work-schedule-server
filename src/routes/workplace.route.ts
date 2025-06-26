import express, { Router } from 'express'
import { WorkerController } from '../controllers/worker.controller.js'
import { WorkplaceController } from '../controllers/workplace.controller.js'

const workplaceRouter: Router = express.Router()
const workplace = new WorkplaceController()

workplaceRouter.get('/workplace', workplace.getById)
workplaceRouter.get('/workplaces', workplace.getByWorkerId)
workplaceRouter.get('/allworkplaces', workplace.getAllWorkplaces)

export default workplaceRouter
