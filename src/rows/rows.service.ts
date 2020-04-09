import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common'
import { SelectQueryBuilder } from 'typeorm'
import { PagingDto } from '../dto/paging.dto'
import { UserDto } from 'src/dto/user.dto'
import { Pengguna } from 'src/entities/pengguna.entity'
import getBentukPendidikanIdFromPeran from 'src/utils/get-bentukPendidikanId-from-peran.utils'
import { Peran } from 'src/enums/peran.enum'
import { PenggunaTestGeisa } from 'src/entities/pengguna.testgeisa.entity'

const logger = new Logger('rows-service')

@Injectable()
export class RowsService {
  private limit: number
  private offset: number
  private page: number

  constructor(@Inject('QUERY_BUILDER') private query: SelectQueryBuilder<any>) {
    this.limit = 100
    this.offset = 0
    this.page = 1
  }

  async getTotalRowsCount(): Promise<number> {
    return await this.query.getCount()
  }

  async getRowsData(): Promise<any[]> {
    return await this.query
      .offset(this.offset)
      .limit(this.limit)
      .getRawMany()
  }

  setLimit(limit: number) {
    this.limit = limit
  }

  setOffset(offset: number) {
    this.offset = offset
  }

  getLimit(): number {
    return this.limit
  }

  getOffset(): number {
    return this.offset
  }

  setPage(page: number) {
    this.page = page
  }

  async getResult(): Promise<PagingDto> {
    const result = new PagingDto()

    result.totalCount = await this.getTotalRowsCount()
    result.limit = this.getLimit()
    result.page = this.page
    result.totalPage = Math.ceil(result.totalCount / result.limit)
    this.offset = result.limit * (result.page - 1)
    result.rows = await this.getRowsData()

    return result
  }

  static async addLimitByPeran(
    query: SelectQueryBuilder<any>,
    user: UserDto,
    tblAlias: string,
    tblSekolahAlias = 'sekolah',
  ): Promise<SelectQueryBuilder<any>> {
    const { kodeWilayah, peran, id, username } = user

    if ([Peran.KABKOTA, Peran.UPTD].includes(peran)) {
      // Dinas Kab/kota || Dinas UPTD
      if (peran == Peran.UPTD) {
        const pengguna = await Pengguna.findOne(id)

        if (pengguna && pengguna.cakupanWilayah?.length > 1) {
          query.where(
            `${tblSekolahAlias}.kode_wilayah_kecamatan in(:cakupanWilayah)`,
            {
              cakupanWilayah: pengguna.cakupanWilayah,
            },
          )
        } else {
          logger.warn(`Cakupan Wilayah ${username} kosong`)
          throw new NotFoundException()
        }
      } else {
        query.where(
          `${tblSekolahAlias}.kode_wilayah_kabupaten_kota = :kodeWilayah`,
          {
            kodeWilayah,
          },
        )
      }

      query.andWhere(
        `${tblSekolahAlias}.bentuk_pendidikan_id in(:bentukPendidikanId)`,
        {
          bentukPendidikanId: getBentukPendidikanIdFromPeran(Peran.KABKOTA),
        },
      )
    } else if ([Peran.PROPINSI, Peran.CABDIS].includes(peran)) {
      // Dinas Provinsi || Dinas Cabdis
      if (peran == Peran.CABDIS) {
        const pengguna = await Pengguna.findOne(id)

        if (pengguna && pengguna.cakupanWilayah?.length > 1) {
          query.where(
            `${tblSekolahAlias}.kode_wilayah_kabupaten_kota in(:cakupanWilayah)`,
            {
              cakupanWilayah: pengguna.cakupanWilayah,
            },
          )
        } else {
          logger.warn(`Cakupan Wilayah ${username} kosong`)
          throw new NotFoundException()
        }
      } else {
        query.where(`${tblSekolahAlias}.kode_wilayah_provinsi = :kodeWilayah`, {
          kodeWilayah,
        })
      }

      if (kodeWilayah !== '010000') {
        query.andWhere(
          `${tblSekolahAlias}.bentuk_pendidikan_id in(:bentukPendidikanId)`,
          {
            bentukPendidikanId: getBentukPendidikanIdFromPeran(Peran.PROPINSI),
          },
        )
      }
    } else if (peran == Peran.SEKOLAH) {
      // Sekolah
      try {
        const pengguna =
          (await Pengguna.findOne(user.id)) ||
          (await PenggunaTestGeisa.findOne(user.id))
        query.where(`${tblAlias}.sekolah_id = :sekolahId`, {
          sekolahId: pengguna.sekolahId,
        })
      } catch (e) {
        logger.error(e.toString())
        throw new NotFoundException()
      }
    } else {
      query.andWhere(
        `${tblSekolahAlias}.bentuk_pendidikan_id in(:bentukPendidikanId)`,
        {
          bentukPendidikanId: getBentukPendidikanIdFromPeran(Peran.ADMIN),
        },
      )
    }

    return query
  }
}
