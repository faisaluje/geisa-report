import { Controller, Get, UseGuards } from '@nestjs/common'
import { AlasanPenolakanService } from './alasan-penolakan.service'
import { RefAlasanPenolakan } from 'src/entities/refAlasanPenolakan.entity'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard())
@Controller('alasan-penolakan')
export class AlasanPenolakanController {
  constructor(
    private readonly alasanPenolakanService: AlasanPenolakanService,
  ) {}

  @Get('/')
  async getAlasanPenolakan(): Promise<RefAlasanPenolakan[]> {
    return await this.alasanPenolakanService.getAlasanPenolakan()
  }
}
