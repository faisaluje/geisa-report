import { Module } from '@nestjs/common'
import { MailboxService } from './mailbox.service'
import { MailboxController } from './mailbox.controller'
import { JenisPenerimaService } from './jenis-penerima.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RefJenisPenerima } from 'src/entities/RefJenisPenerima.entity'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    TypeOrmModule.forFeature([RefJenisPenerima]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [MailboxService, JenisPenerimaService],
  controllers: [MailboxController],
})
export class MailboxModule {}
