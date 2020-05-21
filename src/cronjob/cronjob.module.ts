import { Module } from '@nestjs/common'
import { CronjobService } from './cronjob.service'
import { CronjobController } from './cronjob.controller'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CronJob } from '../entities/cronJob.entity'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([CronJob]),
  ],
  providers: [CronjobService],
  controllers: [CronjobController],
})
export class CronjobModule {}
