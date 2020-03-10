import { Column, Entity } from 'typeorm'

@Entity('absensi_manual', { schema: 'geisa' })
export class AbsensiManual {
  @Column('int', { primary: true, name: 'absensi_manual_id' })
  absensiManualId: number

  @Column('varchar', {
    name: 'no_absensi_manual',
    length: 12,
    default: () => '',
  })
  noAbsensiManual: string

  @Column('varchar', { name: 'sekolah_id', length: 255 })
  sekolahId: string

  @Column('date', { name: 'tanggal' })
  tanggal: Date

  @Column('varchar', { name: 'serial_number', nullable: true, length: 32 })
  serialNumber: string | null

  @Column('varchar', { name: 'merk', nullable: true, length: 32 })
  merk: string | null

  @Column('int', { name: 'jenis_absensi_manual_id' })
  jenisAbsensiManualId: number

  @Column('varchar', {
    name: 'user_id_pengusul',
    nullable: true,
    length: 36,
    default: () => '',
  })
  userIdPengusul: string | null

  @Column('int', {
    name: 'status_pengajuan',
    nullable: true,
    default: () => 0,
  })
  statusPengajuan: number | null

  @Column('varchar', { name: 'user_id_pemeriksa', nullable: true, length: 36 })
  userIdPemeriksa: string | null

  @Column('date', { name: 'tgl_diperiksa', nullable: true })
  tglDiperiksa: string | null

  @Column('varchar', {
    name: 'catatan_dari_pengusul',
    nullable: true,
    length: 256,
    default: () => '',
  })
  catatanDariPengusul: string | null

  @Column('varchar', {
    name: 'catatan_dari_pemeriksa',
    nullable: true,
    length: 256,
  })
  catatanDariPemeriksa: string | null

  @Column('tinyint', { name: 'alasan_penolakan_id', nullable: true })
  alasanPenolakanId: number | null

  @Column('datetime', { name: 'last_update', nullable: true })
  lastUpdate: Date | null

  @Column('datetime', { name: 'create_date', nullable: true })
  createDate: Date | null

  @Column('varchar', { name: 'update_by', nullable: true, length: 100 })
  updateBy: string | null
}
