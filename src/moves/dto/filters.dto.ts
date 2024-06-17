import { IsOptional } from "class-validator";
import { QueryDto } from "src/common/Dto/query.dto";

export class MovesFiltersDto extends QueryDto {
    @IsOptional()
    account?:number
}