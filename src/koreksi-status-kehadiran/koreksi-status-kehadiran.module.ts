import { Module } from '@nestjs/common'
import { KoreksiStatusKehadiranService } from './koreksi-status-kehadiran.service'
import { KoreksiStatusKehadiranController } from './koreksi-status-kehadiran.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { KoreksiStatusKehadiran } from 'src/entities/koreksiStatusKehadiran.entity'
import { PassportModule } from '@nestjs/passport'
import { RowsModule } from 'src/rows/rows.module'

@Module({
  imports: [
    RowsModule,
    TypeOrmModule.forFeature([KoreksiStatusKehadiran]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [KoreksiStatusKehadiranService],
  controllers: [KoreksiStatusKehadiranController],
})
export class KoreksiStatusKehadiranModule {}
