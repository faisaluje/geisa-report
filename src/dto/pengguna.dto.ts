import { Peran } from '../entities/peran.entity'
import { Jenjang } from '../enums/jenjang.enum'
import { HakAkses } from '../enums/hak-akses.enum'
import { WilayahDto } from './wilayah.dto'

export class PenggunaDto {
  penggunaId: string
  nama: string
  username: string
  password?: string
  peran: Peran
  noHp: string
  jenjang: Jenjang[]
  wilayah: WilayahDto
  cakupanWilayah: WilayahDto[]
  hakAkses: HakAkses
  picName: string
}
