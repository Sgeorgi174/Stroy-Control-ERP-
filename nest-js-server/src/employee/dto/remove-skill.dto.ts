import { IsUUID, IsString } from 'class-validator';

export class RemoveSkillsDto {
  @IsString()
  @IsUUID()
  skillId: string;
}
