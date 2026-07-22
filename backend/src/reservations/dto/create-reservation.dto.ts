import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { EventType } from '../../services-catalog/entities/catering-service.entity';

export class CreateReservationDto {
  @IsDateString()
  eventDate: string;

  @IsString()
  eventTime: string;

  @IsInt()
  @Min(1)
  numberOfPeople: number;

  @IsEnum(EventType)
  eventType: EventType;

  @IsString()
  @MinLength(5)
  address: string;

  @IsOptional()
  @IsString()
  comments?: string;
}
