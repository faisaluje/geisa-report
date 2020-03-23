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

  async getLastSunc(
    { peran, kodeWilayah }: UserDto,
    { jenjang, status }: any,
  ): Promise<any> {
    try {
      const level = getLevelUser(peran)
      const result = await getConnection().query(
        'call m_Last_Syncron(?, ?, ?, ?)',
        [level, kodeWilayah, jenjang, status],
      )

      return result[0]
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  async getJumlahSekolahSync(
    { peran, kodeWilayah }: UserDto,
    { jenjang, status }: any,
  ): Promise<any> {
    try {
      const level = getLevelUser(peran)
      const result = await getConnection().query(
        `select
          m_Jumlah_Sekolah_Syncron(?, ?, ?, ?, ?) h_0,
          m_Jumlah_Sekolah_Syncron(?, ?, ?, ?, ?) h_7,
          m_Jumlah_Sekolah_Syncron(?, ?, ?, ?, ?) h_30`,
        [
          level,
          kodeWilayah,
          jenjang,
          status,
          0,
          level,
          kodeWilayah,
          jenjang,
          status,
          7,
          level,
          kodeWilayah,
          jenjang,
          status,
          30,
        ],
      )

      return result[0]
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }
}
