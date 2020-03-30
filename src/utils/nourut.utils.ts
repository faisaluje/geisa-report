import { getRepository, Between } from 'typeorm'
import { KoreksiStatusKehadiran } from 'src/entities/koreksiStatusKehadiran.entity'
import moment = require('moment')
import { AbsensiManual } from 'src/entities/absensiManual.entity'
import { Logger } from '@nestjs/common'
import { JenisUsulan } from 'src/enums/jenis-usulan.enum'

export async function generateNoUrut(
  jenisUsulan: JenisUsulan,
): Promise<string> {
  const logger = new Logger('generate-nourut')
  let noUrut: number

  try {
    if (jenisUsulan === JenisUsulan.KOREKSI_STATUS) {
      noUrut = await getRepository(KoreksiStatusKehadiran).count({
        tglPengajuan: Between(
          moment().format('YYYY-MM-01'),
          moment().format(`YYYY-MM-31`),
        ),
      })
    } else if (jenisUsulan === JenisUsulan.ABSENSI_MANUAL) {
      noUrut = await getRepository(AbsensiManual).count({
        tanggal: Between(
          moment().format('YYYY-MM-01'),
          moment().format(`YYYY-MM-31`),
        ),
      })
    } else {
      noUrut = 0
    }
  } catch (e) {
    logger.error(e.toString())
    noUrut = 0
  }

  noUrut += 1
  const dateFormat = moment().format('YYYYMM')

  return `${dateFormat}${noUrut.toString().padStart(6, '0')}`
}
