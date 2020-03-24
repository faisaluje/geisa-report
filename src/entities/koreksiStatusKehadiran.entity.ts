import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('koreksi_status_kehadiran', { schema: 'new_geisa' })
export class KoreksiStatusKehadiran {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'koreksi_status_id' })
  koreksiStatusId: number

  @Column('varchar', {
    name: 'no_koreksi',
    nullable: true,
    length: 12,
    default: () => '',
  })
  noKoreksi: string | null

  @Column('varchar', { name: 'id_dapodik', length: 36, default: () => '' })
  idDapodik: string

  @Column('varchar', { name: 'nama', nullable: true, length: 128 })
  nama: string | null

  @Column('varchar', { name: 'nama_sekolah', nullable: true, length: 128 })
  namaSekolah: string | null

  @Column('varchar', { name: 'sekolah_id', length: 36 })
  sekolahId: string

  @Column('tinyint', { name: 'jenis_koreksi', default: () => '' })
  jenisKoreksi: number

  @Column('int', { name: 'status_kehadiran_awal', nullable: true })
  statusKehadiranAwal: number | null

  @Column('int', { name: 'status_kehadiran_koreksi', nullable: true })
  statusKehadiranKoreksi: number | null

  @Column('date', { name: 'tgl_kehadiran_dari', nullable: true })
  tglKehadiranDari: Date | null

  @Column('date', { name: 'tgl_kehadiran_sampai', nullable: true })
  tglKehadiranSampai: Date | null

  @Column('date', { name: 'tgl_pengajuan' })
  tglPengajuan: Date

  @Column('time', { name: 'waktu_datang_awal', nullable: true })
  waktuDatangAwal: string | null

  @Column('time', { name: 'waktu_datang_koreksi', nullable: true })
  waktuDatangKoreksi: string | null

  @Column('time', { name: 'waktu_pulang_awal', nullable: true })
  waktuPulangAwal: string | null

  @Column('time', { name: 'waktu_pulang_koreksi', nullable: true })
  waktuPulangKoreksi: string | null

  @Column('int', { name: 'jenis_izin', nullable: true })
  jenisIzin: number | null

  @Column('varchar', { name: 'user_id_pengusul', length: 36 })
  userIdPengusul: string

  @Column('int', { name: 'status_pengajuan' })
  statusPengajuan: number

  @Column('int', { name: 'user_id_pemeriksa', nullable: true })
  userIdPemeriksa: number | null

  @Column('date', { name: 'tgl_diperiksa', nullable: true })
  tglDiperiksa: Date | null

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
    default: () => '',
  })
  catatanDariPemeriksa: string | null

  @Column('tinyint', { name: 'alasan_penolakan_id', nullable: true })
  alasanPenolakanId: number | null

  @Column('datetime', { name: 'last_update', nullable: true })
  lastUpdate: Date | null

  @Column('datetime', {
    name: 'create_date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date

  @Column('varchar', { name: 'updated_by', nullable: true, length: 100 })
  updatedBy: string | null
}
