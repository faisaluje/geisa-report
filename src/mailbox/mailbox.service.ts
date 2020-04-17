import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { UserDto } from 'src/dto/user.dto'
import { PesanDto } from 'src/dto/pesan.dto'
import { JenisPesan } from 'src/enums/jenis-pesan.enum'
import { getConnection } from 'typeorm'
import { getMethodName } from 'src/services/ClassHelpers'

const logger = new Logger('mailbox-service')

@Injectable()
export class MailboxService {
  async getPesan(user: UserDto, jenisPesan: JenisPesan): Promise<PesanDto[]> {
    const { username } = user
    const spName = this.getSpName(jenisPesan)

    try {
      const response = await getConnection().query(
        `call ${spName}('${username}')`,
      )

      return response[0] as PesanDto[]
    } catch (e) {
      logger.error(`${getMethodName(this.getPesan)}, ${e.toString()}`)
      throw new BadRequestException()
    }
  }

  getSpName(jenisPesan: JenisPesan): string {
    switch (jenisPesan) {
      case JenisPesan.DRAFT:
        return 'e_draft'
      case JenisPesan.TERKIRIM:
        return 'e_terkirim'
      case JenisPesan.DIHAPUS:
        return 'e_dihapus'
      default:
        return 'e_inbox'
    }
  }
}
