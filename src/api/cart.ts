import { api } from './client';

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    category?: { id: number; name: string };
  };
  itemTotal: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface CartTotal {
  total: number;
}

export const cartApi = {
  getCart: () =>
    api.get<{ cart: Cart }>('/cart').then((res) => res.cart),

  addItem: (productId: number, quantity: number) =>
    api.post<{ cartItem: CartItem }>('/cart', { productId, quantity }).then((res) => res.cartItem),

  updateItem: (itemId: number, quantity: number) =>
    api.put<Cart>(`/cart/${itemId}`, { quantity }),

  removeItem: (itemId: number) =>
    api.del<void>(`/cart/${itemId}`),

  clearCart: () =>
    api.del<void>('/cart'),

  checkout: (selectedCartItemIds: number[]) =>
    api.post<{ message: string; order: { id: number; totalAmount: number } }>('/orders', { selectedCartItemIds }),

  getTotal: () =>
    api.get<CartTotal>('/cart/total'),
};
