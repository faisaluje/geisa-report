import {
  Controller,
  UseGuards,
  Get,
  Req,
  Query,
  Param,
  Post,
  Body,
  Patch,
  UseInterceptors,
  UploadedFile,
  Logger,
  BadRequestException,
} from '@nestjs/common'
import * as config from 'config'
import { AuthGuard } from '@nestjs/passport'
import { PenggunaService } from './pengguna.service'
import { PagingDto } from 'src/dto/paging.dto'
import { PenggunaDto } from 'src/dto/pengguna.dto'
import { FileInterceptor } from '@nestjs/platform-express/multer'
import { FileDto } from 'src/dto/file.dto'
import { PhotoService } from './photo.service'
import { ChangePasswordService } from './change-password.service'
import { UpdatePasswordDto } from 'src/dto/updatePassword.dto'

const prefixConfig = config.get('prefix')
const logger = new Logger('pengguna-controller')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/pengguna`)
export class PenggunaController {
  constructor(
    private readonly penggunaService: PenggunaService,
    private readonly photoService: PhotoService,
    private readonly changePasswordService: ChangePasswordService,
  ) {}

  @Get('/list')
  async getPengguna(@Query() query: any, @Req() req: any): Promise<PagingDto> {
    return await this.penggunaService.getPengguna(req.user, query)
  }

  @Get('/:penggunaId')
  async getProfileData(
    @Param('penggunaId') penggunaId: string,
  ): Promise<PenggunaDto> {
    return await this.penggunaService.getPenggunaOne(penggunaId)
  }

  @Get()
  async getCurrentProfile(@Req() req: any): Promise<PenggunaDto> {
    return await this.penggunaService.getPenggunaOne(req.user.id)
  }

  @Post()
  async createNewPengguna(
    @Body() body: PenggunaDto,
    @Req() req: any,
  ): Promise<PenggunaDto> {
    return await this.penggunaService.upsertPengguna(req.user, body)
  }

  @Patch('/update-password')
  async updatePassword(
    @Body() body: UpdatePasswordDto,
    @Req() req: any,
  ): Promise<void> {
    await this.changePasswordService.updatePassword(req.user, body)
  }

  @Patch('/:id')
  async updatePengguna(
    @Param('id') penggunaId: string,
    @Body() body: PenggunaDto,
    @Req() req: any,
  ): Promise<PenggunaDto> {
    return await this.penggunaService.upsertPengguna(req.user, body, penggunaId)
  }

  @Post('/change-photo')
  @UseInterceptors(FileInterceptor('file'))
  async changePhotoProfile(
    @UploadedFile() file: FileDto,
    @Query() query: any,
  ): Promise<void> {
    try {
      await this.photoService.changePhoto({
        penggunaId: query.id,
        picName: file.filename,
      })
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }
}
