
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { LayoutConfig, getCompanyLayout } from '@/config/companyLayouts';

interface LayoutContextType {
  currentSection: string;
  setCurrentSection: (section: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  getLayoutByCompanyId: (companyId: number | null) => LayoutConfig;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState<string>('');
  
  // Get initial collapsed state from localStorage, default to false if not set
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });

  // Get current selected company from Redux store
  const { selectedCompany } = useSelector((state: RootState) => state.project);

  // Save sidebar collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Company ID to layout mapping function
  const getLayoutByCompanyId = (companyId: number | null): LayoutConfig => {
    return getCompanyLayout(companyId);
  };

  return (
    <LayoutContext.Provider value={{ 
      currentSection, 
      setCurrentSection,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      getLayoutByCompanyId
    }}>
      {children}
    </LayoutContext.Provider>
  );
};
