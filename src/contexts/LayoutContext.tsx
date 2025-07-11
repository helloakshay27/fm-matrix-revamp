
import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState('Dashboard');

  return (
    <LayoutContext.Provider value={{ currentSection, setCurrentSection }}>
      {children}
    </LayoutContext.Provider>
  );
};
