import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from '../entities/product-image.entity';
import { Category } from '../../categories/entities/category.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { QueryProductsDto } from '../dto/query-products.dto';
import { slugify } from '../../utils/slugify';
import { CloudinaryService, UploadedImage } from '../../uploads/services/cloudinary.service';
import { Product, ProductType } from '../entities/product.entity';

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
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const slug = slugify(dto.name);

    const existing = await this.productsRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException('Ya existe un producto con un nombre similar');
    }

    const { category, images, ...productData } = dto;

    let categoryId: string | undefined = undefined;

    if (category) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category);

      if (isUuid) {
        categoryId = category;
      } else {
        const foundCategory = await this.categoriesRepository.findOne({
          where: [{ slug: category }, { name: category }],
        });
        if (foundCategory) {
          categoryId = foundCategory.id;
        }
      }
    }

    // 💡 FALLBACK DE SEGURIDAD PARA CATEGORY_ID:
    if (!categoryId) {
      const firstCategory = await this.categoriesRepository.findOne({ where: {} });
      if (!firstCategory) {
        throw new NotFoundException('Debes crear al menos una categoría antes de agregar productos.');
      }
      categoryId = firstCategory.id;
    }

    // Validación de Enum
    const allowedTypes = Object.values(ProductType) as string[];
    const inputType = dto.type ? dto.type.toLowerCase() : '';
    const finalType: ProductType = allowedTypes.includes(inputType)
      ? (inputType as ProductType)
      : ProductType.PLATO;

    const product = this.productsRepository.create({
      ...productData,
      type: finalType,
      slug,
      categoryId,
    } as unknown as Partial<Product>);

    const savedProduct = (await this.productsRepository.save(product)) as unknown as Product;

    // Insertar imágenes si existen
    if (images && images.length > 0) {
      const imageEntities = images.map((img, index) =>
        this.productImagesRepository.create({
          url: img.url,
          publicId: (img as any).publicId || null,
          displayOrder: index,
          productId: savedProduct.id,
        }),
      );
      await this.productImagesRepository.save(imageEntities);
    }

    return this.findById(savedProduct.id);
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

    // Actualizar slug si cambia el nombre
    if (dto.name && dto.name !== product.name) {
      product.slug = slugify(dto.name);
    }

    const { category, images, ...updateData } = dto as any;

    // Manejo de categoría si viene en la actualización
    if (category) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category);
      if (isUuid) {
        product.categoryId = category;
      } else {
        const foundCat = await this.categoriesRepository.findOne({
          where: [{ slug: category }, { name: category }],
        });
        if (foundCat) {
          product.categoryId = foundCat.id;
        }
      }
    }

    // Copiar resto de propiedades
    Object.assign(product, updateData);
    await this.productsRepository.save(product);

    // Manejo y reemplazo de imágenes si vienen en la actualización
    if (images && Array.isArray(images)) {
      // Eliminar imágenes antiguas asociadas a este producto
      await this.productImagesRepository.delete({ productId: product.id });

      // Insertar nuevas imágenes
      if (images.length > 0) {
        const imageEntities = images.map((img: any, index: number) =>
          this.productImagesRepository.create({
            url: img.url,
            publicId: img.publicId || null,
            displayOrder: index,
            productId: product.id,
          }),
        );
        await this.productImagesRepository.save(imageEntities);
      }
    }

    return this.findById(product.id);
  }

  async addImage(
    productId: string,
    fileBuffer: Buffer,
    displayOrder = 0,
  ): Promise<ProductImage> {
    await this.findById(productId);

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
    if (image.publicId) {
      await this.cloudinaryService.deleteImage(image.publicId);
    }
    await this.productImagesRepository.remove(image);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findById(id);
    await this.productsRepository.softRemove(product);
  }
}