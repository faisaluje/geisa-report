import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { KoreksiStatusKehadiranService } from './koreksi-status-kehadiran.service'
import { PagingDto } from 'src/dto/paging.dto'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard())
@Controller('koreksi-status-kehadiran')
export class KoreksiStatusKehadiranController {
  constructor(
    private readonly koreksiStatusKehadiranService: KoreksiStatusKehadiranService,
  ) {}

  @Get('/')
  async getKoreksuStatusKehadiran(
    @Query() query: any,
    @Req() req: any,
  ): Promise<PagingDto> {
    return await this.koreksiStatusKehadiranService.getKoreksiStatusKehadiran(
      req.user,
      query,
    )
  }
}
