import { Module } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { DashboardController } from './dashboard.controller'
import { PassportModule } from '@nestjs/passport'
import { PenggunaGeisaService } from './pengguna-geisa.service'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [DashboardService, PenggunaGeisaService],
  controllers: [DashboardController],
})
export class DashboardModule {}
