import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Pengguna } from '../entities/pengguna.entity'
import { Repository } from 'typeorm'
import { ChangePhotoDto } from '../dto/change-photo.dto'
import * as config from 'config'
import { unlinkSync } from 'fs'

const uploadConfig = config.get('upload')
const logger = new Logger('dokumen-pendukung-1')

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Pengguna)
    private readonly penggunaRepo: Repository<Pengguna>,
  ) {}

  async changePhoto(data: ChangePhotoDto): Promise<void> {
    try {
      const pengguna = await this.penggunaRepo.findOneOrFail(data.penggunaId)

      const oldFile = `${pengguna.picName}`

      pengguna.picName = data.picName
      pengguna.lastUpdate = new Date()

      if (await this.penggunaRepo.save(pengguna)) {
        this.deleteFile(oldFile)
      }
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  deleteFile(fileName: string): boolean {
    try {
      unlinkSync(`${uploadConfig.profilePicPath}/${fileName}`)

      return true
    } catch (err) {
      logger.error(err.toString())
      throw new NotFoundException('File not found')
    }
  }
}
