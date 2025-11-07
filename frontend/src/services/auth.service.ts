import api from './api';
import type { AuthResponse } from '../types';
import type { User } from '../types';

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async (): Promise<{ success: boolean; data: { user: User } }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: {
    name?: string;
    phone?: string;
    address?: string;
  }): Promise<{ success: boolean; message: string; data: { user: User } }> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};
