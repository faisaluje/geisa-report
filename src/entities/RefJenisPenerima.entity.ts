import { Column, Entity } from 'typeorm'

@Entity('ref_jenis_penerima', { schema: 'new_geisa' })
export class RefJenisPenerima {
  @Column('int', { primary: true, name: 'jenis_penerima_id' })
  jenisPenerimaId: number

  @Column('varchar', { name: 'deskripsi', nullable: true, length: 64 })
  deskripsi: string | null

  @Column('varchar', { name: 'keterangan_tujuan', nullable: true, length: 64 })
  keteranganTujuan: string | null
}
