import { type SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 190 40"
      fill="none"
      {...props}
    >
      <path 
        d="M21.3,3.9C18.1,1.4,14.1,0,9.6,0C4.3,0,0,4.3,0,9.6c0,4.2,2.7,7.8,6.4,9.1v-2.1c-2.3-1-4-3.4-4-6.1c0-3.6,2.9-6.5,6.5-6.5c3.2,0,5.8,2.3,6.4,5.3h-3.5v2.9h6.3c0.2,1.2,0.3,2.4,0.3,3.7c0,5.7-4.6,10.3-10.3,10.3c-2.9,0-5.5-1.2-7.4-3.1l-2,2.3c2.5,2.5,6,4.1,9.9,4.1c7.2,0,13-5.8,13-13c0-1.5-0.3-3-0.7-4.4h2.9v-2.9h-2.5c-0.2-0.4-0.4-0.8-0.6-1.2h3.1V9.8h-4.2C25.8,6.9,23.9,5,21.3,3.9z M29.1,13.7h-2.9c-0.5-2.5-2.6-4.4-5.2-4.4c-2.9,0-5.2,2.3-5.2,5.2c0,2.5,1.8,4.6,4.1,5.1v2.1c-3.4-0.6-6.1-3.5-6.1-7.2c0-4,3.2-7.2,7.2-7.2C25.5,6.5,28.4,9.5,29.1,13.7z" 
        fill="hsl(var(--primary))"
      />
      <text
        x="40"
        y="28"
        fontFamily="Poppins, sans-serif"
        fontSize="24"
        fontWeight="600"
        fill="hsl(var(--foreground))"
      >
        Learn<tspan fill="hsl(var(--primary))">AI</tspan>
      </text>
    </svg>
  ),
};
