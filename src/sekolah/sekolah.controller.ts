import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { SekolahService } from './sekolah.service'
import { PagingDto } from '../dto/paging.dto'
import { AuthGuard } from '@nestjs/passport'
import * as config from 'config'

const prefixConfig = config.get('prefix')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/sekolah`)
export class SekolahController {
  constructor(private sekolahService: SekolahService) {}

  @Get('/')
  async getSekolah(@Query() query: any, @Req() req: any): Promise<PagingDto> {
    const user = req.user

    return await this.sekolahService.getSekolah(user, query)
  }
}
