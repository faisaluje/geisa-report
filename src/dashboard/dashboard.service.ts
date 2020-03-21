import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { UserDto } from 'src/dto/user.dto'
import { getConnection } from 'typeorm'
import getLevelUser from 'src/utils/get-level-user.utils'

const logger = new Logger('dashboard-service')

@Injectable()
export class DashboardService {
  async getRekapPengguna(
    { peran, kodeWilayah }: UserDto,
    status: string = '',
  ): Promise<any> {
    try {
      const level = getLevelUser(peran)
      const result = await getConnection().query(
        'call m_rekap_pengguna_nas(?, ?, ?)',
        [level, kodeWilayah, status],
      )

      return result[0]
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }
}
