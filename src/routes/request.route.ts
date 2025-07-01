import express, { Router } from 'express'
import { RequestController } from '../controllers/request.controller.js'

const requestRouter: Router = express.Router()
const request = new RequestController()

requestRouter.get('/request/all', request.getAllRequests)
requestRouter.post('/request/create', request.createRequest)
requestRouter.delete('/request/delete', request.deleteRequest)

export default requestRouter
