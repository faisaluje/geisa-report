import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PengaturanLibur } from 'src/entities/pengaturanLibur.entity'
import { Repository } from 'typeorm'
import { UserDto } from 'src/dto/user.dto'
import { v4 as uuid } from 'uuid'

const logger = new Logger('pengaturan-libur-service')

@Injectable()
export class PengaturanLiburService {
  constructor(
    @InjectRepository(PengaturanLibur)
    private readonly pengaturanLiburRepo: Repository<PengaturanLibur>,
  ) {}

  async getPengaturanLibur(user: UserDto): Promise<PengaturanLibur[]> {
    try {
      const { kodeWilayah } = user
      if (!kodeWilayah) {
        return null
      }

      const pengaturanLibur = await this.pengaturanLiburRepo.find({
        where: [{ kodeWilayah }, { jenisLiburId: 1 }],
      })
      if (!pengaturanLibur) {
        return null
      }

      return pengaturanLibur
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  async upsertPengaturanLibur(
    data: PengaturanLibur,
    user: UserDto,
  ): Promise<PengaturanLibur> {
    if (!data) {
      logger.error('Data is null')
      throw new BadRequestException()
    }

    try {
      const id: string = data.id ? data.id : uuid()
      if (data.id) {
        data.lastUpdate = new Date()
      } else {
        data.id = id.toUpperCase()
      }

      data.jenjang = JSON.stringify(data.jenjang)
      data.jenisLiburId = user.peran
      data.kodeWilayah = user.kodeWilayah
      data.updatedBy = user.username
      return await this.pengaturanLiburRepo.save(data)
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  async deletePengaturanLibur(id: string): Promise<boolean> {
    try {
      const record = await this.pengaturanLiburRepo.delete({ id })
      if (record) {
        return true
      } else {
        throw new NotFoundException()
      }
    } catch (e) {
      logger.error(e.toString())
      throw new NotFoundException()
    }
  }
}
