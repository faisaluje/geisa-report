import { Module } from '@nestjs/common'
import { AbsensiManualService } from './absensi-manual.service'
import { AbsensiManualController } from './absensi-manual.controller'
import { PassportModule } from '@nestjs/passport'
import { RowsModule } from 'src/rows/rows.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AbsensiManual } from 'src/entities/absensiManual.entity'
import { AbsensiManualDetailModule } from 'src/absensi-manual-detail/absensi-manual-detail.module'
import { DokumenPendukungModule } from 'src/dokumen-pendukung/dokumen-pendukung.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([AbsensiManual]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    RowsModule,
    AbsensiManualDetailModule,
    DokumenPendukungModule,
  ],
  providers: [AbsensiManualService],
  controllers: [AbsensiManualController],
})
export class AbsensiManualModule {}
