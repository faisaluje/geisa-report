import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { Sekolah } from 'src/entities/sekolah.entity'
import { getConnection } from 'typeorm'
import { Pengguna } from 'src/entities/pengguna.entity'
import { Dataguru } from 'src/entities/dataguru.entity'
import { RegistrasiDto } from 'src/dto/registrasi.dto'
import { SubmitRegistrasiDto } from 'src/dto/submit-registrasi.dto'
import { PenggunaService } from 'src/pengguna/pengguna.service'
import PrivateKeyDto from 'src/dto/private-key.dto'
import moment = require('moment')
import { sha1 } from 'locutus/php/strings'
import Axios from 'axios'
import jsonpAdapter from 'axios-jsonp'

const logger = new Logger('registrasi-service')

@Injectable()
export class RegistrasiService {
  private VENDOR_CODE = 'IBB0Q6K2J'
  private URL_WS_GTK = 'http://118.98.166.149:8000'

  constructor(private readonly penggunaService: PenggunaService) {}

  async submitRegistrasi(form: SubmitRegistrasiDto): Promise<void> {
    if (await this.penggunaService.checkUsernameExist(form.username)) {
      throw new BadRequestException()
    }
  }

  async getPrivateKey(form: SubmitRegistrasiDto): Promise<PrivateKeyDto> {
    try {
      const today = moment().format('YYYY-MM-DD')
      const _cd = sha1(`${this.VENDOR_CODE}${today}`)

      const response = await Axios({
        url: `${this.URL_WS_GTK}/registrasi`,
        params: {
          ...form,
          _cd,
        },
        adapter: jsonpAdapter,
        timeout: 60000,
      })

      return response.data as PrivateKeyDto
    } catch (e) {
      logger.error(e.toString())
      return { success: false }
    }
  }

  async insertDataToDb(data: RegistrasiDto): Promise<void> {
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
