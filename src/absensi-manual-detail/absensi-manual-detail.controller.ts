import { Controller, UseGuards, Get, Req, Param, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AbsensiManualDetailService } from './absensi-manual-detail.service'
import { PagingDto } from 'src/dto/paging.dto'

@UseGuards(AuthGuard())
@Controller('absensi-manual-detail')
export class AbsensiManualDetailController {
  constructor(
    private readonly absensiManualDetailService: AbsensiManualDetailService,
  ) {}

  @Get('/')
  async getAbsensiManualDetail(
    @Req() req: any,
    @Query('id') id: number,
  ): Promise<any[]> {
    return this.absensiManualDetailService.getAbsensiManualDetail(req.user, id)
  }
}
