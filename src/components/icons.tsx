import { type SVGProps } from 'react';
import { BrainCircuit } from 'lucide-react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <BrainCircuit className="text-primary" width="28" height="28" x="0" y="0" />
      <text
        x="40"
        y="21"
        fontFamily="Poppins, sans-serif"
        fontSize="24"
        fontWeight="600"
        fill="hsl(var(--foreground))"
      >
        LearnAI
      </text>
    </svg>
  ),
};
