import { Module } from '@nestjs/common'
import { RekapHarianService } from './rekap-harian.service'
import { RekapHarianController } from './rekap-harian.controller'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [RekapHarianService],
  controllers: [RekapHarianController],
})
export class RekapHarianModule {}
