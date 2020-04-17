import { Column, Entity, Index } from 'typeorm'

@Index('unik', ['idPesan', 'username'], {})
@Entity('pesan_terbaca', { schema: 'new_geisa' })
export class PesanTerbaca {
  @Column('bigint', { primary: true, name: 'id_pesan' })
  idPesan: string

  @Column('varchar', { primary: true, name: 'username', length: 50 })
  username: string

  @Column('tinyint', { name: 'terbaca', nullable: true, default: () => 1 })
  terbaca: boolean | null

  @Column('datetime', { name: 'created_date', nullable: true })
  createdDate: Date | null
}
