import { Column, Entity } from 'typeorm'

@Entity('ref_status_kehadiran', { schema: 'geisa' })
export class RefStatusKehadiran {
  @Column('int', {
    primary: true,
    name: 'status_kehadiran_id',
    default: () => '0',
  })
  statusKehadiranId: number

  @Column('varchar', {
    name: 'status_kehadiran',
    nullable: true,
    length: 64,
    default: () => '',
  })
  statusKehadiran: string | null

  @Column('varchar', {
    name: 'singkatan',
    nullable: true,
    length: 8,
    default: () => '',
  })
  singkatan: string | null

  @Column('varchar', { name: 'group_kehadiran', nullable: true, length: 32 })
  groupKehadiran: string | null

  @Column('varchar', {
    name: 'dokumen_pendukung',
    nullable: true,
    length: 128,
    default: () => '',
  })
  dokumenPendukung: string | null

  @Column('tinyint', {
    name: 'status_koreksi',
    nullable: true,
    default: () => '0',
  })
  statusKoreksi: number | null
}
