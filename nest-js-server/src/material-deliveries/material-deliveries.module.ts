import { Module } from '@nestjs/common';
import { S3Module } from 'src/s3/s3.module';
import { MaterialDeliveryService } from './material-deliveries.service';
import { MaterialDeliveryController } from './material-deliveries.controller';

@Module({
  controllers: [MaterialDeliveryController],
  providers: [MaterialDeliveryService],
  imports: [S3Module],
})
export class MaterialDeliveriesModule {}
