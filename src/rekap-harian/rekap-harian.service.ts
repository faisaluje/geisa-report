import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { RekapHarianDto } from 'src/dto/rekap-harian.dto'
import { Dataguru } from 'src/entities/dataguru.entity'
import { FindConditions, getConnection, getRepository } from 'typeorm'
import { RekapSummaryDto } from '../dto/rekap-summary.dto'

const logger = new Logger('rekap-harian')

@Injectable()
export class RekapHarianService {
  async getRekapharian(query?: RekapHarianDto): Promise<any[]> {
    try {
      if (Number(query?.hitungUlang) === 1) {
        const conditions: FindConditions<Dataguru> = {}
        if (query.idDapodik) {
          conditions.idDapodik = query.idDapodik
        } else if (query.nuptk) {
          conditions.nuptk = query.nuptk
        }
        const gtk = await getRepository(Dataguru).findOneOrFail(conditions)
        await getConnection().query('call p_calculate_monthly_by_sek(?);', [
          gtk.sekolahId,
        ])
      }

      let rekapHarian = []
      if (query.idDapodik) {
        rekapHarian = await getConnection().query(
          'SELECT * FROM v_rekapharian WHERE id_dapodik = ? AND tahun_bulan = ? ORDER BY tahun_bulan, hari_ke LIMIT 0, 31',
          [query.idDapodik, query.monthSelected],
        )
      } else if (query.nuptk) {
        rekapHarian = await getConnection().query(
          'SELECT v_rekapharian.* FROM v_rekapharian INNER JOIN dataguru_unique dataguru ON dataguru.id_dapodik = v_rekapharian.id_dapodik WHERE dataguru.nuptk = ? AND tahun_bulan = ? ORDER BY tahun_bulan, hari_ke LIMIT 0, 31',
          [query.nuptk, query.monthSelected],
        )
      }

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
