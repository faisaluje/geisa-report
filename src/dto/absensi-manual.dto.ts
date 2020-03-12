import { RefStatusKehadiran } from 'src/entities/refStatusKehadiran.entity'
import { RefAlasanPenolakan } from 'src/entities/refAlasanPenolakan.entity'
import { Sekolah } from 'src/entities/sekolah.entity'
import { DokumenPendukung } from 'src/entities/dokumenPendukung.entity'
import { AbsensiManualDetail } from 'src/entities/absensiManualDetail.entity'

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
