import { Module } from '@nestjs/common'
import { WilayahService } from './wilayah.service'
import { WilayahController } from './wilayah.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MstWilayah } from 'src/entities/mstWilayah.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MstWilayah])],
  providers: [WilayahService],
  controllers: [WilayahController],
})
export class WilayahModule {}
