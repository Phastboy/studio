
export interface OrderItem {
  productId: string;
  productName: string; // Denormalized for display convenience
  quantity: number;
  priceAtPurchase: number; // Price per item at the time of order
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

// Ensure this array is exported for use in Select components
export const ALL_ORDER_STATUSES: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];


export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  customerName: string; // For simplicity, could be more complex user object later
  customerEmail?: string; // Optional
  shippingAddress?: string; // Optional
  createdAt: number;
}

// This type will be used by the useCart hook
export interface CartItem {
  productId: string;
  quantity: number;
  // Name, price, imageUrl will be fetched from product data for display
}
