import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  Patch,
  Body,
} from '@nestjs/common'
import { SekolahService } from './sekolah.service'
import { PagingDto } from '../dto/paging.dto'
import { AuthGuard } from '@nestjs/passport'
import * as config from 'config'
import { Sekolah } from 'src/entities/sekolah.entity'

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

  @Patch('/')
  async updateSekolah(@Body() body: Sekolah): Promise<Sekolah> {
    return await this.sekolahService.updateSekolah(body)
  }
}
