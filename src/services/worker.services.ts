import { WorkerRepository } from '../repositories/worker.repository.js'
import { Worker } from '../models/worker.model.js'

export class WorkerService {
  private workerRepo = new WorkerRepository()

  async getById(id: string): Promise<Worker | null> {
    return this.workerRepo.findById(id)
  }

  async getByTelegramId(telegram_id: string): Promise<Worker | null> {
    return this.workerRepo.findByTelegramId(telegram_id)
  }

  async getByWorkplaceId(workplace_id: string): Promise<Worker[] | null> {
    return this.workerRepo.findByWorkplaceId(workplace_id)
  }
}
