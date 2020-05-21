import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { UserDto } from '../dto/user.dto'
import { getConnection } from 'typeorm'
import getLevelUser from '../utils/get-level-user.utils'

const logger = new Logger('dashboard-service')

@Injectable()
export class DashboardService {
  async getRekapPengguna(user: UserDto, query: any): Promise<any> {
    try {
      const status = query.status || ''
      const level = query.level || getLevelUser(user.peran)
      const kodeWilayah = query.kodeWilayah || user.kodeWilayah

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

  async getLastSync(user: UserDto, query: any): Promise<any> {
    try {
      const level = query.level || getLevelUser(user.peran)
      const status = query.status || ''
      const kodeWilayah = query.kodeWilayah || user.kodeWilayah

      const result = await getConnection().query(
        'call m_Last_Syncron(?, ?, ?, ?)',
        [level, kodeWilayah, query.jenjang, status],
      )

      return result[0]
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  async getJumlahSekolahSync(user: UserDto, query: any): Promise<any> {
    try {
      const level = query.level || getLevelUser(user.peran)
      const status = query.status || ''
      const kodeWilayah = query.kodeWilayah || user.kodeWilayah

      const result = await getConnection().query(
        'call m_Jumlah_Sekolah_Syncron(?,?,?,?)',
        [level, kodeWilayah, query.jenjang, status],
      )

      return result[0][0]
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }
}
