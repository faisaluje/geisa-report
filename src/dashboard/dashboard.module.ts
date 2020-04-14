import { Module } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { DashboardController } from './dashboard.controller'
import { PassportModule } from '@nestjs/passport'
import { PenggunaGeisaService } from './pengguna-geisa.service'
import { DashboardSekolahService } from './dashboard-sekolah.service'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [DashboardService, PenggunaGeisaService, DashboardSekolahService],
  controllers: [DashboardController],
})
export class DashboardModule {}
