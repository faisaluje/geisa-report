import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { Sekolah } from 'src/entities/sekolah.entity'
import { getConnection } from 'typeorm'
import { Pengguna } from 'src/entities/pengguna.entity'
import { Dataguru } from 'src/entities/dataguru.entity'
import { RegistrasiDto } from 'src/dto/registrasi.dto'

const logger = new Logger('registrasi-service')

@Injectable()
export class RegistrasiService {
  async submitRegistrasi(data: RegistrasiDto): Promise<void> {
    try {
      await getConnection().transaction(async entityManager => {
        await entityManager.getRepository(Sekolah).save({
          ...data.sekolah,
          licenseType: 'trial',
        })
        await entityManager.getRepository(Pengguna).save(data.pengguna)
        await entityManager.getRepository(Dataguru).save(data.gtk)
      })
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }
}
