import { ArrayMinSize, IsArray, IsDefined, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MaxLength, ValidateIf, ValidateNested } from "class-validator"
import { MoveTypes } from "src/common/interfaces/Moves.interface"
import { IsRequiredIfTypeIsTransfer } from "../decorators/IsRequiredIfTypeIsTransfer"
import { Type } from "class-transformer"
import { Label } from "src/labels/entities/label.entity"

export class CreateMoveDto {

    @IsString()
    @IsDefined()
    @IsIn(["INCOME","EXPENSE","TRANSFER"])
    type:MoveTypes

    @IsNumber()
    @IsOptional()
    @IsPositive()
    value:number

    @IsString()
    @MaxLength(80)
    @IsOptional()
    comment:string

    @IsInt()
    @IsDefined()
    account:number

    @IsInt()
    @IsOptional()
    @IsRequiredIfTypeIsTransfer('type', 'TRANSFER', {
        message: 'destiny_account is required when type is TRANSFER',
      })
    destiny_account:number

    @IsInt()
    @IsOptional()
    @ValidateIf((o) => o.type !== 'TRANSFER') // Hacer que category sea opcional si el tipo no es TRANSFER
    category:number

    @IsInt()
    @IsOptional()
    creditor:number

    @IsArray()
    @ArrayMinSize(1)
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => Number)
    labels:Label[]


      // Propiedad para fecha y hora
      @IsOptional()
      createdAt: Date; // Aquí asumo que `createdAt` es de tipo `Date`
}
