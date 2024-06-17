import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovesModule } from './moves/moves.module';
import { AccountsModule } from './accounts/accounts.module';
import { CategoriesModule } from './categories/categories.module';
import { LabelsModule } from './labels/labels.module';
import { DebtorsModule } from './debtors/debtors.module';
import { CurrenciesModule } from './currencies/currencies.module';

@Module({
  imports: [ConfigModule.forRoot({
    expandVariables: true,
  }),
    TypeOrmModule.forRoot({
      type:"postgres",
       host:  process.env.DB_HOST,
       port:  +process.env.DB_PORT,
       database:  process.env.DB_NAME,
       username:  process.env.DB_USERNAME,
       password:  process.env.DB_PASSWORD,
      autoLoadEntities:true,
      synchronize:!!process.env.DB_SYNCRONIZE
    }),
    MovesModule,
    AccountsModule,
    CategoriesModule,
    LabelsModule,
    DebtorsModule,
    CurrenciesModule,
   ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
