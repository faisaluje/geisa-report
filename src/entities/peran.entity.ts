import { Column, Entity, BaseEntity } from 'typeorm'

@Entity('peran', { schema: 'new_geisa' })
export class Peran extends BaseEntity {
  @Column('int', { primary: true, name: 'peran_id' })
  peranId: number

  @Column('varchar', { name: 'nama', nullable: true, length: 50 })
  nama: string | null

  @Column('datetime', { name: 'create_date', nullable: true })
  createDate: Date | null

  @Column('datetime', { name: 'last_update', nullable: true })
  lastUpdate: Date | null

  @Column('datetime', { name: 'expired_date', nullable: true })
  expiredDate: Date | null

  @Column('datetime', { name: 'last_sync', nullable: true })
  lastSync: Date | null
}
