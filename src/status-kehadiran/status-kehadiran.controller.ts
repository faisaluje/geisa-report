import { Controller, UseGuards, Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { StatusKehadiranService } from './status-kehadiran.service'
import { RefStatusKehadiran } from 'src/entities/refStatusKehadiran.entity'
import * as config from 'config'

const prefixConfig = config.get('prefix')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/status-kehadiran`)
export class StatusKehadiranController {
  constructor(
    private readonly statusKehadiranService: StatusKehadiranService,
  ) {}

  @Get('/')
  async getStatusKehadiran(): Promise<RefStatusKehadiran[]> {
    return await this.statusKehadiranService.getStatusKehadiran()
  }
}
