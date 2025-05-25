
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Shop } from '@/types/shop';
import {
  getShopsFromStorage,
  addShopToStorage,
  updateShopInStorage,
  deleteShopFromStorage,
} from '@/lib/shopStore';

export function useShopData() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setShops(getShopsFromStorage());
    setIsLoading(false);
  }, []);

  const addShop = useCallback((newShopData: Omit<Shop, 'id' | 'createdAt'>) => {
    const shopWithId: Shop = {
      ...newShopData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    const updatedShops = addShopToStorage(shopWithId);
    setShops(updatedShops);
    return shopWithId;
  }, []);

  const updateShop = useCallback((updatedShop: Shop) => {
    const updatedShops = updateShopInStorage(updatedShop);
    setShops(updatedShops);
  }, []);

  const deleteShop = useCallback((shopId: string) => {
    const updatedShops = deleteShopFromStorage(shopId);
    setShops(updatedShops);
  }, []);

  const getShopById = useCallback((shopId: string): Shop | undefined => {
    return shops.find(s => s.id === shopId);
  }, [shops]);


  return {
    shops,
    addShop,
    updateShop,
    deleteShop,
    getShopById,
    isLoading,
  };
}
