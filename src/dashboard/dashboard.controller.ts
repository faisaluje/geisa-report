import { Controller, UseGuards, Get, Req, Param, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { DashboardService } from './dashboard.service'
import * as config from 'config'
import { PenggunaGeisaService } from './pengguna-geisa.service'

const prefixConfig = config.get('prefix')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/dashboard`)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly penggunaGeisaService: PenggunaGeisaService,
  ) {}

  @Get('/rekap-pengguna')
  async getRekapPengguna(@Query() query: any, @Req() req: any): Promise<any> {
    return this.dashboardService.getRekapPengguna(req.user, query)
  }

  @Get('/rekap-sync')
  async getRekapSync(@Query() query: any, @Req() req: any): Promise<any> {
    const sekolahLastSync = await this.dashboardService.getLastSync(
      req.user,
      query,
    )
    const jumlahSekolahSync = await this.dashboardService.getJumlahSekolahSync(
      req.user,
      query,
    )

    return { sekolahLastSync, jumlahSekolahSync }
  }

  @Get('/last-sync')
  async getLastSync(@Query() query: any, @Req() req: any): Promise<any> {
    return await this.dashboardService.getLastSync(req.user, query)
  }

  @Get('jumlah-sekolah-sync')
  async getJumlahSekolahSync(
    @Query() query: any,
    @Req() req: any,
  ): Promise<any> {
    return await this.dashboardService.getJumlahSekolahSync(req.user, query)
  }

  @Get('pengguna-geisa')
  async getPenggunaGeisa(@Query() query: any, @Req() req: any): Promise<any[]> {
    return await this.penggunaGeisaService.getPenggunaGeisa(req.user, query)
  }
}
