import { IsOptional } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class QueryDto extends PaginationDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  order?: "ASC"|"DESC";

  @IsOptional()
  order_type?: string;
}
