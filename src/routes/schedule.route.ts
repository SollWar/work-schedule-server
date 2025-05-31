import express, { Router } from 'express'
import { WorkerController } from '../controllers/worker.controller.js'
import { ScheduleController } from '../controllers/schedule.controller.js'

const scheduleRouter: Router = express.Router()
const schedule = new ScheduleController()

scheduleRouter.get('/schedule', schedule.getByWorkerId)
scheduleRouter.get('/schedules', schedule.getByWorkplaceId)
scheduleRouter.post('/up_schedule', schedule.updateSchedule)

export default scheduleRouter
