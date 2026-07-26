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
              "relative flex flex-col items-center justify-center w-14 h-14 rounded-[1.5rem] transition-all duration-500",
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-primary/10 rounded-[1.5rem] -z-10"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              />
            )}
            <motion.div
              animate={{
                scale: isActive ? 1.15 : 1,
                y: isActive ? -2 : 0
              }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
            </motion.div>
            <motion.span 
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                y: isActive ? 0 : 4,
                scale: isActive ? 1 : 0.8
              }}
              className="text-[10px] font-black uppercase tracking-widest mt-1"
            >
              {item.label}
            </motion.span>
          </Link>
        );
      })}
    </nav>
  );
}