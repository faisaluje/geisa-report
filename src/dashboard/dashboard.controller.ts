import { Controller, UseGuards, Get, Req, Param } from '@nestjs/common'
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
}
