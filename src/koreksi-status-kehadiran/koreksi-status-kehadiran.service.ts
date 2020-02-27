import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { KoreksiStatusKehadiran } from 'src/entities/koreksiStatusKehadiran.entity'
import { Repository } from 'typeorm'
import { UserDto } from 'src/dto/user.dto'
import { Pengguna } from 'src/entities/pengguna.entity'
import { PagingDto } from 'src/dto/paging.dto'
import { RowsService } from 'src/rows/rows.service'
import { FileDto } from 'src/dto/file.dto'
import * as moment from 'moment'
import { DokumenPendukungService } from 'src/dokumen-pendukung/dokumen-pendukung.service'
import { KoreksiStatusDto } from 'src/dto/koreksi-status.dto'
import { Dataguru } from 'src/entities/dataguru.entity'

const logger = new Logger('koreksi-status-kehadiran')

@Injectable()
export class KoreksiStatusKehadiranService {
  constructor(
    @InjectRepository(KoreksiStatusKehadiran)
    private readonly koreksiStatusKehadiranRepo: Repository<
      KoreksiStatusKehadiran
    >,
    @InjectRepository(Dataguru)
    private readonly dataGuruRepo: Repository<Dataguru>,
    private readonly dokumenPendukungService: DokumenPendukungService,
  ) {}

  async getKoreksiStatusKehadiran(
    user: UserDto,
    request: any,
  ): Promise<PagingDto> {
    const { kodeWilayah, peran } = user
    if (!kodeWilayah || !peran) {
      return null
    }

    const query = this.koreksiStatusKehadiranRepo
      .createQueryBuilder('koreksi')
      .select('koreksi.koreksi_status_id', 'id')
      .addSelect('koreksi.no_koreksi', 'noKoreksi')
      .addSelect('koreksi.sekolah_id', 'sekolahId')
      .addSelect('koreksi.nama_sekolah', 'namaSekolah')
      .addSelect('koreksi.id_dapodik', 'idDapodik')
      .addSelect('koreksi.nama', 'nama')
      .addSelect('gtk.nip', 'nip')
      .addSelect('koreksi.jenis_koreksi', 'jenisKoreksi')
      .addSelect('koreksi.tgl_pengajuan', 'tglPengajuan')
      .addSelect('koreksi.status_pengajuan', 'statusPengajuan')
      .addSelect('status_pengajuan.status_nama', 'statusPengajuanNama')
      .leftJoin('dataguru', 'gtk', 'gtk.id_dapodik = koreksi.id_dapodik')
      .leftJoin('sekolah', 'sekolah', 'sekolah.sekolah_id = koreksi.sekolah_id')
      .leftJoin(
        'ref_status_pengajuan',
        'status_pengajuan',
        'koreksi.status_pengajuan = status_pengajuan.status_id',
      )

    if (peran === 2) {
      // Dinas Kab/kota
      query.where('sekolah.kode_wilayah_kabupaten_kota = :kodeWilayah', {
        kodeWilayah,
      })
      query.andWhere('sekolah.bentuk_pendidikan_id in(:bentukPendidikanId)', {
        bentukPendidikanId: [1, 2, 3, 4, 5, 6],
      })
    } else if (peran === 3) {
      // Dinas Provinsi
      query.where('sekolah.kode_wilayah_provinsi = :kodeWilayah', {
        kodeWilayah,
      })
      if (kodeWilayah !== '010000') {
        query.andWhere('sekolah.bentuk_pendidikan_id in(:bentukPendidikanId)', {
          bentukPendidikanId: [7, 8, 13, 14, 15, 29],
        })
      }
    } else if (peran === 99) {
      // Sekolah
      try {
        const pengguna = await Pengguna.findOne(user.id)
        query.where('koreksi.sekolah_id = :sekolahId', {
          sekolahId: pengguna.sekolahId,
        })
      } catch (e) {
        logger.error(e.toString())
        throw new NotFoundException()
      }
    }

    if (request.noKoreksi) {
      query.andWhere('koreksi.no_koreksi = :noKoreksi', {
        noKoreksi: request.noKoreksi,
      })
    }

    query.orderBy('koreksi.tgl_pengajuan', 'DESC')

    const rows = new RowsService(query)

    if (request.page) {
      // tslint:disable-next-line: radix
      rows.setPage(parseInt(request.page))
    }

    return await rows.getResult()
  }

  async upsertKoreksiStatusKehadiran(
    user: UserDto,
    data: KoreksiStatusKehadiran,
    files: FileDto[],
  ): Promise<KoreksiStatusDto> {
    logger.log(data)
    try {
      let koreksiStatus: KoreksiStatusKehadiran
      if (data.koreksiStatusId) {
        koreksiStatus = await this.koreksiStatusKehadiranRepo.findOne()
      }

      if (!koreksiStatus || !data.koreksiStatusId) {
        koreksiStatus = new KoreksiStatusKehadiran()
        koreksiStatus.noKoreksi = await this.generateNoKoreksi()
        koreksiStatus.userIdPengusul = user.id
        koreksiStatus.tglPengajuan = new Date()
        koreksiStatus.statusPengajuan = 1
      } else {
        koreksiStatus.lastUpdate = new Date()
        // tslint:disable-next-line: radix
        koreksiStatus.userIdPemeriksa = parseInt(user.id)
        koreksiStatus.tglDiperiksa = new Date()
      }

      const result = await this.koreksiStatusKehadiranRepo.save(koreksiStatus)
      if (result) {
        const resultFiles = await this.dokumenPendukungService.insertDokumenPendukungs(
          files,
          user,
          result.koreksiStatusId,
        )
        logger.log(resultFiles)

        return {
          koreksiStatusId: result.koreksiStatusId,
          gtkSelected: await this.dataGuruRepo.findOne(result.idDapodik),
          tglKehadiranDari: result.tglKehadiranDari.getTime(),
          jenisKoreksi: result.jenisKoreksi,
          statusPengajuan: result.statusPengajuan,
        }
      }
    } catch (e) {
      logger.error(e.toString())
      this.dokumenPendukungService.deleteFile(files.map(val => val.filename))
      throw new BadRequestException()
    }
  }

  async generateNoKoreksi(): Promise<string> {
    let noUrut: number
    try {
      noUrut = await this.koreksiStatusKehadiranRepo.count()
    } catch (e) {
      logger.warn(e.toString())
      noUrut = 0
    }

    const dateFormat = moment().format('YYYYMM')

    return `${dateFormat}${noUrut.toString().padStart(6, '0')}`
  }
}
