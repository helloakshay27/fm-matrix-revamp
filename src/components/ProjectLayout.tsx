
import React from 'react';
import { Header } from './Header';
import { DynamicHeader } from './DynamicHeader';
import { useLocation } from 'react-router-dom';
import { Settings, FileText, CheckSquare, AlertTriangle } from 'lucide-react';

interface ProjectLayoutProps {
  children: React.ReactNode;
}

const projectMenuItems = [
  {
    name: 'Fitout Setup',
    href: '/projects/fitout-setup',
    icon: Settings,
  },
  {
    name: 'Fitout Request',
    href: '/projects/fitout-request',
    icon: FileText,
  },
  {
    name: 'Fitout Checklist',
    href: '/projects/fitout-checklist',
    icon: CheckSquare,
  },
  {
    name: 'Fitout Violation',
    href: '/projects/fitout-violation',
    icon: AlertTriangle,
  },
];

export const ProjectLayout: React.FC<ProjectLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <DynamicHeader />
      
      <div className="flex pt-28">
        {/* Project Sidebar */}
        <div className="w-64 h-screen bg-[#4a1d3d] fixed left-0 top-28 overflow-y-auto">
          <div className="p-4">
            <nav className="space-y-1">
              {projectMenuItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-purple-700 text-white'
                        : 'text-gray-300 hover:bg-purple-600 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="ml-64 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};
