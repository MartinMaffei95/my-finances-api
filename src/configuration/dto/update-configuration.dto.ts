import { PartialType } from '@nestjs/mapped-types';
import { CreateConfigurationDto } from './create-configuration.dto';
import { IsString } from 'class-validator';

export class UpdateConfigurationDto extends PartialType(CreateConfigurationDto) {
    @IsString()
    value:string
}
