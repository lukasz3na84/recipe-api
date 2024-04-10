import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { BaseEntity } from 'typeorm';

export class FilterQueryDto<ENTITY extends BaseEntity> {
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  offset?: number;

  @IsString()
  @IsOptional()
  query?: string;

  @IsOptional()
  orderBy?: keyof ENTITY;

  @IsOptional()
  order?: 'ASC' | 'DESC';

  constructor(limit, offset, query, orderBy, order) {
    this.limit = Number(limit);
    this.offset = Number(offset);
    this.query = query;
    this.orderBy = orderBy;
    this.order = order;
  }
}
