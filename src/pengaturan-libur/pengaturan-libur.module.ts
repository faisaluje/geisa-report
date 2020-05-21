import { Module } from '@nestjs/common'
import { PengaturanLiburService } from './pengaturan-libur.service'
import { PengaturanLiburController } from './pengaturan-libur.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PengaturanLibur } from '../entities/pengaturanLibur.entity'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([PengaturanLibur]),
  ],
  providers: [PengaturanLiburService],
  controllers: [PengaturanLiburController],
})
export class PengaturanLiburModule {}
