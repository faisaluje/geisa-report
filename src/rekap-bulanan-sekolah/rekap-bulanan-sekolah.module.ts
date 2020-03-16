import { Module } from '@nestjs/common'
import { RekapBulananSekolahService } from './rekap-bulanan-sekolah.service'
import { RekapBulananSekolahController } from './rekap-bulanan-sekolah.controller'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [RekapBulananSekolahService],
  controllers: [RekapBulananSekolahController],
})
export class RekapBulananSekolahModule {}
