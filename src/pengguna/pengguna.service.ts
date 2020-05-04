import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Pengguna } from 'src/entities/pengguna.entity'
import { Repository, Not, FindManyOptions, Like, In } from 'typeorm'
import { UserDto } from 'src/dto/user.dto'
import { PagingDto } from 'src/dto/paging.dto'
import { Peran } from 'src/enums/peran.enum'
import { Peran as PeranEntity } from 'src/entities/peran.entity'
import { PenggunaDto } from 'src/dto/pengguna.dto'
import { MstWilayah } from 'src/entities/mstWilayah.entity'
import { WilayahDto } from 'src/dto/wilayah.dto'
import { v4 as uuid } from 'uuid'
import { sha1, md5 } from 'locutus/php/strings'
import { HakAkses } from 'src/enums/hak-akses.enum'
import { getMethodName } from 'src/services/ClassHelpers'

const logger = new Logger('pengguna-service')

@Injectable()
export class PenggunaService {
  constructor(
    @InjectRepository(Pengguna)
    private readonly penggunaRepo: Repository<Pengguna>,
  ) {}

  async getPenggunaOne(penggunaId: string): Promise<PenggunaDto> {
    try {
      const pengguna = await this.penggunaRepo.findOneOrFail(penggunaId)
      const cakupanWilayah: WilayahDto[] = []

      if (pengguna.cakupanWilayah) {
        const wilayahs = await MstWilayah.find({
          mstKodeWilayah: pengguna.wilayah.kodeWilayah,
        })

        pengguna.cakupanWilayah.forEach(wilayah => {
          const wilayahSelected = wilayahs.find(
            val => val.kodeWilayah === wilayah,
          )
          cakupanWilayah.push({
            kodeWilayah: wilayahSelected.kodeWilayah,
            nama: wilayahSelected.nama,
            idLevelWilayah: wilayahSelected.idLevelWilayah,
          })
        })
      }

      return {
        penggunaId: pengguna.penggunaId,
        nama: pengguna.nama,
        username: pengguna.username,
        noHp: pengguna.noHp,
        jenjang: pengguna.jenjang,
        wilayah: pengguna.wilayah
          ? {
              nama: pengguna.wilayah.nama,
              kodeWilayah: pengguna.wilayah.kodeWilayah,
              idLevelWilayah: pengguna.wilayah.idLevelWilayah,
            }
          : null,
        hakAkses: pengguna.hakAkses,
        picName: pengguna.picName,
        peran: await PeranEntity.findOneOrFail(pengguna.peranId),
        cakupanWilayah,
      }
    } catch (e) {
      logger.error(`${getMethodName(this.getPenggunaOne)}, ${e.toString()}`)
      throw new BadRequestException()
    }
  }

