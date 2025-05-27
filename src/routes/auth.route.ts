import express, { Router } from 'express'
import { WorkerController } from '../controllers/worker.controller.js'

const authRouter: Router = express.Router()
const auth = new WorkerController()

authRouter.get('/login', auth.getByTelegramId)

export default authRouter
