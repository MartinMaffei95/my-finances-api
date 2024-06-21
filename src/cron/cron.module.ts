import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  providers: [CronService],
  imports:[AccountsModule]
})
export class CronModule {}
