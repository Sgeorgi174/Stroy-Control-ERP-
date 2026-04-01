import { Controller } from '@nestjs/common';
import { MaxBotService } from './max-bot.service';

@Controller('max-bot')
export class MaxBotController {
  constructor(private readonly maxBotService: MaxBotService) {}
}
