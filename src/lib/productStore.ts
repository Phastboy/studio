
import type { Product } from '@/types/product';

const PRODUCTS_STORAGE_KEY = 'eventide_products';

export const getProductsFromStorage = (): Product[] => {
  if (typeof window === 'undefined') return [];
  const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  try {
    return storedProducts ? JSON.parse(storedProducts) : [];
  } catch (e) {
    console.error("Failed to parse products from storage", e);
    return [];
  }
};

export const saveProductsToStorage = (products: Product[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
};

export const addProductToStorage = (product: Product): Product[] => {
  const products = getProductsFromStorage();
  const updatedProducts = [product, ...products].sort((a,b) => b.createdAt - a.createdAt);
  saveProductsToStorage(updatedProducts);
  return updatedProducts;
};

export const updateProductInStorage = (updatedProduct: Product): Product[] => {
  let products = getProductsFromStorage();
  products = products.map(product => product.id === updatedProduct.id ? updatedProduct : product);
  saveProductsToStorage(products);
  return products;
};

export const deleteProductFromStorage = (productId: string): Product[] => {
  let products = getProductsFromStorage();
  products = products.filter(product => product.id !== productId);
  saveProductsToStorage(products);
  return products;
};

// Helper to update stock, typically called when an order is placed
export const updateStockForProductInStorage = (productId: string, quantityChange: number): Product | null => {
  const products = getProductsFromStorage();
  let updatedProduct: Product | null = null;
  const updatedProducts = products.map(p => {
    if (p.id === productId) {
      updatedProduct = { ...p, stockQuantity: p.stockQuantity - quantityChange };
      return updatedProduct;
    }
    return p;
  });
  if (updatedProduct) {
    saveProductsToStorage(updatedProducts);
  }
  return updatedProduct;
};
