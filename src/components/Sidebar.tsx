import React, { useState } from 'react';
import {
  Home,
  Wrench,
  Building2,
  Settings,
  Users,
  DollarSign,
  FileText,
  CheckSquare,
  AlertTriangle,
  ClipboardList,
  Shield,
  Eye,
  Mail,
  Target,
  BookOpen,
  Receipt,
  MapPin,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Calendar,
  Bell,
  Package,
  Truck,
  BarChart,
  ListChecks,
  DoorOpen,
  Key,
  ParkingSquare,
  Car,
  User,
  HardDrive,
  Navigation,
  Flag,
  Newspaper,
  Briefcase,
  Building,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isCollapsed?: boolean;
}

interface SidebarItem {
  label: string;
  href?: string;
  icon: React.ComponentType<any>;
  children?: SidebarItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sidebarItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
    },
    {
      label: 'Services',
      href: '/services',
      icon: Wrench,
    },
    {
      label: 'Supplier',
      href: '/supplier',
      icon: Building2,
    },
    {
      label: 'Maintenance',
      icon: Settings,
      children: [
        { label: 'Vendor', href: '/vendor' },
        { label: 'Schedule', href: '/schedule-list' },
        { label: 'Tasks', href: '/task-list' },
        { label: 'Tickets', href: '/tickets' },
        { label: 'Operational Audit', children: [
          { label: 'Scheduled', href: '/operational-audit/scheduled' },
          { label: 'Conducted', href: '/operational-audit/conducted' },
          { label: 'Master Checklists', href: '/operational-audit/master-checklists' },
        ]},
        { label: 'Vendor Audit', children: [
          { label: 'Scheduled', href: '/maintenance/vendor-audit/scheduled' },
          { label: 'Conducted', href: '/maintenance/vendor-audit/conducted' },
        ]},
        { label: 'Incident', children: [
          { label: 'Setup', href: '/maintenance/incident/setup' },
          { label: 'List', href: '/maintenance/incident/list' },
        ]},
        { label: 'Permit', children: [
          { label: 'Setup', href: '/maintenance/permit/setup' },
          { label: 'List', href: '/maintenance/permit/list' },
          { label: 'Pending Approvals', href: '/maintenance/permit/pending-approvals' },
        ]},
        { label: 'Design Insights', children: [
          { label: 'List', href: '/maintenance/design-insights/list' },
          { label: 'Setup', href: '/maintenance/design-insights/setup' },
        ]},
      ]
    },
    {
      label: 'CRM',
      icon: Users,
      children: [
        { label: 'Customer', href: '/crm/customer' },
        { label: 'FM Users', href: '/crm/fm-users' },
        { label: 'Occupant Users', href: '/crm/occupant-users' },
      ]
    },
    {
      label: 'Finance',
      icon: DollarSign,
      children: [
        { label: 'Material PR', href: '/finance/material-pr' },
        { label: 'Service PR', href: '/finance/service-pr' },
        { label: 'PO', href: '/finance/po' },
        { label: 'WO', href: '/finance/wo' },
        { label: 'GRN', href: '/finance/grn' },
        { label: 'Invoices SES', href: '/finance/invoices-ses' },
        { label: 'Pending Approvals', href: '/finance/pending-approvals' },
        { label: 'GDN', href: '/finance/gdn' },
        { label: 'Auto Saved PR', href: '/finance/auto-saved-pr' },
        { label: 'WBS Element', href: '/finance/wbs-element' },
        { label: 'Other Bills', href: '/finance/other-bills' },
        { label: 'Accounting', href: '/finance/accounting' },
        { label: 'Customer Bills', href: '/finance/customer-bills' },
        { label: 'My Bills', href: '/finance/my-bills' },
      ]
    },
    {
      label: 'Property',
      icon: Building,
      children: [
        {
          label: 'Space',
          children: [
            { label: 'Bookings', href: '/property/space/bookings' },
            { label: 'Seat Type', href: '/property/space/seat-type' },
          ],
        },
        {
          label: 'Booking',
          children: [
            { label: 'Setup', href: '/property/booking/setup' },
          ],
        },
      ],
    },
    {
      label: 'Visitors',
      icon: User,
      children: [
        { label: 'Visitors', href: '/visitors/visitors' },
        { label: 'History', href: '/visitors/history' },
        { label: 'R Vehicles', href: '/visitors/r-vehicles' },
        { label: 'R Vehicles History', href: '/visitors/r-vehicles/history' },
        { label: 'G Vehicles', href: '/visitors/g-vehicles' },
        { label: 'Staffs', href: '/visitors/staffs' },
        { label: 'Materials', href: '/visitors/materials' },
        { label: 'Patrolling', href: '/visitors/patrolling' },
        { label: 'Patrolling Pending', href: '/visitors/patrolling-pending' },
        { label: 'Goods', href: '/visitors/goods' },
        {
          label: 'Goods Inwards',
          href: '/visitors/goods/inwards',
        },
        {
          label: 'Goods Outwards',
          href: '/visitors/goods/outwards',
        },
        { label: 'Vehicle Parkings', href: '/visitors/vehicle-parkings' },
      ],
    },
    {
      label: 'Experience',
      icon: Eye,
      children: [
        { label: 'Events', href: '/experience/events' },
        { label: 'Broadcast', href: '/experience/broadcast' },
        { label: 'Business Directory', href: '/experience/business' },
        { label: 'Documents Unit', href: '/experience/documents/unit' },
        { label: 'Documents Common', href: '/experience/documents/common' },
        {
          label: 'Transport',
          children: [
            { label: 'Outstation', href: '/experience/transport/outstation' },
            { label: 'Airline', href: '/experience/transport/airline' },
            { label: 'Rail', href: '/experience/transport/rail' },
            { label: 'Hotel', href: '/experience/transport/hotel' },
            { label: 'Self Travel', href: '/experience/transport/self-travel' },
          ],
        },
        { label: 'Testimonials', href: '/experience/testimonials' },
        { label: 'Company Partners', href: '/experience/company-partners' },
      ],
    },
    {
      label: 'Setup',
      href: '/setup',
      icon: Settings,
    },
  ];

  return (
    <aside className={`w-64 bg-[#f6f4ee] border-r border-[#D5DbDB] h-screen fixed top-0 left-0 overflow-y-auto ${isCollapsed ? 'hidden' : ''}`}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#C72030] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-[#1a1a1a] font-semibold text-lg">Lockated</span>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item, index) => (
            item.href ? (
              <Link
                to={item.href}
                key={index}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ) : (
              <div key={index}>
                <button
                  onClick={() => toggleSection(item.label)}
                  className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </div>
                  {openSections[item.label] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {item.children && openSections[item.label] && (
                  <div className="ml-6 space-y-1">
                    {item.children.map((child, childIndex) => (
                      child.href ? (
                        <Link
                          to={child.href}
                          key={childIndex}
                          className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                        >
                          {child.label}
                        </Link>
                      ) : (
                        <div key={childIndex}>
                          {/* Nested Submenu */}
                          {child.children && child.children.length > 0 ? (
                            <>
                              <button
                                onClick={() => toggleSection(child.label)}
                                className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                              >
                                <div className="flex items-center gap-3">
                                  {child.label}
                                </div>
                                {openSections[child.label] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </button>
                              {openSections[child.label] && (
                                <div className="ml-6 space-y-1">
                                  {child.children.map((grandchild, grandchildIndex) => (
                                    <Link
                                      to={grandchild.href || ""}
                                      key={grandchildIndex}
                                      className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                                    >
                                      {grandchild.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a]">
                              {child.label}
                            </span>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            )
          ))}
        </nav>
      </div>
    </aside>
  );
};
