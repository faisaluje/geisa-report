import { Module } from '@nestjs/common'
import { MailboxService } from './mailbox.service'
import { MailboxController } from './mailbox.controller'
import { JenisPenerimaService } from './jenis-penerima.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RefJenisPenerima } from '../entities/RefJenisPenerima.entity'
import { PassportModule } from '@nestjs/passport'
import { Pesan } from '../entities/Pesan.entity'
import { PesanPenerima } from '../entities/PesanPenerima.entity'
import { PesanTerbaca } from '../entities/PesanTerbaca.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RefJenisPenerima,
      Pesan,
      PesanPenerima,
      PesanTerbaca,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [MailboxService, JenisPenerimaService],
  controllers: [MailboxController],
})
export class MailboxModule {}
