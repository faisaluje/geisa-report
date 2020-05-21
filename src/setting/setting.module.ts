import { Module } from '@nestjs/common'
import { SettingService } from './setting.service'
import { SettingController } from './setting.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Setting } from '../entities/Setting.entity'
import { PassportModule } from '@nestjs/passport'

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
