
import React, { useState } from 'react';
import { 
  MapPin, 
  Users, 
  Building, 
  Settings, 
  FileText, 
  AlertTriangle,
  ClipboardList,
  Mail,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Package,
  Wrench,
  Home,
  Download
} from 'lucide-react';

const locationItems = [
  { name: 'Account', href: '/setup/location/account' },
  { name: 'Building', href: '/setup/location/building' },
  { name: 'Wing', href: '/setup/location/wing' },
  { name: 'Area', href: '/setup/location/area' },
  { name: 'Floor', href: '/setup/location/floor' },
  { name: 'Unit', href: '/setup/location/unit' },
];

const roomItems = [
  { name: 'Room Option 1', href: '/setup/location/room-1' },
  { name: 'Room Option 2', href: '/setup/location/room-2' },
];

const userRoleItems = [
  { name: 'Department', href: '/setup/user-role/department' },
];

const roleItems = [
  { name: 'Role Option 1', href: '/setup/user-role/role-1' },
  { name: 'Role Option 2', href: '/setup/user-role/role-2' },
];

const ticketItems = [
  { name: 'Setup', href: '/setup/ticket/setup' },
  { name: 'Escalation', href: '/setup/ticket/escalation' },
];

const costApprovalItems = [
  { name: 'Cost Approval Option 1', href: '/setup/ticket/cost-approval-1' },
  { name: 'Cost Approval Option 2', href: '/setup/ticket/cost-approval-2' },
];

export const SetupSidebar = () => {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isUserRoleOpen, setIsUserRoleOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isCostApprovalOpen, setIsCostApprovalOpen] = useState(false);

  return (
    <div className="w-64 h-screen bg-[#5a4a6b] text-white fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#5a4a6b] font-bold text-sm">S</span>
          </div>
          <span className="text-white font-semibold text-lg">Setup</span>
        </div>
        
        <nav className="space-y-1">
          {/* Location Dropdown */}
          <div>
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                Location
              </div>
              {isLocationOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isLocationOpen && (
              <div className="ml-7 mt-1 space-y-1">
                {locationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 rounded-lg text-sm transition-colors text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    {item.name}
                  </a>
                ))}
                
                {/* Room Dropdown */}
                <div>
                  <button
                    onClick={() => setIsRoomOpen(!isRoomOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <span>Room</span>
                    {isRoomOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isRoomOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {roomItems.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="block px-3 py-2 rounded-lg text-xs transition-colors text-white/70 hover:bg-white/10 hover:text-white"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Role Dropdown */}
          <div>
            <button
              onClick={() => setIsUserRoleOpen(!isUserRoleOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                User Role
              </div>
              {isUserRoleOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isUserRoleOpen && (
              <div className="ml-7 mt-1 space-y-1">
                {userRoleItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 rounded-lg text-sm transition-colors text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    {item.name}
                  </a>
                ))}
                
                {/* Role Dropdown */}
                <div>
                  <button
                    onClick={() => setIsRoleOpen(!isRoleOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <span>Role</span>
                    {isRoleOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isRoleOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {roleItems.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="block px-3 py-2 rounded-lg text-xs transition-colors text-white/70 hover:bg-white/10 hover:text-white"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Individual Items */}
          <a href="/setup/fm-user" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10">
            <Users className="w-4 h-4" />
            FM User
          </a>

          <a href="/setup/occupant-users" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10">
            <Users className="w-4 h-4" />
            Occupant Users
          </a>

          <a href="/setup/meter-type" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10">
            <Settings className="w-4 h-4" />
            Meter Type
          </a>

          <a href="/setup/asset-groups" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10">
            <Package className="w-4 h-4" />
            Asset Groups
          </a>

          <a href="/setup/checklist-group" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10">
            <ClipboardList className="w-4 h-4" />
            Checklist Group
          </a>

          {/* Ticket Dropdown */}
          <div>
            <button
              onClick={() => setIsTicketOpen(!isTicketOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                Ticket
              </div>
              {isTicketOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isTicketOpen && (
              <div className="ml-7 mt-1 space-y-1">
                {ticketItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 rounded-lg text-sm transition-colors text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    {item.name}
                  </a>
                ))}
                
                {/* Cost Approval Dropdown */}
                <div>
                  <button
                    onClick={() => setIsCostApprovalOpen(!isCostApprovalOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <span>Cost Approval</span>
                    {isCostApprovalOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isCostApprovalOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {costApprovalItems.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="block px-3 py-2 rounded-lg text-xs transition-colors text-white/70 hover:bg-white/10 hover:text-white"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Remaining Individual Items */}
          <a href="/setup/task-escalation" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10">
            <AlertTriangle className="w-4 h-4" />
            Task Escalation
          </a>

          <a href="/setup/approval-matrix" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10">
            <ClipboardList className="w-4 h-4" />
            Approval Matrix
          </a>

          <a href="/setup/patrolling-approval" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10">
            <UserCheck className="w-4 h-4" />
            Patrolling Approval
          </a>

          <a href="/setup/email-rule" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10">
            <Mail className="w-4 h-4" />
            Email Rule
          </a>

          <a href="/setup/fm-group" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10">
            <Users className="w-4 h-4" />
            FM Group
          </a>

          <a href="/setup/master-checklist" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10">
            <ClipboardList className="w-4 h-4" />
            Master Checklist
          </a>

          <a href="/setup/sac-hsn-setup" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10">
            <Settings className="w-4 h-4" />
            SAC/HSN Setup
          </a>

          <a href="/setup/address" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10">
            <Home className="w-4 h-4" />
            Address
          </a>

          <a href="/setup/export" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10">
            <Download className="w-4 h-4" />
            Export
          </a>
        </nav>
      </div>
    </div>
  );
};
