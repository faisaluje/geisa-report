import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LogMesin } from '../entities/logMesin.entity'
import { Repository } from 'typeorm'
import { PagingDto } from '../dto/paging.dto'
import { RowsService } from '../rows/rows.service'

@Injectable()
export class ReportKehadiranService {
  constructor(
    @InjectRepository(LogMesin)
    private readonly logMesinRepo: Repository<LogMesin>,
  ) {}

  async getReportKehadiran(sekolahId: string, query: any): Promise<PagingDto> {
    let tanggal: number = query.tanggal ? query.tanggal : new Date().getTime()

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
      .addSelect('log.update_from', 'updateFrom')
      .addSelect('log.kirim_dhgtk', 'kirimDhgtk')
      .leftJoin('dataguru', 'gtk', 'gtk.id_dapodik = log.id_pada_dapodik')
      .where('log.sekolah_id = :sekolahId', { sekolahId })
      .andWhere('(UNIX_TIMESTAMP(log.date_time)*1000) >= :tglFirst', {
        tglFirst: tanggal,
      })

    tanggal = +tanggal + +86400000
    logs.andWhere('(UNIX_TIMESTAMP(log.date_time)*1000) < :tglLast', {
      tglLast: tanggal,
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
