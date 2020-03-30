import {
  Controller,
  UseGuards,
  Get,
  Req,
  Param,
  Post,
  Body,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { PengaturanDurasiJenjangService } from './pengaturan-durasi-jenjang.service'
import { PengaturanDurasiJenjang } from 'src/entities/pengaturanDurasiJenjang.entity'
import { Jenjang } from 'src/enums/jenjang.enum'
import * as config from 'config'
import { TipeSubmitDurasi } from 'src/enums/tipe-submit-durasi.enum'

const prefixConfig = config.get('prefix')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/pengaturan/durasi`)
export class PengaturanDurasiJenjangController {
  constructor(
    private readonly pengaturanDurasiJenjangService: PengaturanDurasiJenjangService,
  ) {}

  @Get('/:jenjang')
  async getPengaturanDurasiJenjang(
    @Param('jenjang') jenjang: Jenjang,
    @Req() req: any,
  ): Promise<PengaturanDurasiJenjang[]> {
    return await this.pengaturanDurasiJenjangService.getPengaturanDurasiJenjang(
      req.user,
      jenjang,
    )
  }

  @Get('/')
  async getPengaturanDurasiJenjangBySekolah(
    @Req() req: any,
  ): Promise<PengaturanDurasiJenjang[]> {
    return await this.pengaturanDurasiJenjangService.getPengaturanDurasiJenjang(
      req.user,
    )
  }

  @Post('/:jenjang/:tipeSubmit')
  async setPengaturanDurasiJenjang(
    @Param('jenjang') jenjang: Jenjang,
    @Param('tipeSubmit') tipeSubmitDurasi: TipeSubmitDurasi,
    @Body() body: PengaturanDurasiJenjang[],
    @Req() req: any,
  ): Promise<PengaturanDurasiJenjang[]> {
    return await this.pengaturanDurasiJenjangService.setPengaturanDurasiJenjang(
      body,
      req.user,
      jenjang,
      tipeSubmitDurasi,
    )
  }
}
