import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { QuotationStatus } from '../entities/quotation.entity';

export class ReviewQuotationDto {
  @IsEnum(QuotationStatus)
  status: QuotationStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  finalPrice?: number;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
