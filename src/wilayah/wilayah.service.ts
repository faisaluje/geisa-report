import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RowsService } from '../rows/rows.service'
import { PagingDto } from '../dto/Paging.dto'
import { WilayahDto } from '../dto/wilayah.dto'
import { MstWilayah } from '../entities/mstWilayah.entity'

@Injectable()
export class WilayahService {
  constructor(
    @InjectRepository(MstWilayah)
    private readonly mstWilayahRepo: Repository<MstWilayah>,
  ) {}

  async getWilayahOne(kodeWilayah: string): Promise<WilayahDto> {
    const wilayah = (await this.mstWilayahRepo
      .createQueryBuilder('wil')
      .select('wil.kode_wilayah', 'kodeWilayah')
      .addSelect('wil.nama', 'nama')
      .addSelect('wil.id_level_wilayah', 'idLevelWilayah')
      .addSelect('prov.kode_wilayah', 'kodeProvinsi')
      .addSelect('prov.nama', 'namaProvinsi')
      .addSelect('kabkota.kode_wilayah', 'kodeKabKota')
      .addSelect('kabkota.nama', 'namaKabKota')
      .addSelect('kec.kode_wilayah', 'kodeKecamatan')
      .addSelect('kec.nama', 'namaKecamatan')
      .leftJoin('mst_wilayah', 'kec', 'kec.kode_wilayah=wil.mst_kode_wilayah')
      .leftJoin(
        'mst_wilayah',
        'kabkota',
        'kabkota.kode_wilayah=kec.mst_kode_wilayah',
      )
      .leftJoin(
        'mst_wilayah',
        'prov',
        'prov.kode_wilayah=kabkota.mst_kode_wilayah',
      )
      .where('wil.kode_wilayah = :kodeWilayah', { kodeWilayah })
      .getRawOne()) as WilayahDto

    if (!wilayah) {
      return null
    }

    switch (wilayah.idLevelWilayah) {
      case 3:
        wilayah.kodeProvinsi = wilayah.kodeKabKota
        wilayah.namaProvinsi = wilayah.namaKabKota
        wilayah.kodeKabKota = wilayah.kodeKecamatan
        wilayah.namaKabKota = wilayah.namaKecamatan
        delete wilayah.kodeKecamatan
        delete wilayah.namaKecamatan
        break
      case 2:
        wilayah.kodeProvinsi = wilayah.kodeKecamatan
        wilayah.namaProvinsi = wilayah.namaKecamatan
        delete wilayah.kodeKabKota
        delete wilayah.namaKabKota
        delete wilayah.kodeKecamatan
        delete wilayah.namaKecamatan
        break
    }

    return wilayah
  }

  async getWilayah(query: any): Promise<PagingDto> {
    const wilayah = this.mstWilayahRepo
      .createQueryBuilder('wil')
      .select('wil.kode_wilayah', 'kodeWilayah')
      .addSelect('wil.nama', 'nama')
      .addSelect('wil.id_level_wilayah', 'idLevelWilayah')

    if (query.mstKodeWilayah) {
      wilayah
        .addSelect('mst.kode_wilayah', 'mstKodeWilayah')
        .addSelect('mst.nama', 'mstNama')
        .leftJoin('mst_wilayah', 'mst', 'mst.kode_wilayah=wil.mst_kode_wilayah')
        .where('wil.mst_kode_wilayah = :mstKodeWilayah', {
          mstKodeWilayah: query.mstKodeWilayah,
        })
    } else if (typeof query.level === 'string') {
      switch (query.level) {
        case '2':
          wilayah
            .addSelect('prov.kode_wilayah', 'kodeProvinsi')
            .addSelect('prov.nama', 'namaProvinsi')
            .leftJoin(
              'mst_wilayah',
              'prov',
              'prov.kode_wilayah=wil.mst_kode_wilayah',
            )
            .where('wil.id_level_wilayah = :level', { level: 2 })
          break
        case '3':
          wilayah
            .addSelect('prov.kode_wilayah', 'kodeProvinsi')
            .addSelect('prov.nama', 'namaProvinsi')
            .addSelect('kabkota.kode_wilayah', 'kodeKabKota')
            .addSelect('kabkota.nama', 'namaKabKota')
            .leftJoin(
              'mst_wilayah',
              'kabkota',
              'kabkota.kode_wilayah=wil.mst_kode_wilayah',
            )
            .leftJoin(
              'mst_wilayah',
              'prov',
              'prov.kode_wilayah=kabkota.mst_kode_wilayah',
            )
            .where('wil.id_level_wilayah = :level', { level: 3 })
          break
        case '4':
          wilayah
            .addSelect('prov.kode_wilayah', 'kodeProvinsi')
            .addSelect('prov.nama', 'namaProvinsi')
            .addSelect('kabkota.kode_wilayah', 'kodeKabKota')
            .addSelect('kabkota.nama', 'namaKabKota')
            .addSelect('kec.kode_wilayah', 'kodeKecamatan')
            .addSelect('kec.nama', 'namaKecamatan')
            .leftJoin(
              'mst_wilayah',
              'kec',
              'kec.kode_wilayah=wil.mst_kode_wilayah',
            )
            .leftJoin(
              'mst_wilayah',
              'kabkota',
              'kabkota.kode_wilayah=kec.mst_kode_wilayah',
            )
            .leftJoin(
              'mst_wilayah',
              'prov',
              'prov.kode_wilayah=kabkota.mst_kode_wilayah',
            )
            .where('wil.id_level_wilayah = :level', { level: 4 })
          break
        default:
          wilayah
            .addSelect('mst.kode_wilayah', 'mstKodeWilayah')
            .addSelect('mst.nama', 'mstNama')
            .leftJoin(
              'mst_wilayah',
              'mst',
              'mst.kode_wilayah=wil.mst_kode_wilayah',
            )
            .where('wil.id_level_wilayah = :level', { level: 1 })
      }
    } else {
      wilayah
        .addSelect('mst.kode_wilayah', 'mstKodeWilayah')
        .addSelect('mst.nama', 'mstNama')
        .leftJoin('mst_wilayah', 'mst', 'mst.kode_wilayah=wil.mst_kode_wilayah')
    }

    if (query.search) {
      wilayah.andWhere('wil.nama like :search', { search: `%${query.search}%` })
    }

    const rows = new RowsService(wilayah)

    if (query.page) {
      // tslint:disable-next-line: radix
      rows.setPage(parseInt(query.page))
    }

    if (query.limit) {
      // tslint:disable-next-line: radix
      rows.setLimit(parseInt(query.limit))
    }

    return rows.getResult()
  }
}
