import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Index('id_dapodik', ['idDapodik'], {})
@Index('sekolah_id', ['sekolahId'], {})
@Index('id_dapodik_2', ['idDapodik'], {})
@Index('sekolah_id_2', ['sekolahId'], {})
@Entity('dataguru', { schema: 'new_geisa' })
export class Dataguru {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'id_dapodik', nullable: true, length: 50 })
  idDapodik: string | null

  @Column('varchar', { name: 'nama_dapodik', nullable: true, length: 255 })
  namaDapodik: string | null

  @Column('datetime', { name: 'tanggal_lahir', nullable: true })
  tanggalLahir: Date | null

  @Column('varchar', { name: 'sekolah_id', nullable: true, length: 50 })
  sekolahId: string | null

  @Column('datetime', { name: 'create_date', nullable: true })
  createDate: Date | null

  @Column('varchar', { name: 'nuptk', nullable: true, length: 50 })
  nuptk: string | null

  @Column('int', { name: 'jenis_ptk_id', nullable: true })
  jenisPtkId: number | null

  @Column('varchar', { name: 'jenis_guru', nullable: true, length: 100 })
  jenisGuru: string | null

  @Column('varchar', { name: 'status_kepegawaian', nullable: true, length: 50 })
  statusKepegawaian: string | null

  @Column('varchar', { name: 'nik', nullable: true, length: 50 })
  nik: string | null

  @Column('varchar', { name: 'nip', nullable: true, length: 50 })
  nip: string | null

  @Column('char', { name: 'jenis_kelamin', nullable: true, length: 1 })
  jenisKelamin: string | null

  @Column('int', { name: 'jenis_keluar_id', nullable: true })
  jenisKeluarId: number | null

  @Column('varchar', {
    name: 'jenis_keluar_id_str',
    nullable: true,
    length: 50,
  })
  jenisKeluarIdStr: string | null

  @Column('date', { name: 'tgl_ptk_keluar', nullable: true })
  tglPtkKeluar: string | null

  @Column('datetime', { name: 'last_sync', nullable: true })
  lastSync: Date | null

  @Column('datetime', { name: 'last_update', nullable: true })
  lastUpdate: Date | null

  @Column('varchar', { name: 'user_updated', nullable: true, length: 255 })
  userUpdated: string | null

  @Column('tinyint', { name: 'sumber', unsigned: true, default: () => 1 })
  sumber: number

  @Column('tinyint', { name: 'is_dapodik', nullable: true, width: 1 })
  isDapodik: boolean | null

  @Column('tinyint', {
    name: 'show_sptjm',
    nullable: true,
    width: 1,
    default: () => 1,
  })
  showSptjm: boolean

  @Column('tinyint', { name: 'is_induk', nullable: true, width: 1 })
  isInduk: boolean | null
}
