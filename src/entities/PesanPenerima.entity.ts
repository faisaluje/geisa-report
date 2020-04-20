import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { MstWilayah } from './mstWilayah.entity'
import { WilayahDto } from 'src/dto/wilayah.dto'
import { Pesan } from './Pesan.entity'

@Entity('pesan_penerima', { schema: 'new_geisa' })
export class PesanPenerima {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_pesan_penerima' })
  idPesanPenerima: number

  @ManyToOne(() => Pesan)
  @JoinColumn({ name: 'id_pesan' })
  // @Column('bigint', { name: 'id_pesan' })
  pesan: Pesan

  @Column('int', { name: 'jenis_penerima_id' })
  jenisPenerimaId: number

  // @Column('varchar', { name: 'kode_wilayah', nullable: true, length: 6 })
  // kodeWilayah: string | null

  @ManyToOne(() => MstWilayah, { eager: true, nullable: true })
  @JoinColumn({ name: 'kode_wilayah' })
  wilayah: WilayahDto

  @Column('varchar', {
    name: 'user_name_tertentu',
    nullable: true,
    length: 100,
  })
  userNameTertentu: string | null
}
