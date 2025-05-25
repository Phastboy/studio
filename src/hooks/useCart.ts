
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CartItem } from '@/types/order'; // Reusing CartItem from order types
import type { Product } from '@/types/product'; // To get product details

const CART_STORAGE_KEY = 'eventide_cart';

export interface CartItemWithDetails extends CartItem {
  name: string;
  price: number;
  imageUrl?: string;
  stockQuantity: number;
}

const getCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  try {
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (e) {
    console.error("Failed to parse cart from storage", e);
    return [];
  }
};

const saveCartToStorage = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setItems(getCartFromStorage());
    setIsLoading(false);
  }, []);

  const addItem = useCallback((productId: string, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === productId);
      let newItems;
      if (existingItem) {
        newItems = prevItems.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prevItems, { productId, quantity }];
      }
      saveCartToStorage(newItems);
      return newItems;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prevItems => {
      const newItems = prevItems.filter(item => item.productId !== productId);
      saveCartToStorage(newItems);
      return newItems;
    });
  }, []);

  const updateItemQuantity = useCallback((productId: string, quantity: number) => {
    setItems(prevItems => {
      if (quantity <= 0) {
        const newItems = prevItems.filter(item => item.productId !== productId);
        saveCartToStorage(newItems);
        return newItems;
      }
      const newItems = prevItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      saveCartToStorage(newItems);
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const cartTotalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  // Note: Calculating total price requires product details, typically done in the component using the cart.
  // This hook focuses on managing item IDs and quantities.

  return {
    items,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    cartTotalQuantity,
    isLoading,
  };
}
