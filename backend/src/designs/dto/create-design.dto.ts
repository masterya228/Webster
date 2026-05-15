import { IsString, IsNumber, IsBoolean, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDesignDto {
  @ApiProperty({ example: 'My Instagram Post' })
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  width?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  canvasData?: object;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
