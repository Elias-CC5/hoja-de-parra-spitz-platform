import { IsDateString, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @MinLength(5)
  deliveryAddress!: string;

  @IsDateString()
  eventDate!: string;

  @IsInt()
  @Min(1)
  numberOfPeople!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
