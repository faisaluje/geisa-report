import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { Dataguru } from 'src/entities/dataguru.entity'
import { getConnection, getRepository } from 'typeorm'
import { RekapSummaryDto } from '../dto/rekap-summary.dto'

const logger = new Logger('rekap-harian')

@Injectable()
export class RekapHarianService {
  async getRekapharian(
    monthSelected: string,
    idDapodik: string,
    hitungUlang?: number,
  ): Promise<any[]> {
    try {
      if (Number(hitungUlang) === 1) {
        const gtk = await getRepository(Dataguru).findOneOrFail({ idDapodik })
        await getConnection().query('call p_calculate_monthly_by_sek(?);', [
          gtk.sekolahId,
        ])
      }

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

  async getRekapSummary(
    monthSelected: string,
    idDapodik: string,
  ): Promise<RekapSummaryDto> {
    try {
      const statusKehadiran = await getConnection().query(
        'call r_Laporan_A1(?,1,?);',
        [idDapodik, monthSelected],
      )

      const jenisAbsensi = await getConnection().query(
        'call r_Laporan_A1(?,2,?);',
        [idDapodik, monthSelected],
      )

      const sakitCutiDinasLuar = await getConnection().query(
        'call r_Laporan_A1(?,3,?);',
        [idDapodik, monthSelected],
      )

      const datangTerlambatPulangCepat = await getConnection().query(
        'call r_Laporan_A1(?,4,?);',
        [idDapodik, monthSelected],
      )

      return {
        statusKehadiran: statusKehadiran[0],
        jenisAbsensi: jenisAbsensi[0],
        sakitCutiDinasLuar: sakitCutiDinasLuar[0],
        datangTerlambatPulangCepat: datangTerlambatPulangCepat[0],
      }
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }
}
