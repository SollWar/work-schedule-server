import express, { Router } from 'express'
import { WorkplaceController } from '../controllers/workplace.controller.js'

const workplaceRouter: Router = express.Router()
const workplace = new WorkplaceController()

workplaceRouter.get('/workplace', workplace.getById)
workplaceRouter.post('/workplace/update', workplace.updateWorkplaceById)
workplaceRouter.post('/workplace/create', workplace.createWorkplace)
workplaceRouter.delete('/workplace/delete', workplace.deleteWorkplaceById)
workplaceRouter.get('/workplace/user', workplace.getByWorkerId)
workplaceRouter.get('/workplace/all', workplace.getAllWorkplaces)

export default workplaceRouter
