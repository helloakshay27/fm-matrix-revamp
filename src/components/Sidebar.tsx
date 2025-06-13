
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  Home,
  Settings,
  Users,
  Calendar,
  ClipboardList,
  Truck,
  UserCheck,
  BarChart3,
  MapPin,
  Clock,
  FileText,
  Building2,
  Car,
  Package,
  Shield,
  Archive,
  Radio,
  Megaphone
} from 'lucide-react';

interface MenuSection {
  title: string;
  icon: React.ComponentType<any>;
  items: MenuItem[];
}

interface MenuItem {
  title: string;
  path: string;
  icon?: React.ComponentType<any>;
}

const menuSections: MenuSection[] = [
  {
    title: 'Dashboard',
    icon: Home,
    items: [
      { title: 'Home', path: '/' }
    ]
  },
  {
    title: 'Services',
    icon: Settings,
    items: [
      { title: 'Services', path: '/services' }
    ]
  },
  {
    title: 'Supplier',
    icon: Truck,
    items: [
      { title: 'Supplier', path: '/supplier' }
    ]
  },
  {
    title: 'Schedule',
    icon: Calendar,
    items: [
      { title: 'Schedule', path: '/schedule' }
    ]
  },
  {
    title: 'AMC',
    icon: FileText,
    items: [
      { title: 'AMC', path: '/amc' }
    ]
  },
  {
    title: 'Attendance',
    icon: UserCheck,
    items: [
      { title: 'Attendance', path: '/attendance' }
    ]
  },
  {
    title: 'Tasks',
    icon: ClipboardList,
    items: [
      { title: 'Tasks', path: '/tasks' }
    ]
  },
  {
    title: 'Surveys',
    icon: BarChart3,
    items: [
      { title: 'Survey List', path: '/surveys/list' },
      { title: 'Survey Mapping', path: '/surveys/mapping' },
      { title: 'Survey Response', path: '/surveys/response' }
    ]
  },
  {
    title: 'Assets',
    icon: Building2,
    items: [
      { title: 'In Active Assets', path: '/assets/inactive' }
    ]
  },
  {
    title: 'Visitors',
    icon: Users,
    items: [
      { title: 'Visitors', path: '/visitors/visitors' },
      { title: 'Visitors History', path: '/visitors/history' },
      { title: 'R-Vehicles', path: '/visitors/r-vehicles' },
      { title: 'R-Vehicles History', path: '/visitors/r-vehicles/history' },
      { title: 'G-Vehicles', path: '/visitors/g-vehicles' },
      { title: 'Staffs', path: '/visitors/staffs' },
      { title: 'Materials', path: '/visitors/materials' },
      { title: 'Patrolling', path: '/visitors/patrolling' },
      { title: 'Patrolling Pending', path: '/visitors/patrolling-pending' },
      { title: 'Goods In/Out', path: '/visitors/goods' },
      { title: 'Inwards', path: '/visitors/goods/inwards' },
      { title: 'Outwards', path: '/visitors/goods/outwards' },
      { title: 'Vehicle Parkings', path: '/visitors/vehicle-parkings' }
    ]
  },
  {
    title: 'Experience',
    icon: Radio,
    items: [
      { title: 'Events', path: '/experience/events' },
      { title: 'Broadcast', path: '/experience/broadcast' }
    ]
  }
];

export const Sidebar: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['Experience']);
  const location = useLocation();

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionTitle) 
        ? prev.filter(title => title !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto z-40">
      <div className="p-4">
        <nav className="space-y-2">
          {menuSections.map((section) => {
            const isExpanded = expandedSections.includes(section.title);
            const Icon = section.icon;
            
            return (
              <div key={section.title} className="space-y-1">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span>{section.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="ml-6 space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                          isActive(item.path)
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
