import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm'

@Index('serial_number', ['serialNumber'], {})
@Index('id_pada_dapodik', ['idPadaDapodik'], {})
@Index('date_time', ['dateTime'], {})
@Index('sekolah_id', ['sekolahId'], {})
@Index('id_pada_mesin', ['idPadaMesin'], {})
@Index('work_code', ['workCode'], {})
@Index('has_recap', ['hasRecap'], {})
@Index('last_sync', ['lastSync'], {})
@Index('date_insert', ['dateInsert'], {})
@Index('status', ['status'], {})
@Index('last_update', ['lastUpdate'], {})
@Index('update_from', ['updateFrom'], {})
@Index('data_send_gtk', ['idPadaDapodik', 'dateTime', 'sekolahId'], {})
@Entity('log_mesin', { schema: 'new_geisa' })
export class LogMesin extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column('varchar', { name: 'serial_number', length: 50 })
  serialNumber: string

  @Column('varchar', { name: 'sekolah_id', length: 50 })
  sekolahId: string

  @Column('varchar', { name: 'id_pada_mesin', nullable: true, length: 50 })
  idPadaMesin: string | null

  @Column('varchar', { name: 'id_pada_dapodik', nullable: true, length: 70 })
  idPadaDapodik: string | null

  @Column('varchar', { name: 'nama_pada_mesin', nullable: true, length: 50 })
  namaPadaMesin: string | null

  @Column('varchar', { name: 'nama_pada_dapodik', nullable: true, length: 100 })
  namaPadaDapodik: string | null

  @Column('datetime', { name: 'tanggal_lahir', nullable: true })
  tanggalLahir: Date | null

  @Column('datetime', { name: 'date_time', nullable: true })
  dateTime: Date | null

  @Column('int', { name: 'verified', nullable: true })
  verified: number | null

  @Column('int', { name: 'work_code', nullable: true })
  workCode: number | null

  @Column('datetime', { name: 'date_insert', nullable: true })
  dateInsert: Date | null

  @Column('int', { name: 'status', nullable: true })
  status: number | null

  @Column('datetime', { name: 'last_sync', nullable: true })
  lastSync: Date | null

  @Column('datetime', { name: 'last_update', nullable: true })
  lastUpdate: Date | null

  @Column('int', { name: 'update_from', nullable: true, default: () => 0 })
  updateFrom: number | null

  @Column('int', { name: 'has_recap', nullable: true, default: () => 0 })
  hasRecap: number | null

  @Column('smallint', {
    name: 'kirim_dhgtk',
    nullable: true,
    default: () => 0,
  })
  kirimDhgtk: number | null
}
