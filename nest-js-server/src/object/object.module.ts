import { Module } from '@nestjs/common';
import { ObjectService } from './object.service';
import { ObjectController } from './object.controller';
import { CustomerService } from './customer.service';

@Module({
  controllers: [ObjectController],
  providers: [ObjectService, CustomerService],
})
export class ObjectModule {}
