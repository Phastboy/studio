
'use client';

import { useState, useEffect } from 'react';
import { useShopData } from '@/hooks/useShopData';
import { ShopForm, type ShopFormValues } from '@/components/shop/ShopForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit3, Trash2, Store, AlertTriangle, Loader2 } from 'lucide-react';
import type { Shop } from '@/types/shop';

export default function AdminShopsPage() {
  const { shops, addShop, updateShop, deleteShop, isLoading: isLoadingShops } = useShopData();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | undefined>(undefined);

  const handleFormSubmit = (data: ShopFormValues) => {
    try {
      if (editingShop) {
        updateShop({ ...editingShop, ...data });
        toast({ title: 'Shop Updated', description: `"${data.name}" has been successfully updated.` });
      } else {
        addShop(data);
        toast({ title: 'Shop Created', description: `"${data.name}" has been successfully created.` });
      }
      setIsFormOpen(false);
      setEditingShop(undefined);
    } catch (error) {
      console.error("Failed to save shop:", error);
      toast({ title: 'Error', description: 'Failed to save shop. Please try again.', variant: 'destructive' });
    }
  };

  const openEditForm = (shop: Shop) => {
    setEditingShop(shop);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingShop(undefined);
    setIsFormOpen(true);
  };

  const handleDeleteShop = (shopId: string, shopName: string) => {
    // Consider adding a check for products associated with this shop before deleting
    if (confirm(`Are you sure you want to delete "${shopName}"? This cannot be undone.`)) {
      deleteShop(shopId);
      toast({ title: 'Shop Deleted', description: `"${shopName}" has been deleted.`, variant: 'destructive' });
    }
  };
  
  if (isLoadingShops) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(spacing.16))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading shops...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Store className="mr-3 h-8 w-8 text-primary" /> Shop Management
          </h1>
          <DialogTrigger asChild>
            <Button onClick={openCreateForm}>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Shop
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingShop ? 'Edit Shop' : 'Add New Shop'}</DialogTitle>
          </DialogHeader>
          <ShopForm
            onSubmit={handleFormSubmit}
            initialData={editingShop}
          />
        </DialogContent>
      </Dialog>

      {shops.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>All Shops</CardTitle>
            <CardDescription>View, edit, or delete shops.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Owner ID (Placeholder)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shops.map((shop) => (
                  <TableRow key={shop.id}>
                    <TableCell className="font-medium">{shop.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate max-w-xs">{shop.description}</TableCell>
                    <TableCell>{shop.ownerId}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditForm(shop)} className="mr-2">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteShop(shop.id, shop.name)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
         <Card className="text-center py-12">
           <CardContent>
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground">No Shops Found</h2>
            <p className="text-muted-foreground mt-2 mb-6">
              Create your first shop to start assigning products to it!
            </p>
            <DialogTrigger asChild>
              <Button onClick={openCreateForm}>
                <PlusCircle className="mr-2 h-5 w-5" /> Add Shop
              </Button>
            </DialogTrigger>
           </CardContent>
         </Card>
      )}
    </div>
  );
}
