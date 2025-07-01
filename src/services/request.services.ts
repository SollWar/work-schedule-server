import { RequestRepository } from '../repositories/request.repository.js'
import { Request } from '../models/request.model.js'

export class RequestServices {
  private requestRepo = new RequestRepository()

  async getAll(): Promise<Request[] | null> {
    return this.requestRepo.getAll()
  }

  async create(
    telegram_id: string,
    worker_name: string,
    workplace_name: string
  ): Promise<boolean> {
    return this.requestRepo.create(telegram_id, worker_name, workplace_name)
  }

  async delete(telegram_id: string): Promise<boolean> {
    return this.requestRepo.delete(telegram_id)
  }
}
