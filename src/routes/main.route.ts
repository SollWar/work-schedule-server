import express, { Router } from 'express'
import { MainController } from '../controllers/main.controller.js'

const mainRouter: Router = express.Router()
const main = new MainController()

mainRouter.get('/main', main.getMainDataFromTelegramId)

export default mainRouter
