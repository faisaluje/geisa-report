import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LogMesin } from 'src/entities/logMesin.entity'
import { Repository } from 'typeorm'
import { PagingDto } from 'src/dto/Paging.dto'
import { RowsService } from 'src/rows/rows.service'

@Injectable()
export class ReportDurasiService {
  constructor(
    @InjectRepository(LogMesin)
    private readonly logMesinRepo: Repository<LogMesin>,
  ) {}

  async getReportDurasi(sekolahId: string, query: any): Promise<PagingDto> {
    const tanggal = query.tanggal ? new Date(query.tanggal) : new Date()

    tanggal.setHours(0, 0, 0, 0)

    const logs = this.logMesinRepo
      .createQueryBuilder('log')
      .select('log.id', 'id')
      .addSelect('log.serial_number', 'serialNumber')
      .addSelect('log.sekolah_id', 'sekolahId')
      .addSelect('log.id_pada_mesin', 'idPadaMesin')
      .addSelect('log.id_pada_dapodik', 'idPadaDapodik')
      .addSelect('log.nama_pada_mesin', 'namaPadaMesin')
      .addSelect('log.nama_pada_dapodik', 'namaPadaDapodik')
      .addSelect('gtk.nuptk', 'nuptk')
      .addSelect('gtk.nip', 'nip')
      .addSelect('gtk.jenis_ptk_id', 'jenisPtkId')
      .addSelect('gtk.jenis_guru', 'jenisGtk')
      .addSelect('log.tanggal_lahir', 'tanggalLahir')
      .addSelect('log.date_time', 'dateTime')
      .addSelect('log.date_insert', 'dateInsert')
      .addSelect('log.update_from', 'updateFrokm')
      .addSelect('log.kirim_dhgtk', 'kirimDhgtk')
      .leftJoin('dataguru', 'gtk', 'gtk.id_dapodik = log.id_pada_dapodik')
      .where('log.sekolah_id = :sekolahId', { sekolahId })
      .andWhere('log.date_time >= :tglFirst', {
        tglFirst: tanggal.toISOString(),
      })

    tanggal.setDate(tanggal.getDate() + 1)
    logs.andWhere('log.date_time < :tglLast', {
      tglLast: tanggal.toISOString(),
    })
    logs.orderBy('log.nama_pada_dapodik', 'ASC')

    const rows = new RowsService(logs)

    if (query.page) {
      // tslint:disable-next-line: radix
      rows.setPage(parseInt(query.page))
    }

    rows.setLimit(1500)

    const result = await rows.getResult()
    return result
  }
}
