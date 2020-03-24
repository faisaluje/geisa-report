import { Controller, Get, UseGuards, Param, Query } from '@nestjs/common'
import { PagingDto } from '../dto/paging.dto'
import { ReportKehadiranService } from './report-kehadiran.service'
import { AuthGuard } from '@nestjs/passport'
import * as config from 'config'

const prefixConfig = config.get('prefix')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/report`)
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
