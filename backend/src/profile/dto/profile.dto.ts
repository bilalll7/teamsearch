import { IsString, IsOptional, MaxLength, IsBoolean, IsUrl, IsIn, IsArray, IsObject } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  namaTampilan?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  programStudi?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  angkatan?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  headline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  lokasi?: string;

  @IsOptional()
  @IsUrl({ protocols: ['https'], require_protocol: true })
  @MaxLength(500)
  avatarUrl?: string;

  @IsOptional()
  @IsUrl({ protocols: ['https'], require_protocol: true })
  @MaxLength(500)
  resumeUrl?: string;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  pengalaman?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  pendidikan?: Record<string, unknown>[];

  @IsOptional()
  @IsBoolean()
  ketersediaan?: boolean;
}

export class CreatePortfolioLinkDto {
  @IsString()
  @MaxLength(50)
  label: string;

  @IsUrl()
  @MaxLength(500)
  url: string;

  @IsIn(['github', 'linkedin', 'behance', 'lainnya'])
  tipe: string;
}

export class UpdatePortfolioLinkDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  label?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  url?: string;

  @IsOptional()
  @IsIn(['github', 'linkedin', 'behance', 'lainnya'])
  tipe?: string;
}
