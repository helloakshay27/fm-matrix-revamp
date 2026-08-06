import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Recess Club wordmark using Lockated brand tokens:
 * - RECESS → --color-primary (#DA7756)
 * - the / club → --color-secondary-green (#798c5e)
 */
export function RecessClubLogo({
  className,
  title = 'The Recess Club',
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 90"
      role="img"
      aria-label={title}
      className={cn('h-10 w-auto max-w-full sm:h-12 md:h-[56px]', className)}
    >
      <title>{title}</title>
      {/* "the" — script feel via italic serif */}
      <text
        x="8"
        y="28"
        fill="var(--color-secondary-green, #798c5e)"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontSize="22"
        fontWeight="500"
      >
        the
      </text>
      {/* RECESS — brand primary */}
      <text
        x="8"
        y="62"
        fill="var(--color-primary, #DA7756)"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="42"
        fontWeight="700"
        letterSpacing="1.5"
      >
        RECESS
      </text>
      {/* "club" */}
      <text
        x="200"
        y="78"
        fill="var(--color-secondary-green, #798c5e)"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontSize="22"
        fontWeight="500"
      >
        club
      </text>
    </svg>
  );
}

export default RecessClubLogo;
