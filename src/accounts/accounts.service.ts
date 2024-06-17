import { Injectable, Logger } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { handleDBExceptions } from 'src/common/error.handler';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { Currency } from 'src/currencies/entities/currency.entity';
import { AccountsFiltersDto } from './dto/filters.dto';
import { Paginator } from 'src/common/Paginator.service';
import { Move } from 'src/moves/entities/move.entity';
import { accountTypes } from 'src/common/Dto/options.dto';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger("AccountsService")
  private readonly paginator = new Paginator();

  constructor(
    @InjectRepository(Account) 
    private readonly accountRepository:Repository<Account>,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    @InjectRepository(Move)
    private readonly moveRepository: Repository<Move>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    try {
      const { currency: currencyId, ...accountData } = createAccountDto;
      const currency = await this.currencyRepository.findOneBy({ id: currencyId });

      if (!currency) {
       throw {code:"NOT_FOUND",detail:`Currency ${currencyId} not found`}
      }

      const account = this.accountRepository.create({
        ...accountData,
        balance:accountData?.init_balance ? accountData?.init_balance : 0,
        currency,
      });

      await this.accountRepository.save(account)
      return account
    } catch (error) {
      handleDBExceptions(this.logger,error)
    }
  }

  async findAll(query:AccountsFiltersDto) {
    try {
      const { limit = 10, offset = 1, search = '', order="ASC",order_type="id",name="" } = query;

      // Adding the wheere
      const accountSelect = await this.accountRepository.createQueryBuilder("accounts")
      .andWhere("LOWER(name) LIKE :name", { name: `%${search.toLowerCase()}%` })

      // Adding filters
      if(name?.length > 0){
        accountSelect.andWhere("accounts.name = :name", { name: name }) //Filter
      }

      // Adding order and offset
      accountSelect.orderBy(`accounts.${order_type}`, order)
      .take(limit)
      .skip((offset - 1) * limit)
      
      //Execute the query
      const accountsQuery = await accountSelect.getManyAndCount()
      // DETRUCTURATE
      const [accounts,count]= accountsQuery

      // Add calculation vs past in every accounts

      const calculatedAccounts = await Promise.all(
        accounts.map(async (account) => await this.calculateBalanceAndProgress(account))
      );
      const accountsResponse = this.paginator.paginate(
        {data:calculatedAccounts,count,limit,offset}
      )
      return accountsResponse

    } catch (error) {
      handleDBExceptions(this.logger,error)
    }
  }

  async findOne(id: number) {
    try {
        const account = await this.accountRepository.findOneBy({id:id})
        if (!account) {
          throw {code:"NOT_FOUND",detail:`Account ${id} not found`}
         }

         const calculatedAccount =await this.calculateBalance(account)

        return calculatedAccount
    } catch (error) {
      handleDBExceptions(this.logger,error)
    }
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }

  async calculateBalance(account:Account){
    const currentBalance = account.balance;

    const date30DaysAgo = new Date();
    date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);

    const recentMoves = await this.moveRepository
      .createQueryBuilder("moves")
      .where("moves.accountId = :id", { id:account.id })
      .leftJoinAndSelect("moves.account", "account")
      .leftJoinAndSelect("moves.destiny_account", "destiny_account")
      .andWhere("moves.createdAt >= :date30DaysAgo", { date30DaysAgo })
      .getMany();

    let balance30DaysAgo = currentBalance;

    // Variables para acumular ingresos, gastos y transferencias
    let totalIncome = 0;
    let totalExpense = 0;
    let totalTransferOut = 0;
    let totalTransferIn = 0;

    for (const move of recentMoves) {
      if (move.type === "INCOME") {
        balance30DaysAgo -= move.value;
        totalIncome += move.value; // Sumar al total de ingresos
      } else if (move.type === "EXPENSE") {
        balance30DaysAgo += move.value;
        totalExpense += move.value; // Sumar al total de gastos
      } else if (move.type === "TRANSFER" && move.account.id === account.id) {
        balance30DaysAgo += move.value;
        totalTransferOut += move.value; // Sumar al total de transferencias salientes
      } else if (move.type === "TRANSFER" && move.destiny_account.id === account.id) {
        balance30DaysAgo -= move.value;
        totalTransferIn += move.value; // Sumar al total de transferencias entrantes
      }
    }

    const accountWithLast30Days = {
      ...account,
      vs30d: balance30DaysAgo,
      totalIncome,     // Total de ingresos
      totalExpense,    // Total de gastos
      totalTransferOut, // Total de transferencias salientes
      totalTransferIn   // Total de transferencias entrantes
    };
    return accountWithLast30Days
  }
  async calculateBalanceAndProgress(account: Account) {
    const calculatedAccount = await this.calculateBalance(account);
  
    const { balance: currentBalance, max, min } = calculatedAccount;
  
    let progress = 0;
    if (max !== null && min !== null) {
      // Ambos están presentes
      const totalRange = max - min;
      const progressAmount = currentBalance - min;
      progress = (progressAmount / totalRange) * 100;
    } else if (max !== null) {
      // Solo max está presente
      const totalRange = max;
      const progressAmount = currentBalance;
      progress = (progressAmount / totalRange) * 100;
    } else if (min !== null) {
      // Solo min está presente
      const totalRange = min; // Convertir a positivo porque el rango es de min a 0
      const progressAmount = currentBalance - min;
      progress = (progressAmount / totalRange) * 100;
    }
  
    // Check alerts
    if (max !== null && currentBalance >= max) {
      console.log('Alerta: Se ha alcanzado el saldo máximo.');
    }
  
    if (min !== null && currentBalance <= min) {
      console.log('Alerta: Se ha alcanzado el saldo mínimo.');
    }
  
    return {
      ...calculatedAccount,
      progress,
    };
  }

  async findAccountTypes(query:AccountsFiltersDto) {
    try {
      const { limit = 10, offset = 1, search = '', order="ASC",order_type="id",name="" } = query;
      const accountsTypesResponse = {data:[...accountTypes]}
      return accountsTypesResponse
    } catch (error) {
      handleDBExceptions(this.logger,error)
    }
  }
}
