import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CateringService } from '../entities/catering-service.entity';
import { ServiceFaq } from '../entities/service-faq.entity';
import { CreateCateringServiceDto } from '../dto/create-catering-service.dto';
import { UpdateCateringServiceDto } from '../dto/update-catering-service.dto';
import { slugify } from '../../utils/slugify';

@Injectable()
export class ServicesCatalogService {
  constructor(
    @InjectRepository(CateringService)
    private readonly servicesRepository: Repository<CateringService>,
    @InjectRepository(ServiceFaq)
    private readonly faqsRepository: Repository<ServiceFaq>,
  ) {}

  async create(dto: CreateCateringServiceDto): Promise<CateringService> {
    const slug = slugify(dto.name);

    const existing = await this.servicesRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException('Ya existe un servicio con un nombre similar');
    }

    const service = this.servicesRepository.create({ ...dto, slug });
    return this.servicesRepository.save(service);
  }

  async findAll(onlyActive = false): Promise<CateringService[]> {
    return this.servicesRepository.find({
      where: onlyActive ? { isActive: true } : {},
      relations: { faqs: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<CateringService> {
    const service = await this.servicesRepository.findOne({
      where: { id },
      relations: { faqs: true },
    });
    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }
    return service;
  }

  async findBySlug(slug: string): Promise<CateringService> {
    const service = await this.servicesRepository.findOne({
      where: { slug },
      relations: { faqs: true },
    });
    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }
    return service;
  }

  async update(id: string, dto: UpdateCateringServiceDto): Promise<CateringService> {
    const service = await this.findById(id);

    if (dto.name && dto.name !== service.name) {
      service.slug = slugify(dto.name);
    }

    const { faqs, ...rest } = dto;
    Object.assign(service, rest);
    const saved = await this.servicesRepository.save(service);

    if (faqs) {
      await this.faqsRepository.delete({ serviceId: id });
      const newFaqs = faqs.map((faq) => this.faqsRepository.create({ ...faq, serviceId: id }));
      await this.faqsRepository.save(newFaqs);
    }

    return this.findById(saved.id);
  }

  async remove(id: string): Promise<void> {
    const service = await this.findById(id);
    await this.servicesRepository.softRemove(service);
  }
}
