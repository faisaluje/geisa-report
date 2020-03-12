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
import { PagingDto } from 'src/dto/paging.dto'
import { AuthGuard } from '@nestjs/passport'
import { AbsensiManualDto } from 'src/dto/absensi-manual.dto'

@UseGuards(AuthGuard())
@Controller('absensi-manual')
export class AbsensiManualController {
  constructor(private readonly absensiManualSerivce: AbsensiManualService) {}

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
  ): Promise<boolean> {
    return await this.absensiManualSerivce.upsertAbsensiManual(req.user, data)
  }
}
