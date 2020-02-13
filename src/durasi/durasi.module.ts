import { Module } from '@nestjs/common';
import { DurasiService } from './durasi.service';
import { DurasiController } from './durasi.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  providers: [DurasiService],
  controllers: [DurasiController]
})
export class DurasiModule {}
