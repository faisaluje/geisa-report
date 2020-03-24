import { Controller, Get, Query, Req, UseGuards, Param } from '@nestjs/common'
import { DataGuruService } from './data-guru.service'
import { PagingDto } from 'src/dto/paging.dto'
import { AuthGuard } from '@nestjs/passport'
import * as config from 'config'

const prefixConfig = config.get('prefix')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/gtk`)
export class DataGuruController {
  constructor(private readonly dataGuruService: DataGuruService) {}

  @Get('/:id')
  async getDataGuruOne(@Param('id') id: string): Promise<any> {
    return await this.dataGuruService.getDataGuruOne(id)
  }

  @Get('/')
  async getDataGuru(@Query() query: any, @Req() req: any): Promise<PagingDto> {
    return await this.dataGuruService.getDataGuru(req.user, query)
  }
}
