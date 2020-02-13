import { Module } from '@nestjs/common';
import { ReportDurasiService } from './report-durasi.service';
import { ReportDurasiController } from './report-durasi.controller';

@Module({
  providers: [ReportDurasiService],
  controllers: [ReportDurasiController]
})
export class ReportDurasiModule {}
