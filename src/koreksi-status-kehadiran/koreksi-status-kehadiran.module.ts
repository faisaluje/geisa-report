import { Module } from '@nestjs/common'
import { KoreksiStatusKehadiranService } from './koreksi-status-kehadiran.service'
import { KoreksiStatusKehadiranController } from './koreksi-status-kehadiran.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { KoreksiStatusKehadiran } from '../entities/koreksiStatusKehadiran.entity'
import { PassportModule } from '@nestjs/passport'
import { RowsModule } from '../rows/rows.module'
import * as config from 'config'
import { DokumenPendukungModule } from '../dokumen-pendukung/dokumen-pendukung.module'
import { Dataguru } from '../entities/dataguru.entity'

const uploadConfig = config.get('upload')

@Module({
  imports: [
    RowsModule,
    DokumenPendukungModule,
    TypeOrmModule.forFeature([KoreksiStatusKehadiran, Dataguru]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [KoreksiStatusKehadiranService],
  controllers: [KoreksiStatusKehadiranController],
})
export class KoreksiStatusKehadiranModule {}
