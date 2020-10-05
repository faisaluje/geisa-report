import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Sekolah } from '../entities/sekolah.entity'
import { RowsModule } from '../rows/rows.module'
import { SekolahController } from './sekolah.controller'
import { SekolahService } from './sekolah.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Sekolah]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    RowsModule,
  ],
  providers: [SekolahService],
  controllers: [SekolahController],
  exports: [SekolahService],
})
export class SekolahModule {}
