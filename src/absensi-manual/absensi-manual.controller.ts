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
import { AbsensiManualService } from './absensi-manual.service'
import { PagingDto } from '../dto/paging.dto'
import { AuthGuard } from '@nestjs/passport'
import { AbsensiManualDto } from '../dto/absensi-manual.dto'
import * as config from 'config'

const prefixConfig = config.get('prefix')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/absensi-manual`)
export class AbsensiManualController {
  constructor(private readonly absensiManualSerivce: AbsensiManualService) {}

  @Get('/rekap')
  async getRekapKoreksiStatus(): Promise<any[]> {
    return this.absensiManualSerivce.getRekapAbsensiManual()
  }

  @Get('/:id')
  async getAbsensiManualOne(
    @Param('id') id: number,
    @Req() req: any,
  ): Promise<AbsensiManualDto> {
    return await this.absensiManualSerivce.getAbsensiManualOne(req.user, id)
  }

  @Get('/')
  async getAbsensiManual(
    @Query() query: any,
    @Req() req: any,
  ): Promise<PagingDto> {
    return await this.absensiManualSerivce.getAbasensiManual(req.user, query)
  }

  @Post('/')
  async upsertAbsensiManual(
    @Body() data: AbsensiManualDto,
    @Req() req: any,
  ): Promise<any> {
    return await this.absensiManualSerivce.upsertAbsensiManual(req.user, data)
  }
}
