import { Module } from '@nestjs/common';
import { ClothesService } from './clothes.service';
import { ClothesController } from './clothes.controller';
import { ClothesHistoryModule } from 'src/clothes-history/clothes-history.module';
import { UserModule } from 'src/user/user.module';

import { EmployeeModule } from 'src/employee/employee.module';
import { MaxBotModule } from 'src/max-bot/max-bot.module';

@Module({
  imports: [ClothesHistoryModule, UserModule, EmployeeModule, MaxBotModule],
  controllers: [ClothesController],
  providers: [ClothesService],
})
export class ClothesModule {}
