import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RefAlasanPenolakan } from 'src/entities/refAlasanPenolakan.entity'
import { Repository } from 'typeorm'

const logger = new Logger('alasan-penolakan')

@Injectable()
export class AlasanPenolakanService {
  constructor(
    @InjectRepository(RefAlasanPenolakan)
    private readonly alasanPenolakanRepo: Repository<RefAlasanPenolakan>,
  ) {}

  async getAlasanPenolakan(): Promise<RefAlasanPenolakan[]> {
    try {
      return await this.alasanPenolakanRepo.find()
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }
}
