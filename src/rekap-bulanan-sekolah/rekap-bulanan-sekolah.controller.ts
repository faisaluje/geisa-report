import { Controller, UseGuards, Get, Query, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RekapBulananSekolahService } from './rekap-bulanan-sekolah.service'
import getSekolahIdFromPenggunaId from '../utils/get-sekolahId-from-penggunaId.utils'
import * as config from 'config'

const prefixConfig = config.get('prefix')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/rekap/bulanan-sekolah`)
export class RekapBulananSekolahController {
  constructor(
    private readonly rekapBulananSekolahService: RekapBulananSekolahService,
  ) {}

  @Get('/')
  async getRekapBulananSekolah(
    @Query() query: any,
    @Req() req: any,
  ): Promise<any[]> {
    const sekolahId = await getSekolahIdFromPenggunaId(req.user.id)
    return await this.rekapBulananSekolahService.getRekapBulananSekolah(
      sekolahId || query.sekolahId,
      query.monthSelected,
      // tslint:disable-next-line: radix
      parseInt(query.hitungUlang),
    )
  }
}
