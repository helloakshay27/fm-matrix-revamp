import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  Home, 
  Wrench, 
  Users, 
  Calendar, 
  Shield, 
  ClipboardList, 
  BarChart3, 
  Settings, 
  Building, 
  Car, 
  Star, 
  FileText, 
  DollarSign, 
  MapPin,
  Zap,
  Droplet,
  Recycle,
  BookOpen,
  Sun,
  HelpCircle,
  Trash2
} from 'lucide-react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ChevronDown } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/'
    },
    {
      title: 'Project',
      icon: Building,
      children: [
        { title: 'Projects', href: '/projects' },
        { title: 'Add Project', href: '/projects/add' },
        { title: 'Fitout Setup', href: '/projects/fitout-setup' }
      ]
    },
    {
      title: 'Maintenance',
      icon: Wrench,
      children: [
        { title: 'Services', href: '/services' },
        { title: 'Supplier', href: '/supplier' },
        { title: 'Schedule', href: '/schedule' },
        { title: 'AMC', href: '/amc' },
        { title: 'Attendance', href: '/attendance' },
        { title: 'Tasks', href: '/tasks' },
        { title: 'Vendor', href: '/vendor' },
        { title: 'Schedule List', href: '/schedule-list' },
        { title: 'Task List', href: '/task-list' },
        { title: 'Tickets', href: '/tickets' }
      ]
    },
    {
      title: 'Finance',
      icon: DollarSign,
      children: [
        { title: 'Material PR', href: '/finance/material-pr' },
        { title: 'Service PR', href: '/finance/service-pr' },
        { title: 'PO', href: '/finance/po' },
        { title: 'WO', href: '/finance/wo' },
        { title: 'GRN', href: '/finance/grn' },
        { title: 'Invoices SES', href: '/finance/invoices-ses' },
        { title: 'Pending Approvals', href: '/finance/pending-approvals' },
        { title: 'GDN', href: '/finance/gdn' },
        { title: 'Auto Saved PR', href: '/finance/auto-saved-pr' },
        { title: 'WBS Element', href: '/finance/wbs-element' },
        { title: 'Other Bills', href: '/finance/other-bills' },
        { title: 'Accounting', href: '/finance/accounting' },
        { title: 'Customer Bills', href: '/finance/customer-bills' },
        { title: 'My Bills', href: '/finance/my-bills' },
        { title: 'My Parking', href: '/finance/my-parking' }
      ]
    },
    {
      title: 'CRM',
      icon: Users,
      children: [
        { title: 'Customers', href: '/crm/customers' },
        { title: 'FM Users', href: '/crm/fm-users' },
        { title: 'Occupant Users', href: '/crm/occupant-users' }
      ]
    },
    {
      title: 'Utility',
      icon: Zap,
      children: [
        { title: 'Energy Meters', href: '/utility/energy-meters' },
        { title: 'Water', href: '/utility/water' },
        { title: 'STP', href: '/utility/stp' },
        { title: 'Daily Readings', href: '/utility/daily-readings' },
        { title: 'Consumption', href: '/utility/consumption' },
        { title: 'EV Consumption', href: '/utility/ev-consumption' },
        { title: 'Solar Generator', href: '/utility/solar-generator' },
        { title: 'Utility Request', href: '/utility/utility-request' },
        { title: 'Waste Generation', href: '/utility/waste-generation' }
      ]
    },
    {
      title: 'Visitors',
      icon: Users,
      children: [
        { title: 'Visitors', href: '/visitors/visitors' },
        { title: 'Visitors History', href: '/visitors/history' },
        { title: 'R-Vehicles', href: '/visitors/r-vehicles' },
        { title: 'R-Vehicles History', href: '/visitors/r-vehicles/history' },
        { title: 'G-Vehicles', href: '/visitors/g-vehicles' },
        { title: 'Staffs', href: '/visitors/staffs' },
        { title: 'Materials', href: '/visitors/materials' },
        { title: 'Patrolling', href: '/visitors/patrolling' },
        { title: 'Patrolling Pending', href: '/visitors/patrolling-pending' },
        { title: 'Goods In/Out', href: '/visitors/goods' },
        { title: 'Vehicle Parkings', href: '/visitors/vehicle-parkings' }
      ]
    },
    {
      title: 'Experience',
      icon: Star,
      children: [
        { title: 'Events', href: '/experience/events' },
        { title: 'Broadcast', href: '/experience/broadcast' },
        { title: 'Business Directory', href: '/experience/business' },
        { title: 'Documents Unit', href: '/experience/documents/unit' },
        { title: 'Documents Common', href: '/experience/documents/common' },
        { title: 'Transport', href: '/experience/transport/outstation' },
        { title: 'Testimonials', href: '/experience/testimonials' },
        { title: 'Company Partners', href: '/experience/company-partners' }
      ]
    },
    {
      title: 'Property',
      icon: Building,
      children: [
        { title: 'Space Bookings', href: '/property/space/bookings' },
        { title: 'Booking Setup', href: '/property/booking/setup' },
        { title: 'Seat Type', href: '/property/space/seat-type' },
        { title: 'Parking', href: '/property/parking' },
        { title: 'Mailroom Inbound', href: '/property/mailroom/inbound' }
      ]
    }
  ];

  const renderMenuItem = (item: any, index: number) => {
    if (item.children) {
      return (
        <Collapsible key={index}>
          <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
            <div className="flex items-center">
              <item.icon className="mr-3 h-5 w-5" />
              <span className="text-sm">{item.title}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-6 mt-1 space-y-1">
            {item.children.map((child: any, childIndex: number) => (
              <NavLink
                key={childIndex}
                to={child.href}
                className={({ isActive }) =>
                  cn(
                    "block px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-colors",
                    isActive && "bg-gray-700 text-white"
                  )
                }
              >
                {child.title}
              </NavLink>
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <NavLink
        key={index}
        to={item.href}
        className={({ isActive }) =>
          cn(
            "flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors",
            isActive && "bg-gray-700 text-white"
          )
        }
      >
        <item.icon className="mr-3 h-5 w-5" />
        <span className="text-sm">{item.title}</span>
      </NavLink>
    );
  };

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </nav>
    </div>
  );
};

export default Sidebar;
