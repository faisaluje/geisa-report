import { Controller, UseGuards, Get, Req, Param, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { DashboardService } from './dashboard.service'

@UseGuards(AuthGuard())
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/rekap-pengguna/:status')
  async getRekapPenggunaWithStatus(
    @Req() req: any,
    @Param('status') status: string,
  ): Promise<any> {
    return this.dashboardService.getRekapPengguna(req.user, status)
  }

  @Get('/rekap-pengguna')
  async getRekapPengguna(@Req() req: any): Promise<any> {
    return this.dashboardService.getRekapPengguna(req.user)
  }

  @Get('/rekap-sync')
  async getRekapSync(@Query() query: any, @Req() req: any): Promise<any> {
    const sekolahLastSync = await this.dashboardService.getLastSunc(
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
    return await this.dashboardService.getLastSunc(req.user, query)
  }

  @Get('jumlah-sekolah-sync')
  async getJumlahSekolahSync(
    @Query() query: any,
    @Req() req: any,
  ): Promise<any> {
    return await this.dashboardService.getJumlahSekolahSync(req.user, query)
  }
}
