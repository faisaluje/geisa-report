import { Module } from '@nestjs/common'
import { DataGuruService } from './data-guru.service'
import { DataGuruController } from './data-guru.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Dataguru } from '../entities/dataguru.entity'
import { RowsModule } from '../rows/rows.module'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    RowsModule,
    TypeOrmModule.forFeature([Dataguru]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [DataGuruService],
  controllers: [DataGuruController],
  exports: [DataGuruService],
})
export class DataGuruModule {}
