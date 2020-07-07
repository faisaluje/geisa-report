import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Sekolah } from '../entities/sekolah.entity'
import { Repository } from 'typeorm'
import { RowsService } from '../rows/rows.service'
import { PagingDto } from '../dto/paging.dto'
import { UserDto } from '../dto/user.dto'
import { Pengguna } from '../entities/pengguna.entity'
import getBentukPendidikanIdFromPeran from '../utils/get-bentukPendidikanId-from-peran.utils'
import { Peran } from '../enums/peran.enum'
import { PenggunaTestGeisa } from '../entities/pengguna.testgeisa.entity'
import getCakupanWilayahFromPengguna from '../utils/get-cakupanWilayah-from-pengguna.utils'

const logger = new Logger('sekolah-service')

@Injectable()
export class SekolahService {
  constructor(
    @InjectRepository(Sekolah)
    private readonly sekolahRepo: Repository<Sekolah>,
  ) {}

  async getSekolah(user: UserDto, query: any): Promise<PagingDto> {
    const { kodeWilayah, peran } = user
    const bentukPendidikanId = getBentukPendidikanIdFromPeran(peran)

    const sekolah = this.sekolahRepo
      .createQueryBuilder('sekolah')
      .select('sekolah.sekolah_id', 'sekolahId')
      .addSelect('sekolah.nama', 'nama')
      .addSelect('sekolah.npsn', 'npsn')
      .addSelect('sekolah.bentuk_pendidikan_id', 'bentukPendidikanId')
      .addSelect('sekolah.bentuk_pendidikan_id_str', 'bentukPendidikan')
      .addSelect('sekolah.status_sekolah', 'statusSekolah')
      .addSelect('sekolah.kode_wilayah_provinsi', 'kodeWilayahProvinsi')
      .addSelect('sekolah.kode_wilayah_provinsi_str', 'namaProvinsi')
      .addSelect('sekolah.kode_wilayah_kabupaten_kota', 'kodeWilayahKabKota')
      .addSelect('sekolah.kode_wilayah_kabupaten_kota_str', 'namaKabKota')
      .addSelect('sekolah.kode_wilayah_kecamatan', 'kodeWilayahKecamatan')
      .addSelect('sekolah.kode_wilayah_kecamatan_str', 'namaKecamatan')
      .addSelect('sekolah.shift_pagi', 'shiftPagi')
      .addSelect('sekolah.shift_siang', 'shiftSiang')
      .addSelect('sekolah.shift_pagi_mulai', 'shiftPagiMulai')
      .addSelect('sekolah.shift_siang_mulai', 'shiftSiangMulai')
      .addSelect('sekolah.GMTPlus', 'gmtPlus')
      .addSelect('sekolah.kalibrasi_waktu', 'kalibrasiWaktu')
      .where('sekolah.bentuk_pendidikan_id in(:bentukPendidikanId)', {
        bentukPendidikanId,
      })

    if (peran == Peran.SEKOLAH) {
      const userData =
        (await Pengguna.findOne(user.id)) ||
        (await PenggunaTestGeisa.findOne(user.id))

      if (userData) {
        sekolah.andWhere('sekolah.sekolah_id=:sekolahId', {
          sekolahId: userData.sekolahId,
        })
      } else {
        return null
      }
    } else {
      let cakupanWilayah: string[] = ['']
      if ([Peran.UPTD, Peran.CABDIS].includes(peran)) {
        cakupanWilayah = await getCakupanWilayahFromPengguna(user)
      }

      switch (peran) {
        case Peran.UPTD:
          sekolah.andWhere(
            'sekolah.kode_wilayah_kecamatan in(:cakupanWilayah)',
            {
              cakupanWilayah,
            },
          )
          break
        case Peran.CABDIS:
          sekolah.andWhere(
            'sekolah.kode_wilayah_kabupaten_kota in(:cakupanWilayah)',
            {
              cakupanWilayah,
            },
          )
          break
        case Peran.KABKOTA:
          sekolah.andWhere('sekolah.kode_wilayah_kabupaten_kota=:kodeWilayah', {
            kodeWilayah,
          })
          break
        case Peran.PROPINSI:
          sekolah.andWhere('sekolah.kode_wilayah_provinsi=:kodeWilayah', {
            kodeWilayah,
          })
          break
      }

      if (query.search) {
        sekolah.andWhere('sekolah.nama like :search', {
          search: `%${query.search}%`,
        })
      }
      sekolah.orderBy('sekolah.nama', 'ASC')
    }

    const rows = new RowsService(sekolah)

    return await rows.getResult()
  }

  async updateSekolah(body: Sekolah): Promise<Sekolah> {
    try {
      const sekolah = await Sekolah.findOneOrFail(body.sekolahId)

      sekolah.shiftPagi = body.shiftPagi
      sekolah.shiftSiang = body.shiftSiang
      sekolah.shiftPagiMulai = body.shiftPagiMulai
      sekolah.shiftSiangMulai = body.shiftSiangMulai
      sekolah.kalibrasiWaktu = body.kalibrasiWaktu
      sekolah.lastUpdate = new Date()

      return await sekolah.save()
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }
}
