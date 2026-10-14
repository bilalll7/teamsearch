import { IsString, IsOptional, MaxLength, IsBoolean, IsUrl, IsIn } from 'class-validator';

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
