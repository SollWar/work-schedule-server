import express, { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'

const userRouter: Router = express.Router()
// const user = new UserController()

// userRouter.get('/user', user.getUser)

export default userRouter
