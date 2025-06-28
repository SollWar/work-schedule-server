import { customAlphabet } from 'nanoid'
import { Workplace } from '../models/workplace.model.js'
import { WorkplaceRepository } from '../repositories/workplace.repository.js'

export class WorkplaceService {
  private workplaceRepo = new WorkplaceRepository()
  private nanoid = customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    12
  )

  async getAll(): Promise<Workplace[] | null> {
    return this.workplaceRepo.getAll()
  }

  async getById(id: string): Promise<Workplace | null> {
    return this.workplaceRepo.findById(id)
  }

  async getByWorkerId(worker_id: string): Promise<Workplace[] | null> {
    return this.workplaceRepo.findByWorkerId(worker_id)
  }

  async updateWorkplaceById(
    id: string,
    updates: {
      name?: string
      color?: string
    }
  ): Promise<boolean> {
    return this.workplaceRepo.updateWorkplaceById(id, updates)
  }

  async createWorplaceById(name: string, color: string): Promise<boolean> {
    const id = this.nanoid()
    return this.workplaceRepo.createWorplace(id, name, color)
  }
}
