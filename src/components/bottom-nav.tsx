'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PieChart, Calculator, Landmark, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/', icon: Home, label: 'home' },
    { href: '/seven-twelve-to-vigha', icon: PieChart, label: '7/12' },
    { href: '/calculator', icon: Calculator, label: 'calc' },
    { href: '/fd-calculator', icon: Landmark, label: 'fd' },
    { href: '/login', icon: User, label: 'profile' },
  ];

  return (
    <nav className="floating-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300",
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <motion.div
              animate={{
                scale: isActive ? 1.1 : 1,
                y: isActive ? -2 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="h-6 w-6 mb-0.5" />
            </motion.div>
            <motion.span 
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0.7,
                scale: isActive ? 1.05 : 1
              }}
              className="text-[10px] font-bold uppercase tracking-wider"
            >
              {item.label}
            </motion.span>
          </Link>
        );
      })}
    </nav>
  );
}