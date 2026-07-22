import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { EventType } from '../../services-catalog/entities/catering-service.entity';

export class CreateQuotationDto {
  @IsEnum(EventType)
  eventType: EventType;

  @IsDateString()
  eventDate: string;

  @IsString()
  eventTime: string;

  @IsString()
  @MinLength(5)
  location: string;

  @IsInt()
  @Min(1)
  numberOfGuests: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedBudget?: number;

  @IsOptional()
  @IsString()
  additionalServices?: string;

  @IsOptional()
  @IsString()
  comments?: string;
}
