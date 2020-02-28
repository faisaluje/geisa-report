import { Module } from '@nestjs/common'
import { DokumenPendukungService } from './dokumen-pendukung.service'
import { DokumenPendukungController } from './dokumen-pendukung.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DokumenPendukung } from 'src/entities/dokumenPendukung.entity'
import { PassportModule } from '@nestjs/passport'
import * as config from 'config'
import { RowsModule } from 'src/rows/rows.module'
import { MulterModule } from '@nestjs/platform-express/multer'

const uploadConfig = config.get('upload')

@Module({
  imports: [
    RowsModule,
    MulterModule.register({ dest: uploadConfig.path }),
    TypeOrmModule.forFeature([DokumenPendukung]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [DokumenPendukungService],
  controllers: [DokumenPendukungController],
  exports: [DokumenPendukungService],
})
export class DokumenPendukungModule {}
