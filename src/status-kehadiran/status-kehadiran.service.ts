import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RefStatusKehadiran } from 'src/entities/refStatusKehadiran.entity'
import { Repository } from 'typeorm'

const logger = new Logger('status-kehadiran')

@Injectable()
export class StatusKehadiranService {
  constructor(
    @InjectRepository(RefStatusKehadiran)
    private readonly statusKehadiranRepo: Repository<RefStatusKehadiran>,
  ) {}

  async getStatusKehadiran(): Promise<RefStatusKehadiran[]> {
    try {
      return await this.statusKehadiranRepo.find()
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }
}
