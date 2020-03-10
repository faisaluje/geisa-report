import { Column, Entity, Index } from 'typeorm'

@Index('idx-dokumen-1', ['parentId', 'jenisUsulan'], {})
@Entity('dokumen_pendukung', { schema: 'geisa' })
export class DokumenPendukung {
  @Column('varchar', { primary: true, name: 'nama_file', length: 128 })
  namaFile: string

  @Column('varchar', { name: 'name_original', length: 255 })
  nameOriginal: string

  @Column('int', { name: 'parent_id' })
  parentId: number

  @Column('varchar', { name: 'mimetype' })
  mimetype: string

  @Column('tinyint', { name: 'jenis_usulan', default: 1 })
  jenisUsulan: number

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
