import { Module } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { DashboardController } from './dashboard.controller'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
