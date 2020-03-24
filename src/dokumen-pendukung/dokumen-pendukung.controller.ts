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
  Logger,
  BadRequestException,
  Query,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { DokumenPendukungService } from './dokumen-pendukung.service'
import { DokumenPendukung } from 'src/entities/dokumenPendukung.entity'
import { FilesInterceptor } from '@nestjs/platform-express/multer'
import { FileDto } from 'src/dto/file.dto'
import * as config from 'config'

const prefixConfig = config.get('prefix')
const logger = new Logger('dokumen-pendukung-controller')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/dokumen-pendukung`)
export class DokumenPendukungController {
  constructor(
    private readonly dokumenPendukungService: DokumenPendukungService,
  ) {}

  @Post('/:parentId')
  @UseInterceptors(FilesInterceptor('files'))
  async addDokumenPendukung(
    @UploadedFiles() files: FileDto[],
    @Param('parentId') parentId: number,
    @Req() req: any,
    @Query() query: any,
  ): Promise<DokumenPendukung[]> {
    try {
      return this.dokumenPendukungService.addDokumenPendukungs(
        files,
        req.user,
        parentId,
        query.jenisUsulan,
      )
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  @Delete('/:fileName')
  async deleteDokumenPendukung(
    @Param('fileName') fileName: string,
  ): Promise<boolean> {
    return await this.dokumenPendukungService.deleteDokumenPendukung(fileName)
  }
}
