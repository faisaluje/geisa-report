import { Column, Entity, BaseEntity } from 'typeorm'

@Entity('ref_status_pengajuan', { schema: 'new_geisa' })
export class RefStatusPengajuan extends BaseEntity {
  @Column('int', { primary: true, name: 'status_id' })
  statusId: number

  @Column('varchar', { name: 'status_nama', nullable: true, length: 16 })
  statusNama: string | null
}
