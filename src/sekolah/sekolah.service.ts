import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Sekolah } from '../entities/sekolah.entity'
import { Repository } from 'typeorm'
import { RowsService } from '../rows/rows.service'
import { PagingDto } from '../dto/paging.dto'
import { UserDto } from '../dto/user.dto'
import { Pengguna } from 'src/entities/pengguna.entity'

@Injectable()
export class SekolahService {
  constructor(
    @InjectRepository(Sekolah)
    private readonly sekolahRepo: Repository<Sekolah>,
  ) {}

  async getSekolah(user: UserDto, query: any): Promise<PagingDto> {
    const { kodeWilayah, peran } = user
    const bentukPendidikanId = peran === 3 ? [7, 8, 13, 14, 15, 29] : [5, 6]

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

    if (peran === 99) {
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
        case 2:
          sekolah.andWhere('sekolah.kode_wilayah_kabupaten_kota=:kabKotaId', {
            kabKotaId: kodeWilayah,
          })
          break
        case 3:
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
