
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
  // Get initial collapsed state from localStorage, default to false if not set
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });

  // Get current selected company from Redux store
  const { selectedCompany } = useSelector((state: RootState) => state.project);

  // Automatic section detection based on current route
  useEffect(() => {
    const path = location.pathname;
    let newSection = '';
    
    console.log(`📍 Route changed to: ${path}, Current section: ${currentSection}`);
    
    // Define route patterns and their corresponding sections
    // Keep this in sync with the sidebar logic
    if (path.startsWith('/utility')) {
      newSection = 'Utility';
    } else if (path.startsWith('/transitioning')) {
      newSection = 'Transitioning';
    } else if (path.startsWith('/security')) {
      newSection = 'Security';
    } else if (path.startsWith('/vas')) {
      newSection = 'Value Added Services';
    } else if (path.startsWith('/finance')) {
      newSection = 'Finance';
    } else if (path.startsWith('/maintenance')) {
      newSection = 'Maintenance';
    } else if (path.startsWith('/safety')) {
      newSection = 'Safety';
    } else if (path.startsWith('/crm')) {
      newSection = 'CRM';
    } else if (path.startsWith('/market-place')) {
      newSection = 'Market Place';
    } else if (path.startsWith('/club-management')) {
      newSection = 'Club Management';
    } else if (path.startsWith('/master')) {
      newSection = 'Master';
    } else if (path.startsWith('/settings')) {
      newSection = 'Settings';
    } else if (path.startsWith('/dashboard')) {
      newSection = 'Dashboard';
    } else {
      // For any other route, default to Dashboard
      newSection = 'Dashboard';
    }

    // Always update the section when route changes
    console.log(`🔄 Section change: ${currentSection} → ${newSection} (path: ${path})`);
    setCurrentSection(newSection);
  }, [location.pathname]); // Removed currentSection from dependency to prevent circular updates

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
