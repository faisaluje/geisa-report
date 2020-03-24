import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AbsensiManual } from 'src/entities/absensiManual.entity'
import { Repository, getConnection } from 'typeorm'
import { PagingDto } from 'src/dto/paging.dto'
import { UserDto } from 'src/dto/user.dto'
import { RowsService } from 'src/rows/rows.service'
import { AbsensiManualDetailService } from 'src/absensi-manual-detail/absensi-manual-detail.service'
import { AbsensiManualDto } from 'src/dto/absensi-manual.dto'
import { Sekolah } from 'src/entities/sekolah.entity'
import { RefStatusKehadiran } from 'src/entities/refStatusKehadiran.entity'
import { RefAlasanPenolakan } from 'src/entities/refAlasanPenolakan.entity'
import { DokumenPendukungService } from 'src/dokumen-pendukung/dokumen-pendukung.service'
import { JENIS_USULAN_ABSENSI_MANUAL } from 'src/constants/jenis-usulan.constant'
import { generateNoUrut } from 'src/utils/nourut.utils'
import getSekolahIdFromPenggunaId from 'src/utils/get-sekolahId-from-penggunaId.utils'
import moment = require('moment')

const logger = new Logger('absensi-manual-service')

@Injectable()
export class AbsensiManualService {
  constructor(
    @InjectRepository(AbsensiManual)
    private readonly absensiManualRepo: Repository<AbsensiManual>,
    private readonly absensiManualDetailService: AbsensiManualDetailService,
    private readonly dokumenPendukungService: DokumenPendukungService,
  ) {}

  async getAbsensiManualOne(
    user: UserDto,
    id: number,
  ): Promise<AbsensiManualDto> {
    try {
      const absensiManual = await this.absensiManualRepo.findOne(id)
      const sekolah = absensiManual
        ? await Sekolah.findOneOrFail(absensiManual.sekolahId)
        : await Sekolah.findOne(await getSekolahIdFromPenggunaId(user.id))
      const absensiManualDetail = await this.absensiManualDetailService.getAbsensiManualDetail(
        sekolah.sekolahId,
        id,
      )

      return {
        absensiManualId: absensiManual ? absensiManual.absensiManualId : 0,
        noAbsensiManual: absensiManual ? absensiManual.noAbsensiManual : '',
        sekolah: sekolah || null,
        tanggal: absensiManual ? absensiManual.tanggal : null,
        jenisAbsensiManual: absensiManual
          ? await RefStatusKehadiran.findOneOrFail(
              absensiManual.jenisAbsensiManualId,
            )
          : null,
        detail: absensiManualDetail,
        statusPengajuan: absensiManual ? absensiManual.statusPengajuan : 1,
        catatanDariPengusul: absensiManual
          ? absensiManual.catatanDariPengusul
          : '',
        catatanDariPemeriksa: absensiManual
          ? absensiManual.catatanDariPemeriksa
          : '',
        alasanPenolakan:
          absensiManual && absensiManual.alasanPenolakanId
            ? await RefAlasanPenolakan.findOne(absensiManual.alasanPenolakanId)
            : null,
        dokumenPendukung: absensiManual
          ? await this.dokumenPendukungService.getDokumenPendukung(
              absensiManual.absensiManualId,
              JENIS_USULAN_ABSENSI_MANUAL,
            )
          : null,
      }
    } catch (e) {
      logger.error(e.toString())
      throw new NotFoundException()
    }
  }

