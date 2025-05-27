import express, { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'

const authRouter: Router = express.Router()
const auth = new AuthController()

authRouter.post('/reg', auth.register)
authRouter.post('/login', auth.login)
authRouter.post('/logout', auth.logout)

export default authRouter
