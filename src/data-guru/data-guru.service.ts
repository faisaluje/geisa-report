import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Dataguru } from '../entities/dataguru.entity'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { UserDto } from '../dto/user.dto'
import { PagingDto } from '../dto/paging.dto'
import { RowsService } from '../rows/rows.service'
import { Pengguna } from '../entities/pengguna.entity'
import { Peran } from '../enums/peran.enum'
import { PenggunaTestGeisa } from '../entities/pengguna.testgeisa.entity'
import getCakupanWilayahFromPengguna from '../utils/get-cakupanWilayah-from-pengguna.utils'
import getBentukPendidikanIdFromPeran from '../utils/get-bentukPendidikanId-from-peran.utils'

const logger = new Logger('data-guru-service')

@Injectable()
export class DataGuruService {
  constructor(
    @InjectRepository(Dataguru)
    private readonly dataGuruRepo: Repository<Dataguru>,
  ) {}

  getDataGuruQuery(peran: Peran): SelectQueryBuilder<Dataguru> {
    const bentukPendidikanId = getBentukPendidikanIdFromPeran(peran)

    return this.dataGuruRepo
      .createQueryBuilder('gtk')
      .select('gtk.id', 'id')
      .addSelect('gtk.id_dapodik', 'idDapodik')
      .addSelect('gtk.nama_dapodik', 'namaDapodik')
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
      .addSelect('gtk.is_dapodik', 'isDapodik')
      .addSelect('gtk.show_sptjm', 'showSptjm')
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
      .where('sekolah.bentuk_pendidikan_id in(:bentukPendidikanId)', {
        bentukPendidikanId,
      })
  }

  async getDataGuruOne(user: UserDto, id: string): Promise<any> {
    const query = this.getDataGuruQuery(user.peran).where('gtk.id = :id', {
      id,
    })

    return await query.getRawOne()
  }

  async getDataGuru(user: UserDto, request?: any): Promise<PagingDto> {
    const { id, peran, kodeWilayah } = user

    try {
      const query = this.getDataGuruQuery(peran)
      let cakupanWilayah: string[] = ['']
      if ([Peran.UPTD, Peran.CABDIS].includes(peran)) {
        cakupanWilayah = await getCakupanWilayahFromPengguna(user)
      }

      switch (peran) {
        case Peran.UPTD:
          query.andWhere('sekolah.kode_wilayah_kecamatan in(:cakupanWilayah)', {
            cakupanWilayah,
          })
          break
        case Peran.CABDIS:
          query.andWhere(
            'sekolah.kode_wilayah_kabupaten_kota in(:cakupanWilayah)',
            {
              cakupanWilayah,
            },
          )
          break
        case Peran.KABKOTA:
          query.andWhere('sekolah.kode_wilayah_kabupaten_kota = :kodeWilayah', {
            kodeWilayah,
          })
          break
        case Peran.PROPINSI:
          query.andWhere('sekolah.kode_wilayah_provinsi = :kodeWilayah', {
            kodeWilayah,
          })
          break
        case Peran.SEKOLAH:
          const pengguna =
            (await Pengguna.findOne(id)) ||
            (await PenggunaTestGeisa.findOne(id))
          query.andWhere('gtk.sekolah_id = :sekolahId', {
            sekolahId: pengguna.sekolahId,
          })
          break
        default:
          query.andWhere('gtk.sekolah_id IS NOT NULL')
      }

      if (request) {
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
      }

      query.orderBy('gtk.nama_dapodik')

      const rows = new RowsService(query)
      rows.setLimit(250)

      if (request && request.page) {
        rows.setPage(request.page)
      }

      return await rows.getResult()
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  async upsertDataGuru(user: UserDto, gtk: Dataguru): Promise<void> {
    let dataGuru: Dataguru

    if (gtk.id) {
      dataGuru = await this.dataGuruRepo.findOne(gtk.id)
    }

    if (!dataGuru || !gtk.id) {
      dataGuru = new Dataguru()
      dataGuru.createDate = new Date()
    } else {
      dataGuru.lastUpdate = new Date()
    }

    dataGuru.userUpdated = user.id
    dataGuru.jenisKeluarId = gtk.jenisKeluarId
    dataGuru.jenisKeluarIdStr = gtk.jenisKeluarIdStr
    dataGuru.tglPtkKeluar = gtk.tglPtkKeluar
    dataGuru.showSptjm = gtk.showSptjm
    dataGuru.isInduk = gtk.isInduk

    try {
      await this.dataGuruRepo.save(dataGuru)
    } catch (err) {
      logger.error(err.toString())
      throw new BadRequestException()
    }
  }
}
