import { Module } from '@nestjs/common'
import { DokumenPendukungService } from './dokumen-pendukung.service'
import { DokumenPendukungController } from './dokumen-pendukung.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DokumenPendukung } from 'src/entities/dokumenPendukung.entity'
import { PassportModule } from '@nestjs/passport'
import { RowsModule } from 'src/rows/rows.module'

@Module({
  imports: [
    RowsModule,
    TypeOrmModule.forFeature([DokumenPendukung]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [DokumenPendukungService],
  controllers: [DokumenPendukungController],
  exports: [DokumenPendukungService],
})
export class DokumenPendukungModule {}
