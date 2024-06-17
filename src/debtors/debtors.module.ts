import { Module } from '@nestjs/common';
import { DebtorsService } from './debtors.service';
import { DebtorsController } from './debtors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debtor } from './entities/debtor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Debtor
  ])],
  controllers: [DebtorsController],
  providers: [DebtorsService],
})
export class DebtorsModule {}
