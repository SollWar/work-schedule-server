import { Workplace } from '../models/workplace.model.js'
import { WorkplaceRepository } from '../repositories/workplace.repository.js'

export class WorkplaceService {
  private workplaceRepo = new WorkplaceRepository()

  async getById(id: string): Promise<Workplace | null> {
    return this.workplaceRepo.findById(id)
  }

  async getByWorkerId(worker_id: string): Promise<Workplace[] | null> {
    return this.workplaceRepo.findByWorkerId(worker_id)
  }
}
