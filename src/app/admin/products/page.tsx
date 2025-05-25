
'use client';

import { useState, useMemo } from 'react';
import { useProductData } from '@/hooks/useProductData';
import { useShopData } from '@/hooks/useShopData'; // Import useShopData
import { ProductForm, type ProductFormValues } from '@/components/product/ProductForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit3, Trash2, Package, AlertTriangle, Loader2, Store } from 'lucide-react';
import Image from 'next/image';
import type { Product } from '@/types/product';

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, isLoading: isLoadingProducts } = useProductData();
  const { shops, isLoading: isLoadingShops, getShopById } = useShopData(); // Get shops for displaying names
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const handleFormSubmit = (data: ProductFormValues) => {
    try {
      if (editingProduct) {
        updateProduct({ ...editingProduct, ...data });
        toast({ title: 'Product Updated', description: `"${data.name}" has been successfully updated.` });
      } else {
        addProduct(data);
        toast({ title: 'Product Created', description: `"${data.name}" has been successfully created.` });
      }
      setIsFormOpen(false);
      setEditingProduct(undefined);
    } catch (error) {
      console.error("Failed to save product:", error);
      toast({ title: 'Error', description: String(error) || 'Failed to save product. Please try again.', variant: 'destructive' });
    }
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    if (shops.length === 0 && !isLoadingShops) {
       toast({
        title: 'No Shops Available',
        description: 'Please create a shop first before adding products.',
        variant: 'destructive',
      });
      return;
    }
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (confirm(`Are you sure you want to delete "${productName}"? This cannot be undone.`)) {
      deleteProduct(productId);
      toast({ title: 'Product Deleted', description: `"${productName}" has been deleted.`, variant: 'destructive' });
    }
  };
  
  const getShopName = (shopId: string) => {
    const shop = getShopById(shopId);
    return shop ? shop.name : 'Unknown Shop';
  };

  if (isLoadingProducts || isLoadingShops) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(spacing.16))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading inventory data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Package className="mr-3 h-8 w-8 text-primary" /> Inventory Management
          </h1>
          <DialogTrigger asChild>
            <Button onClick={openCreateForm} disabled={shops.length === 0 && !isLoadingShops}>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleFormSubmit}
            initialData={editingProduct}
          />
        </DialogContent>
      </Dialog>

      {shops.length === 0 && !isLoadingShops && products.length === 0 && (
         <Card className="text-center py-12">
           <CardContent>
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground">No Shops or Products Found</h2>
            <p className="text-muted-foreground mt-2 mb-6">
              Please create a shop first from 'Manage Shops' before adding products.
            </p>
            {/* Optional: Link to create shop page or open shop dialog */}
           </CardContent>
         </Card>
      )}

      {products.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
            <CardDescription>View, edit, or delete products in your inventory. Products are assigned to shops.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Shop</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Image
                        src={product.imageUrl || `https://placehold.co/60x60.png?text=${product.name.substring(0,2)}`}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="rounded object-cover aspect-square"
                        data-ai-hint="product merchandise"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Store className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                        {getShopName(product.shopId)}
                      </div>
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stockQuantity}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditForm(product)} className="mr-2">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id, product.name)} className="text-destructive hover:text-destructive">
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
        shops.length > 0 && ( // Only show this if there are shops but no products
           <Card className="text-center py-12">
             <CardContent>
              <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground">No Products Found</h2>
              <p className="text-muted-foreground mt-2 mb-6">
                Your inventory is empty. Add your first product to get started!
              </p>
              <DialogTrigger asChild>
                <Button onClick={openCreateForm}>
                  <PlusCircle className="mr-2 h-5 w-5" /> Add Product
                </Button>
              </DialogTrigger>
             </CardContent>
           </Card>
        )
      )}
    </div>
  );
}
