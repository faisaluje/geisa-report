import { Module } from '@nestjs/common'
import { AbsensiManualDetailService } from './absensi-manual-detail.service'
import { AbsensiManualDetailController } from './absensi-manual-detail.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AbsensiManualDetail } from 'src/entities/absensiManualDetail.entity'
import { PassportModule } from '@nestjs/passport'
import { DataGuruModule } from 'src/data-guru/data-guru.module'
import { Dataguru } from 'src/entities/dataguru.entity'
import { RowsModule } from 'src/rows/rows.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([AbsensiManualDetail, Dataguru]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    RowsModule,
  ],
  providers: [AbsensiManualDetailService],
  controllers: [AbsensiManualDetailController],
})
export class AbsensiManualDetailModule {}
