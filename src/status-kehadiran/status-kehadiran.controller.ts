import { Controller, UseGuards, Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { StatusKehadiranService } from './status-kehadiran.service'
import { RefStatusKehadiran } from 'src/entities/refStatusKehadiran.entity'

@UseGuards(AuthGuard())
@Controller('status-kehadiran')
export class StatusKehadiranController {
  constructor(
    private readonly statusKehadiranService: StatusKehadiranService,
  ) {}

  @Get('/')
  async getStatusKehadiran(): Promise<RefStatusKehadiran[]> {
    return await this.statusKehadiranService.getStatusKehadiran()
  }
}
