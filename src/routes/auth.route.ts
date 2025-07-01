import express, { Router } from 'express'
import { WorkerController } from '../controllers/worker.controller.js'
import { AuthController } from '../controllers/auth.controller.js'

const authRouter: Router = express.Router()
const worker = new WorkerController()
const auth = new AuthController()

authRouter.get('/login', worker.getByTelegramId)
authRouter.post('/login/telegram', auth.telegramAuth)

export default authRouter
