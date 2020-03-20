export class UserDto {
  id: string
  nama: string
  username: string
  peran: number // 1 = admin, 2 = kab/kota, 3 = provinsi, 99 = sekolah
  kodeWilayah: string
  instansi: string
}
