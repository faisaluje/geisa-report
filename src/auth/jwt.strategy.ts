import * as config from 'config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Pengguna } from 'src/entities/pengguna.entity';
import { UserDto } from 'src/dto/user.dto';
import { RefAnggotaDinas } from 'src/entities/refAnggotaDinas.entity';

const jwtConfig = config.get('jwt')

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || jwtConfig.secret
    })
  }

  async validate(payload: UserDto): Promise<UserDto> {
    const { username } = payload
    const userSekolah = await Pengguna.findOne({ username })

    if (!userSekolah) {
      const userDinas = await RefAnggotaDinas.findOne({ userIdDinas: username })

      if (!userDinas) {
        throw new UnauthorizedException()
      }
    }

    return payload
  }
}