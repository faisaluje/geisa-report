import { Module } from '@nestjs/common'
import { AlasanPenolakanService } from './alasan-penolakan.service'
import { AlasanPenolakanController } from './alasan-penolakan.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RefAlasanPenolakan } from 'src/entities/refAlasanPenolakan.entity'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    TypeOrmModule.forFeature([RefAlasanPenolakan]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AlasanPenolakanService],
  controllers: [AlasanPenolakanController],
})
export class AlasanPenolakanModule {}
