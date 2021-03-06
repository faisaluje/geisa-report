import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { KoreksiStatusKehadiran } from '../entities/koreksiStatusKehadiran.entity'
import { Repository, getConnection } from 'typeorm'
import { UserDto } from '../dto/user.dto'
import { PagingDto } from '../dto/paging.dto'
import { RowsService } from '../rows/rows.service'
import { DokumenPendukungService } from '../dokumen-pendukung/dokumen-pendukung.service'
import { KoreksiStatusDto } from '../dto/koreksi-status.dto'
import { Dataguru } from '../entities/dataguru.entity'
import { Sekolah } from '../entities/sekolah.entity'
import { RefStatusKehadiran } from '../entities/refStatusKehadiran.entity'
import { RefAlasanPenolakan } from '../entities/refAlasanPenolakan.entity'
import { generateNoUrut } from '../utils/nourut.utils'
import { JenisUsulan } from '../enums/jenis-usulan.enum'
import { Peran } from '../enums/peran.enum'
import { getMethodName } from '../services/ClassHelpers'

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
    if (!kodeWilayah && !peran) {
      throw new NotFoundException()
    }

    let query = this.koreksiStatusKehadiranRepo
      .createQueryBuilder('koreksi')
      .distinct(true)
      .select('koreksi.koreksi_status_id', 'id')
      .addSelect('koreksi.no_koreksi', 'noKoreksi')
      .addSelect('koreksi.sekolah_id', 'sekolahId')
      .addSelect('koreksi.nama_sekolah', 'namaSekolah')
      .addSelect('sekolah.kode_wilayah_kabupaten_kota', 'kabupatenKotaId')
      .addSelect('sekolah.kode_wilayah_kabupaten_kota_str', 'namaKabupatenKota')
      .addSelect('sekolah.kode_wilayah_provinsi', 'provinsiId')
      .addSelect('sekolah.kode_wilayah_provinsi_str', 'namaProvinsi')
      .addSelect('koreksi.id_dapodik', 'idDapodik')
      .addSelect('koreksi.nama', 'nama')
      .addSelect('gtk.nip', 'nip')
      .addSelect('koreksi.jenis_koreksi', 'jenisKoreksi')
      .addSelect('koreksi.tgl_pengajuan', 'tglPengajuan')
      .addSelect('koreksi.status_pengajuan', 'statusPengajuan')
      .addSelect('status_pengajuan.status_nama', 'statusPengajuanNama')
      .leftJoin(
        'dataguru',
        'gtk',
        'gtk.id_dapodik = koreksi.id_dapodik AND gtk.sekolah_id = koreksi.sekolah_id',
      )
      .leftJoin('sekolah', 'sekolah', 'sekolah.sekolah_id = koreksi.sekolah_id')
      .leftJoin(
        'ref_status_pengajuan',
        'status_pengajuan',
        'koreksi.status_pengajuan = status_pengajuan.status_id',
      )

    query = await RowsService.addLimitByPeran(query, user, 'koreksi')

    if (request.noKoreksi) {
      query.andWhere('koreksi.no_koreksi = :noKoreksi', {
        noKoreksi: request.noKoreksi,
      })
    }

    if (request.statusPengajuan) {
      query.andWhere('koreksi.status_pengajuan = :statusPengajuan', {
        statusPengajuan: request.statusPengajuan,
      })
    }

    if (request.kodeWilayah) {
      const colWilayah =
        request.levelWilayah === '1'
          ? 'kode_wilayah_provinsi'
          : request.levelWilayah === '2'
          ? 'kode_wilayah_kabupaten_kota'
          : 'kode_wilayah_kecamatan'
      query.andWhere(`sekolah.${colWilayah} = :kodeWilayah`, {
        kodeWilayah: request.kodeWilayah,
      })
    }

    query.orderBy('koreksi.no_koreksi', 'DESC')

    const rows = new RowsService(query)

    if (request.page) {
      // tslint:disable-next-line: radix
      rows.setPage(parseInt(request.page))
    }

    return await rows.getResult()
  }

  async getKoreksiStatusKehadiranOne(id: number): Promise<KoreksiStatusDto> {
    try {
      const row = await this.koreksiStatusKehadiranRepo.findOneOrFail(id)
      const gtk = await this.dataGuruRepo.findOneOrFail({
        idDapodik: row.idDapodik,
      })
      const sekolah = await Sekolah.findOneOrFail(row.sekolahId)

      return {
        koreksiStatusId: row.koreksiStatusId,
        noKoreksi: row.noKoreksi,
        gtkSelected: gtk,
        sekolah,
        tglPengajuan: row.tglPengajuan
          ? new Date(row.tglPengajuan).getTime()
          : null,
        tglKehadiranDari: new Date(row.tglKehadiranDari).getTime(),
        tglKehadiranSampai: row.tglKehadiranSampai
          ? new Date(row.tglKehadiranSampai).getTime()
          : null,
        jenisKoreksi: row.jenisKoreksi,
        statusKehadiranAwal: await RefStatusKehadiran.findOne(
          row.statusKehadiranAwal,
        ),
        statusKehadiranKoreksi: await RefStatusKehadiran.findOne(
          row.statusKehadiranKoreksi,
        ),
        waktuDatangAwal: row.waktuDatangAwal,
        waktuDatangKoreksi: row.waktuDatangKoreksi,
        waktuPulangAwal: row.waktuPulangAwal,
        waktuPulangKoreksi: row.waktuPulangKoreksi,
        jenisIzin: row.jenisIzin ? row.jenisIzin : null,
        statusPengajuan: row.statusPengajuan,
        catatanDariPengusul: row.catatanDariPengusul,
        catatanDariPemeriksa: row.catatanDariPemeriksa,
        alasanPenolakan: await RefAlasanPenolakan.findOne(
          row.alasanPenolakanId,
        ),
        dokumenPendukung: await this.dokumenPendukungService.getDokumenPendukung(
          row.koreksiStatusId,
          JenisUsulan.KOREKSI_STATUS,
        ),
      }
    } catch (e) {
      logger.error(
        `${getMethodName(this.getKoreksiStatusKehadiranOne)}, ${e.toString()}`,
      )
      throw new BadRequestException()
    }
  }

  async upsertKoreksiStatusKehadiran(
    user: UserDto,
    data: KoreksiStatusDto,
  ): Promise<KoreksiStatusDto> {
    try {
      let koreksiStatus: KoreksiStatusKehadiran
      if (data.koreksiStatusId) {
        koreksiStatus = await this.koreksiStatusKehadiranRepo.findOne(
          data.koreksiStatusId,
        )
      }

      if (!koreksiStatus || !data.koreksiStatusId) {
        const sekolah = await Sekolah.findOne(data.gtkSelected.sekolahId)
        koreksiStatus = new KoreksiStatusKehadiran()
        koreksiStatus.noKoreksi = await generateNoUrut(
          JenisUsulan.KOREKSI_STATUS,
        )
        koreksiStatus.userIdPengusul = user.id
        koreksiStatus.tglPengajuan = new Date()
        koreksiStatus.statusPengajuan = 1
        koreksiStatus.namaSekolah = sekolah.nama
        koreksiStatus.sekolahId = sekolah.sekolahId
      } else {
        koreksiStatus.lastUpdate = new Date()
      }

      if (user.peran == Peran.SEKOLAH) {
        koreksiStatus.userIdPengusul = user.id
        koreksiStatus.tglPengajuan = new Date()
        koreksiStatus.statusPengajuan = 1
      } else {
        koreksiStatus.userIdPemeriksa = user.id
        koreksiStatus.tglDiperiksa = new Date()
        koreksiStatus.statusPengajuan = data.statusPengajuan
        koreksiStatus.alasanPenolakanId = data.alasanPenolakan
          ? data.alasanPenolakan.alasanPenolakanId
          : null
      }

      koreksiStatus.idDapodik = data.gtkSelected.idDapodik
      koreksiStatus.nama = data.gtkSelected.namaDapodik
      koreksiStatus.jenisKoreksi = data.jenisKoreksi
      koreksiStatus.statusKehadiranAwal = data.statusKehadiranAwal
        ? data.statusKehadiranAwal.statusKehadiranId
        : null
      koreksiStatus.statusKehadiranKoreksi = data.statusKehadiranKoreksi
        ? data.statusKehadiranKoreksi.statusKehadiranId
        : null
      koreksiStatus.tglKehadiranDari = new Date(data.tglKehadiranDari)
      koreksiStatus.tglKehadiranSampai = data.tglKehadiranSampai
        ? new Date(data.tglKehadiranSampai)
        : null
      koreksiStatus.waktuDatangAwal = data.waktuDatangAwal
      koreksiStatus.waktuDatangKoreksi = data.waktuDatangKoreksi
      koreksiStatus.waktuPulangAwal = data.waktuPulangAwal
      koreksiStatus.waktuPulangKoreksi = data.waktuPulangKoreksi
      koreksiStatus.jenisIzin = data.jenisIzin ? data.jenisIzin : null
      koreksiStatus.catatanDariPengusul = data.catatanDariPengusul
      koreksiStatus.catatanDariPemeriksa = data.catatanDariPemeriksa
      koreksiStatus.alasanPenolakanId = data.alasanPenolakan
        ? data.alasanPenolakan.alasanPenolakanId
        : null
      koreksiStatus.updatedBy = user.username

      const result = await this.koreksiStatusKehadiranRepo.save(koreksiStatus)
      if (result) {
        // if (result.statusPengajuan === 2) {
        //   await getConnection().query(
        //     `call p_koreksi_kehadiran(${result.koreksiStatusId})`,
        //   )
        // }
        return {
          koreksiStatusId: result.koreksiStatusId,
          noKoreksi: result.noKoreksi,
          gtkSelected: data.gtkSelected,
          sekolah: await Sekolah.findOne(data.gtkSelected.sekolahId),
          tglPengajuan: result.tglPengajuan
            ? new Date(result.tglPengajuan).getTime()
            : null,
          tglKehadiranDari: result.tglKehadiranDari.getTime(),
          tglKehadiranSampai: result.tglKehadiranSampai
            ? result.tglKehadiranSampai.getTime()
            : null,
          jenisKoreksi: result.jenisKoreksi,
          statusKehadiranAwal: data.statusKehadiranAwal
            ? data.statusKehadiranAwal
            : null,
          statusKehadiranKoreksi: data.statusKehadiranKoreksi
            ? data.statusKehadiranKoreksi
            : null,
          waktuDatangAwal: data.waktuDatangAwal ? data.waktuDatangAwal : null,
          waktuDatangKoreksi: data.waktuDatangKoreksi
            ? data.waktuDatangKoreksi
            : null,
          waktuPulangAwal: data.waktuPulangAwal ? data.waktuPulangAwal : null,
          waktuPulangKoreksi: data.waktuPulangKoreksi
            ? data.waktuPulangKoreksi
            : null,
          jenisIzin: result.jenisIzin ? result.jenisIzin : null,
          statusPengajuan: result.statusPengajuan,
          catatanDariPengusul: result.catatanDariPengusul,
          catatanDariPemeriksa: result.catatanDariPemeriksa,
          alasanPenolakan: data.alasanPenolakan ? data.alasanPenolakan : null,
          dokumenPendukung: await this.dokumenPendukungService.getDokumenPendukung(
            result.koreksiStatusId,
            JenisUsulan.KOREKSI_STATUS,
          ),
        }
      }
    } catch (e) {
      logger.error(
        `${getMethodName(this.upsertKoreksiStatusKehadiran)}, ${e.toString()}`,
      )
      throw new BadRequestException()
    }
  }

  async getRekapKoreksiStatus(): Promise<any[]> {
    try {
      const result = await getConnection().query('call r_usulan_koreksi_status')

      return result[0]
    } catch (e) {
      logger.error(
        `${getMethodName(this.getRekapKoreksiStatus)}, ${e.toString()}`,
      )
      throw new BadRequestException()
    }
  }
}
