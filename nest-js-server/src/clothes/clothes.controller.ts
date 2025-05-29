import { Controller } from '@nestjs/common';
import { ClothesService } from './clothes.service';

@Controller('clothes')
export class ClothesController {
  constructor(private readonly clothesService: ClothesService) {}
}
