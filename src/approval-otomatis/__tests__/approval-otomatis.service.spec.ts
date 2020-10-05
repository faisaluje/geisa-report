import { Test, TestingModule } from '@nestjs/testing'

import { ApprovalOtomatisService } from '../approval-otomatis.service'

describe('ApprovalOtomatisService', () => {
  let service: ApprovalOtomatisService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApprovalOtomatisService],
    }).compile()

    service = module.get<ApprovalOtomatisService>(ApprovalOtomatisService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