  async getAbasensiManual(user: UserDto, query: any): Promise<PagingDto> {
    const { kodeWilayah, peran } = user
    if (!kodeWilayah || !peran) {
      return null
    }

    let absensiManualQuery = this.absensiManualRepo
      .createQueryBuilder('absensi')
      .select('absensi.absensi_manual_id', 'id')
      .addSelect('absensi.no_absensi_manual', 'noAbsensiManual')
      .addSelect('absensi.sekolah_id', 'sekolahId')
      .addSelect('sekolah.nama', 'namaSekolah')
      .addSelect('absensi.tanggal', 'tglAbsensi')
      .addSelect('absensi.jenis_absensi_manual_id', 'jenisAbsensiManualId')
      .addSelect(
        'jenis_absensi_manual.status_kehadiran',
        'namaJenisAbsensiManual',
      )
      .addSelect('absensi.status_pengajuan', 'statusPengajuan')
      .addSelect('status_pengajuan.status_nama', 'statusPengajuanNama')
      .addSelect('absensi.tgl_diperiksa', 'tglDiperiksa')
      .leftJoin('sekolah', 'sekolah', 'absensi.sekolah_id = sekolah.sekolah_id')
      .leftJoin(
        'ref_status_kehadiran',
        'jenis_absensi_manual',
        'absensi.jenis_absensi_manual_id = jenis_absensi_manual.status_kehadiran_id',
      )
      .leftJoin(
        'ref_status_pengajuan',
        'status_pengajuan',
        'absensi.status_pengajuan = status_pengajuan.status_id',
      )

    absensiManualQuery = await RowsService.addLimitByPeran(
      absensiManualQuery,
      user,
      'absensi',
    )

    if (query.noAbsensiManual) {
      absensiManualQuery.andWhere(
        'absensi.no_absensi_manual = :noAbsensiManual',
        {
          noAbsensiManual: query.noAbsensiManual,
        },
      )
    }

    if (query.statusPengajuan) {
      absensiManualQuery.andWhere(
        'absensi.status_pengajuan = :statusPengajuan',
        {
          statusPengajuan: query.statusPengajuan,
        },
      )
    }

    absensiManualQuery.orderBy('absensi.no_absensi_manual', 'DESC')

    const rows = new RowsService(absensiManualQuery)

    if (query.page) {
      // tslint:disable-next-line: radix
      rows.setPage(parseInt(query.page))
    }

    return await rows.getResult()
  }

  async upsertAbsensiManual(
    user: UserDto,
    data: AbsensiManualDto,
  ): Promise<any> {
    try {
      let absensiManual: AbsensiManual
      if (data.absensiManualId) {
        absensiManual = await this.absensiManualRepo.findOne(
          data.absensiManualId,
        )
      }

      if (!absensiManual || !data.absensiManualId) {
        absensiManual = new AbsensiManual()
        absensiManual.noAbsensiManual = await generateNoUrut(
          JENIS_USULAN_ABSENSI_MANUAL,
        )
      } else {
        absensiManual.lastUpdate = new Date()
      }

      if (user.peran === 99) {
        absensiManual.userIdPengusul = user.id
        absensiManual.statusPengajuan = 1
      } else {
        absensiManual.userIdPemeriksa = user.id
        absensiManual.tglDiperiksa = new Date()
        absensiManual.statusPengajuan = data.statusPengajuan
        absensiManual.alasanPenolakanId = data.alasanPenolakan
          ? data.alasanPenolakan.alasanPenolakanId
          : null
      }

      absensiManual.sekolahId = data.sekolah.sekolahId
      absensiManual.tanggal = data.tanggal
      absensiManual.jenisAbsensiManualId = data.jenisAbsensiManual
        ? data.jenisAbsensiManual.statusKehadiranId
        : 0
      absensiManual.catatanDariPengusul = data.catatanDariPengusul
      absensiManual.catatanDariPemeriksa = data.catatanDariPemeriksa
      absensiManual.updateBy = user.username

      const result = await this.absensiManualRepo.save(absensiManual)
      if (result) {
        const absensiManualDetail = await this.absensiManualDetailService.upsertAbsensiManualId(
          data.detail,
          user,
          result.absensiManualId,
        )
        if (absensiManualDetail && result.statusPengajuan === 2) {
          await getConnection().query(
            `call p_absen_manual('${result.sekolahId}')`,
          )
        }

        return {
          absensiManualId: result.absensiManualId,
        }
      }

      throw new BadRequestException()
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }
}
