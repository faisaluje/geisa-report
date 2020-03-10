import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfig } from './config/typeorm.config'
import { PenggunaModule } from './pengguna/pengguna.module'
import { AuthModule } from './auth/auth.module'
import { DurasiModule } from './durasi/durasi.module'
import { ReportKehadiranModule } from './report-kehadiran/report-kehadiran.module'
import { RowsModule } from './rows/rows.module'
import { SekolahModule } from './sekolah/sekolah.module'
import { PengaturanLiburModule } from './pengaturan-libur/pengaturan-libur.module'
import { KoreksiStatusKehadiranModule } from './koreksi-status-kehadiran/koreksi-status-kehadiran.module'
import { DokumenPendukungModule } from './dokumen-pendukung/dokumen-pendukung.module'
import { DataGuruModule } from './data-guru/data-guru.module'
import { StatusKehadiranModule } from './status-kehadiran/status-kehadiran.module'
import { AlasanPenolakanModule } from './alasan-penolakan/alasan-penolakan.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { RekapHarianModule } from './rekap-harian/rekap-harian.module';
import { LogMesinModule } from './log-mesin/log-mesin.module';
import { AbsensiManualModule } from './absensi-manual/absensi-manual.module';
import { AbsensiManualDetailModule } from './absensi-manual-detail/absensi-manual-detail.module';

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
    DataGuruModule,
    StatusKehadiranModule,
    AlasanPenolakanModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    RekapHarianModule,
    LogMesinModule,
    AbsensiManualModule,
    AbsensiManualDetailModule,
  ],
})
export class AppModule {}
