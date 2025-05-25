
import type { Order } from '@/types/order';

const ORDERS_STORAGE_KEY = 'eventide_orders';

export const getOrdersFromStorage = (): Order[] => {
  if (typeof window === 'undefined') return [];
  const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
  try {
    return storedOrders ? JSON.parse(storedOrders) : [];
  } catch (e) {
    console.error("Failed to parse orders from storage", e);
    return [];
  }
};

export const saveOrdersToStorage = (orders: Order[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

export const addOrderToStorage = (order: Order): Order[] => {
  const orders = getOrdersFromStorage();
  const updatedOrders = [order, ...orders].sort((a,b) => b.createdAt - a.createdAt);
  saveOrdersToStorage(updatedOrders);
  return updatedOrders;
};

export const updateOrderInStorage = (updatedOrder: Order): Order[] => {
  let orders = getOrdersFromStorage();
  orders = orders.map(order => order.id === updatedOrder.id ? updatedOrder : order);
  saveOrdersToStorage(orders);
  return orders;
};

// Typically, orders are not deleted but cancelled.
// A delete function might be useful for admin cleanup if necessary.
export const deleteOrderFromStorage = (orderId: string): Order[] => {
  let orders = getOrdersFromStorage();
  orders = orders.filter(order => order.id !== orderId);
  saveOrdersToStorage(orders);
  return orders;
};
