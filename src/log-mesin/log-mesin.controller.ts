import { Controller, Get, Query } from '@nestjs/common'
import { LogMesinService } from './log-mesin.service'
import { PagingDto } from '../dto/paging.dto'
import * as config from 'config'

const prefixConfig = config.get('prefix')

@Controller(`${prefixConfig.backend}/log-mesin`)
export class LogMesinController {
  constructor(private readonly logMesinService: LogMesinService) {}

  @Get('')
  async getLogMesin(@Query() query: any): Promise<PagingDto> {
    return await this.logMesinService.getLogMesin(query)
  }
}
