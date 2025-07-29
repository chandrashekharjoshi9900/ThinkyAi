import { type SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 130 40"
      fill="none"
      {...props}
    >
      <text
        x="0"
        y="28"
        fontFamily="Poppins, sans-serif"
        fontSize="24"
        fontWeight="600"
        fill="hsl(var(--foreground))"
      >
        Thinky<tspan fill="hsl(var(--primary))">AI</tspan>
      </text>
    </svg>
  ),
};
