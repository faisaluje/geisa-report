import {
  Column,
  Entity,
  Index,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { HakAkses } from 'src/enums/hak-akses.enum'
import { Jenjang } from 'src/enums/jenjang.enum'
import { MstWilayah } from './mstWilayah.entity'
import { WilayahDto } from 'src/dto/wilayah.dto'

@Index('username_pengguna', ['username'], { unique: true })
@Entity('pengguna', { database: 'new_geisa' })
export class Pengguna extends BaseEntity {
  @Column('varchar', { primary: true, name: 'pengguna_id', length: 50 })
  penggunaId: string

  @Column('varchar', { name: 'nama', length: 100 })
  nama: string

  @Column('varchar', { name: 'username', unique: true, length: 100 })
  username: string

  @Column('varchar', { name: 'password', length: 50 })
  password: string

  @Column('varchar', { name: 'sekolah_id', nullable: true, length: 50 })
  sekolahId: string | null

  @Column('int', { name: 'peran_id' })
  peranId: number

  @Column('varchar', { name: 'no_hp', nullable: true, length: 50 })
  noHp: string | null

  @Column('varchar', { name: 'status_pengguna', nullable: true, length: 50 })
  statusPengguna: string | null

  @Column('varchar', { name: 'private_key', nullable: true, length: 100 })
  privateKey: string | null

  @Column('simple-array', { name: 'jenjang', nullable: true })
  jenjang: Jenjang[]

  @ManyToOne(() => MstWilayah, { eager: true, nullable: true })
  @JoinColumn({ name: 'kode_wilayah' })
  wilayah: WilayahDto

  @Column('simple-array', { name: 'cakupan_wilayah', nullable: true })
  cakupanWilayah: string[]

  @Column('enum', {
    name: 'hak_akses',
    nullable: true,
    enum: ['MONITORING', 'APPROVAL'],
    default: () => 'MONITORING',
  })
  hakAkses: HakAkses

  @Column('datetime', {
    name: 'create_date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date | null

  @Column('datetime', { name: 'last_update', nullable: true })
  lastUpdate: Date | null

  @Column('datetime', { name: 'last_sync', nullable: true })
  lastSync: Date | null

  @Column('int', { name: 'old_id', nullable: true })
  oldId: number | null

  @Column('varchar', { name: 'pic_name', nullable: true, length: 150 })
  picName: string | null
}
