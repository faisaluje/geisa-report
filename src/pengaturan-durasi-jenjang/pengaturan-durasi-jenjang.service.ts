import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SekolahService } from 'src/sekolah/sekolah.service'
import { getConnection, getRepository, Repository } from 'typeorm'

import mapJenjangData from '../data/mapJenjang.data'
import { UserDto } from '../dto/user.dto'
import { PengaturanDurasiJenjang } from '../entities/pengaturanDurasiJenjang.entity'
import { Pengguna } from '../entities/pengguna.entity'
import { PenggunaTestGeisa } from '../entities/pengguna.testgeisa.entity'
import { Sekolah } from '../entities/sekolah.entity'
import { Jenjang } from '../enums/jenjang.enum'
import { Peran } from '../enums/peran.enum'
import { TipeSubmitDurasi } from '../enums/tipe-submit-durasi.enum'

const logger = new Logger('pengaturxxan-durasi-jenjang')

@Injectable()
export class PengaturanDurasiJenjangService {
  constructor(
    @InjectRepository(PengaturanDurasiJenjang)
    private readonly pengaturanDurasiJenjangRepo: Repository<
      PengaturanDurasiJenjang
    >,
    private readonly sekolahService: SekolahService,
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
    jenjang?: Jenjang,
  ): Promise<PengaturanDurasiJenjang[]> {
    try {
      const { kodeWilayah, peran, id } = user
      let pengaturandurasiJenjang: PengaturanDurasiJenjang[]

      if (peran == Peran.SEKOLAH) {
        const pengguna =
          (await Pengguna.findOne(id)) ||
          (await PenggunaTestGeisa.findOneOrFail(id))
        const sekolah = await Sekolah.findOneOrFail(pengguna.sekolahId)

        const jenjangBySekolah = mapJenjangData.find(
          val => val.jenisSekolahId === sekolah.bentukPendidikanId,
        )
        pengaturandurasiJenjang = await this.pengaturanDurasiJenjangRepo.find({
          kodeWilayah,
          jenjang: jenjangBySekolah.jenjang,
        })
      } else {
        pengaturandurasiJenjang = await this.pengaturanDurasiJenjangRepo.find({
          kodeWilayah,
          jenjang,
        })
      }
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
    tipeSubmitDurasi: TipeSubmitDurasi,
  ): Promise<PengaturanDurasiJenjang[]> {
    try {
      let shift: number
      const rows: PengaturanDurasiJenjang[] = data.map(val => {
        if (tipeSubmitDurasi == TipeSubmitDurasi.WAKTU) {
          delete val.isLibur
        } else if (tipeSubmitDurasi == TipeSubmitDurasi.HARILIBUR) {
          delete val.jamMasuk
          delete val.jamPulang
          delete val.jamIstirahatMulai
          delete val.jamIstirahatSelesai
        }

        shift = val.shift

        return {
          ...val,
          jenjang,
          updatedBy: user.username,
          lastUpdate: new Date(),
          kodeWilayah: user.kodeWilayah.trim(),
        }
      })

      const result = await this.pengaturanDurasiJenjangRepo.save(rows)
      if (result) {
        if (tipeSubmitDurasi == TipeSubmitDurasi.WAKTU) {
          // logger.log(
          // `call p_update_durasi(${user.kodeWilayah}, ${jenjang}, ${shift})`,
          // )
          await getConnection().query('call p_update_durasi(?, ?, ?)', [
            user.kodeWilayah,
            jenjang,
            shift,
          ])
        } else if (tipeSubmitDurasi == TipeSubmitDurasi.HARILIBUR) {
          // logger.log(
          //   `call p_update_libur_minggu(${user.kodeWilayah}, ${jenjang})`,
          // )
          await getConnection().query('call p_update_libur_minggu(?, ?)', [
            user.kodeWilayah,
            jenjang,
          ])
        }
        // call p_update_durasi('022100','SD',1);
        // call p_update_libur_minggu('022100','SD');
      }

      return await this.getPengaturanDurasiJenjang(user, jenjang)
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  async getPengaturanDurasiBySekolah(
    sekolah: Sekolah,
    hari: number,
  ): Promise<PengaturanDurasiJenjang> {
    const kodeWilayah = this.sekolahService.getKodeWilayahByJenjang(sekolah)

    return getRepository(PengaturanDurasiJenjang).findOne({
      where: [
        { kodeWilayah, jenjang: sekolah.bentukPendidikanIdStr, hari, shift: 1 },
        { kodeWilayah: '000001', jenjang: 'XXX', hari },
      ],
    })
  }
}
