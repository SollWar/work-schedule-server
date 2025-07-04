import { RequestHandler } from 'express'
import { ScheduleService } from '../services/schedule.services.js'
import { WorkerService } from '../services/worker.services.js'

export class ScheduleController {
  private scheduleService = new ScheduleService()
  private workerService = new WorkerService()

  public getByWorkerId: RequestHandler = async (req, res) => {
    try {
      const { worker_id, year, month } = req.query
      if (
        typeof worker_id !== 'string' ||
        typeof year !== 'string' ||
        typeof month !== 'string'
      ) {
        res.status(400).json({ error: 'Недостаточно параметров' })
      } else {
        const yearNum = Number(year)
        const monthNum = Number(month)
        const schedule = await this.scheduleService.getByWorkerId(
          worker_id,
          yearNum,
          monthNum
        )
        if (schedule) {
          res.json(schedule)
        } else {
          res.json({ schedule: '' })
        }
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  public updateSchedule: RequestHandler = async (req, res) => {
    try {
      const { type, id, year, month, schedule } = req.body
      if (
        typeof type !== 'string' ||
        typeof id !== 'string' ||
        typeof year !== 'string' ||
        typeof month !== 'string' ||
        typeof schedule !== 'string'
      ) {
        res.status(400).json({ error: 'Недостаточно параметров' })
      } else {
        const yearNum = Number(year)
        const monthNum = Number(month)
        if (type === 'worker') {
          const result = await this.scheduleService.updateByWorkerId(
            id,
            yearNum,
            monthNum,
            schedule
          )
          res.json(result)
        } else if (type === 'workplace') {
          const workers = await this.workerService.getByWorkplaceId(id)
          const schedules = await Promise.all(
            workers!.map(async (value) => {
              const worker_schedule = await this.scheduleService.getByWorkerId(
                value.id,
                yearNum,
                monthNum
              )
              return (
                worker_schedule || {
                  worker_id: value.id,
                  year: yearNum,
                  month: monthNum,
                  schedule: '',
                }
              )
            })
          )

          if (schedules) {
            const days = schedule.split(',')
            const scheduleLength = days.length

            const workerSchedule = new Map<string, string[]>(
              schedules.map(({ worker_id }) => [
                worker_id,
                new Array(scheduleLength).fill('0'),
              ])
            )

            const workerSchedules = schedules.map((worker) => ({
              ...worker,
              scheduleArray: worker.schedule.split(','),
            }))

            for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
              const currentDay = days[dayIndex]

              for (const worker of workerSchedules) {
                const workerScheduleArray = workerSchedule.get(worker.worker_id)
                if (!workerScheduleArray) continue

                const oldScheduleValue = worker.scheduleArray[dayIndex]

                if (currentDay === worker.worker_id) {
                  workerScheduleArray[dayIndex] = id
                } else if (currentDay === 'X') {
                  workerScheduleArray[dayIndex] = oldScheduleValue
                } else {
                  workerScheduleArray[dayIndex] =
                    oldScheduleValue === id ? '0' : oldScheduleValue
                }
              }
            }

            const updatePromises = Array.from(workerSchedule.entries()).map(
              ([workerId, scheduleArray]) =>
                this.scheduleService.updateByWorkerId(
                  workerId,
                  yearNum,
                  monthNum,
                  scheduleArray.join(',')
                )
            )

            await Promise.all(updatePromises)
          }
          res.json(true)
        }
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  public getByWorkplaceId: RequestHandler = async (req, res) => {
    try {
      const { workplace_id, year, month } = req.query
      if (
        typeof workplace_id !== 'string' ||
        typeof year !== 'string' ||
        typeof month !== 'string'
      ) {
        res.status(400).json({ error: 'Недостаточно параметров' })
      } else {
        const yearNum = Number(year)
        const monthNum = Number(month)
        const schedules = await this.scheduleService.getByWorkplaceId(
          workplace_id,
          yearNum,
          monthNum
        )
        if (schedules) {
          res.json(schedules)
        }
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}
