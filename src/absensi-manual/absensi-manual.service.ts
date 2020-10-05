import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { getConnection, Repository } from 'typeorm'

import { AbsensiManualDetailService } from '../absensi-manual-detail/absensi-manual-detail.service'
import { DokumenPendukungService } from '../dokumen-pendukung/dokumen-pendukung.service'
import { AbsensiManualDto } from '../dto/absensi-manual.dto'
import { PagingDto } from '../dto/paging.dto'
import { UserDto } from '../dto/user.dto'
import { AbsensiManual } from '../entities/absensiManual.entity'
import { RefAlasanPenolakan } from '../entities/refAlasanPenolakan.entity'
import { RefStatusKehadiran } from '../entities/refStatusKehadiran.entity'
import { Sekolah } from '../entities/sekolah.entity'
import { JenisUsulan } from '../enums/jenis-usulan.enum'
import { Peran } from '../enums/peran.enum'
import { RowsService } from '../rows/rows.service'
import { getMethodName } from '../services/ClassHelpers'
import getSekolahIdFromPenggunaId from '../utils/get-sekolahId-from-penggunaId.utils'
import { generateNoUrut } from '../utils/nourut.utils'
import { StatusPengajuanService } from './status-pengajuan.service'

const logger = new Logger('absensi-manual-service')

@Injectable()
export class AbsensiManualService {
  constructor(
    @InjectRepository(AbsensiManual)
    private readonly absensiManualRepo: Repository<AbsensiManual>,
    private readonly absensiManualDetailService: AbsensiManualDetailService,
    private readonly dokumenPendukungService: DokumenPendukungService,
    private readonly statusPengajuanService: StatusPengajuanService,
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
              JenisUsulan.ABSENSI_MANUAL,
            )
          : null,
      }
    } catch (e) {
      logger.error(
        `${getMethodName(this.getAbsensiManualOne)}, ${e.toString()}`,
      )
      throw new NotFoundException()
    }
  }

  async getAbasensiManual(user: UserDto, query: any): Promise<PagingDto> {
    const { kodeWilayah, peran } = user
    if (!kodeWilayah && !peran) {
      return null
    }

    let absensiManualQuery = this.absensiManualRepo
      .createQueryBuilder('absensi')
      .distinct(true)
      .select('absensi.absensi_manual_id', 'id')
      .addSelect('absensi.no_absensi_manual', 'noAbsensiManual')
      .addSelect('absensi.sekolah_id', 'sekolahId')
      .addSelect('sekolah.nama', 'namaSekolah')
      .addSelect('sekolah.kode_wilayah_kabupaten_kota', 'kabupatenKotaId')
      .addSelect('sekolah.kode_wilayah_kabupaten_kota_str', 'namaKabupatenKota')
      .addSelect('sekolah.kode_wilayah_provinsi', 'provinsiId')
      .addSelect('sekolah.kode_wilayah_provinsi_str', 'namaProvinsi')
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

    if (query.kodeWilayah) {
      const colWilayah =
        query.levelWilayah === '1'
          ? 'kode_wilayah_provinsi'
          : query.levelWilayah === '2'
          ? 'kode_wilayah_kabupaten_kota'
          : 'kode_wilayah_kecamatan'
      absensiManualQuery.andWhere(`sekolah.${colWilayah} = :kodeWilayah`, {
        kodeWilayah: query.kodeWilayah,
      })
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
          JenisUsulan.ABSENSI_MANUAL,
        )
      } else {
        absensiManual.lastUpdate = new Date()
      }

      if (user.peran == Peran.SEKOLAH) {
        absensiManual.userIdPengusul = user.id
        absensiManual.statusPengajuan = await this.statusPengajuanService.getStatusPengajuan(
          data.sekolah,
          new Date(data.tanggal),
          data.detail,
        )
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
        await this.absensiManualDetailService.upsertAbsensiManualId(
          data.detail,
          user,
          result.absensiManualId,
        )
        // if (absensiManualDetail && result.statusPengajuan === 2) {
        //   await getConnection().query(
        //     `call p_absen_manual('${result.sekolahId}', ${result.absensiManualId})`,
        //   )
        // }

        return {
          absensiManualId: result.absensiManualId,
        }
      }

      throw new BadRequestException()
    } catch (e) {
      logger.error(
        `${getMethodName(this.upsertAbsensiManual)}, ${e.toString()}`,
      )
      throw new BadRequestException()
    }
  }

  async getRekapAbsensiManual(): Promise<any[]> {
    try {
      const result = await getConnection().query('call r_usulan_absen_manual')

      return result[0]
    } catch (e) {
      logger.error(
        `${getMethodName(this.getRekapAbsensiManual)}, ${e.toString()}`,
      )
      throw new BadRequestException()
    }
  }
}
