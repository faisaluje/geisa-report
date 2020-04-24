import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { UserDto } from 'src/dto/user.dto'
import { PesanDto } from 'src/dto/pesan.dto'
import { JenisPesan } from 'src/enums/jenis-pesan.enum'
import { getConnection, Repository, getRepository } from 'typeorm'
import { getMethodName } from 'src/services/ClassHelpers'
import { Pesan } from 'src/entities/Pesan.entity'
import { InjectRepository } from '@nestjs/typeorm'
import moment = require('moment')
import { PesanPenerima } from 'src/entities/PesanPenerima.entity'

const logger = new Logger('mailbox-service')

@Injectable()
export class MailboxService {
  constructor(
    @InjectRepository(Pesan) private readonly pesanRepo: Repository<Pesan>,
  ) {}

  async getPesanOne(idPesan: number): Promise<Pesan> {
    try {
      return await this.pesanRepo.findOneOrFail(idPesan)
    } catch (e) {
      logger.error(`${getMethodName(this.getPesanOne)}, ${e.toString()}`)
      throw new NotFoundException()
    }
  }

  async getPesanWithDetail(
    user: UserDto,
    statusPesanId: number,
  ): Promise<Pesan[]> {
    try {
      return await this.pesanRepo.find({
        dariPenggunaId: user.username,
        statusPesanId,
      })
    } catch (e) {
      logger.error(`${getMethodName(this.getPesanWithDetail)}, ${e.toString()}`)
      throw new NotFoundException()
    }
  }

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

  async updateReadPesan(user: UserDto, idPesan: number): Promise<void> {
    try {
      await getConnection().query('call p_baca_pesan(?,?)', [
        idPesan,
        user.username,
      ])
    } catch (e) {
      logger.error(`${getMethodName(this.updateReadPesan)}, ${e.toString()}`)
      throw new BadRequestException('Gagal memperbaharui sudah baca')
    }
  }

  async upsertPesan(user: UserDto, body: Pesan): Promise<void> {
    try {
      const { username } = user

      body.tanggal = moment()
        .locale('id')
        .format('YYYY-MM-DD')
      body.dariPenggunaId = username

      const pesan = await this.pesanRepo.save(body)

      if (body.penerima) {
        for (const pesanPenerima of body.penerima) {
          pesanPenerima.pesan = pesan
        }
        await getRepository(PesanPenerima).save(body.penerima)
      }
    } catch (e) {
      logger.error(`${getMethodName(this.upsertPesan)}, ${e.toString()}`)
      throw new BadRequestException()
    }
  }

  async deletePesan(idPesan: number[]): Promise<void> {
    try {
      await this.pesanRepo.update(idPesan, { statusPesanId: 3 })
    } catch (e) {
      logger.error(`${getMethodName(this.deletePesan)}, ${e.toString()}`)
      throw new BadRequestException()
    }
  }

  getSpName(jenisPesan: JenisPesan): string {
    switch (jenisPesan) {
      case JenisPesan.Draft:
        return 'e_draft'
      case JenisPesan.Terkirim:
        return 'e_terkirim'
      case JenisPesan.Dihapus:
        return 'e_dihapus'
      default:
        return 'e_inbox'
    }
  }
}
