import { Dataguru } from '../entities/dataguru.entity'
import { RefStatusKehadiran } from '../entities/refStatusKehadiran.entity'
import { RefAlasanPenolakan } from '../entities/refAlasanPenolakan.entity'
import { Sekolah } from '../entities/sekolah.entity'
import { DokumenPendukung } from '../entities/dokumenPendukung.entity'

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
  waktuDatangAwal?: string
  waktuPulangAwal?: string
  waktuDatangKoreksi?: string
  waktuPulangKoreksi?: string
  jenisIzin?: number
  statusPengajuan: number
  catatanDariPengusul?: string
  catatanDariPemeriksa?: string
  alasanPenolakan?: RefAlasanPenolakan
  dokumenPendukung?: DokumenPendukung[]
}
