import { IsUUID } from 'class-validator';

export class IssueClothingDto {
  @IsUUID()
  clothingId: string;
}
