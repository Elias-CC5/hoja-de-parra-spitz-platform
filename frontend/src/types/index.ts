// Tipos globales compartidos entre features. Reflejan las entidades del backend (NestJS).

export enum Role {
  ADMIN = "admin",
  EMPLEADO = "empleado",
  CLIENTE = "cliente",
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  isActive: boolean;
}

export enum CategoryType {
  PRODUCTO = "producto",
  SERVICIO = "servicio",
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  type: CategoryType;
  displayOrder: number;
  isActive: boolean;
}

export enum ProductType {
  PLATO = "plato",
  COMBO = "combo",
  PAQUETE_CORPORATIVO = "paquete_corporativo",
  COFFEE_BREAK = "coffee_break",
  BUFFET = "buffet",
  BOX_LUNCH = "box_lunch",
  POSTRE = "postre",
  BEBIDA = "bebida",
}

export interface ProductImage {
  id: string;
  url: string;
  displayOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: ProductType;
  price: number;
  minPeoplePerOrder: number;
  maxPeoplePerOrder?: number;
  isAvailable: boolean;
  isFeatured: boolean;
  stock: number;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  createdAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export enum EventType {
  MATRIMONIO = "matrimonio",
  CUMPLEANOS = "cumpleanos",
  EMPRESARIAL = "empresarial",
  CONFERENCIA = "conferencia",
  COFFEE_BREAK = "coffee_break",
  ANIVERSARIO = "aniversario",
  GRADUACION = "graduacion",
  EVENTO_PRIVADO = "evento_privado",
}

export interface ServiceFaq {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
}

export interface CateringService {
  id: string;
  name: string;
  slug: string;
  description: string;
  eventType: EventType;
  referencePrice?: number;
  galleryUrls?: string[];
  isActive: boolean;
  faqs: ServiceFaq[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export interface CartSummary {
  cart: Cart;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export enum OrderStatus {
  PENDIENTE_PAGO = "pendiente_pago",
  PAGADO = "pagado",
  EN_PREPARACION = "en_preparacion",
  EN_CAMINO = "en_camino",
  ENTREGADO = "entregado",
  CANCELADO = "cancelado",
}

export interface OrderItem {
  id: string;
  productId: string;
  productNameSnapshot: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  deliveryAddress: string;
  eventDate: string;
  numberOfPeople: number;
  notes?: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
}

export enum QuotationStatus {
  PENDIENTE = "pendiente",
  APROBADA = "aprobada",
  RECHAZADA = "rechazada",
  CONVERTIDA_A_PEDIDO = "convertida_a_pedido",
}

export interface Quotation {
  id: string;
  eventType: EventType;
  eventDate: string;
  eventTime: string;
  location: string;
  numberOfGuests: number;
  estimatedBudget?: number;
  additionalServices?: string;
  comments?: string;
  status: QuotationStatus;
  finalPrice?: number;
  adminNotes?: string;
  createdAt: string;
}

export enum ReservationStatus {
  PENDIENTE = "pendiente",
  CONFIRMADA = "confirmada",
  CANCELADA = "cancelada",
  COMPLETADA = "completada",
}

export interface Reservation {
  id: string;
  eventDate: string;
  eventTime: string;
  numberOfPeople: number;
  eventType: EventType;
  address: string;
  comments?: string;
  status: ReservationStatus;
}

export interface Review {
  id: string;
  userId: string;
  user?: { fullName: string };
  productId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}
