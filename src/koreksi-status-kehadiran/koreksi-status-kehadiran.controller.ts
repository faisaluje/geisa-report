import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  Post,
  Body,
  Param,
} from '@nestjs/common'
import { KoreksiStatusKehadiranService } from './koreksi-status-kehadiran.service'
import { PagingDto } from 'src/dto/paging.dto'
import { AuthGuard } from '@nestjs/passport'
import { KoreksiStatusDto } from 'src/dto/koreksi-status.dto'
import { generateNoUrut } from 'src/utils/nourut.utils'

@UseGuards(AuthGuard())
@Controller('koreksi-status-kehadiran')
export class KoreksiStatusKehadiranController {
  constructor(
    private readonly koreksiStatusKehadiranService: KoreksiStatusKehadiranService,
  ) {}

  @Get('/no-urut')
  async getNoUrut(@Query() query: any): Promise<string> {
    // tslint:disable-next-line: radix
    const jenisUsulan = parseInt(query.jenisUsulan) || 1
    return await generateNoUrut(jenisUsulan)
  }

  @Get('/:id')
  async getKoreksiStatusKehadiranOne(
    @Param('id') id: number,
  ): Promise<KoreksiStatusDto> {
    return await this.koreksiStatusKehadiranService.getKoreksiStatusKehadiranOne(
      id,
    )
  }

  @Get('/')
  async getKoreksiStatusKehadiran(
    @Query() query: any,
    @Req() req: any,
  ): Promise<PagingDto> {
    return await this.koreksiStatusKehadiranService.getKoreksiStatusKehadiran(
      req.user,
      query,
    )
  }

  @Post('/')
  async upsertKoreksiStatusKehadiran(
    @Body() data: KoreksiStatusDto,
    @Req() req: any,
  ): Promise<KoreksiStatusDto> {
    return await this.koreksiStatusKehadiranService.upsertKoreksiStatusKehadiran(
      req.user,
      data,
    )
  }
}
