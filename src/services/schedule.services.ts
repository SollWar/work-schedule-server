import { Schedule } from '../models/schedule.model.js'
import { ScheduleRepository } from '../repositories/schedule.repository.js'

export class ScheduleService {
  private scheduleRepo = new ScheduleRepository()
  async getByWorkerId(
    worker_id: string,
    year: number,
    month: number
  ): Promise<Schedule | null> {
    return this.scheduleRepo.findByWorkerId(worker_id, year, month)
  }

  async getByWorkplaceId(
    workplace_id: string,
    year: number,
    month: number
  ): Promise<Schedule[] | null> {
    return this.scheduleRepo.findByWorkplaceId(workplace_id, year, month)
  }
}
