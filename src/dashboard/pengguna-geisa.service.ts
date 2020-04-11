import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { UserDto } from 'src/dto/user.dto'
import { getMethodName } from 'src/services/ClassHelpers'
import { Pengguna } from 'src/entities/pengguna.entity'
import { getConnection } from 'typeorm'

const logger = new Logger('pengguna-geisa-service')

@Injectable()
export class PenggunaGeisaService {
  async getPenggunaGeisa(user: UserDto, query: any): Promise<any[]> {
    try {
      let jenjang: string = ''
      const kodeWilayah = query?.kodeWilayah || user.kodeWilayah || '000000'
      if (query.jenjang) {
        jenjang = query.jenjang
      } else {
        jenjang = (await Pengguna.findOne(user.id))?.jenjang.join(',')
      }

      const result = await getConnection().query(
        'call m_daftar_sekolah_pengguna(?, ?)',
        [jenjang, kodeWilayah],
      )

      return result[0]
    } catch (e) {
      logger.log(`${getMethodName(this.getPenggunaGeisa)}, ${e.toString()}`)
      throw new BadRequestException()
    }
  }
}
