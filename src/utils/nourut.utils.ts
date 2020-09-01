import { Logger } from '@nestjs/common'
import moment = require('moment')
import { Between, getRepository } from 'typeorm'

import { AbsensiManual } from '../entities/absensiManual.entity'
import { KoreksiStatusKehadiran } from '../entities/koreksiStatusKehadiran.entity'
import { JenisUsulan } from '../enums/jenis-usulan.enum'

export async function generateNoUrut(
  jenisUsulan: JenisUsulan,
): Promise<string> {
  const logger = new Logger('generate-nourut')
  let noUrut: number

  try {
    if (jenisUsulan == JenisUsulan.KOREKSI_STATUS) {
      noUrut = await getRepository(KoreksiStatusKehadiran).count({
        tglPengajuan: Between(
          moment().format('YYYY-MM-01'),
          moment().format('YYYY-MM-31'),
        ),
      })
    } else if (jenisUsulan == JenisUsulan.ABSENSI_MANUAL) {
      noUrut = await getRepository(AbsensiManual).count({
        createDate: Between(
          moment().format('YYYY-MM-01 00:00:00'),
          moment().format('YYYY-MM-31 23:59:59'),
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
