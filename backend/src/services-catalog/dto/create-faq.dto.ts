import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @MinLength(5)
  question: string;

  @IsString()
  @MinLength(5)
  answer: string;

  @IsOptional()
  @IsInt()
  displayOrder?: number;
}
