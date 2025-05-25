
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types/product';
import {
  getProductsFromStorage,
  addProductToStorage,
  updateProductInStorage,
  deleteProductFromStorage,
  updateStockForProductInStorage,
} from '@/lib/productStore';

export function useProductData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setProducts(getProductsFromStorage());
    setIsLoading(false);
  }, []);

  const addProduct = useCallback((newProductData: Omit<Product, 'id' | 'createdAt'>) => {
    const productWithId: Product = {
      ...newProductData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    const updatedProducts = addProductToStorage(productWithId);
    setProducts(updatedProducts);
    return productWithId;
  }, []);

  const updateProduct = useCallback((updatedProduct: Product) => {
    const updatedProducts = updateProductInStorage(updatedProduct);
    setProducts(updatedProducts);
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    const updatedProducts = deleteProductFromStorage(productId);
    setProducts(updatedProducts);
  }, []);
  
  const getProductById = useCallback((productId: string): Product | undefined => {
    return products.find(p => p.id === productId);
  }, [products]);

  const updateStock = useCallback((productId: string, quantityChange: number) => {
    // quantityChange is positive if items are bought (stock decreases)
    const product = updateStockForProductInStorage(productId, quantityChange);
    if (product) {
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === productId ? product : p)
      );
    }
  }, []);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    updateStock,
    isLoading,
  };
}
