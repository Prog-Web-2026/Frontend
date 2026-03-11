export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  DELIVERY = 'delivery',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  address?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl?: string;
  isActive: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  userId: number;
  deliveryId?: number;
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress?: string;
  deliveredAt?: string;
  estimatedDeliveryTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  customer?: User;
  deliveryPerson?: User;
  items?: OrderItem[];
  payment?: Payment;
  address?: OrderAddress;
  distance?: number;
  estimatedTime?: number;
}

export interface OrderAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  price?: number;
  product?: Product;
}

export interface Payment {
  id: number;
  orderId: number;
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: Pick<User, 'id' | 'name'>;
  product?: Pick<Product, 'id' | 'name'>;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface OrderStatsResponse {
  stats: {
    total: number;
    pending: number;
    confirmed: number;
    preparing: number;
    readyForPickup: number;
    outForDelivery: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
  };
}
