import { IsString, IsNotEmpty, IsOptional, IsEmail, IsIn } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  organization?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Faible', 'Moyenne', 'Haute', 'Critique'])
  priority: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  domain?: string;
}

export class AddMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
