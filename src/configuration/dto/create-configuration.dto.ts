import { IsString } from "class-validator"

export class CreateConfigurationDto {
    @IsString()
    name:string

    @IsString()
    description:string

    @IsString()
    value:string

    @IsString()
    default:string
}
