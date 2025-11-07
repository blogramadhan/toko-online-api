import api from './api';
import type { Product } from '../types';
import type { ApiResponse } from '../types';

export const productService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse<{ products: Product[]; pagination: unknown }>> => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<{ product: Product }>> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (data: Partial<Product>): Promise<ApiResponse<{ product: Product }>> => {
    const response = await api.post('/products', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Product>): Promise<ApiResponse<{ product: Product }>> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
