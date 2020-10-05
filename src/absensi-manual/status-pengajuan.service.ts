import { Injectable } from '@nestjs/common'
import moment = require('moment')
import { AbsensiManualDetail } from 'src/entities/absensiManualDetail.entity'
import { AutomatedApproval } from 'src/entities/automatedApproval.entity'
import { PengaturanDurasiJenjang } from 'src/entities/pengaturanDurasiJenjang.entity'
import { Sekolah } from 'src/entities/sekolah.entity'
import { PengaturanDurasiJenjangService } from 'src/pengaturan-durasi-jenjang/pengaturan-durasi-jenjang.service'
import { SekolahService } from 'src/sekolah/sekolah.service'

@Injectable()
export class StatusPengajuanService {
  constructor(
    private readonly pengaturanDurasiJenjangService: PengaturanDurasiJenjangService,
    private readonly sekolahService: SekolahService,
  ) {}

  async getStatusPengajuan(
    sekolah: Sekolah,
    tgl: Date,
    absensiManualDetail: AbsensiManualDetail[],
  ): Promise<number> {
    const kodeWilayah = this.sekolahService.getKodeWilayahByJenjang(sekolah)
    const automatedApproval = await AutomatedApproval.findOne({
      wilayah: { kodeWilayah },
    })
    if (!automatedApproval) {
      return 1
    }

    const pengaturanDurasi = await this.pengaturanDurasiJenjangService.getPengaturanDurasiBySekolah(
      sekolah,
      tgl.getDay(),
    )

    return this.validateInputTime(absensiManualDetail, pengaturanDurasi) ? 2 : 1
  }

  validateInputTime(
    absensiManualDetail: AbsensiManualDetail[],
    pengaturanDurasi: PengaturanDurasiJenjang,
  ): boolean {
    let result = false
    const refJamDatang = new Date(
      moment().format(`YYYY-MM-DD ${pengaturanDurasi.jamMasuk}`),
    )
    const refJamPulang = new Date(
      moment().format(`YYYY-MM-DD ${pengaturanDurasi.jamPulang}`),
    )

    for (const detail of absensiManualDetail) {
      if (detail.waktuDatang && detail.waktuPulang) {
        const jamDatang = new Date(
          moment().format(`YYYY-MM-DD ${detail.waktuDatang}`),
        )
        const jamPulang = new Date(
          moment().format(`YYYY-MM-DD ${detail.waktuPulang}`),
        )

        result = jamDatang <= refJamDatang && jamPulang >= refJamPulang
        if (!result) {
          break
        }
      }
    }

    if (
      absensiManualDetail.find(
        (detail) => detail.waktuDatang && !detail.waktuPulang,
      )
    ) {
      return false
    }

    if (
      absensiManualDetail.find(
        (detail) => !detail.waktuDatang && detail.waktuPulang,
      )
    ) {
      return false
    }

    return result
  }
}
