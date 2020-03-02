import { Controller, UseGuards, Get, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RekapHarianService } from './rekap-harian.service'

@UseGuards(AuthGuard())
@Controller('rekap/harian')
export class RekapHarianController {
  constructor(private readonly rekapHarianService: RekapHarianService) {}

  @Get('')
  async getRekapHarian(@Query() query: any): Promise<any[]> {
    return this.rekapHarianService.getRekapharian(
      query.monthSelected,
      query.idDapodik,
    )
  }
}
