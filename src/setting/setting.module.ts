import { Module } from '@nestjs/common'
import { SettingService } from './setting.service'
import { SettingController } from './setting.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Setting } from 'src/entities/Setting.entity'
import { PassportModule } from '@nestjs/passport'
import { MaintenanceMiddleware } from 'src/middleware/maintenance.middleware'

@Module({
  imports: [
    TypeOrmModule.forFeature([Setting]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [SettingService],
  controllers: [SettingController],
  exports: [SettingService],
})
export class SettingModule {}
