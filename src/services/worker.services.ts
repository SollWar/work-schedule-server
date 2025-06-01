import { WorkerRepository } from '../repositories/worker.repository.js'
import { TelegramAuth, Worker } from '../models/worker.model.js'

export class WorkerService {
  private workerRepo = new WorkerRepository()

  async getById(id: string): Promise<Worker | null> {
    return this.workerRepo.findById(id)
  }

  async getByTelegramId(telegram_id: string): Promise<Worker | null> {
    return this.workerRepo.findByTelegramId(telegram_id)
  }

  async findTelegramIdById(id: string): Promise<TelegramAuth[] | null> {
    return this.workerRepo.findTelegramIdById(id)
  }

  async updateWorkerById(
    id: string,
    updates: {
      name?: string
      color?: string
      access_id?: number
    }
  ): Promise<boolean> {
    return this.updateWorkerById(id, updates)
  }

  async getByWorkplaceId(workplace_id: string): Promise<Worker[] | null> {
    return this.workerRepo.findByWorkplaceId(workplace_id)
  }
}
