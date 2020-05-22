import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('cron_job', { schema: 'new_geisa' })
export class CronJob {
  @PrimaryGeneratedColumn({ type: 'int', name: 'cron_id' })
  cronId: number

  @Column('varchar', { name: 'perintah', length: 128 })
  perintah: string

  @Column('enum', {
    name: 'periode',
    nullable: true,
    enum: ['PERJAM', 'PERHARI', 'PERMINGGU', 'PERBULAN', 'PERTAHUN'],
  })
  periode: 'PERJAM' | 'PERHARI' | 'PERMINGGU' | 'PERBULAN' | 'PERTAHUN' | null

  @Column('tinyint', { name: 'hari', nullable: true, default: () => 0 })
  hari: number | null

  @Column('tinyint', { name: 'tanggal', nullable: true, width: 1 })
  tanggal: number | null

  @Column('tinyint', { name: 'jam', nullable: true })
  jam: number | null

  @Column('tinyint', { name: 'enable', nullable: true })
  enable: boolean

  @Column('datetime', {
    name: 'created_date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date | null

  @Column('datetime', { name: 'last_update', nullable: true })
  lastUpdate: Date | null

  @Column('datetime', { name: 'last_run', nullable: true })
  lastRun: Date | null

  @Column('varchar', { name: 'updated_by', nullable: true, length: 50 })
  updatedBy: string | null

  @Column('tinyint', { name: 'prioritas', nullable: true })
  prioritas: number | null
}
