import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Sekolah } from '../entities/sekolah.entity'
import { Repository } from 'typeorm'
import { RowsService } from '../rows/rows.service'
import { PagingDto } from '../dto/paging.dto'
import { UserDto } from '../dto/user.dto'
import { Pengguna } from 'src/entities/pengguna.entity'
import getBentukPendidikanIdFromPeran from 'src/utils/get-bentukPendidikanId-from-peran.utils'
import {
  PERAN_SEKOLAH,
  PERAN_KABKOTA,
  PERAN_PROPINSI,
  PERAN_UPTD,
  PERAN_CABDIS,
} from 'src/constants/peran.constant'

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
      .where('sekolah.bentuk_pendidikan_id in(:bentukPendidikanId)', {
        bentukPendidikanId,
      })

    if (peran === PERAN_SEKOLAH) {
      const userData = await Pengguna.findOne({ penggunaId: user.id })

      if (userData) {
        sekolah.andWhere('sekolah.sekolah_id=:sekolahId', {
          sekolahId: userData.sekolahId,
        })
      } else {
        return null
      }
    } else {
      switch (peran) {
        case PERAN_UPTD:
          sekolah.andWhere('sekolah.kode_wilayah_kecamatan=:kecamatanId', {
            kecamatanId: kodeWilayah,
          })
          break
        case PERAN_KABKOTA:
        case PERAN_CABDIS:
          sekolah.andWhere('sekolah.kode_wilayah_kabupaten_kota=:kabKotaId', {
            kabKotaId: kodeWilayah,
          })
          break
        case PERAN_PROPINSI:
          sekolah.andWhere('sekolah.kode_wilayah_provinsi=:provId', {
            provId: kodeWilayah,
          })
          break
        default:
          return null
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
}
