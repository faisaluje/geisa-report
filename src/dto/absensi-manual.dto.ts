import { RefStatusKehadiran } from '../entities/refStatusKehadiran.entity'
import { RefAlasanPenolakan } from '../entities/refAlasanPenolakan.entity'
import { Sekolah } from '../entities/sekolah.entity'
import { DokumenPendukung } from '../entities/dokumenPendukung.entity'

export class AbsensiManualDto {
  absensiManualId?: number
  noAbsensiManual?: string
  sekolah?: Sekolah
  serialNumber?: string
  merk?: string
  jenisAbsensiManual: RefStatusKehadiran
  tanggal: string
  detail: any[]
  statusPengajuan: number
  catatanDariPengusul?: string
  catatanDariPemeriksa?: string
  alasanPenolakan?: RefAlasanPenolakan
  dokumenPendukung?: DokumenPendukung[]
}
