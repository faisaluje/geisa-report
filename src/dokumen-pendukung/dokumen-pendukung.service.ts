import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DokumenPendukung } from 'src/entities/dokumenPendukung.entity'
import { Repository } from 'typeorm'
import { unlinkSync } from 'fs'
import * as config from 'config'
import { FileDto } from 'src/dto/file.dto'
import { UserDto } from 'src/dto/user.dto'

const uploadConfig = config.get('upload')
const logger = new Logger('dokumen-pendukung-1')

@Injectable()
export class DokumenPendukungService {
  constructor(
    @InjectRepository(DokumenPendukung)
    private readonly dokumenPendukungRepo: Repository<DokumenPendukung>,
  ) {}

  async getDokumenPendukung(
    parentId: number,
    jenisUsulan: number,
  ): Promise<DokumenPendukung[]> {
    try {
      return await this.dokumenPendukungRepo.find({ parentId, jenisUsulan })
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  async addDokumenPendukungs(
    files: FileDto[],
    user: UserDto,
    parentId: number,
    jenisUsulan: number,
  ): Promise<DokumenPendukung[]> {
    try {
      const rows = files.map(file => ({
        namaFile: file.filename,
        nameOriginal: file.originalname,
        parentId,
        jenisUsulan,
        mimetype: file.mimetype,
        updatedBy: user.username,
      }))

      return await this.dokumenPendukungRepo.save(rows)
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  async deleteDokumenPendukung(fileName: string): Promise<boolean> {
    try {
      if (
        (await this.dokumenPendukungRepo.delete(fileName)) &&
        this.deleteFile([fileName])
      ) {
        return true
      }

      return false
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  deleteFile(files: string[]): boolean {
    try {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < files.length; i++) {
        unlinkSync(`${uploadConfig.path}/${files[i]}`)
      }

      return true
    } catch (err) {
      logger.error(err.toString())
      throw new NotFoundException('File not found')
    }
  }
}
