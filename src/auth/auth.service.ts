import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthUserDto } from 'src/dto/auth-user.dto'
import { UserDto } from '../dto/user.dto'
import { Pengguna } from '../entities/pengguna.entity'
import {
  validatePasswordMd5,
  validatePasswordSha1,
} from '../security/process-password.security'
import { RefAnggotaDinas } from '../entities/refAnggotaDinas.entity'
import { Sekolah } from '../entities/sekolah.entity'
import { MstWilayah } from 'src/entities/mstWilayah.entity'
import getBentukPendidikanIdFromPeran from 'src/utils/get-bentukPendidikanId-from-peran.utils'
import { Peran } from 'src/enums/peran.enum'
import { md5 } from 'locutus/php/strings'
import { PenggunaTestGeisa } from 'src/entities/pengguna.testgeisa.entity'
import { HakAkses } from 'src/enums/hak-akses.enum'

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
        instansi = sekolah.nama
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
