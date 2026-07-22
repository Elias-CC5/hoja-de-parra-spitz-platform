import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QuotationsService } from '../services/quotations.service';
import { CreateQuotationDto } from '../dto/create-quotation.dto';
import { ReviewQuotationDto } from '../dto/review-quotation.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../common/constants/role.enum';

@ApiTags('Quotations')
@ApiBearerAuth()
@Controller('quotations')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateQuotationDto) {
    return this.quotationsService.create(user.id, dto);
  }

  @Get('my-quotations')
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.quotationsService.findByUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotationsService.findById(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLEADO)
  @Get()
  findAll() {
    return this.quotationsService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLEADO)
  @Patch(':id/review')
  review(@Param('id') id: string, @Body() dto: ReviewQuotationDto) {
    return this.quotationsService.review(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLEADO)
  @Post(':id/convert-to-order')
  convertToOrder(@Param('id') id: string) {
    return this.quotationsService.convertToOrder(id);
  }
}
