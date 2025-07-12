
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [currentSection, setCurrentSection] = useState('Settings');

  return (
    <LayoutContext.Provider value={{ currentSection, setCurrentSection }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
