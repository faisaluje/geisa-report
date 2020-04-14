import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { UserDto } from 'src/dto/user.dto'
import { Sekolah } from 'src/entities/sekolah.entity'
import getSekolahIdFromPenggunaId from 'src/utils/get-sekolahId-from-penggunaId.utils'
import { getMethodName } from 'src/services/ClassHelpers'
import { DashboardSekolahDto } from 'src/dto/dashboard-sekolah.dto'
import { getConnection } from 'typeorm'

const logger = new Logger('dashboard-sekolah-service')

@Injectable()
export class DashboardSekolahService {
  async getDashboardSekolah(
    user: UserDto,
    sekolahId?: string,
  ): Promise<DashboardSekolahDto> {
    try {
      const sekolah = await Sekolah.findOneOrFail(
        sekolahId || (await getSekolahIdFromPenggunaId(user.id)),
      )

      return {
        sekolah,
        token: await this.getTokenInfo(sekolah.sekolahId),
        progressDhgtk: await this.getProgressDhgtk(sekolah.sekolahId),
      }
    } catch (e) {
      logger.error(
        `${getMethodName(this.getDashboardSekolah)}, ${e.toString()}`,
      )
      throw new BadRequestException()
    }
  }

  private async getTokenInfo(sekolahId: string): Promise<any[]> {
    const result = await getConnection().query('call m_info_token(?)', [
      sekolahId,
    ])

    return result[0]
  }

  private async getProgressDhgtk(sekolahId: string): Promise<any[]> {
    const result = await getConnection().query('call m_progress_kirim(?)', [
      sekolahId,
      // 'e0645514-2cf5-e011-8114-2b1605213879',
    ])

    return result[0]
  }
}
