import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { ApprovalOtomatisController } from './approval-otomatis.controller'
import { ApprovalOtomatisService } from './approval-otomatis.service'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [ApprovalOtomatisService],
  controllers: [ApprovalOtomatisController],
})
export class ApprovalOtomatisModule {}
