import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from '../services/favorites.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

@ApiTags('Favorites')
@ApiBearerAuth()
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.favoritesService.findByUser(user.id);
  }

  @Post(':productId')
  add(@CurrentUser() user: AuthenticatedUser, @Param('productId') productId: string) {
    return this.favoritesService.add(user.id, productId);
  }

  @Delete(':productId')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('productId') productId: string) {
    return this.favoritesService.remove(user.id, productId);
  }
}
