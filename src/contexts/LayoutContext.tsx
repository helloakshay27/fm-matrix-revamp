
import React, { createContext, useContext, useState, ReactNode } from 'react';

type LayoutContextType = {
  currentSection: string;
  setCurrentSection: (section: string) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState('Value Added Services');

  return (
    <LayoutContext.Provider value={{ currentSection, setCurrentSection }}>
      {children}
    </LayoutContext.Provider>
  );
};
