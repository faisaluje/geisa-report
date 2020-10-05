import { BadRequestException, Injectable } from '@nestjs/common'
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate'
import { AutomatedApprovalDto } from 'src/dto/automated-approval.dto'
import { AutomatedApproval } from 'src/entities/automatedApproval.entity'
import { getRepository } from 'typeorm'

@Injectable()
export class ApprovalOtomatisService {
  async getListApprovalOtomatis(
    pageOptions: IPaginationOptions,
  ): Promise<Pagination<AutomatedApproval>> {
    return paginate<AutomatedApproval>(
      getRepository(AutomatedApproval),
      pageOptions,
      {
        relations: ['wilayah'],
      },
    )
  }

  async createApprovalOtomatis(
    data: AutomatedApprovalDto,
  ): Promise<AutomatedApproval> {
    try {
      const result = await getRepository(AutomatedApproval).save({
        ...data,
      })

      return result
    } catch (err) {
      throw new BadRequestException(err.message)
    }
  }

  async deleteApprovalOtomatis(kodeWilayah: string): Promise<void> {
    try {
      await getRepository(AutomatedApproval).delete({
        wilayah: { kodeWilayah },
      })
    } catch (err) {
      throw new BadRequestException(err.message)
    }
  }
}
