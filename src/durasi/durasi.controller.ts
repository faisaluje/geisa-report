import { Controller, Get, Req, UseGuards, Post, Body } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { DurasiService } from './durasi.service'
import { PengaturanDurasi } from 'src/entities/pengaturanDurasi.entity'

@UseGuards(AuthGuard())
@Controller('durasi')
export class DurasiController {
  constructor(private readonly durasiService: DurasiService) {}

  @Get('/')
  getPengaturanDurasi(@Req() req: any): Promise<PengaturanDurasi[]> {
    return this.durasiService.getPengaturanDurasi(req.user)
  }

  @Post('/')
  async setPengaturanDurasi(
    @Body() body: PengaturanDurasi[],
    @Req() req: any,
  ): Promise<PengaturanDurasi[]> {
    return await this.durasiService.setPengaturanDurasi(body, req.user)
  }
}
