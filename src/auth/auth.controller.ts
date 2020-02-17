import { Controller, Post, Body, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthUserDto } from 'src/dto/auth-user.dto'

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signIn(@Body(ValidationPipe) authUserDto: AuthUserDto): Promise<string> {
    return this.authService.signIn(authUserDto)
  }
}
