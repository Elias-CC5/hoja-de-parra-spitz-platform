import { PartialType } from '@nestjs/swagger';
import { CreateCateringServiceDto } from './create-catering-service.dto';

export class UpdateCateringServiceDto extends PartialType(CreateCateringServiceDto) {}
