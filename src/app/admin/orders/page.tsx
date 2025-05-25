
'use client';

import { useOrderData } from '@/hooks/useOrderData';
import { OrderListItem } from '@/components/order/OrderListItem';
import type { OrderStatus } from '@/types/order';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';


export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, isLoading: isLoadingOrders } = useOrderData();
  const { toast } = useToast();

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    try {
      updateOrderStatus(orderId, newStatus);
      toast({
        title: 'Order Status Updated',
        description: `Order ${orderId.substring(0,8)} status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast({
        title: 'Error',
        description: 'Failed to update order status. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  if (isLoadingOrders) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(spacing.16))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <ClipboardList className="mr-3 h-8 w-8 text-primary" /> Order Management
        </h1>
        {/* Potential future actions like "Export Orders" could go here */}
      </div>

      {orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map(order => (
            <OrderListItem key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
           <CardContent>
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground">No Orders Found</h2>
            <p className="text-muted-foreground mt-2">
              There are no orders to display yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
