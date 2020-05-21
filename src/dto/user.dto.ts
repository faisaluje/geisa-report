import { HakAkses } from '../enums/hak-akses.enum'

export class UserDto {
  id: string
  nama: string
  username: string
  peran: number
  hakAkses: HakAkses
  kodeWilayah: string
  instansi: string
}
