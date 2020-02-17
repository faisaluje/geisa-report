import { Module } from '@nestjs/common'
import { SekolahService } from './sekolah.service'
import { SekolahController } from './sekolah.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Sekolah } from 'src/entities/sekolah.entity'
import { RowsModule } from 'src/rows/rows.module'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    TypeOrmModule.forFeature([Sekolah]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    RowsModule,
  ],
  providers: [SekolahService],
  controllers: [SekolahController],
})
export class SekolahModule {}
