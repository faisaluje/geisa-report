import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { SekolahService } from './sekolah.service'
import { PagingDto } from '../dto/Paging.dto'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard())
@Controller('sekolah')
export class SekolahController {
  constructor(private sekolahService: SekolahService) {}

  @Get('/')
  async getSekolah(@Query() query: any, @Req() req: any): Promise<PagingDto> {
    const user = req.user

    return await this.sekolahService.getSekolah(user, query)
  }
}
