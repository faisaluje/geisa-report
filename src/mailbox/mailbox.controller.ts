import { Controller, Get, Req, UseGuards, Param } from '@nestjs/common'
import { JenisPenerimaService } from './jenis-penerima.service'
import { RefJenisPenerima } from 'src/entities/RefJenisPenerima.entity'
import { AuthGuard } from '@nestjs/passport'
import * as config from 'config'
import { PesanDto } from 'src/dto/pesan.dto'
import { MailboxService } from './mailbox.service'
import { JenisPesan } from 'src/enums/jenis-pesan.enum'

const prefixConfig = config.get('prefix')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/mailbox`)
export class MailboxController {
  constructor(
    private readonly jenisPenerimaService: JenisPenerimaService,
    private readonly mailboxService: MailboxService,
  ) {}

  @Get('/jenis-penerima')
  async getJenisPenerima(@Req() req: any): Promise<RefJenisPenerima[]> {
    return await this.jenisPenerimaService.getJenisPenerima(req.user)
  }

  @Get('/:jenisPesan')
  async getInboxbyJenis(
    @Req() req: any,
    @Param('jenisPesan') jenisPesan: JenisPesan,
  ): Promise<PesanDto[]> {
    return await this.mailboxService.getPesan(req.user, jenisPesan)
  }

  @Get('/')
  async getInbox(@Req() req: any): Promise<PesanDto[]> {
    return await this.mailboxService.getPesan(req.user, JenisPesan.INBOX)
  }
}
