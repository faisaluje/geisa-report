import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDto } from 'src/dto/auth-user.dto';
import { UserDto } from 'src/dto/user.dto';
import { Pengguna } from 'src/entities/pengguna.entity';
import { validatePasswordMd5, validatePasswordSha1 } from 'src/security/processPassword';
import { RefAnggotaDinas } from 'src/entities/refAnggotaDinas.entity';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {}

  async signIn(authUserDto: AuthUserDto): Promise<string> {
    const user = await this.validateUserPassword(authUserDto)
    
    if (!user) {
      throw new UnauthorizedException('Bad Credentials')
    }

    const payload: JwtPayload = {
      name: user.nama,
      username: user.username,
      peran: user.peran
    }

    return this.jwtService.sign(payload)
  }

  async validateUserPassword(authUserDto: AuthUserDto): Promise<UserDto> {
    const { username, password } = authUserDto
    const userSekolah = await Pengguna.findOne({ username })

    if (userSekolah && validatePasswordMd5(userSekolah.password, password)){
      return {
        id: userSekolah.penggunaId,
        nama: userSekolah.nama,
        username: userSekolah.username,
        peran: 1  // sekolah
      }
    } else {
      const userDinas = await RefAnggotaDinas.findOne({ userIdDinas: username })
      if (userDinas && validatePasswordSha1(userDinas.passwordDinas, password)) {
        return {
          id: userDinas.idAnggotaDinas.toString(),
          nama: userDinas.namaAnggotaDinas,
          username: userDinas.userIdDinas,
          peran: 2, // dinas
          kodeWilayah: userDinas.kabupatenKotaIdList
        }
      } else {
        return null
      }
    }
  }
}
