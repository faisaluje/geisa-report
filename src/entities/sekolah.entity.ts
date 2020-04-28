import { Column, Entity, Index, BaseEntity } from 'typeorm'

@Index('npsn', ['npsn'], {})
@Index('kode_wilayah_desa_kelurahan', ['kodeWilayahDesaKelurahan'], {})
@Index('kode_wilayah_kabupaten_kota', ['kodeWilayahKabupatenKota'], {})
@Index('kode_wilayah_provinsi', ['kodeWilayahProvinsi'], {})
@Index('bentuk_pendidikan_id', ['bentukPendidikanId'], {})
@Index('kode_wilayah_kecamatan', ['kodeWilayahKecamatan'], {})
@Index('status_sekolah', ['statusSekolah'], {})
@Entity('sekolah', { schema: 'new_geisa' })
export class Sekolah extends BaseEntity {
  @Column('varchar', { primary: true, name: 'sekolah_id', length: 50 })
  sekolahId: string

  @Column('varchar', { name: 'nama', length: 200 })
  nama: string

  @Column('varchar', { name: 'npsn', length: 50 })
  npsn: string

  @Column('int', { name: 'bentuk_pendidikan_id' })
  bentukPendidikanId: number

  @Column('varchar', { name: 'bentuk_pendidikan_id_str', length: 100 })
  bentukPendidikanIdStr: string

  @Column('longtext', { name: 'alamat_jalan', nullable: true })
  alamatJalan: string | null

  @Column('varchar', { name: 'rt', nullable: true, length: 50 })
  rt: string | null

  @Column('varchar', { name: 'rw', nullable: true, length: 50 })
  rw: string | null

  @Column('varchar', { name: 'nama_dusun', nullable: true, length: 100 })
  namaDusun: string | null

  @Column('varchar', {
    name: 'kode_wilayah_desa_kelurahan',
    nullable: true,
    length: 50,
  })
  kodeWilayahDesaKelurahan: string | null

  @Column('varchar', {
    name: 'kode_wilayah_desa_kelurahan_str',
    nullable: true,
    length: 100,
  })
  kodeWilayahDesaKelurahanStr: string | null

  @Column('varchar', {
    name: 'kode_wilayah_kabupaten_kota',
    nullable: true,
    length: 50,
  })
  kodeWilayahKabupatenKota: string | null

  @Column('varchar', {
    name: 'kode_wilayah_kabupaten_kota_str',
    nullable: true,
    length: 100,
  })
  kodeWilayahKabupatenKotaStr: string | null

  @Column('varchar', {
    name: 'kode_wilayah_provinsi',
    nullable: true,
    length: 50,
  })
  kodeWilayahProvinsi: string | null

  @Column('varchar', {
    name: 'kode_wilayah_provinsi_str',
    nullable: true,
    length: 100,
  })
  kodeWilayahProvinsiStr: string | null

  @Column('varchar', { name: 'kode_pos', nullable: true, length: 10 })
  kodePos: string | null

  @Column('varchar', { name: 'status_sekolah', nullable: true, length: 10 })
  statusSekolah: string | null

  @Column('varchar', { name: 'yayasan_id', nullable: true, length: 100 })
  yayasanId: string | null

  @Column('varchar', { name: 'yayasan_id_str', nullable: true, length: 100 })
  yayasanIdStr: string | null

  @Column('datetime', { name: 'license_expired' })
  licenseExpired: Date

  @Column('varchar', { name: 'license_type', length: 50 })
  licenseType: string

  @Column('varchar', {
    name: 'kode_wilayah_kecamatan',
    nullable: true,
    length: 50,
  })
  kodeWilayahKecamatan: string | null

  @Column('varchar', {
    name: 'kode_wilayah_kecamatan_str',
    nullable: true,
    length: 100,
  })
  kodeWilayahKecamatanStr: string | null

  @Column('int', { name: 'GMTPlus', nullable: true })
  gmtPlus: number | null

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

  @Column('tinyint', {
    name: 'shift_pagi',
    nullable: true,
    width: 1,
    default: () => 1,
  })
  shiftPagi: boolean

  @Column('tinyint', {
    name: 'shift_siang',
    nullable: true,
    width: 1,
    default: () => 0,
  })
  shiftSiang: boolean

  @Column('time', {
    name: 'shift_pagi_mulai',
    nullable: true,
    default: () => '05:30:00',
  })
  shiftPagiMulai: string | null

  @Column('time', {
    name: 'shift_siang_mulai',
    nullable: true,
    default: () => '09:00:00',
  })
  shiftSiangMulai: string | null

  @Column('tinyint', {
    name: 'is_online_registration',
    nullable: true,
    width: 1,
    default: () => 1,
  })
  isOnlineRegistration: boolean
}
