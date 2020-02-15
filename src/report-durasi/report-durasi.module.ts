import { Module } from '@nestjs/common';
import { ReportDurasiService } from './report-durasi.service';
import { ReportDurasiController } from './report-durasi.controller';
import { RowsModule } from 'src/rows/rows.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogMesin } from 'src/entities/logMesin.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    RowsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([LogMesin])
  ],
  providers: [ReportDurasiService],
  controllers: [ReportDurasiController]
})
export class ReportDurasiModule {}
