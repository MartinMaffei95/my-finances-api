import { Injectable, Logger } from '@nestjs/common';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { Paginator } from 'src/common/Paginator.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from './entities/configuration.entity';
import { handleDBExceptions } from 'src/common/error.handler';

@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger("ConfigurationService")
  private readonly paginator = new Paginator();


  constructor(
    @InjectRepository(Configuration)
    private readonly configRepository: Repository<Configuration>,
  ) {}


  async create(createConfigurationDto: CreateConfigurationDto) {
    try {
      const {  ...configData } = createConfigurationDto;
      const newConfig = this.configRepository.create(configData);
      await this.configRepository.save(newConfig)
      return newConfig
    } catch (error) {
      handleDBExceptions(this.logger,error)
    }
  }

  findAll() {
    return `This action returns all configuration`;
  }

  async findOne(id: number) {
     try {
      const findedConfig = await this.configRepository.findOneBy({ id });
      if(!findedConfig) throw {code:"NOT_FOUND",detail:`Config ${id} not found`}
      return findedConfig
    } catch (error) {
      handleDBExceptions(this.logger,error)
    }
  }

  async update(id: number, updateConfigurationDto: UpdateConfigurationDto) {
    try {
      const {  ...configData } = updateConfigurationDto;

      const findedConfig = await this.configRepository.findOneBy({ id });
      if(!findedConfig) throw {code:"NOT_FOUND",detail:`Config ${id} not found`}

      const newConfig = this.configRepository.create({
        ...findedConfig,
        value:configData.value
      });
      await this.configRepository.update({id},newConfig)
      return newConfig
    } catch (error) {
      handleDBExceptions(this.logger,error)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} configuration`;
  }
}
