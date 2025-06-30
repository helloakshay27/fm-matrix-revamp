
import React from 'react';

interface ComponentSpacingProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  direction?: 'vertical' | 'horizontal' | 'both';
  className?: string;
}

export const ComponentSpacing: React.FC<ComponentSpacingProps> = ({
  children,
  size = 'md',
  direction = 'vertical',
  className = '',
}) => {
  const getSpacingClass = () => {
    const sizeMap = {
      sm: {
        vertical: 'space-y-2 md:space-y-3 xl:space-y-4',
        horizontal: 'space-x-2 md:space-x-3 xl:space-x-4',
        both: 'gap-2 md:gap-3 xl:gap-4',
      },
      md: {
        vertical: 'space-y-4 md:space-y-5 xl:space-y-6',
        horizontal: 'space-x-4 md:space-x-5 xl:space-x-6',
        both: 'gap-4 md:gap-5 xl:gap-6',
      },
      lg: {
        vertical: 'space-y-6 md:space-y-8 xl:space-y-10',
        horizontal: 'space-x-6 md:space-x-8 xl:space-x-10',
        both: 'gap-6 md:gap-8 xl:gap-10',
      },
    };

    return sizeMap[size][direction];
  };

  const containerClass = direction === 'both' ? 'flex flex-wrap' : 'flex flex-col';

  return (
    <div className={`${containerClass} ${getSpacingClass()} ${className}`}>
      {children}
    </div>
  );
};
