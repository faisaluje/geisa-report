import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Pengguna } from 'src/entities/pengguna.entity'
import { Repository, Not, FindManyOptions, Like } from 'typeorm'
import { UserDto } from 'src/dto/user.dto'
import { PagingDto } from 'src/dto/paging.dto'
import { Peran } from 'src/enums/peran.enum'
import { Peran as PeranEntity } from 'src/entities/peran.entity'
import { PenggunaDto } from 'src/dto/pengguna.dto'
import { MstWilayah } from 'src/entities/mstWilayah.entity'
import { WilayahDto } from 'src/dto/wilayah.dto'

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
      logger.error(e.toString())
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
          peran = Not(Peran.SEKOLAH)
      }

      condition.where = {
        peranId: peran,
      }

      if ([Peran.PROPINSI, Peran.KABKOTA].includes(user.peran)) {
        condition.where = {
          ...condition.where,
          kodeWilayah: user.kodeWilayah,
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
      if (pengguna.length > 0) {
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
          if (wilayahs.length > 0 && val.cakupanWilayah.length > 0) {
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
      logger.error(e.toString())
      throw new BadRequestException(e.toString())
    }
  }
}
