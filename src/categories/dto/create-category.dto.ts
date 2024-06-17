import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { Category } from "../entities/category.entity";

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    name: string;

    @IsInt()
    @IsOptional()
    parent: number;

    @IsString()
    @MaxLength(23) // rgba(123,456,789,01,23)
    @IsOptional()
    color: string;

    @IsString()
    @MaxLength(23) // rgba(123,456,789,01,23)
    @IsOptional()
    color2: string;
  
    @IsString()
    @MaxLength(20)
    @IsOptional()
    icon: string;

}
