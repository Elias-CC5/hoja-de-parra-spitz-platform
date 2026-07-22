import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { CreateReviewDto } from '../dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
  ) {}

  async create(userId: string, dto: CreateReviewDto): Promise<Review> {
    const existing = await this.reviewsRepository.findOne({
      where: { userId, productId: dto.productId },
    });
    if (existing) {
      throw new ConflictException('Ya reseñaste este producto');
    }

    const review = this.reviewsRepository.create({ ...dto, userId });
    return this.reviewsRepository.save(review);
  }

  async findByProduct(productId: string): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { productId, isVisible: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getAverageRating(productId: string): Promise<{ average: number; count: number }> {
    const result = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.productId = :productId', { productId })
      .andWhere('review.isVisible = true')
      .getRawOne<{ average: string; count: string }>();

    return {
      average: result?.average ? Number(Number(result.average).toFixed(1)) : 0,
      count: result?.count ? Number(result.count) : 0,
    };
  }

  async toggleVisibility(id: string, isVisible: boolean): Promise<Review> {
    const review = await this.reviewsRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException('Reseña no encontrada');
    }
    review.isVisible = isVisible;
    return this.reviewsRepository.save(review);
  }

  async remove(id: string, userId: string): Promise<void> {
    const review = await this.reviewsRepository.findOne({ where: { id } });
    if (!review || review.userId !== userId) {
      throw new NotFoundException('Reseña no encontrada');
    }
    await this.reviewsRepository.remove(review);
  }
}
