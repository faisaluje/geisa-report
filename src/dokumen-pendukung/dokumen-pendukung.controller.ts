import { Controller, UseGuards, Delete, Param } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { DokumenPendukungService } from './dokumen-pendukung.service'

@UseGuards(AuthGuard())
@Controller('dokumen-pendukung')
export class DokumenPendukungController {
  constructor(
    private readonly dokumenPendukungService: DokumenPendukungService,
  ) {}

  @Delete('/:fileName')
  async deleteDokumenPendukung(
    @Param('fileName') fileName: string,
  ): Promise<boolean> {
    return await this.dokumenPendukungService.deleteDokumenPendukung(fileName)
  }
}
