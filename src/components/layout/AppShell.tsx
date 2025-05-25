
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
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { 
  CalendarDays, CalendarPlus, CalendarCheck, Home, Sparkles
} from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

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

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-sidebar-primary" />
            {/* The h1 now has an ID for aria-labelledby in sidebar.tsx's SheetContent */}
            <h1 id="sidebar-title" className="text-2xl font-semibold text-sidebar-foreground">Eventide</h1>
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
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border">
          {/* Optional: Footer content like settings or user profile */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
