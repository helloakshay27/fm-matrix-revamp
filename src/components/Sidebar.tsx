
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  ClipboardList, 
  Package, 
  Building, 
  FileText, 
  BarChart3, 
  UserCheck, 
  Settings,
  ChevronDown,
  ChevronRight,
  Car,
  UserPlus,
  PackageOpen,
  Shield,
  Truck,
  ShoppingCart,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CalendarDays
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLayout } from '@/contexts/LayoutContext';

const Sidebar = () => {
  const location = useLocation();
  const { currentSection } = useLayout();
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    maintenance: true,
    visitors: false,
    experience: false,
    goodsInOut: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const maintenanceItems = [
    { name: 'Assets', path: '/', icon: Package },
    { name: 'Services', path: '/services', icon: Settings },
    { name: 'Supplier', path: '/supplier', icon: Building },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
    { name: 'AMC', path: '/amc', icon: FileText },
    { name: 'Attendance', path: '/attendance', icon: UserCheck },
    { name: 'Tasks', path: '/tasks', icon: ClipboardList },
    { name: 'Survey List', path: '/surveys/list', icon: BarChart3 },
    { name: 'Survey Mapping', path: '/surveys/mapping', icon: BarChart3 },
    { name: 'Survey Response', path: '/surveys/response', icon: BarChart3 },
    { name: 'InActive Assets', path: '/assets/inactive', icon: Package }
  ];

  const visitorsItems = [
    { name: 'Visitors', path: '/visitors/visitors', icon: Users },
    { name: 'Visitors History', path: '/visitors/history', icon: Users },
    { name: 'R-Vehicles', path: '/visitors/r-vehicles', icon: Car },
    { name: 'R-Vehicles History', path: '/visitors/r-vehicles/history', icon: Car },
    { name: 'G-Vehicles', path: '/visitors/g-vehicles', icon: Truck },
    { name: 'Staffs', path: '/visitors/staffs', icon: UserPlus },
    { name: 'Materials', path: '/visitors/materials', icon: PackageOpen },
    { name: 'Patrolling', path: '/visitors/patrolling', icon: Shield },
    { name: 'Patrolling Pending', path: '/visitors/patrolling-pending', icon: Shield },
    { name: 'Vehicle Parkings', path: '/visitors/vehicle-parkings', icon: Car }
  ];

  const goodsInOutItems = [
    { name: 'Inwards', path: '/visitors/goods/inwards', icon: ArrowDown },
    { name: 'Outwards', path: '/visitors/goods/outwards', icon: ArrowUp }
  ];

  const experienceItems = [
    { name: 'Events', path: '/experience/events', icon: CalendarDays }
  ];

  const isActiveSection = (sectionName: string): boolean => {
    return currentSection === sectionName;
  };

  const isActivePath = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="space-y-2">
          {/* Maintenance Section */}
          <div>
            <button
              onClick={() => toggleSection('maintenance')}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2 text-left rounded-lg transition-colors",
                isActiveSection('Maintenance') 
                  ? "bg-blue-100 text-blue-700 font-medium" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <span>Maintenance</span>
              {expandedSections.maintenance ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {expandedSections.maintenance && (
              <div className="ml-4 mt-2 space-y-1">
                {maintenanceItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                      isActivePath(item.path)
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Visitors Section */}
          <div>
            <button
              onClick={() => toggleSection('visitors')}
              className="flex items-center justify-between w-full px-3 py-2 text-left rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
            >
              <span>Visitors</span>
              {expandedSections.visitors ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {expandedSections.visitors && (
              <div className="ml-4 mt-2 space-y-1">
                {visitorsItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                      isActivePath(item.path)
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Link>
                ))}
                
                {/* Goods In/Out Sub Section */}
                <div>
                  <button
                    onClick={() => toggleSection('goodsInOut')}
                    className="flex items-center justify-between w-full px-3 py-2 text-left rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-3" />
                      <span className="text-sm">Goods In/Out</span>
                    </div>
                    {expandedSections.goodsInOut ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>
                  {expandedSections.goodsInOut && (
                    <div className="ml-6 mt-1 space-y-1">
                      {goodsInOutItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                            isActivePath(item.path)
                              ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                              : "text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          <item.icon className="h-3 w-3 mr-3" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Experience Section */}
          <div>
            <button
              onClick={() => toggleSection('experience')}
              className="flex items-center justify-between w-full px-3 py-2 text-left rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
            >
              <span>Experience</span>
              {expandedSections.experience ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {expandedSections.experience && (
              <div className="ml-4 mt-2 space-y-1">
                {experienceItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                      isActivePath(item.path)
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
