
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

export const updateStockForProductInStorage = (productId: string, quantityChange: number): Product | undefined => {
  const products = getProductsFromStorage();
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    console.error(`Product with ID ${productId} not found for stock update.`);
    return undefined;
  }

  const product = products[productIndex];
  const newStock = product.stockQuantity - quantityChange;

  if (newStock < 0) {
    console.warn(`Stock for product ${product.name} cannot go below zero. Stock unchanged.`);
    // Optionally throw an error or handle as per business logic
    return product; 
  }

  const updatedProduct = { ...product, stockQuantity: newStock };
  products[productIndex] = updatedProduct;
  saveProductsToStorage(products);
  return updatedProduct;
};
