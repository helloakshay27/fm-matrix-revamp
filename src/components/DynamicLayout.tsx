
import React, { ReactNode, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { DynamicHeader } from './DynamicHeader';
import { DynamicSubHeader } from './DynamicSubHeader';
import { useLayout } from '../contexts/LayoutContext';
import { useLocation } from 'react-router-dom';

interface DynamicLayoutProps {
  children: ReactNode;
}

export const DynamicLayout: React.FC<DynamicLayoutProps> = ({ children }) => {
  const { setCurrentSection } = useLayout();
  const location = useLocation();

  useEffect(() => {
    // Set current section based on route
    const path = location.pathname;
    
    if (path === '/' || path.startsWith('/amc') || path.startsWith('/services') || 
        path.startsWith('/surveys') || path.startsWith('/attendance') || 
        path.startsWith('/schedule') || path.startsWith('/supplier')) {
      setCurrentSection('maintenance');
    }
    // Add other section detection logic as needed
  }, [location.pathname, setCurrentSection]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Sidebar />
      <DynamicHeader />
      <DynamicSubHeader />
      
      <main className="ml-64 pt-32">
        {children}
      </main>
    </div>
  );
};
