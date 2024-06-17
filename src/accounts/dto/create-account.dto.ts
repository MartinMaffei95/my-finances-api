import { IsDefined, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { accountTypes } from "src/common/Dto/options.dto";
import { AccountTypes } from "src/common/interfaces/Accounts.interface";

export class CreateAccountDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    name: string;
  
    @IsString()
    @MaxLength(80)
    @IsOptional()
    description: string;
  
    @IsString()
    @IsDefined()
    @IsIn(accountTypes)
    type:AccountTypes
 
    @IsInt()
    @IsDefined()
    currency: number;
    
    @IsNumber()
    @IsOptional()
    init_balance: number;

    @IsNumber()
    @IsOptional()
    balance: number;

    @IsString()
    @MaxLength(23) // rgba(123,456,789,01,23)
    @IsOptional()
    color: string;
  
    @IsString()
    @MaxLength(20)
    @IsOptional()
    icon: string;
  
    @IsNumber()
    @IsOptional()
    min: number;

    @IsNumber()
    @IsOptional()
    max: number;
}
