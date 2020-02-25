import { Column, Entity, Index } from 'typeorm'

@Index('idx-dokumen-1', ['koreksiStatusId'], {})
@Entity('dokumen_pendukung', { schema: 'geisa' })
export class DokumenPendukung {
  @Column('varchar', { primary: true, name: 'nama_file', length: 128 })
  namaFile: string

  @Column('int', { name: 'koreksi_status_id' })
  koreksiStatusId: number

  @Column('datetime', { name: 'last_update', nullable: true })
  lastUpdate: Date | null

  @Column('datetime', {
    name: 'create_date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date

  @Column('varchar', { name: 'updated_by', nullable: true, length: 100 })
  updatedBy: string | null
}
