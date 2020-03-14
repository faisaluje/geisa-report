import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { KoreksiStatusKehadiran } from 'src/entities/koreksiStatusKehadiran.entity'
import { Repository, Between, getConnection } from 'typeorm'
import { UserDto } from 'src/dto/user.dto'
import { PagingDto } from 'src/dto/paging.dto'
import { RowsService } from 'src/rows/rows.service'
import { DokumenPendukungService } from 'src/dokumen-pendukung/dokumen-pendukung.service'
import { KoreksiStatusDto } from 'src/dto/koreksi-status.dto'
import { Dataguru } from 'src/entities/dataguru.entity'
import { Sekolah } from 'src/entities/sekolah.entity'
import { RefStatusKehadiran } from 'src/entities/refStatusKehadiran.entity'
import { RefAlasanPenolakan } from 'src/entities/refAlasanPenolakan.entity'
import { generateNoUrut } from 'src/utils/nourut.utils'
import { JENIS_USULAN_KOREKSI_STATUS } from 'src/constants/jenis-usulan.constant'

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
      throw new NotFoundException()
    }

    let query = this.koreksiStatusKehadiranRepo
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
          JENIS_USULAN_KOREKSI_STATUS,
        ),
      }
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  async upsertKoreksiStatusKehadiran(
    user: UserDto,
    data: KoreksiStatusDto,
  ): Promise<KoreksiStatusDto> {
    try {
      const sekolah = await Sekolah.findOne(data.gtkSelected.sekolahId)
      let koreksiStatus: KoreksiStatusKehadiran
      if (data.koreksiStatusId) {
        koreksiStatus = await this.koreksiStatusKehadiranRepo.findOne(
          data.koreksiStatusId,
        )
      }

      if (!koreksiStatus || !data.koreksiStatusId) {
        koreksiStatus = new KoreksiStatusKehadiran()
        koreksiStatus.noKoreksi = await generateNoUrut(
          JENIS_USULAN_KOREKSI_STATUS,
        )
        koreksiStatus.userIdPengusul = user.id
        koreksiStatus.tglPengajuan = new Date()
        koreksiStatus.statusPengajuan = 1
      } else {
        koreksiStatus.lastUpdate = new Date()
      }

      if (user.peran === 99) {
        koreksiStatus.userIdPengusul = user.id
        koreksiStatus.tglPengajuan = new Date()
        koreksiStatus.statusPengajuan = 1
      } else {
        // tslint:disable-next-line: radix
        koreksiStatus.userIdPemeriksa = parseInt(user.id)
        koreksiStatus.tglDiperiksa = new Date()
        koreksiStatus.statusPengajuan = data.statusPengajuan
        koreksiStatus.alasanPenolakanId = data.alasanPenolakan
          ? data.alasanPenolakan.alasanPenolakanId
          : null
      }

      koreksiStatus.idDapodik = data.gtkSelected.idDapodik
      koreksiStatus.nama = data.gtkSelected.namaDapodik
      koreksiStatus.namaSekolah = sekolah.nama
      koreksiStatus.sekolahId = sekolah.sekolahId
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
        if (result.statusPengajuan === 2) {
          await getConnection().query(
            `call p_koreksi_kehadiran(${result.koreksiStatusId})`,
          )
        }
        return {
          koreksiStatusId: result.koreksiStatusId,
          noKoreksi: result.noKoreksi,
          gtkSelected: data.gtkSelected,
          sekolah,
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
            JENIS_USULAN_KOREKSI_STATUS,
          ),
        }
      }
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }
}
