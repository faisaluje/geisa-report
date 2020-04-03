import { Module } from '@nestjs/common'
import { PenggunaService } from './pengguna.service'
import { PenggunaController } from './pengguna.controller'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Pengguna } from 'src/entities/pengguna.entity'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Pengguna]),
  ],
  providers: [PenggunaService],
  controllers: [PenggunaController],
})
export class PenggunaModule {}
