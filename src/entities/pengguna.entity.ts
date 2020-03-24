import { Column, Entity, BaseEntity } from 'typeorm'

@Entity('pengguna', { schema: 'new_geisa' })
export class Pengguna extends BaseEntity {
  @Column('varchar', { primary: true, name: 'pengguna_id', length: 50 })
  penggunaId: string

  @Column('varchar', { name: 'nama', length: 100 })
  nama: string

  @Column('varchar', { name: 'username', length: 100 })
  username: string

  @Column('varchar', { name: 'password', length: 50 })
  password: string

  @Column('varchar', { name: 'sekolah_id', length: 50 })
  sekolahId: string

  @Column('int', { name: 'peran_id', nullable: true })
  peranId: number | null

  @Column('varchar', { name: 'no_hp', nullable: true, length: 50 })
  noHp: string | null

  @Column('varchar', { name: 'status_pengguna', nullable: true, length: 50 })
  statusPengguna: string | null

  @Column('varchar', { name: 'private_key', nullable: true, length: 100 })
  privateKey: string | null

  @Column('datetime', { name: 'create_date', nullable: true })
  createDate: Date | null

  @Column('datetime', { name: 'last_update', nullable: true })
  lastUpdate: Date | null

  @Column('datetime', { name: 'last_sync', nullable: true })
  lastSync: Date | null
}
