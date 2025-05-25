
'use client';

import { useProductData } from '@/hooks/useProductData';
import { useCart } from '@/hooks/useCart';
import { ShopProductCard } from '@/components/product/ShopProductCard';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingBag, ShoppingCart as CartIcon, AlertTriangle, Loader2 } from 'lucide-react';

export default function ShopPage() {
  const { products, isLoading: isLoadingProducts, getProductById } = useProductData();
  const { addItem, items: cartItems } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (productId: string) => {
    const product = getProductById(productId);
    if (!product) return;

    const cartItem = cartItems.find(item => item.productId === productId);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    if (product.stockQuantity <= quantityInCart) {
        toast({
            title: 'Out of Stock',
            description: `Cannot add more "${product.name}". All available stock is in your cart or already purchased.`,
            variant: 'destructive',
        });
        return;
    }

    addItem(productId, 1);
    toast({
      title: 'Added to Cart!',
      description: `"${product.name}" has been added to your cart.`,
    });
  };

  if (isLoadingProducts) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(spacing.16))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <ShoppingBag className="mr-3 h-8 w-8 text-primary" /> Eventide Shop
        </h1>
        <Button asChild variant="outline">
          <Link href="/cart">
            <CartIcon className="mr-2 h-5 w-5" /> View Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
          </Link>
        </Button>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => {
            const cartItem = cartItems.find(item => item.productId === product.id);
            const quantityInCart = cartItem ? cartItem.quantity : 0;
            const isEffectivelyOutOfStock = product.stockQuantity <= quantityInCart;
            return (
                <ShopProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isOutOfStock={isEffectivelyOutOfStock}
                />
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg shadow p-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground">Shop is Empty</h2>
          <p className="text-muted-foreground mt-2">
            There are no products available at the moment. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}

