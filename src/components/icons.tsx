import { type SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.77 0 3.44-.46 4.91-1.26M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10c-1.77 0-3.44-.46-4.91-1.26" />
      <path d="M12 2v20" />
      <path d="M12 12c-2.76 0-5-2.24-5-5s2.24-5 5-5" />
      <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5 5-5" />
      <path d="M7 17c-1.66 0-3-1.34-3-3" />
      <path d="M17 17c1.66 0 3-1.34 3-3" />
    </svg>
  ),
};
