import { Test, TestingModule } from '@nestjs/testing'

import { ApprovalOtomatisController } from '../approval-otomatis.controller'

describe('ApprovalOtomatis Controller', () => {
  let controller: ApprovalOtomatisController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApprovalOtomatisController],
    }).compile()

    controller = module.get<ApprovalOtomatisController>(
      ApprovalOtomatisController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
