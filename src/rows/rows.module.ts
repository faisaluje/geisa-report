import { Module } from '@nestjs/common'
import { RowsService } from './rows.service'
import { SelectQueryBuilder } from 'typeorm'

@Module({
  providers: [
    {
      provide: 'QUERY_BUILDER',
      useClass: SelectQueryBuilder,
    },
    RowsService,
  ],
})
export class RowsModule {}
