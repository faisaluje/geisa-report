import { Controller, Get, Query } from '@nestjs/common'
import { LogMesinService } from './log-mesin.service'
import { PagingDto } from 'src/dto/paging.dto'

@Controller('log-mesin')
export class LogMesinController {
  constructor(private readonly logMesinService: LogMesinService) {}

  @Get('')
  async getLogMesin(@Query() query: any): Promise<PagingDto> {
    return await this.logMesinService.getLogMesin(query)
  }
}
