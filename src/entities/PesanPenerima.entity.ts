import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('pesan_penerima', { schema: 'new_geisa' })
export class PesanPenerima {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_pesan_penerima' })
  idPesanPenerima: string

  @Column('bigint', { name: 'id_pesan' })
  idPesan: string

  @Column('int', { name: 'jenis_penerima_id' })
  jenisPenerimaId: number

  @Column('varchar', { name: 'kode_wilayah', nullable: true, length: 6 })
  kodeWilayah: string | null

  @Column('varchar', {
    name: 'user_name_tertentu',
    nullable: true,
    length: 100,
  })
  userNameTertentu: string | null
}
