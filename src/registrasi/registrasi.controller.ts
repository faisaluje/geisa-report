import {
  Controller,
  Get,
  Param,
  BadRequestException,
  Post,
  Body,
  Logger,
} from '@nestjs/common'
import { PenggunaService } from 'src/pengguna/pengguna.service'
import * as config from 'config'
import { RegistrasiDto } from 'src/dto/registrasi.dto'
import { RegistrasiService } from './registrasi.service'
import { SubmitRegistrasiDto } from 'src/dto/submit-registrasi.dto'

const prefixConfig = config.get('prefix')
const logger = new Logger('registrasi')

@Controller(`${prefixConfig.backend}/registrasi`)
export class RegistrasiController {
  constructor(
    private readonly penggunaService: PenggunaService,
    private readonly registrasiService: RegistrasiService,
  ) {}

  @Get('check-username/:username')
  async checkUsernameExist(@Param('username') username: string): Promise<void> {
    if (await this.penggunaService.checkUsernameExist(username)) {
      throw new BadRequestException()
    }
  }

  @Post()
  async submitRegistrasi(
    @Body() body: SubmitRegistrasiDto,
  ): Promise<RegistrasiDto> {
    return await this.registrasiService.submitRegistrasi(body)
  }
}
