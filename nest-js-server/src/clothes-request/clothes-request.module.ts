import { Module } from '@nestjs/common';
import { ClothesRequestService } from './clothes-request.service';
import { ClothesRequestController } from './clothes-request.controller';

@Module({
  controllers: [ClothesRequestController],
  providers: [ClothesRequestService],
})
export class ClothesRequestModule {}
