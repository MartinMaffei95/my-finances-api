import { Injectable, Logger } from '@nestjs/common';
import { CreateMoveDto } from './dto/create-move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';
import { PaginatedData, PaginationInfo } from 'src/common/interfaces';
import { Move } from './entities/move.entity';
import { SearchDto } from 'src/common/Dto/search.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { handleDBExceptions } from 'src/common/error.handler';
import { Account } from 'src/accounts/entities/account.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Label } from 'src/labels/entities/label.entity';
import { MovesFiltersDto } from './dto/filters.dto';

@Injectable()
export class MovesService {
  private readonly logger = new Logger(MovesService.name);

  constructor(
    @InjectRepository(Move)
    private readonly moveRepository: Repository<Move>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,

    //Data source used in query runner
    private readonly dataSource: DataSource,
  ) {}

  async create(createMoveDto: CreateMoveDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    // Connect to database and initialize the transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        account: accountId,
        category: categoryId,
        destiny_account: destinyAccountId,
        type,
        labels: labelIds,
        value,
        ...moveData
      } = createMoveDto;

      const account = await this.accountRepository.findOneBy({ id: accountId });
      if (!account) {
        throw { code: 'NOT_FOUND', detail: `Account ${accountId} not found` };
      }

      let destiny_account = null;
      if (type === 'TRANSFER') {
        destiny_account = await this.accountRepository.findOneBy({
          id: destinyAccountId,
        });
        if (!destiny_account) {
          throw {
            code: 'NOT_FOUND',
            detail: `Account ${destinyAccountId} not found`,
          };
        }
      }
      let category = null;
     // if (type === 'TRANSFER') {
        category = await this.categoryRepository.findOneBy({ id: categoryId });
        if (!category) {
          throw {
            code: 'NOT_FOUND',
            detail: `Category ${categoryId} not found`,
          };
        }
      //}

      let labels = null;
      if (labelIds?.length > 0) {
        labels = await this.labelRepository.findBy({ id: In(labelIds) });
        if (labels?.length !== labelIds?.length) {
          throw { code: 'NOT_FOUND', detail: `One or more labels not found` };
        }
      }

         // Añadir la lógica para establecer createdAt
         const createdAt = createMoveDto.createdAt || new Date();

      // Adjust the balance based on the type of move
      if (type === 'INCOME') {
        account.balance += value;
        await queryRunner.manager.update(
          Account,
          { id: account.id },
          {
            ...account,
          },
        );
      } else if (type === 'EXPENSE') {
        account.balance -= value;
        await queryRunner.manager.update(
          Account,
          { id: account.id },
          {
            ...account,
          },
        );
      } else if (type === 'TRANSFER') {
        account.balance -= value;
        destiny_account.balance += value;

        await queryRunner.manager.update(
          Account,
          { id: account.id },
          {
            ...account,
          },
        );
        await queryRunner.manager.update(
          Account,
          { id: destiny_account.id },
          {
            ...destiny_account,
          },
        );
      }

      const moveInstance = {
        ...moveData,
        account,
        category,
        destiny_account,
        creditor: null,
        labels,
        type,
        value,
        createdAt
      };
      const move = this.moveRepository.create(moveInstance);

      await queryRunner.manager.save(move);

      //Execute the Query Runner
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return move;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      handleDBExceptions(this.logger, error);
    }
  }

  async findAll(query: MovesFiltersDto) {
    const { limit = 10, offset = 1, search = '', order="ASC",order_type="id",account=undefined} = query;
    this.logger.log("account"+account,JSON.stringify(query))
    try {
        const movesQuery = this.moveRepository
        .createQueryBuilder('moves')
        .leftJoinAndSelect('moves.category', 'category')
        .leftJoinAndSelect('moves.account', 'account');

      if (account) {
        movesQuery.andWhere('account.id = :account', { account });
      }

      movesQuery
        .orderBy(`moves.${order_type}`, order)
        .take(limit)
        .skip((offset - 1) * limit);

      const movesFinded = await movesQuery.getManyAndCount();
      // DETRUCTURATE
      const [moves, count] = movesFinded;
      const movesResponse = this.paginate({
        data: moves,
        count,
        limit,
        offset,
      });

      return movesResponse;
    } catch (error) {
      handleDBExceptions(this.logger, error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} move`;
  }

  update(id: number, updateMoveDto: UpdateMoveDto) {
    return `This action updates a #${id} move`;
  }

  remove(id: number) {
    return `This action removes a #${id} move`;
  }
  paginate({
    data,
    count,
    offset,
    limit,
  }: {
    data: Move[];
    count: number;
    offset: number;
    limit: number;
  }): PaginatedData<Move[]> {
    const totalPages = Math.ceil(count / limit);
    // Calcular la página basada en el offset y el límite
    //  const page =  Math.min(Math.max(1, offset), totalPages);
    // console.log("count,offset,limit,",count,offset,limit)
    const page = offset;

    let paginationInfo: PaginationInfo = {
      page: page,
      perPage: limit,
      totalPages: totalPages,
      totalElements: count,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };

    return { data: data, pagination: paginationInfo };
  }
}
