import { Dataguru } from 'src/entities/dataguru.entity'
import { RefStatusKehadiran } from 'src/entities/refStatusKehadiran.entity'

export class KoreksiStatusDto {
  koreksiStatusId?: number
  noKoreksi?: string
  gtkSelected: Dataguru
  tglKehadiranDari: number
  tglKehadiranSampai?: number
  jenisKoreksi: number
  statusKehadiranAwal?: RefStatusKehadiran
  statusKehadiranKoreksi?: RefStatusKehadiran
  waktuDatangAwal?: number
  waktuPulangAwal?: number
  waktuDatangKoreksi?: number
  waktuPulangKoreksi?: number
  jenisIzin?: number
  statusPengajuan: number
  catatanDariPengusul?: string
  dokumenPendukung?: object
}
