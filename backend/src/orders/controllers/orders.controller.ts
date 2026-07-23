import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../common/constants/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // 👈 1. IMPORTAR JWT GUARD

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // 👈 2. PROTEGER TODO EL CONTROLADOR CON JWT
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateOrderDto) {
    return this.ordersService.createFromCart(user.id, dto);
  }

  @Get('my-orders')
  findMyOrders(@CurrentUser() user: AuthenticatedUser) {
    return this.ordersService.findByUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLEADO)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLEADO)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}