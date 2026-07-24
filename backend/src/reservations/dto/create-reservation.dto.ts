import { IsString, IsNotEmpty, IsInt, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  eventType!: string;

  @IsDateString()
  eventDate!: string;

  @IsString()
  eventTime!: string;

  @Type(() => Number) 
  @IsInt()
  numberOfPeople!: number;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsOptional()
  @IsString()
  comments?: string;
}