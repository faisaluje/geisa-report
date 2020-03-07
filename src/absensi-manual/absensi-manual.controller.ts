import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { AbsensiManualService } from './absensi-manual.service'
import { PagingDto } from 'src/dto/paging.dto'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard())
@Controller('absensi-manual')
export class AbsensiManualController {
  constructor(private readonly absensiManualSerivce: AbsensiManualService) {}

  @Get('/')
  async getAbsensiManual(
    @Query() query: any,
    @Req() req: any,
  ): Promise<PagingDto> {
    return await this.absensiManualSerivce.getAbasensiManual(req.user, query)
  }
}
