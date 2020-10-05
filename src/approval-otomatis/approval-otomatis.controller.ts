import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import * as config from 'config'
import { Pagination } from 'nestjs-typeorm-paginate'
import { AutomatedApprovalDto } from 'src/dto/automated-approval.dto'
import { AutomatedApproval } from 'src/entities/automatedApproval.entity'

import { ApprovalOtomatisService } from './approval-otomatis.service'

const prefixConfig = config.get('prefix')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/approval-otomatis`)
export class ApprovalOtomatisController {
  constructor(private approvalOtomatisService: ApprovalOtomatisService) {}

  @Get('/')
  async getListApprovalOtomatis(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<AutomatedApproval>> {
    limit = limit > 100 ? 100 : limit
    return this.approvalOtomatisService.getListApprovalOtomatis({ page, limit })
  }

  @Post('/')
  async createApprovalOtomatis(
    @Body() data: AutomatedApprovalDto,
    @Req() req: any,
  ): Promise<AutomatedApproval> {
    if (!data.wilayah) {
      throw new BadRequestException('Wilayah tidak boleh kosong')
    }

    return this.approvalOtomatisService.createApprovalOtomatis({
      wilayah: data.wilayah,
      createBy: req.user.id,
    })
  }

  @Delete('/:kodeWilayah')
  async deleteApprovalOtomatis(
    @Param('kodeWilayah') kodeWilayah: string,
  ): Promise<void> {
    return this.approvalOtomatisService.deleteApprovalOtomatis(kodeWilayah)
  }
}
