import { Column, Entity } from 'typeorm'

@Entity('ref_status_pengajuan', { schema: 'geisa' })
export class RefStatusPengajuan {
  @Column('int', { primary: true, name: 'status_id' })
  statusId: number

  @Column('varchar', { name: 'status_nama', nullable: true, length: 16 })
  statusNama: string | null
}
