import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Req,
  Delete,
  Param,
} from '@nestjs/common'
import * as config from 'config'
import { AuthGuard } from '@nestjs/passport'
import { CronjobService } from './cronjob.service'
import { CronJob } from 'src/entities/cronJob.entity'

const prefixConfig = config.get('prefix')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/cronjob`)
export class CronjobController {
  constructor(private readonly cronjobService: CronjobService) {}

  @Get('/')
  async getCronJob(): Promise<CronJob[]> {
    return await this.cronjobService.getCronJob()
  }

  @Post('/')
  async upsertCronJob(@Body() body: CronJob, @Req() req: any): Promise<any> {
    return await this.cronjobService.upsertCronJob(req.user, body)
  }

  @Delete('/:id')
  async deleteCronJob(@Param('id') id: number): Promise<void> {
    return await this.cronjobService.deleteCronjob(id)
  }
}
