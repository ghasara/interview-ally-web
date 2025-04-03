import React from "react";

interface AppLogoProps {
  className?: string;
  size?: number;
}

export function AppLogo({ className = "", size = 32 }: AppLogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="512" height="512" rx="100" fill="url(#paint0_linear)" />
      <path d="M128 160C128 137.909 145.909 120 168 120H344C366.091 120 384 137.909 384 160V352C384 374.091 366.091 392 344 392H168C145.909 392 128 374.091 128 352V160Z" stroke="white" strokeWidth="20" />
      <path d="M160 192V320" stroke="white" strokeWidth="20" strokeLinecap="round" />
      <path d="M192 256H320" stroke="white" strokeWidth="20" strokeLinecap="round" />
      <path d="M256 192V320" stroke="white" strokeWidth="20" strokeLinecap="round" />
      <path d="M352 192V320" stroke="white" strokeWidth="20" strokeLinecap="round" />
      <circle cx="256" cy="256" r="156" stroke="white" strokeOpacity="0.2" strokeWidth="12"/>
      <defs>
        <linearGradient id="paint0_linear" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F97316"/>
          <stop offset="1" stopColor="#EA580C"/>
        </linearGradient>
      </defs>
    </svg>
  );
}