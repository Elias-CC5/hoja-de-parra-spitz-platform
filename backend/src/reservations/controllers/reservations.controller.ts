import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReservationsService } from '../services/reservations.service';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { UpdateReservationStatusDto } from '../dto/update-reservation-status.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../common/constants/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // 👈 1. IMPORTAR JWT GUARD

@ApiTags('Reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // 👈 2. AGREGAR GUARD AQUÍ PARA PROTEGER LAS RUTAS DE USUARIO
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateReservationDto) {
    return this.reservationsService.create(user.id, dto);
  }

  @Get('my-reservations')
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.reservationsService.findByUser(user.id);
  }

  @Patch(':id/cancel')
  cancel(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.reservationsService.cancel(id, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findById(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLEADO)
  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLEADO)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateReservationStatusDto) {
    return this.reservationsService.updateStatus(id, dto.status);
  }
}