import { Column, Entity, BaseEntity } from 'typeorm'

@Entity('pengaturan_durasi', { schema: 'geisa' })
export class PengaturanDurasi extends BaseEntity {
  @Column('varchar', { primary: true, name: 'kode_wilayah', length: 8 })
  kodeWilayah: string

  @Column('smallint', { primary: true, name: 'hari' })
  hari: number

  @Column('time', { name: 'jam_masuk' })
  jamMasuk: string

  @Column('time', { name: 'jam_pulang' })
  jamPulang: string

  @Column('time', { name: 'jam_istirahat_mulai', nullable: true })
  jamIstirahatMulai: string | null

  @Column('time', { name: 'jam_istirahat_selesai', nullable: true })
  jamIstirahatSelesai: string | null

  @Column('tinyint', { name: 'is_libur' })
  isLibur: boolean

  @Column('datetime', { name: 'last_update', nullable: true })
  lastUpdate: Date | null

  @Column('datetime', {
    name: 'create_date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date | null

  @Column('varchar', { name: 'updated_by', nullable: true, length: 36 })
  updatedBy: string | null
}
