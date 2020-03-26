import {
  Injectable,
  RequestTimeoutException,
  ForbiddenException,
  Logger,
} from '@nestjs/common'
import { PengaturanDurasi } from '../entities/pengaturanDurasi.entity'
import { getConnection, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UserDto } from '../dto/user.dto'

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

    const pengaturanDurasi = await this.pengaturanDurasiRepo.find({
      kodeWilayah,
    })
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
      data.kodeWilayah = kodeWilayah.trim()
      data.hari = idx
      data.jamMasuk = '07:00:00'
      data.jamPulang = '14:00:00'
      data.jamIstirahatMulai = '12:00:00'
      data.jamIstirahatSelesai = '12:30:00'
      data.createDate = new Date()
      data.updatedBy = username
      data.isLibur = idx === 0

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

    try {
      const rows: PengaturanDurasi[] = data.map(val => ({
        ...val,
        updatedBy: user.username,
        lastUpdate: new Date(),
        kodeWilayah: user.kodeWilayah.trim(),
      }))

      logger.log(rows)
      const result = await this.pengaturanDurasiRepo.save(rows)
      if (result) {
        await getConnection().query(
          `call p_update_libur_mingguan('${user.kodeWilayah}', ${user.peran})`,
        )
      }
      return result
    } catch (e) {
      logger.error(e)
      throw new ForbiddenException()
    }
  }
}
