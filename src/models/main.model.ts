import { Worker } from './worker.model.js'
import { Workplace } from './workplace.model.js'

export interface MainData {
  user: Worker
  availableWorkers: Worker[]
  availableWorkplaces: Workplace[]
}
