/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useCallback, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Cart } from '../types';
import { cartService } from '../services/cart.service';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from './CartContext';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const user = authContext?.user || null;

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await cartService.getCart();
      if (response.success && response.data) {
        setCart(response.data.cart);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToCart = async (productId: number, quantity: number) => {
    try {
      setLoading(true);
      const response = await cartService.addToCart(productId, quantity);
      if (response.success && response.data) {
        setCart(response.data.cart);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (cartItemId: number, quantity: number) => {
    try {
      setLoading(true);
      const response = await cartService.updateCartItem(cartItemId, quantity);
      if (response.success && response.data) {
        setCart(response.data.cart);
      }
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      setLoading(true);
      const response = await cartService.removeFromCart(cartItemId);
      if (response.success && response.data) {
        setCart(response.data.cart);
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartService.clearCart();
      setCart(null);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user, fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        cartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};