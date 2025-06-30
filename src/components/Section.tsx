
import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'none' | 'normal' | 'large';
  background?: 'transparent' | 'white' | 'gray';
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  spacing = 'normal',
  background = 'transparent',
}) => {
  const spacingClass = {
    none: '',
    normal: 'section-spacing',
    large: 'my-16 md:my-20 xl:my-32',
  }[spacing];

  const backgroundClass = {
    transparent: '',
    white: 'bg-white',
    gray: 'bg-gray-50',
  }[background];

  return (
    <section className={`${spacingClass} ${backgroundClass} ${className}`}>
      {children}
    </section>
  );
};
