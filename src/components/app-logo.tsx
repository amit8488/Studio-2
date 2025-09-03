import { cn } from "@/lib/utils";

export const AppLogo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(className)}
  >
    <rect width="16" height="20" x="4" y="2" rx="2" fill="currentColor" stroke="none" />
    <path d="M4 8h16" stroke="hsl(var(--primary))" strokeWidth="2" />
    <path d="M9 13h2" stroke="hsl(var(--primary))" />
    <path d="M9 17h2" stroke="hsl(var(--primary))" />
    <path d="M13 13h2" stroke="hsl(var(--primary))" />
    <path d="M13 17h2" stroke="hsl(var(--primary))" />
    <path d="M17 13h1v1" stroke="hsl(var(--primary))" />
    <path d="M17 17h1" stroke="hsl(var(--primary))" />
  </svg>
);
