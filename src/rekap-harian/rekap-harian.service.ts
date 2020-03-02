import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { getConnection } from 'typeorm'

const logger = new Logger('rekap-harian')

@Injectable()
export class RekapHarianService {
  async getRekapharian(
    monthSelected: string,
    idDapodik: string,
  ): Promise<any[]> {
    try {
      const rekapHarian = await getConnection().query(
        'SELECT * FROM v_rekapharian WHERE id_dapodik = ? AND tahun_bulan = ? ORDER BY tahun_bulan, hari_ke LIMIT 0, 31',
        [idDapodik, monthSelected],
      )

      return rekapHarian
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }
}
