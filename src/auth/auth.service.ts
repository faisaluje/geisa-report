import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthUserDto } from 'src/dto/auth-user.dto'
import { UserDto } from '../dto/user.dto'
import { Pengguna } from '../entities/pengguna.entity'
import {
  validatePasswordMd5,
  validatePasswordSha1,
} from '../security/processPassword'
import { RefAnggotaDinas } from '../entities/refAnggotaDinas.entity'
import { Sekolah } from '../entities/sekolah.entity'

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
    const userSekolah = await Pengguna.findOne({ username })

    if (userSekolah && validatePasswordMd5(userSekolah.password, password)) {
      return {
        id: userSekolah.penggunaId,
        nama: userSekolah.nama,
        username: userSekolah.username,
        peran: 99, // sekolah
        kodeWilayah: await this.getKodeWilayahBySekolah(userSekolah.username),
      }
    } else {
      const userDinas = await RefAnggotaDinas.findOne({ userIdDinas: username })
      if (
        userDinas &&
        validatePasswordSha1(userDinas.passwordDinas, password)
      ) {
        return {
          id: userDinas.idAnggotaDinas.toString(),
          nama: userDinas.namaAnggotaDinas,
          username: userDinas.userIdDinas,
          peran: userDinas.roleId, // Dinas Kabkota / Provinsi
          kodeWilayah: await this.getKodeWilayahByDinas(userDinas.userIdDinas),
        }
      } else {
        return null
      }
    }
  }

  async getKodeWilayahBySekolah(username: string): Promise<string> {
    const user = await Pengguna.findOne({ username })
    if (!user) {
      return null
    }

    const userSekolah = await Sekolah.findOne(user.sekolahId)
    if (!userSekolah) {
      return null
    }

    if ([1, 5, 6].includes(userSekolah.bentukPendidikanId)) {
      return userSekolah.kodeWilayahKabupatenKota
    } else if (
      [7, 8, 13, 14, 15, 29].includes(userSekolah.bentukPendidikanId)
    ) {
      return userSekolah.kodeWilayahProvinsi
    } else {
      return null
    }
  }

  async getKodeWilayahByDinas(username: string): Promise<string> {
    const user = await RefAnggotaDinas.findOne({ userIdDinas: username })
    if (!user) {
      return null
    }

    let kodeWilayah = user.kabupatenKotaIdList
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

    return kodeWilayah
  }
}
