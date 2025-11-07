import { createContext } from 'react';
import type { Cart } from '../types';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartItemCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
