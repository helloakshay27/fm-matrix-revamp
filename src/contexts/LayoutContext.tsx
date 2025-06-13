
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface LayoutContextType {
  currentSection: string;
  setCurrentSection: (section: string) => void;
  getCurrentSectionFromPath: (path: string) => string;
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
  const [currentSection, setCurrentSection] = useState('Maintenance');
  const location = useLocation();

  const getCurrentSectionFromPath = (path: string): string => {
    if (path.startsWith('/projects')) return 'Project';
    if (path.startsWith('/surveys')) return 'Maintenance';
    if (path.startsWith('/amc')) return 'Maintenance';
    if (path.startsWith('/services')) return 'Maintenance';
    if (path.startsWith('/attendance')) return 'Maintenance';
    if (path.startsWith('/schedule')) return 'Maintenance';
    if (path.startsWith('/supplier')) return 'Maintenance';
    if (path.startsWith('/assets')) return 'Maintenance';
    if (path.startsWith('/visitors')) return 'Visitors';
    if (path.startsWith('/experience')) return 'Experience';
    if (path.startsWith('/finance')) return 'Finance';
    if (path === '/') return 'Maintenance'; // Asset dashboard is under Maintenance
    return 'Maintenance';
  };

  useEffect(() => {
    const section = getCurrentSectionFromPath(location.pathname);
    setCurrentSection(section);
  }, [location.pathname]);

  return (
    <LayoutContext.Provider value={{
      currentSection,
      setCurrentSection,
      getCurrentSectionFromPath
    }}>
      {children}
    </LayoutContext.Provider>
  );
};
