import * as config from 'config'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Pengguna } from '../entities/pengguna.entity'
import { UserDto } from '../dto/user.dto'
import { RefAnggotaDinas } from '../entities/refAnggotaDinas.entity'
import { PenggunaTestGeisa } from 'src/entities/pengguna.testgeisa.entity'

const jwtConfig = config.get('jwt')

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || jwtConfig.secret,
    })
  }

  async validate(payload: UserDto): Promise<UserDto> {
    const { username } = payload
    let userSekolah: any = await Pengguna.findOne({ username })

    if (!userSekolah) {
      userSekolah = await PenggunaTestGeisa.findOne({ username })

      if (!userSekolah) {
        throw new UnauthorizedException()
      }
    }

    return payload
  }
}
