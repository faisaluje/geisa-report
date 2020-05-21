import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { Sekolah } from '../entities/sekolah.entity'
import { getConnection } from 'typeorm'
import { Pengguna } from '../entities/pengguna.entity'
import { Dataguru } from '../entities/dataguru.entity'
import { RegistrasiDto } from '../dto/registrasi.dto'
import { SubmitRegistrasiDto } from '../dto/submit-registrasi.dto'
import { PenggunaService } from '../pengguna/pengguna.service'
import PrivateKeyDto from '../dto/private-key.dto'
import moment = require('moment')
import { sha1 } from 'locutus/php/strings'
import Axios from 'axios'
import jsonpAdapter from 'axios-jsonp'
import * as jsConvert from 'js-convert-case'

const logger = new Logger('registrasi-service')

@Injectable()
export class RegistrasiService {
  private vendorCode = 'IBB0Q6K2J'
  private urlWsGtk = 'http://118.98.166.149:8000'
  private tables = ['sekolah', 'pengguna', 'ptk', 'pengawas']

  constructor(private readonly penggunaService: PenggunaService) {}

  async submitRegistrasi(form: SubmitRegistrasiDto): Promise<RegistrasiDto> {
    if (await this.penggunaService.checkUsernameExist(form.username)) {
      throw new BadRequestException('Username sudah terdaftar')
    }

    const privateKey = await this.getPrivateKey(form)
    if (!privateKey.success) {
      throw new BadRequestException(
        privateKey.message || 'Gagal mendapatkan private key',
      )
    }

    let payload: any
    for (const val of this.tables) {
      const result = await this.getDataFromGtk(val, privateKey.private_key)
      if (!result) {
        throw new BadRequestException(`Gagal mendapatkan data ${val}`)
      }
      payload = {
        ...payload,
        [val]: result,
      }
    }
    payload = {
      ...payload,
      sekolah: payload.sekolah[0],
      pengguna: payload.pengguna[0],
    }

    let ids = {}
    const sekolah = this.convertSekolahToCamelCase(payload.sekolah)
    const pengguna = this.convertPenggunaToCamelCase(payload.pengguna)
    const ptk: Dataguru[] = payload.ptk?.map(
      (val: { ptk_id: string | number }) => {
        if (!ids[val.ptk_id]) {
          ids = { ...ids, [val.ptk_id]: val.ptk_id }
          return this.convertGtkToCamelCase(val)
        }

        return null
      },
    )
    const pengawas: Dataguru[] = payload.pengawas?.map(
      (val: { ptk_id: string | number }) => {
        if (!ids[val.ptk_id]) {
          ids = { ...ids, [val.ptk_id]: val.ptk_id }
          return this.convertGtkToCamelCase(val)
        }

        return null
      },
    )

    const data: RegistrasiDto = {
      sekolah,
      pengguna,
      gtk: [...ptk, ...pengawas],
    }

    await this.insertDataToDb(data)

    return data
  }

  async getPrivateKey(form: SubmitRegistrasiDto): Promise<PrivateKeyDto> {
    try {
      const today = moment().format('YYYY-MM-01')
      const _cd = sha1(`${this.vendorCode}${today}`)

      const response = await Axios({
        url: `${this.urlWsGtk}/registrasi`,
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

  async getDataFromGtk(tableName: string, privateKey: string): Promise<any> {
    try {
      const response = await Axios.get(`${this.urlWsGtk}/api/${tableName}`, {
        withCredentials: false,
        headers: {
          'Content-Type': 'application/json',
          // tslint:disable-next-line: object-literal-key-quotes
          Authorization: privateKey,
        },
      })

      return response.data
    } catch (e) {
      logger.error(e.toString())
      return false
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
      throw new BadRequestException('Gagal menyimpan data ke server')
    }
  }

  convertSekolahToCamelCase(sekolah: any): Sekolah {
    let obj = {}
    for (const [key, value] of Object.entries(sekolah)) {
      obj = {
        ...obj,
        [jsConvert.toCamelCase(key)]: value,
      }
    }

    obj = {
      ...obj,
      isOnlineRegistration: 1,
    }

    return obj as Sekolah
  }

  convertPenggunaToCamelCase(pengguna: any): Pengguna {
    let obj = {}
    for (const [key, value] of Object.entries(pengguna)) {
      obj = {
        ...obj,
        [jsConvert.toCamelCase(key)]: value,
      }
    }

    return obj as Pengguna
  }

  convertGtkToCamelCase(gtk: any): Dataguru {
    const dataGuru = new Dataguru()

    dataGuru.idDapodik = gtk.ptk_id
    dataGuru.namaDapodik = gtk.nama
    dataGuru.tanggalLahir = gtk.tanggal_lahir
    dataGuru.sekolahId = gtk.sekolah_id
    dataGuru.nuptk = gtk.nuptk
    dataGuru.jenisPtkId = gtk.jenis_ptk_id
    dataGuru.jenisGuru = gtk.jenis_ptk_id_str
    dataGuru.nip = gtk.nip
    dataGuru.jenisKelamin = gtk.jenis_kelamin
    dataGuru.jenisKeluarId = gtk.jenis_keluar_id
    dataGuru.jenisKeluarIdStr = gtk.jenis_keluar_id_str
    dataGuru.tglPtkKeluar = gtk.tgl_ptk_keluar
    dataGuru.isDapodik = true

    return dataGuru
  }
}
