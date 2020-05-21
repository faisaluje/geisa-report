import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AbsensiManualDetail } from '../entities/absensiManualDetail.entity'
import { Repository } from 'typeorm'
import { UserDto } from '../dto/user.dto'
import { Dataguru } from '../entities/dataguru.entity'
import moment = require('moment')

const logger = new Logger('absensi-manual-detail-service')

@Injectable()
export class AbsensiManualDetailService {
  constructor(
    @InjectRepository(AbsensiManualDetail)
    private readonly absensiManualDetailRepo: Repository<AbsensiManualDetail>,
    @InjectRepository(Dataguru)
    private readonly dataGuruRepo: Repository<Dataguru>,
  ) {}

  async getAbsensiManualDetail(
    sekolahId: string,
    id: number = 0,
  ): Promise<any[]> {
    try {
      const query = this.dataGuruRepo
        .createQueryBuilder('gtk')
        .select('detail.absensi_manual_id', 'absensiManualId')
        .addSelect('gtk.id_dapodik', 'ptkId')
        .addSelect('gtk.nip', 'nip')
        .addSelect('gtk.nama_dapodik', 'nama')
        .addSelect('gtk.jenis_guru', 'jabatan')
        .addSelect('gtk.nuptk', 'jabatan')
        .addSelect('detail.status_kehadiran', 'statusKehadiran')
        .addSelect('detail.waktu_datang', 'waktuDatang')
        .addSelect('detail.waktu_pulang', 'waktuPulang')
        .addSelect('detail.keterangan', 'keterangan')
        .leftJoin(
          'absensi_manual_detail',
          'detail',
          `detail.ptk_id = gtk.id_dapodik AND detail.absensi_manual_id = ${id}`,
        )
        .where('gtk.sekolah_id = :sekolahId', { sekolahId })
        .orderBy('gtk.nama_dapodik')
        .take(250)

      return await query.getRawMany()
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }

  async upsertAbsensiManualId(
    data: AbsensiManualDetail[],
    user: UserDto,
    absensiManualId: number,
  ): Promise<boolean> {
    try {
      const dataEksisting = await this.absensiManualDetailRepo.find({
        absensiManualId,
      })

      const newData = data.map(gtk => {
        let row: AbsensiManualDetail = dataEksisting.find(
          val => val.ptkId === gtk.ptkId,
        )
        if (!row) {
          row = new AbsensiManualDetail()
          row.absensiManualId = absensiManualId
          row.ptkId = gtk.ptkId
          row.createdDate = new Date()
        } else {
          row.lastUpdated = new Date()
        }

        row.statusKehadiran = gtk.statusKehadiran
        row.waktuDatang = gtk.waktuDatang
        row.waktuPulang = gtk.waktuPulang
        row.keterangan = gtk.keterangan
        row.updatedBy = user.username

        return row
      })

      if (await this.absensiManualDetailRepo.save(newData)) {
        return true
      }

      throw new BadRequestException()
    } catch (e) {
      logger.error(e.toString())
      throw new BadRequestException()
    }
  }
}
