import express, { Router } from 'express'
import { WorkplaceController } from '../controllers/workplace.controller.js'

const workplaceRouter: Router = express.Router()
const workplace = new WorkplaceController()

workplaceRouter.get('/workplace', workplace.getById)
workplaceRouter.post('/workplace/update', workplace.updateWorkplaceById)
workplaceRouter.post('/workplace/create', workplace.createWorkplace)
workplaceRouter.get('/workplaces', workplace.getByWorkerId)
workplaceRouter.get('/allworkplaces', workplace.getAllWorkplaces)

export default workplaceRouter
