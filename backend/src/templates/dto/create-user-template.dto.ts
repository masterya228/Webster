import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateUserTemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsObject()
  canvasData: object;

  @IsOptional()
  @IsString()
  thumbnail?: string;
}
