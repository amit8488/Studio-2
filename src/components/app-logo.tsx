import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FF8A00' }} />
          <stop offset="100%" style={{ stopColor: '#E52E71' }} />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="url(#logo-gradient)" />
      <circle cx="8" cy="8" r="0.5" fill="url(#logo-gradient)" stroke="url(#logo-gradient)" />
      <circle cx="12" cy="8" r="0.5" fill="url(#logo-gradient)" stroke="url(#logo-gradient)" />
      <circle cx="16" cy="8" r="0.5" fill="url(#logo-gradient)" stroke="url(#logo-gradient)" />
      <circle cx="8" cy="12" r="0.5" fill="url(#logo-gradient)" stroke="url(#logo-gradient)" />
      <circle cx="12" cy="12" r="0.5" fill="url(#logo-gradient)" stroke="url(#logo-gradient)" />
      <circle cx="16" cy="12" r="0.5" fill="url(#logo-gradient)" stroke="url(#logo-gradient)" />
      <circle cx="8" cy="16" r="0.5" fill="url(#logo-gradient)" stroke="url(#logo-gradient)" />
      <circle cx="12" cy="16" r="0.5" fill="url(#logo-gradient)" stroke="url(#logo-gradient)" />
      <rect x="15" y="15" width="2" height="2" rx="0.5" fill="url(#logo-gradient)" stroke="url(#logo-gradient)" />
    </svg>
  );
}
