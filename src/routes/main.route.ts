import express, { Router } from 'express'
import { WorkerController } from '../controllers/worker.controller.js'
import { MainController } from '../controllers/main.controller.js'

const mainRouter: Router = express.Router()
const main = new MainController()

mainRouter.get('/main', main.getMainData)

export default mainRouter
