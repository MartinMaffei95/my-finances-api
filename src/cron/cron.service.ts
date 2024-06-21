import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class CronService {
    private readonly logger = new Logger("CronService")
    constructor(
        private readonly accountService: AccountsService,
    ) {}

    @Cron("0 */30 * * * *")
    async handleCron() {
        console.log("CRON")
        this.logger.log("[ recalculateBalance() ]")
        await this.accountService.recalculateBalance();
    }
}
