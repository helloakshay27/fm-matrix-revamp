import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Sidebar } from './Sidebar';
import { DynamicHeader } from './DynamicHeader';
import { Header } from './Header';
import { useLayout } from '../contexts/LayoutContext';
import { OmanSidebar } from './OmanSidebar';
import { OmanDynamicHeader } from './OmanDynamicHeader';
import ViSidebar from './ViSidebar';
import ViDynamicHeader from './ViDynamicHeader';
import { StaticDynamicHeader } from './StaticDynamicHeader';
import { StacticSidebar } from './StacticSidebar';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSidebarCollapsed, getLayoutByCompanyId } = useLayout();
  const { selectedCompany } = useSelector((state: RootState) => state.project);

  // Get current domain for backward compatibility
  const hostname = window.location.hostname;
  const isOmanSite = hostname.includes('oig.gophygital.work');
  const isViSite = hostname.includes('vi-web.gophygital.work');

  // Get layout configuration based on company ID
  const layoutConfig = getLayoutByCompanyId(selectedCompany?.id === 199 ? selectedCompany.id : null);

  // Layout behavior:
  // - Company ID 111 (Lockated HO): Default layout (Sidebar + DynamicHeader)
  // - Company ID 199 (Customer Support): Default layout (Sidebar + DynamicHeader)
  // - Other companies (193, 204): Static layout (Sidebar + StaticDynamicHeader)
  // - No company selected: Static layout (fallback)

  // Render sidebar component based on configuration
  const renderSidebar = () => {
    // Domain-based logic takes precedence for backward compatibility
    if (isOmanSite) {
      return <OmanSidebar />;
    }
    if (isViSite) {
      return <ViSidebar />;
    }

    // Use company ID-based layout
    switch (layoutConfig.sidebarComponent) {
      case 'oman':
        return <OmanSidebar />;
      case 'vi':
        return <ViSidebar />;
      case 'static':
        return <StacticSidebar />;
      case 'default':
      default:
        return <Sidebar />;
    }
  };

  // Render header component based on configuration
  const renderDynamicHeader = () => {
    // Domain-based logic takes precedence for backward compatibility
    if (isOmanSite) {
      return <OmanDynamicHeader />;
    }
    if (isViSite) {
      return <ViDynamicHeader />;
    }

    // Use company ID-based layout
    switch (layoutConfig.headerComponent) {
      case 'oman':
        return <OmanDynamicHeader />;
      case 'vi':
        return <ViDynamicHeader />;
      case 'static':
        return <StaticDynamicHeader />;
      case 'default':
      default:
        return <DynamicHeader />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]" style={{ backgroundColor: layoutConfig.theme?.backgroundColor }}>
      <Header />
      {renderSidebar()}
      {renderDynamicHeader()}
      
      <main
        className={`${isSidebarCollapsed ? 'ml-16' : 'ml-64'} pt-28 transition-all duration-300`}
      >
        <Outlet />
      </main>
    </div>
  );
};
