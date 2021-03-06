import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthUserDto } from '../dto/auth-user.dto'
import { AuthGuard } from '@nestjs/passport'
import * as config from 'config'

const prefixConfig = config.get('prefix')

@Controller(`${prefixConfig.backend}/`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signIn(@Body(ValidationPipe) authUserDto: AuthUserDto): Promise<string> {
    return this.authService.signIn(authUserDto)
  }

  @UseGuards(AuthGuard())
  @Get('cek-token')
  cekToken(): object {
    return { status: 'ok' }
  }
}
