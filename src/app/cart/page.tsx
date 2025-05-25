
'use client';

import { useState, useMemo } from 'react';
import { useCart, type CartItemWithDetails } from '@/hooks/useCart';
import { useProductData } from '@/hooks/useProductData';
import { useOrderData } from '@/hooks/useOrderData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ShoppingCart, Trash2, PlusCircle, MinusCircle, AlertTriangle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items: cartItems, updateItemQuantity, removeItem, clearCart, isLoading: isLoadingCart } = useCart();
  const { products, isLoading: isLoadingProducts, updateStock } = useProductData();
  const { addOrder } = useOrderData();
  const { toast } = useToast();
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  // Form states for customer details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');


  const detailedCartItems = useMemo((): CartItemWithDetails[] => {
    return cartItems
      .map(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        if (!product) return null;
        return {
          ...cartItem,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          stockQuantity: product.stockQuantity,
        };
      })
      .filter((item): item is CartItemWithDetails => item !== null);
  }, [cartItems, products]);

  const cartTotal = useMemo(() => {
    return detailedCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [detailedCartItems]);

  const handleQuantityChange = (productId: string, newQuantity: number, stock: number) => {
    if (newQuantity > stock) {
        toast({
            title: "Stock Limit Reached",
            description: `Only ${stock} items available.`,
            variant: "destructive",
        });
        updateItemQuantity(productId, stock);
    } else if (newQuantity < 1) {
        removeItem(productId); // Or updateItemQuantity(productId, 1) if you don't want to remove
    } else {
        updateItemQuantity(productId, newQuantity);
    }
  };

  const handlePlaceOrder = async () => {
    if (detailedCartItems.length === 0) {
      toast({ title: 'Empty Cart', description: 'Your cart is empty.', variant: 'destructive' });
      return;
    }
    if (!customerName.trim() || !customerEmail.trim() || !shippingAddress.trim()) {
      toast({ title: 'Missing Information', description: 'Please fill in all customer and shipping details.', variant: 'destructive' });
      return;
    }

    setIsPlacingOrder(true);
    try {
      // Simulate stock check before order (though local storage makes this less robust than a real backend)
      for (const item of detailedCartItems) {
        if (item.quantity > item.stockQuantity) {
          toast({
            title: 'Stock Issue',
            description: `Not enough stock for ${item.name}. Available: ${item.stockQuantity}. Requested: ${item.quantity}`,
            variant: 'destructive',
          });
          setIsPlacingOrder(false);
          return;
        }
      }

      const orderItems = detailedCartItems.map(item => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        priceAtPurchase: item.price,
      }));

      addOrder({
        items: orderItems,
        totalAmount: cartTotal,
        customerName, 
        customerEmail,
        shippingAddress,
      });

      // Update stock for each product
      for (const item of orderItems) {
        updateStock(item.productId, item.quantity); // quantity here is how much stock to reduce
      }

      clearCart();
      toast({
        title: 'Order Placed!',
        description: 'Your order has been successfully placed.',
      });
      router.push('/shop'); // Redirect to shop or an order confirmation page
    } catch (error) {
      console.error("Failed to place order:", error);
      toast({ title: 'Order Failed', description: 'Could not place order. Please try again.', variant: 'destructive' });
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  if (isLoadingCart || isLoadingProducts) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(spacing.16))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <ShoppingCart className="mr-3 h-8 w-8 text-primary" /> Your Shopping Cart
        </h1>
      </div>

      {detailedCartItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground">Your Cart is Empty</h2>
            <p className="text-muted-foreground mt-2 mb-6">
              Looks like you haven't added any products yet.
            </p>
            <Button asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {detailedCartItems.map(item => (
              <Card key={item.productId} className="flex items-center p-4 gap-4 shadow-sm">
                <Image
                  src={item.imageUrl || `https://placehold.co/80x80.png?text=${item.name.substring(0,2)}`}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded object-cover aspect-square"
                  data-ai-hint="cart item"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                  <p className="text-xs text-muted-foreground">Stock: {item.stockQuantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.productId, item.quantity - 1, item.stockQuantity)} disabled={item.quantity <=1}>
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1, item.stockQuantity)}
                    className="w-16 text-center h-9"
                    min="1"
                    max={item.stockQuantity}
                  />
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.productId, item.quantity + 1, item.stockQuantity)} disabled={item.quantity >= item.stockQuantity}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.productId)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </Card>
            ))}
             <Button variant="outline" onClick={clearCart} className="mt-4 text-destructive border-destructive hover:bg-destructive/10">
                Clear Entire Cart
            </Button>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                  <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="John Doe" required/>
                </div>
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-muted-foreground mb-1">Email Address</label>
                  <Input id="customerEmail" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="john.doe@example.com" required/>
                </div>
                <div>
                  <label htmlFor="shippingAddress" className="block text-sm font-medium text-muted-foreground mb-1">Shipping Address</label>
                  <Textarea id="shippingAddress" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="123 Main St, Anytown, USA" required/>
                </div>

                <div className="flex justify-between items-center text-lg font-semibold pt-4 border-t">
                  <span>Total:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handlePlaceOrder} className="w-full" disabled={isPlacingOrder || detailedCartItems.length === 0}>
                  {isPlacingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Place Order
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

// Need to add Textarea to ui components if not already there. Assuming it exists.
// If Textarea is not in ui, need to add:
// import { Textarea } from "@/components/ui/textarea";
