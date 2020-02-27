import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Dataguru } from 'src/entities/dataguru.entity'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { UserDto } from 'src/dto/user.dto'
import { PagingDto } from 'src/dto/paging.dto'
import { RowsService } from 'src/rows/rows.service'
import { Pengguna } from 'src/entities/pengguna.entity'

const logger = new Logger('data-guru')

@Injectable()
export class DataGuruService {
  constructor(
    @InjectRepository(Dataguru)
    private readonly dataGuruRepo: Repository<Dataguru>,
  ) {}

  getDataGuruQuery(): SelectQueryBuilder<Dataguru> {
    return this.dataGuruRepo
      .createQueryBuilder('gtk')
      .select('gtk.id', 'id')
      .addSelect('gtk.id_dapodik', 'idDapodik')
      .addSelect('gtk.nama_dapodik', 'nama')
      .addSelect('gtk.tanggal_lahir', 'tglLahir')
      .addSelect('gtk.nuptk', 'nuptk')
      .addSelect('gtk.nip', 'nip')
      .addSelect('gtk.nik', 'nik')
      .addSelect('gtk.jenis_ptk_id', 'jenisPtkId')
      .addSelect('gtk.jenis_guru', 'jenisGuru')
      .addSelect('gtk.jenis_kelamin', 'jenisKelamin')
      .addSelect('gtk.jenis_keluar_id', 'jenisKeluarId')
      .addSelect('gtk.jenis_keluar_id_str', 'jenisKeluar')
      .addSelect('gtk.tgl_ptk_keluar', 'tglPtkKeluar')
      .addSelect('gtk.sekolah_id', 'sekolahId')
      .addSelect('sekolah.nama', 'namaSekolah')
      .addSelect('sekolah.npsn', 'npsn')
      .addSelect('sekolah.bentuk_pendidikan_id', 'bentukPendidikanId')
      .addSelect('sekolah.kode_wilayah_provinsi', 'kodeWilayahProvinsi')
      .addSelect('sekolah.kode_wilayah_provinsi_str', 'namaProvinsi')
      .addSelect('sekolah.kode_wilayah_kabupaten_kota', 'kodeWilayahKabKota')
      .addSelect('sekolah.kode_wilayah_kabupaten_kota_str', 'namaKabKota')
      .addSelect('sekolah.kode_wilayah_kecamatan', 'kodeWilayahKecamatan')
      .addSelect('sekolah.kode_wilayah_kecamatan_str', 'namaKecamatan')
      .leftJoin('sekolah', 'sekolah', 'sekolah.sekolah_id = gtk.sekolah_id')
  }

  async getDataGuruOne(id: string): Promise<any> {
    const query = this.getDataGuruQuery().where('gtk.id = :id', { id })

    return await query.getRawOne()
  }

  async getDataGuru(user: UserDto, request: any): Promise<PagingDto> {
    const { id } = user

    try {
      const pengguna = await Pengguna.findOneOrFail(id)

      const query = this.getDataGuruQuery().where(
        'gtk.sekolah_id = :sekolahId',
        { sekolahId: pengguna.sekolahId },
      )

      if (request.nip) {
        query.andWhere('gtk.nip = :nip', { nip: request.nip })
      }

      if (request.nuptk) {
        query.andWhere('gtk.nuptk = :nuptk', { nuptk: request.nuptk })
      }

      if (request.nama) {
        query.andWhere('gtk.nama_dapodik like :nama', {
          nama: `%${request.nama}%`,
        })
      }

      const rows = new RowsService(query)

      if (request.page) {
        rows.setPage(request.page)
      }

      return await rows.getResult()
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }
}
