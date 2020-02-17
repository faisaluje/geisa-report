import {
  Injectable,
  RequestTimeoutException,
  ForbiddenException,
  Logger,
} from '@nestjs/common'
import { PengaturanDurasi } from 'src/entities/pengaturanDurasi.entity'
import { getConnection, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UserDto } from 'src/dto/user.dto'

const logger = new Logger('durasi-service')

@Injectable()
export class DurasiService {
  constructor(
    @InjectRepository(PengaturanDurasi)
    private readonly pengaturanDurasiRepo: Repository<PengaturanDurasi>,
  ) {}

  async getPengaturanDurasi(user: UserDto): Promise<PengaturanDurasi[]> {
    const { kodeWilayah } = user
    if (!kodeWilayah) {
      return null
    }

    const pengaturanDurasi = await PengaturanDurasi.find({ kodeWilayah })
    if (pengaturanDurasi.length === 0) {
      return this.initPengaturanDurasi(kodeWilayah, user.username)
    } else {
      return pengaturanDurasi
    }
  }

  async initPengaturanDurasi(
    kodeWilayah: string,
    username: string,
  ): Promise<PengaturanDurasi[]> {
    const rows: PengaturanDurasi[] = []

    for (let idx = 0; idx < 7; idx++) {
      const data = new PengaturanDurasi()
      data.kodeWilayah = kodeWilayah
      data.hari = idx
      data.jamMasuk = '07:00:00'
      data.jamPulang = '14:00:00'
      data.createDate = new Date()
      data.updatedBy = username

      rows.push(data)
    }

    try {
      if (await getConnection().manager.save(rows)) {
        return rows
      } else {
        return null
      }
    } catch (e) {
      throw new RequestTimeoutException('Request time out')
    }
  }

  async setPengaturanDurasi(
    data: PengaturanDurasi[],
    user: UserDto,
  ): Promise<PengaturanDurasi[]> {
    if (!data) {
      return null
    }

    data.forEach(async val => {
      val.updatedBy = user.username
      val.lastUpdate = new Date()
      delete val.createDate
    })

    try {
      return await this.pengaturanDurasiRepo.save(data)
    } catch (e) {
      logger.error(e)
      throw new ForbiddenException()
    }
  }
}
