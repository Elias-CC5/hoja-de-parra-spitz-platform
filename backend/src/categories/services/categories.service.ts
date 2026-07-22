import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { slugify } from '../../utils/slugify';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const slug = slugify(dto.name);

    const existing = await this.categoriesRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException('Ya existe una categoría con un nombre similar');
    }

    const category = this.categoriesRepository.create({ ...dto, slug });
    return this.categoriesRepository.save(category);
  }

  async findAll(onlyActive = false): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: onlyActive ? { isActive: true } : {},
      order: { displayOrder: 'ASC' },
    });
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ where: { slug } });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findById(id);

    if (dto.name && dto.name !== category.name) {
      category.slug = slugify(dto.name);
    }

    Object.assign(category, dto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findById(id);
    await this.categoriesRepository.softRemove(category);
  }
}
