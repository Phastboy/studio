import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  CalendarDays, CalendarPlus, CalendarCheck, Home, Settings, Sparkles, MessageSquare,
  ShoppingBag, ShoppingCart, Package, ClipboardList, Users 
} from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { AuthButton } from '@/components/auth/AuthButton'; // <-- Import AuthButton

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const mainNavItems: NavItem[] = [
  { href: '/', label: 'Home Feed', icon: Home },
  { href: '/events', label: 'All Events', icon: CalendarDays },
  { href: '/create', label: 'Create Event', icon: CalendarPlus },
  { href: '/calendar', label: 'My Calendar', icon: CalendarCheck },
];

const shopNavItems: NavItem[] = [
  { href: '/shop', label: 'Shop', icon: ShoppingBag },
  { href: '/cart', label: 'My Cart', icon: ShoppingCart },
];

const adminNavItems: NavItem[] = [
  { href: '/admin/products', label: 'Inventory', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
  // { href: '/admin/users', label: 'Users', icon: Users }, // Example for future
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-sidebar-primary" />
            <h1 className="text-2xl font-semibold text-sidebar-foreground">Eventide</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Link href={item.href} className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          
          <SidebarSeparator className="my-4" />
          
          <SidebarMenu>
             <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/70 px-2">Shop</SidebarGroupLabel>
            {shopNavItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                 <SidebarMenuButton asChild className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Link href={item.href} className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          <SidebarSeparator className="my-4" />

          <SidebarMenu>
            <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/70 px-2">Admin</SidebarGroupLabel>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                 <SidebarMenuButton asChild className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Link href={item.href} className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border">
          {/* Optional: Footer content like settings or user profile */}
          {/* <Button variant="ghost" className="justify-start w-full">
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button> */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2"> {/* Group trigger and potential title */}
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            {/* Placeholder for potential breadcrumbs or page title can go here */}
          </div>
          <AuthButton /> {/* <-- Add AuthButton to the right */}
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}