  async getPengguna(user: UserDto, query: any): Promise<PagingDto> {
    try {
      const condition: FindManyOptions<Pengguna> = {}
      let peran: any

      switch (user.peran) {
        case Peran.PROPINSI:
          peran = Peran.CABDIS
          break
        case Peran.KABKOTA:
          peran = Peran.UPTD
          break
        case Peran.SEKOLAH:
          throw Error('No Access')
        default:
          peran = Not(In([Peran.SEKOLAH, Peran.ADMIN]))
      }

      condition.where = {
        peranId: peran,
      }

      if ([Peran.PROPINSI, Peran.KABKOTA].includes(user.peran)) {
        condition.where = {
          ...condition.where,
          wilayah: { kodeWilayah: user.kodeWilayah },
        }
      }

      if (query.search) {
        condition.where = [
          {
            ...condition.where,
            nama: Like(`%${query.search}%`),
          },
          {
            ...condition.where,
            username: Like(`%${query.search}%`),
          },
        ]
      }

      condition.order = { peranId: 'ASC', nama: 'ASC' }

      const totalCount = await this.penggunaRepo.count(condition)
      const limit = query.limit || 100
      // tslint:disable-next-line: radix
      const page = parseInt(query.page) || 1
      const totalPage = Math.ceil(totalCount / limit)
      let rows: PenggunaDto[] = []

      condition.take = limit
      condition.skip = limit * (page - 1)

      const pengguna = await this.penggunaRepo.find(condition)
      if (pengguna && pengguna.length > 0) {
        const peranData = await PeranEntity.find()
        let wilayahs: MstWilayah[] = []
        if (user.peran != Peran.ADMIN || user.kodeWilayah) {
          wilayahs = await MstWilayah.find({
            where: [
              { kodeWilayah: user.kodeWilayah },
              { mstKodeWilayah: user.kodeWilayah },
            ],
          })
        }

        rows = pengguna.map(val => {
          const peranFromPengguna = peranData.find(
            item => item.peranId === val.peranId,
          )
          const cakupanWilayah: WilayahDto[] = []
          if (
            wilayahs.length > 0 &&
            val.cakupanWilayah &&
            val.cakupanWilayah.length > 0
          ) {
            val.cakupanWilayah.forEach(wilayah => {
              const wilayahSelected = wilayahs.find(
                wil => wil.kodeWilayah === wilayah,
              )
              if (wilayahSelected) {
                cakupanWilayah.push({
                  kodeWilayah: wilayahSelected.kodeWilayah,
                  nama: wilayahSelected.nama,
                  idLevelWilayah: wilayahSelected.idLevelWilayah,
                })
              }
            })
          }

          return {
            penggunaId: val.penggunaId,
            nama: val.nama,
            username: val.username,
            peran: peranFromPengguna,
            noHp: val.noHp,
            jenjang: val.jenjang,
            wilayah: val.wilayah,
            cakupanWilayah,
            hakAkses: val.hakAkses,
            picName: val.picName,
          }
        })
      }

      return {
        totalCount,
        limit,
        page,
        totalPage,
        rows,
      }
    } catch (e) {
      logger.error(`${getMethodName(this.getPengguna)}, ${e.toString()}`)
      throw new BadRequestException(e.toString())
    }
  }

  async upsertPengguna(
    user: UserDto,
    pengguna: PenggunaDto,
    penggunaId?: string,
  ): Promise<PenggunaDto> {
    if (!penggunaId && (await this.checkUsernameExist(pengguna.username))) {
      throw new BadRequestException('Username sudah dipakai')
    }
    try {
      let penggunaData = penggunaId
        ? await this.penggunaRepo.findOneOrFail(penggunaId)
        : null

      if (!penggunaData) {
        penggunaData = new Pengguna()
        penggunaData.penggunaId = uuid()
      } else {
        penggunaData.lastUpdate = new Date()
      }

      if (await this.checkUserApprovalExist(pengguna)) {
        throw new BadRequestException('User Approval hanya bisa 1 per wilayah')
      }

      penggunaData.nama = pengguna.nama
      penggunaData.username = pengguna.username
      if (pengguna.password) {
        penggunaData.password = sha1(md5(pengguna.password))
      }
      penggunaData.peranId = pengguna.peran.peranId
      penggunaData.noHp = pengguna.noHp
      penggunaData.jenjang = pengguna.jenjang
      penggunaData.wilayah = pengguna.wilayah
      penggunaData.cakupanWilayah =
        pengguna.cakupanWilayah && pengguna.cakupanWilayah.length > 0
          ? pengguna.cakupanWilayah.map(val => val.kodeWilayah)
          : null
      penggunaData.hakAkses = pengguna.hakAkses
      penggunaData.updatedBy = user.id

      const result = await this.penggunaRepo.save(penggunaData)

      return {
        ...pengguna,
        penggunaId: result.penggunaId,
      }
    } catch (e) {
      logger.error(`${getMethodName(this.upsertPengguna)}, ${e.toString()}`)
      throw new BadRequestException(e.message)
    }
  }

  async checkUsernameExist(username: string): Promise<boolean> {
    const pengguna = await this.penggunaRepo.findOne({ username })

    return Boolean(pengguna)
  }

  async checkUserApprovalExist(pengguna: PenggunaDto): Promise<boolean> {
    if (pengguna.hakAkses == HakAkses.MONITORING) {
      return false
    }

    if ([Peran.CABDIS, Peran.UPTD].includes(pengguna.peran.peranId)) {
      return false
    }

    const userApproval = await this.penggunaRepo.findOne({
      wilayah: pengguna.wilayah,
      peranId: pengguna.peran.peranId,
      hakAkses: HakAkses.APPROVAL,
      penggunaId: Not(pengguna.penggunaId),
    })

    return Boolean(userApproval)
  }
}
