import { Controller, Get, UseGuards, Param, Query } from '@nestjs/common'
import { PagingDto } from 'src/dto/Paging.dto'
import { ReportKehadiranService } from './report-kehadiran.service'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard())
@Controller('report')
export class ReportKehadiranController {
  constructor(
    private readonly reportKehadiranService: ReportKehadiranService,
  ) {}

  @Get('/kehadiran/:id')
  async getReportKehadiran(
    @Param('id') id: string,
    @Query() query: any,
  ): Promise<PagingDto> {
    return await this.reportKehadiranService.getReportKehadiran(id, query)
  }
}
