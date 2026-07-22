import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { CartSummary } from '../interfaces/cart-summary.interface';
import { ProductsService } from '../../products/services/products.service';
import {
  FLAT_SHIPPING_COST,
  FREE_SHIPPING_THRESHOLD,
  IGV_RATE,
} from '../../common/constants/pricing.constants';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemsRepository: Repository<CartItem>,
    private readonly productsService: ProductsService,
  ) {}

  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartsRepository.findOne({ where: { userId } });
    if (!cart) {
      cart = await this.cartsRepository.save(this.cartsRepository.create({ userId, items: [] }));
    }
    return cart;
  }

  async getSummary(userId: string): Promise<CartSummary> {
    const cart = await this.getOrCreateCart(userId);
    return this.buildSummary(cart);
  }

  async addItem(userId: string, dto: AddCartItemDto): Promise<CartSummary> {
    const cart = await this.getOrCreateCart(userId);
    const product = await this.productsService.findById(dto.productId);

    const existingItem = cart.items?.find((item) => item.productId === dto.productId);

    if (existingItem) {
      existingItem.quantity += dto.quantity;
      existingItem.notes = dto.notes ?? existingItem.notes;
      await this.cartItemsRepository.save(existingItem);
    } else {
      const newItem = this.cartItemsRepository.create({
        cartId: cart.id,
        productId: product.id,
        quantity: dto.quantity,
        unitPrice: product.price,
        notes: dto.notes,
      });
      await this.cartItemsRepository.save(newItem);
    }

    const updatedCart = await this.getOrCreateCart(userId);
    return this.buildSummary(updatedCart);
  }

  async updateItem(
    userId: string,
    itemId: string,
    dto: UpdateCartItemDto,
  ): Promise<CartSummary> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items?.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Ítem no encontrado en el carrito');
    }

    item.quantity = dto.quantity;
    await this.cartItemsRepository.save(item);

    const updatedCart = await this.getOrCreateCart(userId);
    return this.buildSummary(updatedCart);
  }

  async removeItem(userId: string, itemId: string): Promise<CartSummary> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items?.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Ítem no encontrado en el carrito');
    }

    await this.cartItemsRepository.remove(item);

    const updatedCart = await this.getOrCreateCart(userId);
    return this.buildSummary(updatedCart);
  }

  async clear(userId: string): Promise<CartSummary> {
    const cart = await this.getOrCreateCart(userId);
    if (cart.items?.length) {
      await this.cartItemsRepository.remove(cart.items);
    }
    const updatedCart = await this.getOrCreateCart(userId);
    return this.buildSummary(updatedCart);
  }

  private buildSummary(cart: Cart): CartSummary {
    const subtotal = (cart.items ?? []).reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0,
    );
    const tax = Number((subtotal * IGV_RATE).toFixed(2));
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING_COST;
    const total = Number((subtotal + tax + shipping).toFixed(2));

    return { cart, subtotal: Number(subtotal.toFixed(2)), tax, shipping, total };
  }
}
