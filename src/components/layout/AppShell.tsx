
import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { 
  CalendarDays, CalendarPlus, CalendarCheck, Home, Sparkles,
  UserCircle, MessageCircle 
} from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { BottomNavigation } from './BottomNavigation'; // Added BottomNavigation import

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
  { href: '/chat', label: 'Chat', icon: MessageCircle }, 
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

const shopNavItems: NavItem[] = [
  // E-commerce items are currently rolled back
];

const adminNavItems: NavItem[] = [
   // Admin items are currently rolled back
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

          {shopNavItems.length > 0 && <SidebarSeparator className="my-4" />}
          
          {shopNavItems.length > 0 && (
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
          )}

          {adminNavItems.length > 0 && <SidebarSeparator className="my-4" />}

          {adminNavItems.length > 0 && (
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
          )}

        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border">
          {/* Optional: Footer content like settings or user profile */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          </div>
        </header>
        {/* Adjusted padding: pb-20 for mobile (h-16 nav + some space), md:pb-6 for desktop */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
          {children}
        </main>
        <Toaster />
        <BottomNavigation /> {/* Added BottomNavigation */}
      </SidebarInset>
    </SidebarProvider>
  );
}
