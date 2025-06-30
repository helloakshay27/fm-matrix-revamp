
import React from 'react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  withSidebar?: boolean;
  sidebarContent?: React.ReactNode;
  className?: string;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  withSidebar = false,
  sidebarContent,
  className = '',
}) => {
  if (withSidebar) {
    return (
      <div className={`container-responsive ${className}`}>
        <div className="content-area">
          <div className="layout-with-sidebar">
            <div className="main-content section-spacing">
              {children}
            </div>
            {sidebarContent && (
              <aside className="sidebar-content">
                {sidebarContent}
              </aside>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`container-responsive ${className}`}>
      <div className="content-area section-spacing">
        {children}
      </div>
    </div>
  );
};
