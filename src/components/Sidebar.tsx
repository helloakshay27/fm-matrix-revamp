
import React, { useState } from 'react';
import { 
  Home, 
  Wrench, 
  Package, 
  Users, 
  Calendar, 
  ClipboardList, 
  AlertTriangle,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: Home, href: '/' },
  { name: 'Assets', icon: Package, href: '/assets' },
  { name: 'AMC', icon: Wrench, href: '/amc', current: window.location.pathname === '/amc' },
  { name: 'Services', icon: Settings, href: '/services', current: window.location.pathname === '/services' },
  { name: 'Attendance', icon: Users, href: '/attendance', current: window.location.pathname === '/attendance' },
  { name: 'Inventory', icon: Package, href: '/inventory' },
  { name: 'Tickets', icon: FileText, href: '/tickets' },
  { name: 'Tasks', icon: ClipboardList, href: '/tasks' },
  { name: 'Schedule', icon: Calendar, href: '/schedule', current: window.location.pathname === '/schedule' },
  { name: 'Safety', icon: AlertTriangle, href: '/safety' },
  { name: 'Incident', icon: AlertTriangle, href: '/incident' },
  { name: 'Audit', icon: BarChart3, href: '/audit' },
  { name: 'Supplier', icon: Package, href: '/supplier', current: window.location.pathname === '/supplier' },
];

const surveyItems = [
  { name: 'Survey List', href: '/surveys/list' },
  { name: 'Mapping', href: '/surveys/mapping' },
  { name: 'Response', href: '/surveys/response' },
];

export const Sidebar = () => {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const currentPath = window.location.pathname;
  const isSurveyActive = currentPath.startsWith('/surveys');

  return (
    <div className="w-64 h-screen bg-[#f6f4ee] border-r border-[#D5DbDB] fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#C72030] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FM</span>
          </div>
          <span className="text-[#1a1a1a] font-semibold text-lg">FacilityPro</span>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.current
                  ? 'bg-[#C72030] text-white'
                  : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </a>
          ))}
          
          {/* Survey Dropdown */}
          <div>
            <button
              onClick={() => setIsSurveyOpen(!isSurveyOpen)}
              className={`flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isSurveyActive
                  ? 'bg-[#C72030] text-white'
                  : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5" />
                Surveys
              </div>
              {isSurveyOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            {isSurveyOpen && (
              <div className="ml-8 mt-1 space-y-1">
                {surveyItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentPath === item.href
                        ? 'bg-[#C72030] text-white'
                        : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};
