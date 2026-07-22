import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ServicesCatalogService } from '../services/services-catalog.service';
import { CreateCateringServiceDto } from '../dto/create-catering-service.dto';
import { UpdateCateringServiceDto } from '../dto/update-catering-service.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../common/constants/role.enum';

@ApiTags('Services Catalog')
@Controller('services-catalog')
export class ServicesCatalogController {
  constructor(private readonly servicesCatalogService: ServicesCatalogService) {}

  @Public()
  @Get()
  findAll(@Query('onlyActive') onlyActive?: string) {
    return this.servicesCatalogService.findAll(onlyActive === 'true');
  }

  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.servicesCatalogService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesCatalogService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLEADO)
  @Post()
  create(@Body() dto: CreateCateringServiceDto) {
    return this.servicesCatalogService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLEADO)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCateringServiceDto) {
    return this.servicesCatalogService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesCatalogService.remove(id);
  }
}
