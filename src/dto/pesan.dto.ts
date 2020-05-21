import { PesanPenerima } from '../entities/PesanPenerima.entity'
import { PesanTerbaca } from '../entities/PesanTerbaca.entity'

export class PesanDto {
  id_pesan: number
  tanggal: Date
  dari_pengguna_id: string
  penerima: string
  judul: string
  status_pesan_id: number
  isi_pesan: string
  sifat_pesan: number
  terbaca?: number
  penerima_list?: PesanPenerima[]
  dibaca?: PesanTerbaca[]
}
