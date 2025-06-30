import express, { Router } from 'express'
import { WorkerController } from '../controllers/worker.controller.js'
import { ScheduleController } from '../controllers/schedule.controller.js'

const scheduleRouter: Router = express.Router()
const schedule = new ScheduleController()

scheduleRouter.get('/schedule/worker', schedule.getByWorkerId)
scheduleRouter.get('/schedule/workplace', schedule.getByWorkplaceId)
scheduleRouter.post('/schedule/update', schedule.updateSchedule)

export default scheduleRouter
