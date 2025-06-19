
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Settings, 
  User, 
  Users, 
  Shield, 
  CheckSquare, 
  Folder, 
  FolderOpen,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const SettingsSidebar = () => {
  const location = useLocation();

  const settingsItems = [
    { name: 'General', icon: Settings, path: '/settings/general' },
    { name: 'Account', icon: User, path: '/settings/account' },
    { name: 'Users', icon: Users, path: '/settings/users' },
    { name: 'Roles (RACI)', icon: Shield, path: '/settings/roles' },
    { name: 'Approval Matrix', icon: CheckSquare, path: '/settings/approval-matrix' },
    { name: 'Module 1', icon: Folder, path: '/settings/module-1' },
    { name: 'Module 2', icon: FolderOpen, path: '/settings/module-2' },
    { name: 'Masters', icon: Database, path: '/settings/masters' },
  ];

  return (
    <div className="w-48 bg-white border-r border-gray-200 h-full">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white text-sm font-bold">FM</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Facility</div>
            <div className="text-sm font-semibold text-gray-900">Management</div>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            SETTINGS
          </h3>
          <nav className="space-y-1">
            {settingsItems.map((item) => {
              const isActive = location.pathname === item.path || 
                              (item.path === '/settings/approval-matrix' && location.pathname.startsWith('/settings/approval-matrix'));
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                    isActive 
                      ? "bg-orange-100 text-orange-800 font-medium" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};
