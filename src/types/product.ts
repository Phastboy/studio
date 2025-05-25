
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string; // Optional, use placeholder
  shopId: string; // Each product belongs to a shop
  createdAt: number;
}
