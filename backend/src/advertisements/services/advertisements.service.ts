import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Advertisement, AdvertisementPlacement } from '../entities/advertisement.entity';
import { CreateAdvertisementDto } from '../dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from '../dto/update-advertisement.dto';

@Injectable()
export class AdvertisementsService {
  constructor(
    @InjectRepository(Advertisement)
    private readonly adsRepository: Repository<Advertisement>,
  ) {}

  create(dto: CreateAdvertisementDto): Promise<Advertisement> {
    return this.adsRepository.save(this.adsRepository.create(dto));
  }

  findAll(): Promise<Advertisement[]> {
    return this.adsRepository.find({ order: { displayOrder: 'ASC' } });
  }

  /** Anuncios activos vigentes para una posición específica del sitio */
  async findActiveByPlacement(placement: AdvertisementPlacement): Promise<Advertisement[]> {
    const today = new Date().toISOString().slice(0, 10);
    return this.adsRepository
      .createQueryBuilder('ad')
      .where('ad.placement = :placement', { placement })
      .andWhere('ad.isActive = true')
      .andWhere('(ad.startsAt IS NULL OR ad.startsAt <= :today)', { today })
      .andWhere('(ad.endsAt IS NULL OR ad.endsAt >= :today)', { today })
      .orderBy('ad.displayOrder', 'ASC')
      .getMany();
  }

  async findById(id: string): Promise<Advertisement> {
    const ad = await this.adsRepository.findOne({ where: { id } });
    if (!ad) throw new NotFoundException('Anuncio no encontrado');
    return ad;
  }

  async update(id: string, dto: UpdateAdvertisementDto): Promise<Advertisement> {
    const ad = await this.findById(id);
    Object.assign(ad, dto);
    return this.adsRepository.save(ad);
  }

  async remove(id: string): Promise<void> {
    const ad = await this.findById(id);
    await this.adsRepository.softRemove(ad);
  }
}
