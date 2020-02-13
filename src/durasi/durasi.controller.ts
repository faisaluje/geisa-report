import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DurasiService } from './durasi.service';

@UseGuards(AuthGuard())
@Controller('durasi')
export class DurasiController {
  constructor(private readonly durasiService: DurasiService) {}

  @Get('/')
  getPengaturanDurasi(
    @Req() req: any
  ): any {
    return this.durasiService.getPengaturanDurasi(req.user)
  }
}
