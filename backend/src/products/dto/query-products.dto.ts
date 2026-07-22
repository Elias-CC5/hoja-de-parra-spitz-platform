import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { ProductType } from '../entities/product.entity';

export class QueryProductsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @IsOptional()
  @IsIn(['price_asc', 'price_desc', 'newest', 'featured'])
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'featured';

  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 12;
}
