import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Currency } from 'src/currencies/entities/currency.entity';
import { Move } from 'src/moves/entities/move.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Currency,    
    Account,
    Move
  ])],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports:[AccountsService]
})
export class AccountsModule {}
