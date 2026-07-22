import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductImage } from '../entities/product-image.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { QueryProductsDto } from '../dto/query-products.dto';
import { slugify } from '../../utils/slugify';
import { CloudinaryService, UploadedImage } from '../../uploads/services/cloudinary.service';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const slug = slugify(dto.name);

    const existing = await this.productsRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException('Ya existe un producto con un nombre similar');
    }

    const product = this.productsRepository.create({ ...dto, slug });
    return this.productsRepository.save(product);
  }

  async findAll(query: QueryProductsDto): Promise<PaginatedResult<Product>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 12;

    const qb = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.isAvailable = :isAvailable', { isAvailable: true });

    if (query.search) {
      qb.andWhere('product.name ILIKE :search', { search: `%${query.search}%` });
    }
    if (query.categoryId) {
      qb.andWhere('product.categoryId = :categoryId', { categoryId: query.categoryId });
    }
    if (query.type) {
      qb.andWhere('product.type = :type', { type: query.type });
    }

    switch (query.sortBy) {
      case 'price_asc':
        qb.orderBy('product.price', 'ASC');
        break;
      case 'price_desc':
        qb.orderBy('product.price', 'DESC');
        break;
      case 'featured':
        qb.orderBy('product.isFeatured', 'DESC').addOrderBy('product.createdAt', 'DESC');
        break;
      default:
        qb.orderBy('product.createdAt', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findFeatured(limit = 8): Promise<Product[]> {
    return this.productsRepository.find({
      where: { isFeatured: true, isAvailable: true },
      relations: { images: true },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { images: true },
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { slug },
      relations: { images: true },
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product;
  }

  async findRelated(productId: string, limit = 4): Promise<Product[]> {
    const product = await this.findById(productId);
    return this.productsRepository.find({
      where: { categoryId: product.categoryId, isAvailable: true },
      relations: { images: true },
      take: limit + 1,
    }).then((products) => products.filter((p) => p.id !== productId).slice(0, limit));
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findById(id);

    if (dto.name && dto.name !== product.name) {
      product.slug = slugify(dto.name);
    }

    Object.assign(product, dto);
    return this.productsRepository.save(product);
  }

  async addImage(
    productId: string,
    fileBuffer: Buffer,
    displayOrder = 0,
  ): Promise<ProductImage> {
    await this.findById(productId); // valida existencia

    const uploaded: UploadedImage = await this.cloudinaryService.uploadImage(
      fileBuffer,
      'hoja-de-parra-spitz/products',
    );

    const image = this.productImagesRepository.create({
      url: uploaded.url,
      publicId: uploaded.publicId,
      displayOrder,
      productId,
    });

    return this.productImagesRepository.save(image);
  }

  async removeImage(imageId: string): Promise<void> {
    const image = await this.productImagesRepository.findOne({ where: { id: imageId } });
    if (!image) {
      throw new NotFoundException('Imagen no encontrada');
    }
    await this.cloudinaryService.deleteImage(image.publicId);
    await this.productImagesRepository.remove(image);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findById(id);
    await this.productsRepository.softRemove(product);
  }
}
