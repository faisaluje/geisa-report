import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfig } from './config/typeorm.config'
import { PenggunaModule } from './pengguna/pengguna.module'
import { AuthModule } from './auth/auth.module'
import { DurasiModule } from './durasi/durasi.module'
import { ReportKehadiranModule } from './report-kehadiran/report-kehadiran.module'
import { RowsModule } from './rows/rows.module'
import { SekolahModule } from './sekolah/sekolah.module'
import { PengaturanLiburModule } from './pengaturan-libur/pengaturan-libur.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    PenggunaModule,
    AuthModule,
    DurasiModule,
    ReportKehadiranModule,
    RowsModule,
    SekolahModule,
    PengaturanLiburModule,
  ],
})
export class AppModule {}
