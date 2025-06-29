import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSkillDto {
  @IsString({ message: 'Название навыка должно быть строкой' })
  @IsNotEmpty({ message: 'Название скилла обязательно для заполнения.' })
  skill: string;
}
