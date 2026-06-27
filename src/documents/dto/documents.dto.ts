import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  featured?: any;
}

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  featured?: any;
}
