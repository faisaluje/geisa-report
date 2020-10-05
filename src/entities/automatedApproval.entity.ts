import { BaseEntity, Column, Entity, JoinColumn, OneToOne } from 'typeorm'

import { MstWilayah } from './mstWilayah.entity'

@Entity('automated_approval', { database: 'new_geisa' })
export class AutomatedApproval extends BaseEntity {
  @OneToOne(() => MstWilayah, { primary: true })
  @JoinColumn({ name: 'kode_wilayah' })
  wilayah: MstWilayah

  @Column('datetime', { name: 'create_date', default: 'NOW()' })
  createDate: Date

  @Column('varchar', { name: 'create_by' })
  createBy: string
}
