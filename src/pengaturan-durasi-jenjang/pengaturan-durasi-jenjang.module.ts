import { Module } from '@nestjs/common'
import { PengaturanDurasiJenjangService } from './pengaturan-durasi-jenjang.service'
import { PengaturanDurasiJenjangController } from './pengaturan-durasi-jenjang.controller'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PengaturanDurasiJenjang } from 'src/entities/pengaturanDurasiJenjang.entity'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([PengaturanDurasiJenjang]),
  ],
  providers: [PengaturanDurasiJenjangService],
  controllers: [PengaturanDurasiJenjangController],
})
export class PengaturanDurasiJenjangModule {}
