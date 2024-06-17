import { Injectable, Logger } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { handleDBExceptions } from 'src/common/error.handler';
import { Paginator } from 'src/common/Paginator.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { Repository } from 'typeorm';
import { CurrenciesFiltersDto } from './dto/filters.dto';

@Injectable()
export class CurrenciesService {
  private readonly logger = new Logger("AccountsService")
  private readonly paginator = new Paginator();

  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}


  create(createCurrencyDto: CreateCurrencyDto) {
    return 'This action adds a new currency';
  }

  async findAll(query:CurrenciesFiltersDto) {
    try {
      const { limit = 10, offset = 1, search = '', order="ASC",order_type="id"} = query;

      const curencySelect = await this.currencyRepository.createQueryBuilder("currencies")
      //Execute the query
      const currencyQuery = await curencySelect.getManyAndCount()
      // DETRUCTURATE
      const [accounts,count]= currencyQuery
      const currencyResponse ={data:[...accounts]}
      return currencyResponse
    } catch (error) {
      handleDBExceptions(this.logger,error)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} currency`;
  }

  update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
    return `This action updates a #${id} currency`;
  }

  remove(id: number) {
    return `This action removes a #${id} currency`;
  }
}
