import {
  IsString,
  IsOptional,
  MaxLength,
  IsDateString,
  IsIn,
  IsInt,
  Min,
  Max,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class NestedRequirementDto {
  @IsString()
  @MinLength(1)
  skillId: string;
  @IsIn(['must_have', 'nice_to_have'])
  jenis: string;
  @IsInt()
  @Min(1)
  @Max(3)
  levelMinimum: number;
}

export class NestedPositionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nama: string;
  @IsInt()
  @Min(1)
  @Max(100)
  jumlahSlot: number;
  @IsOptional()
  @IsString()
  @MaxLength(500)
  deskripsi?: string;
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => NestedRequirementDto)
  requirements: NestedRequirementDto[];
}

export class CreateOpportunityDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => NestedPositionDto)
  positions?: NestedPositionDto[];

  @IsString()
  @MaxLength(200)
  judul: string;

  @IsString()
  @MaxLength(2000)
  deskripsi: string;

  @IsIn(['lomba', 'proyek'])
  jenis: string;

  @IsString()
  @MaxLength(100)
  kategori: string;

  @IsIn(['online', 'offline', 'hybrid'])
  mode: string;

  @IsOptional()
  @IsDateString()
  tenggat?: string;
}

export class UpdateOpportunityDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  judul?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  deskripsi?: string;

  @IsOptional()
  @IsIn(['lomba', 'proyek'])
  jenis?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  kategori?: string;

  @IsOptional()
  @IsIn(['online', 'offline', 'hybrid'])
  mode?: string;

  @IsOptional()
  @IsDateString()
  tenggat?: string;

  @IsOptional()
  @IsIn(['draft', 'open', 'closed', 'expired'])
  status?: string;
}

export class CreatePositionDto {
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => NestedRequirementDto)
  requirements?: NestedRequirementDto[];

  @IsString()
  @MaxLength(100)
  nama: string;

  @IsInt()
  @Min(1)
  jumlahSlot: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  deskripsi?: string;
}

export class UpdatePositionDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nama?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  jumlahSlot?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  deskripsi?: string;
}

export class CreatePositionSkillRequirementDto {
  @IsString()
  skillId: string;

  @IsIn(['must_have', 'nice_to_have'])
  jenis: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  levelMinimum?: number;
}

export class UpdatePositionSkillRequirementDto {
  @IsOptional()
  @IsIn(['must_have', 'nice_to_have'])
  jenis?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  levelMinimum?: number;
}

export class CreateApplicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  pesan?: string;
}

export class UpdateApplicationStatusDto {
  @IsIn(['shortlisted', 'accepted', 'rejected', 'withdrawn'])
  status: string;
}
