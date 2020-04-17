import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('pesan', { schema: 'new_geisa' })
export class Pesan {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_pesan' })
  idPesan: string

  @Column('date', { name: 'tanggal', nullable: true })
  tanggal: string | null

  @Column('varchar', { name: 'dari_pengguna_id', nullable: true, length: 50 })
  dariPenggunaId: string | null

  @Column('varchar', { name: 'judul', nullable: true, length: 255 })
  judul: string | null

  @Column('int', { name: 'status_pesan_id', nullable: true })
  statusPesanId: number | null

  @Column('varchar', { name: 'isi_pesan', nullable: true, length: 10000 })
  isiPesan: string | null

  @Column('tinyint', {
    name: 'sifat_pesan',
    nullable: true,
    default: () => 1,
  })
  sifatPesan: number | null
}
