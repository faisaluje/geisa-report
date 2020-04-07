import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PengaturanLibur } from 'src/entities/pengaturanLibur.entity'
import { Repository, getConnection } from 'typeorm'
import { UserDto } from 'src/dto/user.dto'
import { v4 as uuid } from 'uuid'
import moment = require('moment')
import { Peran } from 'src/enums/peran.enum'

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
      if (!kodeWilayah && user.peran != Peran.ADMIN) {
        return null
      }

      const pengaturanLibur = await this.pengaturanLiburRepo.find({
        where:
          user.peran == Peran.ADMIN
            ? { jenisLiburId: 1 }
            : [{ kodeWilayah }, { jenisLiburId: 1 }],
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

      const jenisLiburId = this.getJenisLiburId(user.peran)

      data.jenjang = JSON.stringify(data.jenjang)
      data.jenisLiburId = jenisLiburId
      data.kodeWilayah = user.kodeWilayah || '000000'
      data.updatedBy = user.username
      data.tanggal = moment(data.tanggal).format('YYYY-MM-DD')

      const result = await this.pengaturanLiburRepo.save(data)
      if (result) {
        if (user.peran == Peran.ADMIN) {
          await getConnection().query('call p_update_libur_nasional()')
        } else {
          await getConnection().query(
            `call p_update_liburdaerah('${user.kodeWilayah}', ${jenisLiburId})`,
          )
        }
      }
      return result
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  async deletePengaturanLibur(user: UserDto, id: string): Promise<boolean> {
    try {
      const record = await this.pengaturanLiburRepo.delete({ id })
      if (record) {
        if (user.peran == Peran.ADMIN) {
          await getConnection().query('call p_update_libur_nasional()')
        } else {
          await getConnection().query(
            `call p_update_liburdaerah('${
              user.kodeWilayah
            }', ${this.getJenisLiburId(user.peran)})`,
          )
        }

        return true
      } else {
        throw new NotFoundException()
      }
    } catch (e) {
      logger.error(e.toString())
      throw new NotFoundException()
    }
  }

  getJenisLiburId(peran: Peran): number {
    switch (peran) {
      case Peran.KABKOTA:
      case Peran.UPTD:
        return 2
      case Peran.PROPINSI:
      case Peran.CABDIS:
        return 3
      default:
        return 1 // level admin
    }
  }
}
