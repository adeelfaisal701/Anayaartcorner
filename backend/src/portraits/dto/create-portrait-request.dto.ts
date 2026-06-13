import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreatePortraitRequestDto {
  @ApiProperty({ example: 'Jane Collector' })
  @IsString()
  @MinLength(2)
  clientName: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  clientEmail: string;

  @ApiProperty({ example: 'Oil portrait of family, 24x36 inches' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiPropertyOptional({ example: 'https://example.com/reference.jpg' })
  @IsOptional()
  @IsUrl()
  referenceUrl?: string;
}
