import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { getConnection } from 'typeorm'

const logger = new Logger('rekap-bulanan-sekolah-service')

@Injectable()
export class RekapBulananSekolahService {
  async getRekapBulananSekolah(
    sekolahId: string,
    monthSelected: string,
  ): Promise<any[]> {
    try {
      const rekapbulanan = await getConnection().query(
        `SELECT
          *
        FROM
          v_rekapbulanan rekap
        WHERE
          rekap.sekolah_id = ?
          AND rekap.tahunbulan = ?
        ORDER BY
          tahunbulan,
          nama`,
        [sekolahId, monthSelected],
      )

      return rekapbulanan
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
    return []
  }
}
