import { Module } from '@nestjs/common'
import { LogMesinService } from './log-mesin.service'
import { LogMesinController } from './log-mesin.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LogMesin } from '../entities/logMesin.entity'
import { RowsModule } from '../rows/rows.module'

@Module({
  imports: [TypeOrmModule.forFeature([LogMesin]), RowsModule],
  providers: [LogMesinService],
  controllers: [LogMesinController],
})
export class LogMesinModule {}
