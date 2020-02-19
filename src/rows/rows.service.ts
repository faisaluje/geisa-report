import { Injectable, Inject } from '@nestjs/common'
import { SelectQueryBuilder } from 'typeorm'
import { PagingDto } from '../dto/paging.dto'

@Injectable()
export class RowsService {
  private limit: number
  private offset: number
  private page: number

  constructor(@Inject('QUERY_BUILDER') private query: SelectQueryBuilder<any>) {
    this.limit = 100
    this.offset = 0
    this.page = 1
  }

  async getTotalRowsCount(): Promise<number> {
    return await this.query.getCount()
  }

  async getRowsData(): Promise<any[]> {
    return await this.query
      .offset(this.offset)
      .limit(this.limit)
      .getRawMany()
  }

  setLimit(limit: number) {
    this.limit = limit
  }

  setOffset(offset: number) {
    this.offset = offset
  }

  getLimit(): number {
    return this.limit
  }

  getOffset(): number {
    return this.offset
  }

  setPage(page: number) {
    this.page = page
  }

  async getResult(): Promise<PagingDto> {
    const result = new PagingDto()

    result.totalCount = await this.getTotalRowsCount()
    result.limit = this.getLimit()
    result.page = this.page
    result.totalPage = Math.ceil(result.totalCount / result.limit)
    this.offset = result.limit * (result.page - 1)
    result.rows = await this.getRowsData()

    return result
  }
}
