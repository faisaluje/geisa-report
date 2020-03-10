import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AbsensiManualDetail } from 'src/entities/absensiManualDetail.entity'
import { Repository } from 'typeorm'
import { UserDto } from 'src/dto/user.dto'
import { Pengguna } from 'src/entities/pengguna.entity'
import { Dataguru } from 'src/entities/dataguru.entity'
import { RowsService } from 'src/rows/rows.service'
import { PagingDto } from 'src/dto/paging.dto'

const logger = new Logger('absensi-manual-detail-service')

@Injectable()
export class AbsensiManualDetailService {
  constructor(
    @InjectRepository(AbsensiManualDetail)
    private readonly absensiManualDetailRepo: Repository<AbsensiManualDetail>,
    @InjectRepository(Dataguru)
    private readonly dataGuruRepo: Repository<Dataguru>,
  ) {}

  async getAbsensiManualDetail(user: UserDto, id: number = 0): Promise<any[]> {
    try {
      const sekolahId = await this.getSekolahIdFromPengguna(user.id)

      const query = this.dataGuruRepo
        .createQueryBuilder('gtk')
        .select('detail.absensi_manual_id', 'absensiManualId')
        .addSelect('detail.ptk_id', 'ptkId')
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

  async getSekolahIdFromPengguna(penggunaId: string): Promise<string> {
    const pengguna = await Pengguna.findOne(penggunaId)
    if (pengguna) {
      return pengguna.sekolahId
    } else {
      return null
    }
  }
}
