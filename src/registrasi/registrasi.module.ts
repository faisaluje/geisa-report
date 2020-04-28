import { Module } from '@nestjs/common'
import { RegistrasiService } from './registrasi.service'
import { RegistrasiController } from './registrasi.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Pengguna } from '../entities/pengguna.entity'
import { Sekolah } from '../entities/sekolah.entity'
import { PenggunaModule } from '../pengguna/pengguna.module'

@Module({
  imports: [TypeOrmModule.forFeature([Pengguna, Sekolah]), PenggunaModule],
  providers: [RegistrasiService],
  controllers: [RegistrasiController],
})
export class RegistrasiModule {}
