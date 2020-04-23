import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Setting } from 'src/entities/Setting.entity'
import { Repository } from 'typeorm'

const logger = new Logger('setting-service')

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
  ) {}

  async getSettingByDeskripsi(deskripsi: string): Promise<Setting> {
    try {
      return await this.settingRepo.findOneOrFail({ deskripsi })
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  async getSetting(): Promise<Setting[]> {
    try {
      return await this.settingRepo.find()
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  async updateSetting(body: Setting[]): Promise<void> {
    try {
      await this.settingRepo.save(body)
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }
}
