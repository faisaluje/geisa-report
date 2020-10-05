import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SekolahModule } from 'src/sekolah/sekolah.module'

import { PengaturanDurasiJenjang } from '../entities/pengaturanDurasiJenjang.entity'
import { PengaturanDurasiJenjangController } from './pengaturan-durasi-jenjang.controller'
import { PengaturanDurasiJenjangService } from './pengaturan-durasi-jenjang.service'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([PengaturanDurasiJenjang]),
    SekolahModule,
  ],
  providers: [PengaturanDurasiJenjangService],
  controllers: [PengaturanDurasiJenjangController],
  exports: [PengaturanDurasiJenjangService],
})
export class PengaturanDurasiJenjangModule {}
