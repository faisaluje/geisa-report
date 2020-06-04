import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  Param,
  Post,
  Body,
} from '@nestjs/common'
import { DataGuruService } from './data-guru.service'
import { PagingDto } from '../dto/paging.dto'
import { AuthGuard } from '@nestjs/passport'
import * as config from 'config'
import { Dataguru } from 'src/entities/dataguru.entity'

const prefixConfig = config.get('prefix')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/gtk`)
export class DataGuruController {
  constructor(private readonly dataGuruService: DataGuruService) {}

  @Get('/:id')
  async getDataGuruOne(@Param('id') id: string, @Req() req: any): Promise<any> {
    return await this.dataGuruService.getDataGuruOne(req.user, id)
  }

  @Get('/')
  async getDataGuru(@Query() query: any, @Req() req: any): Promise<PagingDto> {
    return await this.dataGuruService.getDataGuru(req.user, query)
  }

  @Post('/')
  async upsertDataGuru(@Body() gtk: Dataguru, @Req() req: any): Promise<void> {
    return await this.dataGuruService.upsertDataGuru(req.user, gtk)
  }
}
