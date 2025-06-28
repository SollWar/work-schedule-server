import { WorkerRepository } from '../repositories/worker.repository.js'
import { TelegramAuth, Worker } from '../models/worker.model.js'
import { WorkplaceForSetting } from '../models/workplace.model.js'
import { customAlphabet } from 'nanoid'

export class WorkerService {
  private workerRepo = new WorkerRepository()
  private nanoid = customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    12
  )

  async getAll(): Promise<Worker[] | null> {
    return this.workerRepo.getAll()
  }

  async updateWorkerWorkplacesById(
    workerId: string,
    workplaces: WorkplaceForSetting[]
  ): Promise<boolean> {
    return this.workerRepo.updateWorkerWorkplacesById(workerId, workplaces)
  }

  async getById(id: string): Promise<Worker | null> {
    return this.workerRepo.findById(id)
  }

  async getByTelegramId(telegram_id: string): Promise<Worker | null> {
    return this.workerRepo.findByTelegramId(telegram_id)
  }

  async findTelegramIdById(id: string): Promise<TelegramAuth[] | null> {
    return this.workerRepo.findTelegramIdById(id)
  }
  async deleteWorkerById(id: string): Promise<boolean> {
    try {
      return this.workerRepo.deleteWorkerById(id)
    } catch (error) {
      console.log(error)
      return false
    }
  }

  async createWorker(
    name: string,
    color: string,
    access_id: string,
    telegram_id: string
  ): Promise<boolean> {
    const id = this.nanoid()
    return this.workerRepo.createWorker(id, name, color, access_id, telegram_id)
  }

  async updateWorkerById(
    id: string,
    updates: {
      name?: string
      color?: string
      access_id?: number
    }
  ): Promise<boolean> {
    return this.workerRepo.updateWorkerById(id, updates)
  }

  // async updateWorkerNameById(id: string, newName: string): Promise<boolean> {
  //   return th
  // }

  async getByWorkplaceId(workplace_id: string): Promise<Worker[] | null> {
    return this.workerRepo.findByWorkplaceId(workplace_id)
  }
}
