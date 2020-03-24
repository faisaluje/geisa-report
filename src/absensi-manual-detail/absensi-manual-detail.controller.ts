import { Controller, UseGuards, Get, Req, Query, Post } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AbsensiManualDetailService } from './absensi-manual-detail.service'
import * as config from 'config'

const prefixConfig = config.get('prefix')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/absensi-manual-detail`)
export class AbsensiManualDetailController {
  constructor(
    private readonly absensiManualDetailService: AbsensiManualDetailService,
  ) {}

  @Post('/')
  async upsertAbsensiManualDetail(): Promise<boolean> {
    return this.absensiManualDetailService.upsertAbsensiManualId(
      null,
      null,
      100,
    )
  }

  @Get('/')
  async getAbsensiManualDetail(
    @Req() req: any,
    @Query('id') id: number,
  ): Promise<any[]> {
    return this.absensiManualDetailService.getAbsensiManualDetail(req.user, id)
  }
}
