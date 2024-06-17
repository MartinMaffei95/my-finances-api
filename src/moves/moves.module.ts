import { Module } from '@nestjs/common';
import { MovesService } from './moves.service';
import { MovesController } from './moves.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Move } from './entities/move.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Label } from 'src/labels/entities/label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Move, Account, Category, Label])],
  controllers: [MovesController],
  providers: [MovesService],
})
export class MovesModule {}
