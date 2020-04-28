import { Module } from '@nestjs/common'
import { RegistrasiService } from './registrasi.service'
import { RegistrasiController } from './registrasi.controller'
import { PenggunaModule } from '../pengguna/pengguna.module'

@Module({
  imports: [PenggunaModule],
  providers: [RegistrasiService],
  controllers: [RegistrasiController],
})
export class RegistrasiModule {}
