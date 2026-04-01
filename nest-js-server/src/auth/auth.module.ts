import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MaxBotModule } from 'src/max-bot/max-bot.module';

@Module({
  imports: [MaxBotModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
