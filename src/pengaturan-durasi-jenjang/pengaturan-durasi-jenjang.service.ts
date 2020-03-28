import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PengaturanDurasiJenjang } from 'src/entities/pengaturanDurasiJenjang.entity'
import { Repository, getConnection } from 'typeorm'
import { UserDto } from 'src/dto/user.dto'
import { Jenjang } from 'src/enums/jenjang.enum'
import getLevelUser from 'src/utils/get-level-user.utils'

const logger = new Logger('pengaturan-durasi-jenjang')

@Injectable()
export class PengaturanDurasiJenjangService {
  constructor(
    @InjectRepository(PengaturanDurasiJenjang)
    private readonly pengaturanDurasiJenjangRepo: Repository<
      PengaturanDurasiJenjang
    >,
  ) {}

  async initPengaturanDurasiJenjang(
    user: UserDto,
    jenjang: Jenjang,
  ): Promise<PengaturanDurasiJenjang[]> {
    const { username, kodeWilayah } = user
    const rows: PengaturanDurasiJenjang[] = []

    for (let shift = 1; shift <= 2; shift++) {
      for (let hari = 0; hari < 7; hari++) {
        const data = new PengaturanDurasiJenjang()
        data.kodeWilayah = kodeWilayah.trim()
        data.hari = hari
        data.jenjang = jenjang
        data.shift = shift
        data.jamMasuk = '07:00:00'
        data.jamPulang = '14:00:00'
        data.jamIstirahatMulai = '12:00:00'
        data.jamIstirahatSelesai = '12:30:00'
        data.createDate = new Date()
        data.updatedBy = username
        data.isLibur = hari === 0

        rows.push(data)
      }
    }

    try {
      return await this.pengaturanDurasiJenjangRepo.save(rows)
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  async getPengaturanDurasiJenjang(
    user: UserDto,
    jenjang: Jenjang,
  ): Promise<PengaturanDurasiJenjang[]> {
    try {
      const { kodeWilayah } = user
      const pengaturandurasiJenjang = await this.pengaturanDurasiJenjangRepo.find(
        { kodeWilayah, jenjang },
      )
      if (pengaturandurasiJenjang.length === 0) {
        return this.initPengaturanDurasiJenjang(user, jenjang)
      }

      return pengaturandurasiJenjang
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  async setPengaturanDurasiJenjang(
    data: PengaturanDurasiJenjang[],
    user: UserDto,
    jenjang: Jenjang,
  ): Promise<PengaturanDurasiJenjang[]> {
    try {
      const rows: PengaturanDurasiJenjang[] = data.map(val => ({
        ...val,
        updatedBy: user.username,
        lastUpdate: new Date(),
        kodeWilayah: user.kodeWilayah.trim(),
      }))

      const result = await this.pengaturanDurasiJenjangRepo.save(rows)
      if (result) {
        await getConnection().query('call p_update_libur_mingguan(?, ?, ?)', [
          user.kodeWilayah,
          getLevelUser(user.peran),
          jenjang,
        ])
      }

      return result
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }
}
