import { IsOptional } from "class-validator";
import { QueryDto } from "src/common/Dto/query.dto";

export class CategoriesFiltersDto extends QueryDto {
    @IsOptional()
    name:string
}