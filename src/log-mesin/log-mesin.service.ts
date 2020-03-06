import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LogMesin } from 'src/entities/logMesin.entity'
import { Repository } from 'typeorm'
import { PagingDto } from 'src/dto/paging.dto'
import { RowsService } from 'src/rows/rows.service'

const logger = new Logger('log-mesin-service')

@Injectable()
export class LogMesinService {
  constructor(
    @InjectRepository(LogMesin)
    private readonly logMesinRepo: Repository<LogMesin>,
  ) {}

  async getLogMesin(query: any): Promise<PagingDto> {
    const queryLogs = this.logMesinRepo
      .createQueryBuilder('log')
      .select('log.serial_number', 'sn')
      .addSelect('log.id_pada_mesin', 'id')
      .addSelect('log.nama_pada_mesin', 'nama_di_mesin')
      .addSelect('log.nama_pada_dapodik', 'nama_di_dapodik')
      .addSelect('log.date_time', 'date_time')
      .addSelect('log.date_insert', 'date_insert')
      .addSelect('log.update_from', 'update_from')
      .addSelect('sekolah.npsn', 'npsn')
      .innerJoin('sekolah', 'sekolah', 'sekolah.sekolah_id=log.sekolah_id')

    if (query.npsn) {
      queryLogs.where('sekolah.npsn = :npsn', { npsn: query.npsn })
    }

    queryLogs.orderBy({
      'log.date_insert': 'DESC',
      'log.date_time': 'DESC',
      'log.nama_pada_dapodik': 'ASC',
    })

    try {
      const rows = new RowsService(queryLogs)

      if (query.page) {
        // tslint:disable-next-line: radix
        rows.setPage(parseInt(query.page))
      }

      return await rows.getResult()
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }
}
