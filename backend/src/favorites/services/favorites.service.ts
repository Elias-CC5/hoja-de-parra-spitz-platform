import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,
  ) {}

  async add(userId: string, productId: string): Promise<Favorite> {
    const existing = await this.favoritesRepository.findOne({ where: { userId, productId } });
    if (existing) {
      throw new ConflictException('El producto ya está en tus favoritos');
    }
    return this.favoritesRepository.save(this.favoritesRepository.create({ userId, productId }));
  }

  async findByUser(userId: string): Promise<Favorite[]> {
    return this.favoritesRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async remove(userId: string, productId: string): Promise<void> {
    const favorite = await this.favoritesRepository.findOne({ where: { userId, productId } });
    if (!favorite) {
      throw new NotFoundException('Este producto no está en tus favoritos');
    }
    await this.favoritesRepository.remove(favorite);
  }
}
