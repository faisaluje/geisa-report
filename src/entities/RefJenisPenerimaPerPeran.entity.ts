import { Column, Entity } from 'typeorm'

@Entity('ref_jenis_penerima_per_peran', { schema: 'new_geisa' })
export class RefJenisPenerimaPerPeran {
  @Column('int', { primary: true, name: 'jenis_penerima_id' })
  jenisPenerimaId: number

  @Column('int', { primary: true, name: 'peran_id' })
  peranId: number

  @Column('tinyint', { name: 'bisa_kirim', width: 1, default: () => 0 })
  bisaKirim: boolean

  @Column('tinyint', { name: 'bisa_baca', nullable: true, width: 1 })
  bisaBaca: boolean | null
}
