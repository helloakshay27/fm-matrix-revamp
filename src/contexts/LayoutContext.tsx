
import React, { createContext, useContext, useState } from 'react';

interface LayoutContextType {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState('Settings');

  return (
    <LayoutContext.Provider value={{ currentSection, setCurrentSection }}>
      {children}
    </LayoutContext.Provider>
  );
};
