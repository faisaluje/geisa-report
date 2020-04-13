import { InjectRepository } from '@nestjs/typeorm'
import { Pengguna } from 'src/entities/pengguna.entity'
import { Repository } from 'typeorm'
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  NotAcceptableException,
  Logger,
} from '@nestjs/common'
import { UpdatePasswordDto } from 'src/dto/updatePassword.dto'
import { validatePasswordSha1 } from 'src/security/process-password.security'
import { md5, sha1 } from 'locutus/php/strings'
import { getMethodName } from 'src/services/ClassHelpers'
import { UserDto } from 'src/dto/user.dto'

const logger = new Logger('change-password-service')

@Injectable()
export class ChangePasswordService {
  constructor(
    @InjectRepository(Pengguna)
    private readonly penggunaRepo: Repository<Pengguna>,
  ) {}

  async updatePassword(user: UserDto, data: UpdatePasswordDto): Promise<void> {
    const pengguna = await this.penggunaRepo.findOne(user.id)
    if (!pengguna) {
      throw new NotFoundException('Pengguna not found')
    }

    if (!validatePasswordSha1(pengguna.password, md5(data.oldPassword))) {
      throw new BadRequestException('Password lama tidak sesuai')
    }

    try {
      pengguna.password = sha1(md5(data.newPassword))
      pengguna.lastUpdate = new Date()

      await this.penggunaRepo.save(pengguna)
    } catch (e) {
      logger.error(`${getMethodName(this.updatePassword)}, ${e.toString()}`)
      throw new NotAcceptableException()
    }
  }
}
