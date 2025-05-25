
import type { Shop } from '@/types/shop';

const SHOPS_STORAGE_KEY = 'eventide_shops';

export const getShopsFromStorage = (): Shop[] => {
  if (typeof window === 'undefined') return [];
  const storedShops = localStorage.getItem(SHOPS_STORAGE_KEY);
  try {
    return storedShops ? JSON.parse(storedShops) : [];
  } catch (e) {
    console.error("Failed to parse shops from storage", e);
    return [];
  }
};

export const saveShopsToStorage = (shops: Shop[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SHOPS_STORAGE_KEY, JSON.stringify(shops));
};

export const addShopToStorage = (shop: Shop): Shop[] => {
  const shops = getShopsFromStorage();
  const updatedShops = [shop, ...shops].sort((a,b) => b.createdAt - a.createdAt);
  saveShopsToStorage(updatedShops);
  return updatedShops;
};

export const updateShopInStorage = (updatedShop: Shop): Shop[] => {
  let shops = getShopsFromStorage();
  shops = shops.map(shop => shop.id === updatedShop.id ? updatedShop : shop);
  saveShopsToStorage(shops);
  return shops;
};

export const deleteShopFromStorage = (shopId: string): Shop[] => {
  let shops = getShopsFromStorage();
  shops = shops.filter(shop => shop.id !== shopId);
  saveShopsToStorage(shops);
  return shops;
};
