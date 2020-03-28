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

@UseGuards(AuthGuard())
@Controller('pengaturan/durasi')
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

  @Post('/:jenjang')
  async setPengaturanDurasiJenjang(
    @Param('jenjang') jenjang: Jenjang,
    @Body() body: PengaturanDurasiJenjang[],
    @Req() req: any,
  ): Promise<PengaturanDurasiJenjang[]> {
    return await this.pengaturanDurasiJenjangService.setPengaturanDurasiJenjang(
      body,
      req.user,
      jenjang,
    )
  }
}
