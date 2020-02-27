import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common'
import { KoreksiStatusKehadiranService } from './koreksi-status-kehadiran.service'
import { PagingDto } from 'src/dto/paging.dto'
import { AuthGuard } from '@nestjs/passport'
import { FilesInterceptor } from '@nestjs/platform-express/multer'
import { FileDto } from 'src/dto/file.dto'
import { KoreksiStatusKehadiran } from 'src/entities/koreksiStatusKehadiran.entity'
import { KoreksiStatusDto } from 'src/dto/koreksi-status.dto'

@UseGuards(AuthGuard())
@Controller('koreksi-status-kehadiran')
export class KoreksiStatusKehadiranController {
  constructor(
    private readonly koreksiStatusKehadiranService: KoreksiStatusKehadiranService,
  ) {}

  @Get('/')
  async getKoreksuStatusKehadiran(
    @Query() query: any,
    @Req() req: any,
  ): Promise<PagingDto> {
    return await this.koreksiStatusKehadiranService.getKoreksiStatusKehadiran(
      req.user,
      query,
    )
  }

  @Post('/')
  @UseInterceptors(FilesInterceptor('files'))
  async upsertKoreksiStatusKehadiran(
    @UploadedFiles() files: FileDto[],
    @Body() data: any,
    @Req() req: any,
  ): Promise<KoreksiStatusDto> {
    return await this.koreksiStatusKehadiranService.upsertKoreksiStatusKehadiran(
      req.user,
      data,
      files,
    )
  }
}
