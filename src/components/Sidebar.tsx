import React from 'react';
import { LayoutDashboard, Package, FileText, Shield, Wrench, ClipboardList, Calendar, AlertTriangle, CheckSquare, MapPin, Users, MapPinHouse, } from 'lucide-react';

interface SidebarItem {
  name: string;
  href?: string;
  icon: any;
  hasChildren?: boolean;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Assets',
    icon: Package,
    hasChildren: true,
    children: [
      { name: 'Land', href: '/assets/land', icon: MapPin },
      { name: 'Building', href: '/assets/building', icon: MapPinHouse },
      { name: 'Leasehold Improvement', href: '/assets/leasehold-improvement', icon: FileText },
      { name: 'Vehicle', href: '/assets/vehicle', icon: Shield },
    ]
  },
  {
    name: 'Maintenance',
    icon: Wrench,
    hasChildren: true,
    children: [
      { name: 'AMC', href: '/maintenance/amc', icon: FileText },
      { name: 'Warranty', href: '/maintenance/warranty', icon: Shield },
      { name: 'Work Order', href: '/maintenance/work-order', icon: ClipboardList },
      { name: 'PPM', href: '/maintenance/ppm', icon: Calendar },
      { name: 'Breakdown', href: '/maintenance/breakdown', icon: AlertTriangle },
      { name: 'Checklist', href: '/maintenance/checklist', icon: CheckSquare },
      { name: 'M Safe', href: '/maintenance/m-safe', icon: Shield }
    ]
  },
  {
    name: 'Gate Pass',
    icon: FileText,
    hasChildren: true,
    children: [
      { name: 'Inwards', href: '/gate-pass/inwards', icon: FileText },
      { name: 'Outwards', href: '/gate-pass/outwards', icon: FileText },
    ]
  },
  {
    name: 'Master',
    icon: FileText,
    hasChildren: true,
    children: [
      { name: 'Location Master', href: '/master/location', icon: MapPin },
      { name: 'User Master', href: '/master/user', icon: Users },
    ]
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
      <button className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none" onClick={onClose}>
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <nav className="mt-16">
        {sidebarItems.map((item, index) => (
          <div key={index} className="px-4 py-2 hover:bg-gray-700">
            <a href={item.href} className="flex items-center space-x-2">
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </a>
          </div>
        ))}
      </nav>
    </div>
  );
};
