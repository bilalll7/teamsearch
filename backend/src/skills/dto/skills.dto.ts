import { IsString, IsInt, Min, Max } from 'class-validator';

export class AddUserSkillDto {
  @IsString()
  skillId: string;

  @IsInt()
  @Min(1)
  @Max(3)
  level: number; // 1-3 per PRD
}

export class UpdateUserSkillDto {
  @IsInt()
  @Min(1)
  @Max(3)
  level: number;
}
