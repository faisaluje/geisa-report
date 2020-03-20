import { Column, Entity, BaseEntity } from 'typeorm'

@Entity('mst_wilayah', { database: 'referensi' })
export class MstWilayah extends BaseEntity {
  @Column('char', { primary: true, name: 'kode_wilayah', length: 10 })
  kodeWilayah: string

  @Column('varchar', { name: 'nama', nullable: true, length: 50 })
  nama: string | null

  @Column('int', { name: 'id_level_wilayah', nullable: true })
  idLevelWilayah: number | null

  @Column('char', { name: 'mst_kode_wilayah', nullable: true, length: 10 })
  mstKodeWilayah: string | null

  @Column('char', { name: 'negara_id', nullable: true, length: 10 })
  negaraId: string | null

  @Column('char', { name: 'asal_wilayah', nullable: true, length: 10 })
  asalWilayah: string | null

  @Column('char', { name: 'kode_bps', nullable: true, length: 10 })
  kodeBps: string | null

  @Column('char', { name: 'kode_dagri', nullable: true, length: 10 })
  kodeDagri: string | null

  @Column('varchar', { name: 'kode_keu', nullable: true, length: 50 })
  kodeKeu: string | null

  @Column('char', { name: 'id_prov', nullable: true, length: 10 })
  idProv: string | null

  @Column('char', { name: 'id_kabkota', nullable: true, length: 10 })
  idKabkota: string | null

  @Column('char', { name: 'id_kec', nullable: true, length: 10 })
  idKec: string | null

  @Column('datetime', { name: 'create_date', nullable: true })
  createDate: Date | null

  @Column('datetime', { name: 'last_update', nullable: true })
  lastUpdate: Date | null

  @Column('datetime', { name: 'expired_date', nullable: true })
  expiredDate: Date | null

  @Column('datetime', { name: 'last_sync', nullable: true })
  lastSync: Date | null
}
