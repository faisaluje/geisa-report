import {
  Controller,
  Get,
  Req,
  UseGuards,
  Post,
  Body,
  Delete,
  Param,
} from '@nestjs/common'
import { PengaturanLiburService } from './pengaturan-libur.service'
import { PengaturanLibur } from 'src/entities/pengaturanLibur.entity'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard())
@Controller('pengaturan')
export class PengaturanLiburController {
  constructor(
    private readonly pengaturanLiburService: PengaturanLiburService,
  ) {}

  @Get('/libur')
  async getPengaturanLibur(@Req() req: any): Promise<PengaturanLibur[]> {
    return await this.pengaturanLiburService.getPengaturanLibur(req.user)
  }

  @Post('/libur')
  async upsertPengaturanLibur(
    @Body() pengaturanLibur: PengaturanLibur,
    @Req() req: any,
  ): Promise<PengaturanLibur> {
    return await this.pengaturanLiburService.upsertPengaturanLibur(
      pengaturanLibur,
      req.user,
    )
  }

  @Delete('/libur/:id')
  async deletePengaturanLibur(@Param('id') id: string): Promise<boolean> {
    return await this.pengaturanLiburService.deletePengaturanLibur(id)
  }
}
