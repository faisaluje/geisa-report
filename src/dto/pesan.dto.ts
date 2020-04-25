import { PesanPenerima } from 'src/entities/PesanPenerima.entity'
import { PesanTerbaca } from 'src/entities/PesanTerbaca.entity'

export class PesanDto {
  id_pesan: number
  tanggal: Date
  dari_pengguna_id: string
  judul: string
  status_pesan_id: number
  isi_pesan: string
  sifat_pesan: number
  terbaca?: number
  penerima?: PesanPenerima[]
  dibaca?: PesanTerbaca[]
}
