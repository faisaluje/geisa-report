import { Column, Entity } from 'typeorm'

@Entity('pengaturan_durasi_jenjang', { database: 'new_geisa' })
export class PengaturanDurasiJenjang {
  @Column('varchar', { primary: true, name: 'kode_wilayah', length: 8 })
  kodeWilayah: string

  @Column('varchar', { primary: true, name: 'jenjang', length: 3 })
  jenjang: string

  @Column('smallint', { primary: true, name: 'hari' })
  hari: number

  @Column('tinyint', { primary: true, name: 'shift', default: () => 1 })
  shift: number

  @Column('time', { name: 'jam_masuk' })
  jamMasuk: string

  @Column('time', { name: 'jam_pulang' })
  jamPulang: string

  @Column('time', { name: 'jam_istirahat_mulai', nullable: true })
  jamIstirahatMulai: string | null

  @Column('time', { name: 'jam_istirahat_selesai', nullable: true })
  jamIstirahatSelesai: string | null

  @Column('tinyint', { name: 'is_libur', width: 1, default: () => 0 })
  isLibur: boolean

  @Column('datetime', { name: 'last_update', nullable: true })
  lastUpdate: Date | null

  @Column('datetime', {
    name: 'create_date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date

  @Column('varchar', { name: 'updated_by', length: 36 })
  updatedBy: string
}
