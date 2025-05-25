
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CalendarDays, CalendarPlus, CalendarCheck, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/events', label: 'Events', icon: CalendarDays },
  { href: '/create', label: 'Create', icon: CalendarPlus },
  { href: '/calendar', label: 'Calendar', icon: CalendarCheck },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-background shadow-t-lg">
      <div className="flex justify-around items-stretch h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 p-1 text-xs hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground transition-colors group rounded-md',
                isActive ? 'text-primary font-medium' : 'text-muted-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5 mb-0.5', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-accent-foreground')} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
