import {
  Controller,
  Get,
  Req,
  UseGuards,
  Param,
  Query,
  Post,
  Body,
  Patch,
} from '@nestjs/common'
import { JenisPenerimaService } from './jenis-penerima.service'
import { RefJenisPenerima } from 'src/entities/RefJenisPenerima.entity'
import { AuthGuard } from '@nestjs/passport'
import * as config from 'config'
import { PesanDto } from 'src/dto/pesan.dto'
import { MailboxService } from './mailbox.service'
import { JenisPesan } from 'src/enums/jenis-pesan.enum'
import { Pesan } from 'src/entities/Pesan.entity'

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
  async getInbox(@Req() req: any, @Query() query: any): Promise<any> {
    if (query.id) {
      return await this.mailboxService.getPesanOne(query.id)
    }

    return await this.mailboxService.getPesan(req.user, JenisPesan.Inbox)
  }

  @Post('/')
  async upsertPesan(@Body() body: Pesan, @Req() req: any): Promise<void> {
    await this.mailboxService.upsertPesan(req.user, body)
  }

  @Patch('/read/:id')
  async updateReadPesan(
    @Param('id') id: number,
    @Req() req: any,
  ): Promise<void> {
    await this.mailboxService.updateReadPesan(req.user, id)
  }
}
