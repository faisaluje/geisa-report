import { Controller, Get, UseGuards, Param, Query } from '@nestjs/common'
import { PagingDto } from 'src/dto/Paging.dto'
import { ReportDurasiService } from './report-durasi.service'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard())
@Controller('report-durasi')
export class ReportDurasiController {
  constructor(private readonly reportDurasiService: ReportDurasiService) {}

  @Get('/:id')
  async getReportDurasi(
    @Param('id') id: string,
    @Query() query: any,
  ): Promise<PagingDto> {
    return await this.reportDurasiService.getReportDurasi(id, query)
  }
}
