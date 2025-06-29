import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class AddSkillsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  skillIds: string[];
}
