import { Module } from '@nestjs/common'
import { DurasiService } from './durasi.service'
import { DurasiController } from './durasi.controller'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PengaturanDurasi } from '../entities/pengaturanDurasi.entity'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([PengaturanDurasi]),
  ],
  providers: [DurasiService],
  controllers: [DurasiController],
  exports: [DurasiService],
})
export class DurasiModule {}
