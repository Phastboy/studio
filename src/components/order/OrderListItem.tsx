
'use client';

import type { Order, OrderStatus, OrderItem } from '@/types/order';
import { ALL_ORDER_STATUSES } from '@/types/order'; // Ensure this is exported
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { PackageCheck, PackageX, ShoppingCart, User, Tag, DollarSign, CalendarDays, Edit } from 'lucide-react';

interface OrderListItemProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export function OrderListItem({ order, onUpdateStatus }: OrderListItemProps) {
  const handleStatusChange = (newStatus: string) => {
    onUpdateStatus(order.id, newStatus as OrderStatus);
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
      case 'Shipped':
        return <PackageCheck className="h-5 w-5 text-green-500" />;
      case 'Cancelled':
        return <PackageX className="h-5 w-5 text-red-500" />;
      default:
        return <ShoppingCart className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const createdDate = format(new Date(order.createdAt), 'MMM d, yyyy HH:mm');

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl">Order ID: {order.id.substring(0, 8)}...</CardTitle>
                <CardDescription className="flex items-center text-sm">
                    <User className="mr-1.5 h-4 w-4" /> {order.customerName}
                </CardDescription>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                {getStatusIcon(order.status)}
                <span className="font-medium">{order.status}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="font-semibold text-sm mb-1">Items:</h4>
          <ul className="list-disc list-inside pl-1 space-y-0.5 text-sm text-muted-foreground">
            {order.items.map((item, index) => (
              <li key={index}>
                {item.productName} (x{item.quantity}) - ${item.priceAtPurchase.toFixed(2)} each
              </li>
            ))}
          </ul>
        </div>
         <div className="flex items-center text-sm">
            <DollarSign className="mr-1.5 h-4 w-4 text-primary" />
            <span className="font-semibold">Total: ${order.totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
            <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
            Placed on: {createdDate}
        </div>
         {order.shippingAddress && (
          <p className="text-xs text-muted-foreground">
            Shipping to: {order.shippingAddress}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-4 border-t">
        <div className="flex items-center gap-2">
            <Edit className="h-4 w-4 text-muted-foreground"/>
            <span className="text-sm font-medium">Update Status:</span>
        </div>
        <Select value={order.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Change status" />
          </SelectTrigger>
          <SelectContent>
            {ALL_ORDER_STATUSES.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  );
}

