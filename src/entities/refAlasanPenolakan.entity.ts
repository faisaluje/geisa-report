import { Column, Entity } from 'typeorm'

@Entity('ref_alasan_penolakan', { schema: 'geisa' })
export class RefAlasanPenolakan {
  @Column('int', { primary: true, name: 'alasan_penolakan_id' })
  alasanPenolakanId: number

  @Column('varchar', { name: 'alasan_penolakan', nullable: true, length: 64 })
  alasanPenolakan: string | null
}