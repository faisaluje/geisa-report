import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { PenggunaModule } from './pengguna/pengguna.module';
import { AuthModule } from './auth/auth.module';
import { DurasiModule } from './durasi/durasi.module';
import { ReportDurasiModule } from './report-durasi/report-durasi.module';
import { RowsModule } from './rows/rows.module';
import { SekolahModule } from './sekolah/sekolah.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    PenggunaModule,
    AuthModule,
    DurasiModule,
    ReportDurasiModule,
    RowsModule,
    SekolahModule
  ]
})
export class AppModule {}
