import { Controller } from '@nestjs/common';
import { ClothesHistoryService } from './clothes-history.service';

@Controller('clothes-history')
export class ClothesHistoryController {
  constructor(private readonly clothesHistoryService: ClothesHistoryService) {}
}
