import { Dataguru } from 'src/entities/dataguru.entity'
import { RefStatusKehadiran } from 'src/entities/refStatusKehadiran.entity'
import { RefAlasanPenolakan } from 'src/entities/refAlasanPenolakan.entity'
import { Sekolah } from 'src/entities/sekolah.entity'
import { DokumenPendukung } from 'src/entities/dokumenPendukung.entity'

export class KoreksiStatusDto {
  koreksiStatusId?: number
  noKoreksi?: string
  gtkSelected: Dataguru
  sekolah?: Sekolah
  tglPengajuan?: number
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
  catatanDariPemeriksa?: string
  alasanPenolakan?: RefAlasanPenolakan
  dokumenPendukung?: DokumenPendukung[]
}
