import { Column, Entity, Index } from 'typeorm'

@Index('idx-from-google', ['status'], {})
@Index('idx-tanggal-libur', ['kodeWilayah', 'jenisLiburId', 'tanggal'], {})
@Entity('pengaturan_libur', { schema: 'new_geisa' })
export class PengaturanLibur {
  @Column('varchar', { primary: true, name: 'id', length: 36 })
  id: string

  @Column('varchar', { name: 'kode_wilayah', length: 8 })
  kodeWilayah: string

  @Column('longtext', { name: 'jenjang' })
  jenjang: string

  @Column('tinyint', { name: 'jenis_libur_id' })
  jenisLiburId: number

  @Column('date', { name: 'tanggal', nullable: true })
  tanggal: string | null

  @Column('varchar', { name: 'nama', length: 150 })
  nama: string

  @Column('varchar', { name: 'deskripsi', nullable: true, length: 255 })
  deskripsi: string | null

  @Column('int', { name: 'status', nullable: true })
  status: number | null

  @Column('datetime', { name: 'last_update', nullable: true })
  lastUpdate: Date | null

  @Column('datetime', {
    name: 'created_date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date

  @Column('varchar', { name: 'updated_by', length: 100 })
  updatedBy: string
}
