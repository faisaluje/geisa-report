import { Column, Entity } from 'typeorm'

@Entity('absensi_manual_detail', { schema: 'new_geisa' })
export class AbsensiManualDetail {
  @Column('int', { primary: true, name: 'absensi_manual_id' })
  absensiManualId: number

  @Column('varchar', {
    primary: true,
    name: 'ptk_id',
    length: 36,
    default: () => '',
  })
  ptkId: string

  @Column('tinyint', { name: 'status_kehadiran', nullable: true })
  statusKehadiran: boolean | null

  @Column('time', { name: 'waktu_datang', nullable: true })
  waktuDatang: string | null

  @Column('time', { name: 'waktu_pulang', nullable: true })
  waktuPulang: string | null

  @Column('varchar', { name: 'keterangan', nullable: true, length: 128 })
  keterangan: string | null

  @Column('datetime', { name: 'last_updated', nullable: true })
  lastUpdated: Date | null

  @Column('datetime', { name: 'created_date', nullable: true })
  createdDate: Date | null

  @Column('varchar', { name: 'updated_by', nullable: true, length: 100 })
  updatedBy: string | null
}
