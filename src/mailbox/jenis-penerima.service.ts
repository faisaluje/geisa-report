import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RefJenisPenerima } from 'src/entities/RefJenisPenerima.entity'
import { Repository } from 'typeorm'
import { UserDto } from 'src/dto/user.dto'
import { getMethodName } from 'src/services/ClassHelpers'

const logger = new Logger('jenis-penerima-service')

@Injectable()
export class JenisPenerimaService {
  constructor(
    @InjectRepository(RefJenisPenerima)
    private readonly jenisPenerimaRepo: Repository<RefJenisPenerima>,
  ) {}

  async getJenisPenerima(user: UserDto): Promise<RefJenisPenerima[]> {
    try {
      const { peran } = user

      return await this.jenisPenerimaRepo
        .createQueryBuilder('jenisPenerima')
        .select()
        .innerJoin(
          'ref_jenis_penerima_per_peran',
          'perPeran',
          'perPeran.jenis_penerima_id = jenisPenerima.jenis_penerima_id',
        )
        .where('perPeran.bisa_kirim = :bisaKirim', { bisaKirim: 1 })
        .andWhere('perPeran.peran_id = :peran', { peran })
        .getMany()
    } catch (e) {
      logger.error(`${getMethodName(this.getJenisPenerima)}, ${e.toString()}`)
      throw new BadRequestException()
    }
  }
}
