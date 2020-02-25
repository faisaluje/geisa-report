import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { KoreksiStatusKehadiran } from 'src/entities/koreksiStatusKehadiran.entity'
import { Repository } from 'typeorm'
import { UserDto } from 'src/dto/user.dto'
import { Pengguna } from 'src/entities/pengguna.entity'
import { PagingDto } from 'src/dto/paging.dto'
import { RowsService } from 'src/rows/rows.service'

const logger = new Logger('koreksi-status-kehadiran')

@Injectable()
export class KoreksiStatusKehadiranService {
  constructor(
    @InjectRepository(KoreksiStatusKehadiran)
    private readonly koreksiStatusKehadiranRepo: Repository<
      KoreksiStatusKehadiran
    >,
  ) {}

  async getKoreksiStatusKehadiran(
    user: UserDto,
    request: any,
  ): Promise<PagingDto> {
    const { kodeWilayah, peran } = user
    if (!kodeWilayah || !peran) {
      return null
    }

    const query = this.koreksiStatusKehadiranRepo
      .createQueryBuilder('koreksi')
      .select('koreksi.koreksi_status_id', 'id')
      .addSelect('koreksi.no_koreksi', 'noKoreksi')
      .addSelect('koreksi.sekolah_id', 'sekolahId')
      .addSelect('koreksi.nama_sekolah', 'namaSekolah')
      .addSelect('koreksi.id_dapodik', 'idDapodik')
      .addSelect('koreksi.nama', 'nama')
      .addSelect('gtk.nip', 'nip')
      .addSelect('koreksi.jenis_koreksi', 'jenisKoreksi')
      .addSelect('koreksi.tgl_pengajuan', 'tglPengajuan')
      .addSelect('koreksi.status_pengajuan', 'statusPengajuan')
      .addSelect('status_pengajuan.status_nama', 'statusPengajuanNama')
      .leftJoin('dataguru', 'gtk', 'gtk.id_dapodik = koreksi.id_dapodik')
      .leftJoin('sekolah', 'sekolah', 'sekolah.sekolah_id = koreksi.sekolah_id')
      .leftJoin(
        'ref_status_pengajuan',
        'status_pengajuan',
        'koreksi.status_pengajuan = status_pengajuan.status_id',
      )

    if (peran === 2) {
      // Dinas Kab/kota
      query.where('sekolah.kode_wilayah_kabupaten_kota = :kodeWilayah', {
        kodeWilayah,
      })
      query.andWhere('sekolah.bentuk_pendidikan_id in(:bentukPendidikanId)', {
        bentukPendidikanId: [1, 2, 3, 4, 5, 6],
      })
    } else if (peran === 3) {
      // Dinas Provinsi
      query.where('sekolah.kode_wilayah_provinsi = :kodeWilayah', {
        kodeWilayah,
      })
      if (kodeWilayah !== '010000') {
        query.andWhere('sekolah.bentuk_pendidikan_id in(:bentukPendidikanId)', {
          bentukPendidikanId: [7, 8, 13, 14, 15, 29],
        })
      }
    } else if (peran === 99) {
      // Sekolah
      try {
        const pengguna = await Pengguna.findOne(user.id)
        query.where('koreksi.sekolah_id = :sekolahId', {
          sekolahId: pengguna.sekolahId,
        })
      } catch (e) {
        logger.error(e.toString())
        throw new NotFoundException()
      }
    }

    if (request.noKoreksi) {
      query.andWhere('koreksi.no_koreksi = :noKoreksi', {
        noKoreksi: request.noKoreksi,
      })
    }

    query.orderBy('koreksi.tgl_pengajuan', 'DESC')

    const rows = new RowsService(query)

    if (request.page) {
      // tslint:disable-next-line: radix
      rows.setPage(parseInt(request.page))
    }

    return await rows.getResult()
  }
}
