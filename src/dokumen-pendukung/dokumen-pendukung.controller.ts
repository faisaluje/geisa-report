import {
  Controller,
  UseGuards,
  Delete,
  Param,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Req,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { DokumenPendukungService } from './dokumen-pendukung.service'
import { DokumenPendukung } from 'src/entities/dokumenPendukung.entity'
import { FilesInterceptor } from '@nestjs/platform-express/multer'
import { FileDto } from 'src/dto/file.dto'

@UseGuards(AuthGuard())
@Controller('dokumen-pendukung')
export class DokumenPendukungController {
  constructor(
    private readonly dokumenPendukungService: DokumenPendukungService,
  ) {}

  @Post('/:koreksiStatusId')
  @UseInterceptors(FilesInterceptor('files'))
  async addDokumenPendukung(
    @UploadedFiles() files: FileDto[],
    @Param('koreksiStatusId') koreksiStatusId: number,
    @Req() req: any,
  ): Promise<DokumenPendukung[]> {
    return this.dokumenPendukungService.addDokumenPendukungs(
      files,
      req.user,
      koreksiStatusId,
    )
  }

  @Delete('/:fileName')
  async deleteDokumenPendukung(
    @Param('fileName') fileName: string,
  ): Promise<boolean> {
    return await this.dokumenPendukungService.deleteDokumenPendukung(fileName)
  }
}
