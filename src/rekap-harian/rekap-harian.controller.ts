import { Controller, UseGuards, Get, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RekapHarianService } from './rekap-harian.service'
import * as config from 'config'
import { RekapSummaryDto } from '../dto/rekap-summary.dto'

const prefixConfig = config.get('prefix')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/rekap/harian`)
export class RekapHarianController {
  constructor(private readonly rekapHarianService: RekapHarianService) {}

  @Get('')
  async getRekapHarian(
    @Query('monthSelected') monthSelected?: string,
    @Query('idDapodik') idDapodik?: string,
    @Query('hitungUlang') hitungUlang?: number,
    @Query('nuptk') nuptk?: string,
  ): Promise<any[]> {
    return this.rekapHarianService.getRekapharian({ monthSelected, idDapodik, hitungUlang, nuptk })
  }

  @Get('/summary')
  async getRekapSymmary(@Query() query: any): Promise<RekapSummaryDto> {
    return await this.rekapHarianService.getRekapSummary(
      query.monthSelected,
      query.idDapodik,
    )
  }
}
