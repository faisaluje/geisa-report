import { Module } from '@nestjs/common'
import { AbsensiManualDetailService } from './absensi-manual-detail.service'
import { AbsensiManualDetailController } from './absensi-manual-detail.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AbsensiManualDetail } from 'src/entities/absensiManualDetail.entity'
import { PassportModule } from '@nestjs/passport'
import { Dataguru } from 'src/entities/dataguru.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([AbsensiManualDetail, Dataguru]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AbsensiManualDetailService],
  controllers: [AbsensiManualDetailController],
  exports: [AbsensiManualDetailService],
})
export class AbsensiManualDetailModule {}
