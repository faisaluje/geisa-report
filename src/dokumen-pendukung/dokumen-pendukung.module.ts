import { Module } from '@nestjs/common';
import { DokumenPendukungService } from './dokumen-pendukung.service';
import { DokumenPendukungController } from './dokumen-pendukung.controller';

@Module({
  providers: [DokumenPendukungService],
  controllers: [DokumenPendukungController]
})
export class DokumenPendukungModule {}
