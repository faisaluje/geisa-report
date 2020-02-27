import { Module } from '@nestjs/common'
import { StatusKehadiranService } from './status-kehadiran.service'
import { StatusKehadiranController } from './status-kehadiran.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RefStatusKehadiran } from 'src/entities/refStatusKehadiran.entity'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    TypeOrmModule.forFeature([RefStatusKehadiran]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [StatusKehadiranService],
  controllers: [StatusKehadiranController],
})
export class StatusKehadiranModule {}
