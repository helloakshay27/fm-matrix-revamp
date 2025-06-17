
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type Section = 'Transitioning' | 'Maintenance' | 'Finance' | 'CRM' | 'Utility' | 'Security' | 'Value Added Services' | 'Settings';

interface LayoutContextType {
  currentSection: Section;
  setCurrentSection: (section: Section) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [currentSection, setCurrentSection] = useState<Section>('Transitioning');

  useEffect(() => {
    const path = location.pathname;
    
    if (path.startsWith('/transitioning')) {
      setCurrentSection('Transitioning');
    } else if (path.startsWith('/maintenance')) {
      setCurrentSection('Maintenance');
    } else if (path.startsWith('/finance')) {
      setCurrentSection('Finance');
    } else if (path.startsWith('/crm')) {
      setCurrentSection('CRM');
    } else if (path.startsWith('/utility')) {
      setCurrentSection('Utility');
    } else if (path.startsWith('/security')) {
      setCurrentSection('Security');
    } else if (path.startsWith('/vas')) {
      setCurrentSection('Value Added Services');
    } else if (path.startsWith('/settings')) {
      setCurrentSection('Settings');
    } else {
      setCurrentSection('Transitioning'); // default
    }
  }, [location.pathname]);

  return (
    <LayoutContext.Provider value={{ currentSection, setCurrentSection }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
