
import React from 'react';
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
  Settings
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: Home, href: '/' },
  { name: 'Assets', icon: Package, href: '/assets', current: true },
  { name: 'AMC', icon: Wrench, href: '/amc' },
  { name: 'Services', icon: Settings, href: '/services' },
  { name: 'Attendance', icon: Users, href: '/attendance' },
  { name: 'Inventory', icon: Package, href: '/inventory' },
  { name: 'Tickets', icon: FileText, href: '/tickets' },
  { name: 'Tasks', icon: ClipboardList, href: '/tasks' },
  { name: 'Schedule', icon: Calendar, href: '/schedule' },
  { name: 'Safety', icon: AlertTriangle, href: '/safety' },
  { name: 'Incident', icon: AlertTriangle, href: '/incident' },
  { name: 'Audit', icon: BarChart3, href: '/audit' },
];

export const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 border-r border-purple-700 fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FM</span>
          </div>
          <span className="text-white font-semibold text-lg">FacilityPro</span>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.current
                  ? 'bg-orange-500 text-white'
                  : 'text-purple-100 hover:bg-purple-700 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};
