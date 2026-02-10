import { PartialType } from '@nestjs/mapped-types';
import { CreateClothesRequestDto } from './create-clothes-request.dto';

export class UpdateClothesRequestDto extends PartialType(
  CreateClothesRequestDto,
) {}
