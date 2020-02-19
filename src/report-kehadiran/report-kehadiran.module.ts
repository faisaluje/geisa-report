import { Module } from '@nestjs/common'
import { ReportKehadiranService } from './report-kehadiran.service'
import { ReportKehadiranController } from './report-kehadiran.controller'
import { RowsModule } from 'src/rows/rows.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LogMesin } from 'src/entities/logMesin.entity'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    RowsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([LogMesin]),
  ],
  providers: [ReportKehadiranService],
  controllers: [ReportKehadiranController],
})
export class ReportKehadiranModule {}
