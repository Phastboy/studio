
import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarDays, CalendarPlus, CalendarCheck, Home, Settings, Sparkles, MessageSquare } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
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
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">Eventide</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                asChild
              >
                <Link href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2">
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </SidebarContent>
        <SidebarFooter className="p-4">
          {/* Optional: Footer content like settings or user profile */}
          {/* <Button variant="ghost" className="justify-start">
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button> */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <div className="flex-1">
            {/* Placeholder for potential breadcrumbs or page title */}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
