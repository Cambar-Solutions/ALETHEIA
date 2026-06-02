import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ProviderTypeQueryDto {
  @ApiProperty({ enum: ['FISICA', 'MORAL'], example: 'MORAL' })
  @IsIn(['FISICA', 'MORAL'])
  providerType: 'FISICA' | 'MORAL';
}

export class CreateDocumentDto {
  @ApiProperty({ example: 'Acta constitutiva' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'ACTA_CONSTITUTIVA' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'https://storage/contracts/1/acta.pdf' })
  @IsString()
  fileUrl: string;

  @ApiPropertyOptional({ example: 102400 })
  @IsOptional()
  @IsInt()
  fileSize?: number;

  @ApiPropertyOptional({ example: 'application/pdf' })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional({ example: '2026-12-31T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class CreateVersionDto {
  @ApiProperty({ example: 'https://storage/contracts/1/acta-v2.pdf' })
  @IsString()
  fileUrl: string;

  @ApiPropertyOptional({ example: 204800 })
  @IsOptional()
  @IsInt()
  fileSize?: number;

  @ApiPropertyOptional({ example: 'application/pdf' })
  @IsOptional()
  @IsString()
  mimeType?: string;
}
