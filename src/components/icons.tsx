import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={props.width || '1em'}
      height={props.height || '1em'}
      {...props}
    >
      <g fill="currentColor">
        <path d="M128 32C75.09 32 32 75.09 32 128s43.09 96 96 96 96-43.09 96-96S180.91 32 128 32zm-5.05 152.55l-48-96h20.1l37.95 75.9L171 88.55h20.1l-48 96c-4.45 8.9-15.65 8.9-20.1 0z" />
      </g>
    </svg>
  );
}
