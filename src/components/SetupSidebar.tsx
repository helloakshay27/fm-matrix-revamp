import React, { useState } from 'react';
import { 
  MapPin,
  Building,
  Users,
  Settings,
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
  Home,
  ChevronDown,
  ChevronRight,
  Tag
} from 'lucide-react';

const locationItems = [
  { name: 'Account', href: '/setup/location/account' },
  { name: 'Building', href: '/setup/location/building' },
  { name: 'Wing', href: '/setup/location/wing' },
  { name: 'Area', href: '/setup/location/area' },
  { name: 'Floor', href: '/setup/location/floor' },
  { name: 'Unit', href: '/setup/location/unit' },
  { name: 'Room', href: '/setup/location/room' },
];

const userRoleItems = [
  { name: 'Department', href: '/setup/user-role/department' },
  { name: 'Role', href: '/setup/user-role/role' },
];

const ticketItems = [
  { name: 'Setup', href: '/setup/ticket/setup' },
  { name: 'Escalation', href: '/setup/ticket/escalation' },
  { name: 'Cost Approval', href: '/setup/ticket/cost-approval' },
];

export const SetupSidebar = () => {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isUserRoleOpen, setIsUserRoleOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);

  return (
    <div className="w-64 h-screen bg-[#f6f4ee] border-r border-[#D5DbDB] fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#C72030] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-[#1a1a1a] font-semibold text-lg">Setup</span>
        </div>
        
        <nav className="space-y-2">
          {/* Location Dropdown */}
          <div>
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                Location
              </div>
              {isLocationOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isLocationOpen && (
              <div className="ml-8 mt-1 space-y-1">
                {locationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* User Role Dropdown */}
          <div>
            <button
              onClick={() => setIsUserRoleOpen(!isUserRoleOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                User Role
              </div>
              {isUserRoleOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isUserRoleOpen && (
              <div className="ml-8 mt-1 space-y-1">
                {userRoleItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Individual Items */}
          <a href="/setup/fm-user" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
            <Users className="w-5 h-5" />
            FM User
          </a>

          <a href="/setup/occupant-users" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
            <Users className="w-5 h-5" />
            Occupant Users
          </a>

          <a href="/setup/meter-type" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
            <Settings className="w-5 h-5" />
            Meter Type
          </a>

          <a href="/setup/asset-groups" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
            <Building className="w-5 h-5" />
            Asset Groups
          </a>

          <a href="/setup/checklist-group" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
            <CheckSquare className="w-5 h-5" />
            Checklist Group
          </a>

          {/* Ticket Dropdown */}
          <div>
            <button
              onClick={() => setIsTicketOpen(!isTicketOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                Ticket
              </div>
              {isTicketOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isTicketOpen && (
              <div className="ml-8 mt-1 space-y-1">
                {ticketItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="/setup/task-escalation" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
            <AlertTriangle className="w-5 h-5" />
            Task Escalation
          </a>

          <a href="/setup/approval-matrix" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
            <ClipboardList className="w-5 h-5" />
            Approval Matrix
          </a>

          <a href="/setup/patrolling-approval" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
            <Shield className="w-5 h-5" />
            Patrolling Approval
          </a>

          <a href="/setup/email-rule" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
            <Mail className="w-5 h-5" />
            Email Rule
          </a>

          <a href="/setup/fm-group" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
            <Target className="w-5 h-5" />
            FM Group
          </a>

          <a href="/setup/master-checklist" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
            <BookOpen className="w-5 h-5" />
            Master Checklist
          </a>

          <a href="/setup/sac-hsn-setup" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
            <Receipt className="w-5 h-5" />
            SAC/HSN Setup
          </a>

          <a href="/setup/address" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
            <Home className="w-5 h-5" />
            Address
          </a>

          <a href="/setup/tag" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
            <Tag className="w-5 h-5" />
            Tag
          </a>

          <a href="/setup/parking-categories" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
            <Building className="w-5 h-5" />
            Parking Categories
          </a>

          <a href="/setup/export" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
            <FileText className="w-5 h-5" />
            Export
          </a>
        </nav>
      </div>
    </div>
  );
};
