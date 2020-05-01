import { Sekolah } from '../entities/sekolah.entity'
import { Pengguna } from '../entities/pengguna.entity'
import { Dataguru } from '../entities/dataguru.entity'

export class RegistrasiDto {
  sekolah: Sekolah
  pengguna: Pengguna
  gtk: Dataguru[]
}
