import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Settings,
  Users,
  FileText,
  Building2,
  ChevronUp,
  ChevronDown,
  Headset,
  MessageCircle,
  Bell,
  Calendar,
  BarChart3
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: MenuItem[];
}

export const SetupSidebar = () => {
  const location = useLocation();
  const [isSetupExpanded, setIsSetupExpanded] = useState(true);
  const [isCommunicationExpanded, setIsCommunicationExpanded] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const setupMenuItems: MenuItem[] = [
    {
      id: "special-users",
      label: "Special Users Category",
      icon: <Users className="w-5 h-5" />,
      path: "/setup/special-users-category",
    },
    {
      id: "manage-users",
      label: "Manage Users",
      icon: <Users className="w-5 h-5" />,
      path: "/setup/manage-users",
    },
    {
      id: "kyc-details",
      label: "KYC Details",
      icon: <FileText className="w-5 h-5" />,
      path: "/setup/kyc-details",
    },
    {
      id: "manage-flats",
      label: "Manage Flats",
      icon: <Building2 className="w-5 h-5" />,
      path: "/setup/manage-flats",
    },
    {
      id: "helpdesk-setup",
      label: "Helpdesk Setup",
      icon: <Headset className="w-5 h-5" />,
      path: "/setup/helpdesk-setup",
    },
  ];

  const communicationMenuItems: MenuItem[] = [
    {
      id: "notice",
      label: "Notice",
      icon: <Bell className="w-5 h-5" />,
      path: "/communication/notice",
    },
    {
      id: "events",
      label: "Events",
      icon: <Calendar className="w-5 h-5" />,
      path: "/communication/events",
    },
    {
      id: "polls",
      label: "Polls",
      icon: <BarChart3 className="w-5 h-5" />,
      path: "/communication/polls",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      path: "/communication/notifications",
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isParentActive = (subItems?: MenuItem[]) => {
    if (!subItems) return false;
    return subItems.some(item => item.path && location.pathname === item.path);
  };

  const renderMenuItem = (item: MenuItem) => {
    if (item.subItems) {
      const isMenuExpanded = expandedMenus.includes(item.id);
      const hasActiveChild = isParentActive(item.subItems);

      return (
        <div key={item.id}>
          <button
            onClick={() => toggleMenu(item.id)}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-200
              ${
                hasActiveChild
                  ? "bg-[#E8D4BE] text-[#C72031] font-medium"
                  : "text-[#1A1A1A] hover:bg-[#C4B89D54]"
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={hasActiveChild ? "text-[#C72031]" : "text-[#1A1A1A]"}>
                {item.icon}
              </div>
              <span className="text-sm">{item.label}</span>
            </div>
            {isMenuExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {isMenuExpanded && item.subItems && (
            <div className="bg-[#F6F4EE]">
              {item.subItems.map((subItem) => (
                <Link
                  key={subItem.id}
                  to={subItem.path!}
                  className={`w-full flex items-center gap-3 pl-12 pr-4 py-2.5 text-left transition-colors duration-200
                    ${
                      isActive(subItem.path!)
                        ? "bg-[#C4B89D54] text-[#C72031] font-medium border-l-4 border-[#C72031]"
                        : "text-[#1A1A1A] hover:bg-[#C4B89D54]"
                    }`}
                >
                  <div className={isActive(subItem.path!) ? "text-[#C72031]" : "text-[#1A1A1A]"}>
                    {subItem.icon}
                  </div>
                  <span className="text-sm">{subItem.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.path!}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200
          ${
            isActive(item.path!)
              ? "bg-[#C4B89D54] text-[#C72031] font-medium border-l-4 border-[#C72031]"
              : "text-[#1A1A1A] hover:bg-[#C4B89D54]"
          }`}
      >
        <div className={isActive(item.path!) ? "text-[#C72031]" : "text-[#1A1A1A]"}>
          {item.icon}
        </div>
        <span className="text-sm">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-56 bg-[#f6f4ee] shadow-lg z-40 overflow-y-auto border-r border-[#DBC2A9]">
      {/* Setup Header */}
      <div
        className="flex items-center justify-between px-4 py-4 cursor-pointer border-b border-[#DBC2A9] bg-[#C4B89D54]"
        onClick={() => setIsSetupExpanded(!isSetupExpanded)}
      >
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#1A1A1A]" />
          <span className="font-semibold text-[#1A1A1A]">Setup</span>
        </div>
        {isSetupExpanded ? (
          <ChevronUp className="w-5 h-5 text-[#1A1A1A]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#1A1A1A]" />
        )}
      </div>

      {/* Setup Menu Items */}
      {isSetupExpanded && (
        <nav className="py-2">
          {setupMenuItems.map((item) => renderMenuItem(item))}
        </nav>
      )}

      {/* Communication Header */}
      <div
        className="flex items-center justify-between px-4 py-4 cursor-pointer border-b border-[#DBC2A9] bg-[#C4B89D54]"
        onClick={() => setIsCommunicationExpanded(!isCommunicationExpanded)}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#1A1A1A]" />
          <span className="font-semibold text-[#1A1A1A]">Communication</span>
        </div>
        {isCommunicationExpanded ? (
          <ChevronUp className="w-5 h-5 text-[#1A1A1A]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#1A1A1A]" />
        )}
      </div>

      {/* Communication Menu Items */}
      {isCommunicationExpanded && (
        <nav className="py-2">
          {communicationMenuItems.map((item) => renderMenuItem(item))}
        </nav>
      )}
    </div>
  );
};
