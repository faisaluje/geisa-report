import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { md5 } from 'locutus/php/strings'

import { AuthUserDto } from '../dto/auth-user.dto'
import { UserDto } from '../dto/user.dto'
import { MstWilayah } from '../entities/mstWilayah.entity'
import { Pengguna } from '../entities/pengguna.entity'
import { PenggunaTestGeisa } from '../entities/pengguna.testgeisa.entity'
import { RefAnggotaDinas } from '../entities/refAnggotaDinas.entity'
import { Sekolah } from '../entities/sekolah.entity'
import { HakAkses } from '../enums/hak-akses.enum'
import { Peran } from '../enums/peran.enum'
import { validatePasswordMd5, validatePasswordSha1 } from '../security/process-password.security'
import getBentukPendidikanIdFromPeran from '../utils/get-bentukPendidikanId-from-peran.utils'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(authUserDto: AuthUserDto): Promise<string> {
    const user = await this.validateUserPassword(authUserDto)

    if (!user) {
      throw new UnauthorizedException('Bad Credentials')
    }

    return this.jwtService.sign(user)
  }

  async validateUserPassword(authUserDto: AuthUserDto): Promise<UserDto> {
    const { username, password } = authUserDto
    let sekolah: Sekolah
    const pengguna: any =
      (await Pengguna.findOne({ username })) ||
      (await PenggunaTestGeisa.findOne({ username }))

    if (pengguna && this.validatePassword(pengguna.password, password)) {
      let instansi: string

      if (pengguna.peranId == Peran.SEKOLAH) {
        sekolah = await Sekolah.findOne(pengguna.sekolahId)
        instansi = sekolah?.nama || 'Sekolah'
      } else if (pengguna.peranId === Peran.ADMIN) {
        instansi = 'Nasional'
      } else {
        instansi = pengguna.wilayah.nama
      }

      return {
        id: pengguna.penggunaId,
        nama: pengguna.nama || pengguna.username,
        username: pengguna.username,
        peran: pengguna.peranId,
        hakAkses: pengguna.hakAkses || HakAkses.MONITORING,
        kodeWilayah: pengguna.wilayah
          ? pengguna.wilayah.kodeWilayah.trim()
          : pengguna.peranId == Peran.SEKOLAH
          ? this.getKodeWilayahBySekolah(sekolah)
          : null,
        instansi,
      }
    } else {
      return null
    }
  }

  validatePassword(encryptedPassword: string, plainPassword: string): boolean {
    const isMd5 = validatePasswordMd5(encryptedPassword, plainPassword)

    if (!isMd5) {
      return validatePasswordSha1(encryptedPassword, md5(plainPassword))
    }

    return isMd5
  }

  getKodeWilayahBySekolah(sekolah: Sekolah): string {
    if (!sekolah) {
      return null
    }

    if (
      getBentukPendidikanIdFromPeran(Peran.KABKOTA).includes(
        sekolah.bentukPendidikanId,
      )
    ) {
      return sekolah.kodeWilayahKabupatenKota
    } else if (
      getBentukPendidikanIdFromPeran(Peran.PROPINSI).includes(
        sekolah.bentukPendidikanId,
      )
    ) {
      return sekolah.kodeWilayahProvinsi
    } else {
      return null
    }
  }

  async getWilayahByDinas(username: string): Promise<MstWilayah> {
    const user = await RefAnggotaDinas.findOne({ userIdDinas: username })
    if (!user) {
      return null
    }

    let kodeWilayah =
      user.roleId === 1 ? '["000000"]' : user.kabupatenKotaIdList
    if (kodeWilayah) {
      kodeWilayah = JSON.parse(kodeWilayah)
    } else {
      return null
    }

    kodeWilayah = typeof kodeWilayah === 'object' ? kodeWilayah[0] : kodeWilayah

    if (kodeWilayah.length === 5) {
      kodeWilayah = `0${kodeWilayah}`
    }

    if (user.roleId === 3) {
      kodeWilayah = kodeWilayah.substr(0, 2) + '0000'
    }

    return await MstWilayah.findOne(kodeWilayah)
  }
}
