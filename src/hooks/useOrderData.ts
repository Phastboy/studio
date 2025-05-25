
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Order, OrderStatus } from '@/types/order';
import {
  getOrdersFromStorage,
  addOrderToStorage,
  updateOrderInStorage,
} from '@/lib/orderStore';

export function useOrderData() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setOrders(getOrdersFromStorage());
    setIsLoading(false);
  }, []);

  const addOrder = useCallback((newOrderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const orderWithId: Order = {
      ...newOrderData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      status: 'Pending', // Default status
    };
    const updatedOrders = addOrderToStorage(orderWithId);
    setOrders(updatedOrders);
    return orderWithId;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    const orderToUpdate = orders.find(o => o.id === orderId);
    if (orderToUpdate) {
      const updatedOrder = { ...orderToUpdate, status };
      const updatedOrders = updateOrderInStorage(updatedOrder);
      setOrders(updatedOrders);
    }
  }, [orders]);
  
  const getOrderById = useCallback((orderId: string): Order | undefined => {
    return orders.find(o => o.id === orderId);
  }, [orders]);

  return {
    orders,
    addOrder,
    updateOrderStatus,
    getOrderById,
    isLoading,
  };
}
