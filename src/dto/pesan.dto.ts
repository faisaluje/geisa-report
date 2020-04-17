export class PesanDto {
  id_pesan: number
  tanggal: Date
  dari_pengguna_id: string
  judul: string
  status_pesan_id: number
  isi_pesan: string
  sifat_pesan: number
  terbaca?: number
}
