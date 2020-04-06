import { Controller, Get, Param, Query } from '@nestjs/common'
import { WilayahService } from './wilayah.service'
import { WilayahDto } from '../dto/wilayah.dto'
import { PagingDto } from '../dto/paging.dto'
import * as config from 'config'

const prefixConfig = config.get('prefix')

@Controller(`${prefixConfig.backend}/wilayah`)
export class WilayahController {
  constructor(private readonly wilayahService: WilayahService) {}

  @Get('/:kodeWilayah')
  async getWilayahOne(
    @Param('kodeWilayah') kodeWilayah: string,
  ): Promise<WilayahDto> {
    return await this.wilayahService.getWilayahOne(kodeWilayah)
  }

  @Get('/')
  async getWilayah(@Query() query: any): Promise<PagingDto> {
    return this.wilayahService.getWilayah(query)
  }
}
