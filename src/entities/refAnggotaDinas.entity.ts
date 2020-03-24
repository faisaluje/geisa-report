import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity('ref_anggota_dinas', { database: 'geisa' })
export class RefAnggotaDinas extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_anggota_dinas' })
  idAnggotaDinas: number

  @Column('varchar', {
    name: 'nama_anggota_dinas',
    nullable: true,
    length: 255,
  })
  namaAnggotaDinas: string | null

  @Column('int', {
    name: 'id_jenis_dinas',
    nullable: true,
    default: () => 0,
  })
  idJenisDinas: number | null

  @Column('varchar', { name: 'email_dinas', nullable: true, length: 255 })
  emailDinas: string | null

  @Column('varchar', { name: 'no_hp_dinas', nullable: true, length: 15 })
  noHpDinas: string | null

  @Column('varchar', { name: 'user_id_dinas', nullable: true, length: 255 })
  userIdDinas: string | null

  @Column('varchar', { name: 'password_dinas', nullable: true, length: 100 })
  passwordDinas: string | null

  @Column('int', { name: 'status_dinas', nullable: true, default: () => 0 })
  statusDinas: number | null

  @Column('datetime', { name: 'date_register', nullable: true })
  dateRegister: Date | null

  @Column('int', { name: 'register_by', nullable: true, default: () => 0 })
  registerBy: number | null

  @Column('int', { name: 'id_wilayah', nullable: true })
  idWilayah: number | null

  @Column('text', { name: 'kabupaten_kota_id_list', nullable: true })
  kabupatenKotaIdList: string | null

  @Column('text', { name: 'tingkat_list', nullable: true })
  tingkatList: string | null

  @Column('int', { name: 'role_id', nullable: true, default: () => 4 })
  roleId: number | null
}
