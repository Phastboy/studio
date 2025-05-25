
'use client';

import type { Product } from '@/types/product';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, DollarSign, Info, Layers } from 'lucide-react';
import Image from 'next/image';

interface ShopProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  isOutOfStock?: boolean;
}

export function ShopProductCard({ product, onAddToCart, isOutOfStock = false }: ShopProductCardProps) {
  const { name, description, price, stockQuantity, imageUrl, id } = product;

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative w-full h-60">
        <Image
          src={imageUrl || `https://placehold.co/400x400.png?text=${encodeURIComponent(name)}`}
          alt={name}
          layout="fill"
          objectFit="cover"
          data-ai-hint="product item"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-lg font-semibold bg-destructive p-2 rounded">Out of Stock</span>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{name}</CardTitle>
        <div className="flex items-center text-primary pt-1">
          <DollarSign className="mr-1 h-5 w-5" />
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Layers className="mr-1.5 h-4 w-4" />
          <span>Stock: {stockQuantity > 0 ? stockQuantity : 'Unavailable'}</span>
        </div>
        <CardDescription className="text-sm line-clamp-3">{description}</CardDescription>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          onClick={() => onAddToCart(id)} 
          className="w-full"
          disabled={isOutOfStock || stockQuantity <= 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isOutOfStock || stockQuantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
