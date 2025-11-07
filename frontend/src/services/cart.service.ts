import api from './api';
import type { Cart } from '../types';
import type { ApiResponse } from '../types';

export const cartService = {
  getCart: async (): Promise<ApiResponse<{ cart: Cart }>> => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (productId: number, quantity: number): Promise<ApiResponse<{ cart: Cart }>> => {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  },

  updateCartItem: async (
    cartItemId: number,
    quantity: number
  ): Promise<ApiResponse<{ cart: Cart }>> => {
    const response = await api.put(`/cart/${cartItemId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (cartItemId: number): Promise<ApiResponse<{ cart: Cart }>> => {
    const response = await api.delete(`/cart/${cartItemId}`);
    return response.data;
  },

  clearCart: async (): Promise<ApiResponse<void>> => {
    const response = await api.delete('/cart');
    return response.data;
  },
};
