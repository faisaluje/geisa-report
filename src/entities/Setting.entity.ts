import { Column, Entity } from 'typeorm'

@Entity('setting', { database: 'new_geisa' })
export class Setting {
  @Column('int', { primary: true, name: 'id' })
  id: number

  @Column('varchar', { name: 'deskripsi', nullable: true, length: 32 })
  deskripsi: string | null

  @Column('varchar', { name: 'value', nullable: true, length: 3200 })
  value: string | null

  @Column('tinyint', { name: 'aktif', nullable: true })
  aktif: number | null
}
