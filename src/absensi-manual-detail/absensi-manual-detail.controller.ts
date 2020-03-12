import {
  Controller,
  UseGuards,
  Get,
  Req,
  Param,
  Query,
  Post,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AbsensiManualDetailService } from './absensi-manual-detail.service'
import { PagingDto } from 'src/dto/paging.dto'

@UseGuards(AuthGuard())
@Controller('absensi-manual-detail')
export class AbsensiManualDetailController {
  constructor(
    private readonly absensiManualDetailService: AbsensiManualDetailService,
  ) {}

  @Post('/')
  async upsertAbsensiManualDetail(): Promise<boolean> {
    return this.absensiManualDetailService.upsertAbsensiManualId(
      null,
      null,
      100,
    )
  }

  @Get('/')
  async getAbsensiManualDetail(
    @Req() req: any,
    @Query('id') id: number,
  ): Promise<any[]> {
    return this.absensiManualDetailService.getAbsensiManualDetail(req.user, id)
  }
}
