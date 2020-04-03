import { Controller, UseGuards, Get, Req, Query, Param } from '@nestjs/common'
import * as config from 'config'
import { AuthGuard } from '@nestjs/passport'
import { PenggunaService } from './pengguna.service'
import { PagingDto } from 'src/dto/paging.dto'
import { PenggunaDto } from 'src/dto/pengguna.dto'

const prefixConfig = config.get('prefix')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/pengguna`)
export class PenggunaController {
  constructor(private readonly penggunaService: PenggunaService) {}

  @Get('/list')
  async getPengguna(@Query() query: any, @Req() req: any): Promise<PagingDto> {
    return await this.penggunaService.getPengguna(req.user, query)
  }

  @Get('/:penggunaId')
  async getProfileData(
    @Param('penggunaId') penggunaId: string,
  ): Promise<PenggunaDto> {
    return await this.penggunaService.getPenggunaOne(penggunaId)
  }

  @Get()
  async getCurrentProfile(@Req() req: any): Promise<PenggunaDto> {
    return await this.penggunaService.getPenggunaOne(req.user.id)
  }
}
