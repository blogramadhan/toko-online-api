import api from './api';
import { Order, ApiResponse } from '../types';

export const orderService = {
  create: async (data: {
    shippingAddress: string;
    paymentMethod?: string;
  }): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<{ orders: Order[]; pagination: any }>> => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  cancel: async (id: number): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },
};
