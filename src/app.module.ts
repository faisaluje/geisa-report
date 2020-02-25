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
import { KoreksiStatusKehadiranModule } from './koreksi-status-kehadiran/koreksi-status-kehadiran.module';
import { DokumenPendukungModule } from './dokumen-pendukung/dokumen-pendukung.module';

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
    KoreksiStatusKehadiranModule,
    DokumenPendukungModule,
  ],
})
export class AppModule {}
