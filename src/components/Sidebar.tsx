
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  Building, 
  Users, 
  FileText, 
  BarChart3, 
  Shield, 
  DollarSign,
  UserCheck,
  Wrench,
  Globe,
  Download,
  CheckCircle
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: 'Transitioning',
      icon: Home,
      path: '/transitioning',
    },
    {
      title: 'Maintenance',
      icon: Wrench,
      path: '/maintenance',
    },
    {
      title: 'Safety',
      icon: Shield,
      path: '/safety',
    },
    {
      title: 'Finance',
      icon: DollarSign,
      path: '/finance',
    },
    {
      title: 'CRM',
      icon: Users,
      path: '/crm',
    },
    {
      title: 'Utility',
      icon: Building,
      path: '/utility',
    },
    {
      title: 'Security',
      icon: Shield,
      path: '/security',
    },
    {
      title: 'Value Added Services',
      icon: BarChart3,
      path: '/value-added-services',
    },
    {
      title: 'Market Place',
      icon: Globe,
      path: '/market-place',
      subItems: [
        {
          title: 'All',
          icon: Globe,
          path: '/market-place/all',
        },
        {
          title: 'Installed',
          icon: CheckCircle,
          path: '/market-place/installed',
        },
        {
          title: 'Updates',
          icon: Download,
          path: '/market-place/updates',
        },
      ]
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings',
    },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">FM</span>
          </div>
          <span className="font-semibold text-gray-900">Facility Management</span>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${isActive || isActiveRoute(item.path) 
                    ? 'bg-red-50 text-red-700 border-r-2 border-red-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.title}
              </NavLink>
              
              {item.subItems && isActiveRoute(item.path) && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <NavLink
                      key={subItem.path}
                      to={subItem.path}
                      className={({ isActive }) => `
                        flex items-center px-3 py-2 text-sm rounded-lg transition-colors
                        ${isActive 
                          ? 'bg-red-600 text-white' 
                          : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      <subItem.icon className="w-4 h-4 mr-2" />
                      {subItem.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
