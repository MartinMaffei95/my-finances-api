import { IsOptional } from "class-validator";
import { QueryDto } from "src/common/Dto/query.dto";

export class AccountsFiltersDto extends QueryDto {
    @IsOptional()
    name:string
}