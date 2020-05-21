import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CronJob } from '../entities/cronJob.entity'
import { Repository } from 'typeorm'
import { UserDto } from '../dto/user.dto'
import { getMethodName } from '../services/ClassHelpers'

const logger = new Logger('cronjob-service')

@Injectable()
export class CronjobService {
  constructor(
    @InjectRepository(CronJob)
    private readonly cronJobRepo: Repository<CronJob>,
  ) {}

  async getCronJob(): Promise<CronJob[]> {
    return await this.cronJobRepo.find()
  }

  async upsertCronJob(user: UserDto, data: CronJob): Promise<any> {
    let cronjob: CronJob

    if (data.cronId) {
      cronjob = await this.cronJobRepo.findOne(data.cronId)
      cronjob.lastUpdate = new Date()
    } else {
      cronjob = new CronJob()
    }

    cronjob.perintah = data.perintah
    cronjob.periode = data.periode
    cronjob.hari = data.hari
    cronjob.tanggal = data.tanggal
    cronjob.jam = data.jam
    cronjob.enable = data.enable
    cronjob.updatedBy = user.id

    try {
      await this.cronJobRepo.save(cronjob)
    } catch (e) {
      logger.error(`${getMethodName(this.upsertCronJob)}, ${e.toSting()}`)
      throw new BadRequestException()
    }
  }

  async deleteCronjob(id: number): Promise<void> {
    try {
      await this.cronJobRepo.delete(id)
    } catch (e) {
      logger.error(`${getMethodName(this.deleteCronjob)}, ${e.toSting()}`)
      throw new BadRequestException()
    }
  }
}
