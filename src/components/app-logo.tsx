import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Outer Circle Container */}
      <circle cx="256" cy="256" r="240" fill="white" stroke="#0F766E" strokeWidth="8"/>
      <circle cx="256" cy="256" r="225" fill="white" stroke="#0F766E" strokeWidth="2" strokeDasharray="8 8" opacity="0.3"/>
      
      {/* Agricultural Fields (Bottom) */}
      <path 
        d="M60 350 C 150 310, 362 310, 452 350 L 452 420 C 362 460, 150 460, 60 420 Z" 
        fill="#0F766E" 
        fillOpacity="0.05"
      />
      <path d="M70 380 Q 256 320, 442 380" stroke="#0F766E" strokeWidth="12" fill="none" strokeLinecap="round"/>
      <path d="M90 405 Q 256 350, 422 405" stroke="#0F766E" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.7"/>
      
      {/* Main 'V' Ruler */}
      <path 
        d="M190 130 L 256 310 L 322 130" 
        stroke="#0F766E" 
        strokeWidth="28" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Ruler Ticks */}
      <line x1="285" y1="200" x2="305" y2="192" stroke="white" strokeWidth="5" strokeLinecap="round"/>
      <line x1="278" y1="225" x2="298" y2="217" stroke="white" strokeWidth="5" strokeLinecap="round"/>
      <line x1="271" y1="250" x2="291" y2="242" stroke="white" strokeWidth="5" strokeLinecap="round"/>
      <line x1="264" y1="275" x2="284" y2="267" stroke="white" strokeWidth="5" strokeLinecap="round"/>

      {/* Sprout (Top of V) */}
      <path 
        d="M256 125 C 240 85, 256 65, 256 65 C 256 65, 272 85, 256 125Z" 
        fill="#22C55E"
      />
      <path 
        d="M256 105 C 225 75, 235 45, 235 45 C 235 45, 250 55, 256 105Z" 
        fill="#16A34A"
      />

      {/* 4 Feature Circles */}
      {/* 1. 7/12 (Top Left) */}
      <circle cx="125" cy="180" r="42" fill="white" stroke="#0F766E" strokeWidth="3"/>
      <text x="125" y="192" textAnchor="middle" fill="#0F766E" fontSize="26" fontWeight="900" fontFamily="Poppins, sans-serif">7/12</text>
      
      {/* 2. m2 (Top Right) */}
      <circle cx="387" cy="180" r="42" fill="white" stroke="#0F766E" strokeWidth="3"/>
      <text x="387" y="192" textAnchor="middle" fill="#0F766E" fontSize="28" fontWeight="900" fontFamily="Poppins, sans-serif">m²</text>

      {/* 3. Calc (Bottom Left) */}
      <circle cx="125" cy="325" r="42" fill="white" stroke="#0F766E" strokeWidth="3"/>
      <path d="M112 325 H 138 M 125 312 V 338 M 112 338 L 138 312" stroke="#0F766E" strokeWidth="6" strokeLinecap="round" opacity="0.8"/>

      {/* 4. Rupee (Bottom Right) */}
      <circle cx="387" cy="325" r="42" fill="white" stroke="#0F766E" strokeWidth="3"/>
      <text x="387" y="340" textAnchor="middle" fill="#0F766E" fontSize="42" fontWeight="900" fontFamily="Poppins, sans-serif">₹</text>

      {/* Branding Text */}
      <text x="256" y="445" textAnchor="middle" fill="#0F766E" fontSize="56" fontWeight="900" fontFamily="Poppins, sans-serif">ViGha</text>
      <text x="256" y="480" textAnchor="middle" fill="#0F766E" fontSize="16" fontWeight="700" letterSpacing="6" fontFamily="Inter, sans-serif">CALCULATE</text>
    </svg>
  );
}
