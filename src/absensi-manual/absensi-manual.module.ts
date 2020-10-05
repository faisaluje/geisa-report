import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PengaturanDurasiJenjangModule } from 'src/pengaturan-durasi-jenjang/pengaturan-durasi-jenjang.module'
import { SekolahModule } from 'src/sekolah/sekolah.module'

import { AbsensiManualDetailModule } from '../absensi-manual-detail/absensi-manual-detail.module'
import { DokumenPendukungModule } from '../dokumen-pendukung/dokumen-pendukung.module'
import { AbsensiManual } from '../entities/absensiManual.entity'
import { RowsModule } from '../rows/rows.module'
import { AbsensiManualController } from './absensi-manual.controller'
import { AbsensiManualService } from './absensi-manual.service'
import { StatusPengajuanService } from './status-pengajuan.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([AbsensiManual]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    RowsModule,
    AbsensiManualDetailModule,
    DokumenPendukungModule,
    PengaturanDurasiJenjangModule,
    SekolahModule,
  ],
  providers: [AbsensiManualService, StatusPengajuanService],
  controllers: [AbsensiManualController],
})
export class AbsensiManualModule {}
