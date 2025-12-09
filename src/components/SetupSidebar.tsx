import React, { useState, useEffect } from 'react';
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
  BarChart3,
  Wrench,
  Database,
  Image,
  Globe,
  MapPin,
  Mail,
  Tags,
  GraduationCap,
  MessageSquare,
  Briefcase,
  Shield,
  Gift,
  Home,
  HomeIcon,
  UserPlus,
  Layout,
  HelpCircle,
  UserCheck,
  Award,
  Building
} from 'lucide-react';
import { hasPermission } from '../utils/permission';
import { API_CONFIG } from '@/config/apiConfig';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: MenuItem[];
}

export const SetupSidebar = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const location = useLocation();
  const [isHomeExpanded, setIsHomeExpanded] = useState(false);
  const [isSetupExpanded, setIsSetupExpanded] = useState(false);
  const [isCommunicationExpanded, setIsCommunicationExpanded] = useState(false);
  const [isSetupMemberExpanded, setIsSetupMemberExpanded] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Auto-expand sections based on current route
  useEffect(() => {
    const path = location.pathname;
    
    // Check which section should be expanded
    if (path.startsWith('/setup-member')) {
      // Check if it's a home menu item or setup member item
      const isHomeItem = homeMenuItems.some(item => {
        if (!item.path) return false;
        return isActive(item.path);
      });
      
      if (isHomeItem) {
        setIsHomeExpanded(true);
        setIsSetupExpanded(false);
        setIsCommunicationExpanded(false);
        setIsSetupMemberExpanded(false);
      } else {
        setIsHomeExpanded(false);
        setIsSetupExpanded(false);
        setIsCommunicationExpanded(false);
        setIsSetupMemberExpanded(true);
        
        // Auto-expand loyalty submenu if on a loyalty page
        setupMemberMenuItems.forEach(item => {
          if (item.subItems && isParentActive(item.subItems)) {
            setExpandedMenus(prev => prev.includes(item.id) ? prev : [...prev, item.id]);
          }
        });
      }
    } else if (path.startsWith('/setup')) {
      setIsHomeExpanded(false);
      setIsSetupExpanded(true);
      setIsCommunicationExpanded(false);
      setIsSetupMemberExpanded(false);
    } else if (path.startsWith('/communication')) {
      setIsHomeExpanded(false);
      setIsSetupExpanded(false);
      setIsCommunicationExpanded(true);
      setIsSetupMemberExpanded(false);
    }
  }, [location.pathname]);

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
  console.log("hasPermission:--",hasPermission);
  
  // Home menu items with permissions
  const homeMenuItems: MenuItem[] = [
     {
      id: "project",
      label: "Project",
      icon: <Layout className="w-5 h-5" />,
      path: "/setup-member/project-details-list",
    },
    {
      id: "banner",
      label: "Banner",
      icon: <Image className="w-5 h-5" />,
      path: "/setup-member/banner-list",
    },
    {
      id: "testimonial",
      label: "Testimonial",
      icon: <MessageSquare className="w-5 h-5" />,
      path: "/setup-member/testimonial-list",
    },
    {
      id: "event",
      label: "Event",
      icon: <Calendar className="w-5 h-5" />,
      path: "/setup-member/event-list",
    },
    {
      id: "broadcast",
      label: "Broadcast",
      icon: <Bell className="w-5 h-5" />,
      path: "/setup-member/noticeboard-list",
    },
    {
      id: "specification",
      label: "Specification",
      icon: <FileText className="w-5 h-5" />,
      path: "/setup-member/specification-list",
    },
    {
      id: "organization",
      label: "Organization",
      icon: <Building2 className="w-5 h-5" />,
      path: "/setup-member/organization-list",
    },
    {
      id: "company",
      label: "Company",
      icon: <Building className="w-5 h-5" />,
      path: "/setup-member/company-list",
    },
    {
      id: "site",
      label: "Site",
      icon: <MapPin className="w-5 h-5" />,
      path: "/setup-member/site-list",
    },
    // {
    //   id: "support-service",
    //   label: "Support Service",
    //   icon: <Headset className="w-5 h-5" />,
    //   path: "/setup-member/support-service-list",
    // },
    {
      id: "press-releases",
      label: "Press Releases",
      icon: <FileText className="w-5 h-5" />,
      path: "/setup-member/press-releases-list",
    },
    {
      id: "faq",
      label: "FAQ",
      icon: <HelpCircle className="w-5 h-5" />,
      path: "/setup-member/faq-list",
    },
    {
      id: "referral-program",
      label: "Referral Program",
      icon: <UserCheck className="w-5 h-5" />,
      path: "/setup-member/referral-program-list",
    },
  ].filter(Boolean);

  const setupMemberMenuItems: MenuItem[] = [
    {
      id: "user-list",
      label: "User Module",
      icon: <Users className="w-5 h-5" />,
      path: "/setup-member/user-list",
    },
    {
      id: "lock-role-list",
      label: "User Role",
      icon: <Shield className="w-5 h-5" />,
      path: "/setup-member/lock-role-list",
    },
    {
      id: "lock-function-list",
      label: "Lock Function",
      icon: <Shield className="w-5 h-5" />,
      path: "/setup-member/lock-function-list",
    },
    {
      id: "banks-list",
      label: "Banks",
      icon: <Database className="w-5 h-5" />,
      path: "/setup-member/banks-list",
    },
    {
      id: "home-loan-list",
      label: "Home Loans",
      icon: <Home className="w-5 h-5" />,
      path: "/setup-member/home-loan-list",
    },
    {
      id: "loan-manager-list",
      label: "Loan Managers",
      icon: <Users className="w-5 h-5" />,
      path: "/setup-member/loan-manager-list",
    },
    {
      id: "property-type-list",
      label: "Property Types",
      icon: <Home className="w-5 h-5" />,
      path: "/setup-member/property-type-list",
    },
    {
      id: "project-building-type-list",
      label: "Project Building",
      icon: <Building2 className="w-5 h-5" />,
      path: "/setup-member/project-building-type-list",
    },
    {
      id: "construction-status-list",
      label: "Construction Status",
      icon: <BarChart3 className="w-5 h-5" />,
      path: "/setup-member/construction-status-list",
    },
    {
      id: "construction-updates-list",
      label: "Construction Updates",
      icon: <FileText className="w-5 h-5" />,
      path: "/setup-member/construction-updates-list",
    },
    {
      id: "project-configuration-list",
      label: "Project Config",
      icon: <Settings className="w-5 h-5" />,
      path: "/setup-member/project-configuration-list",
    },
    {
      id: "amenities-list",
      label: "Amenities",
      icon: <Gift className="w-5 h-5" />,
      path: "/setup-member/amenities-list",
    },
    {
      id: "department-list",
      label: "Department",
      icon: <Building className="w-5 h-5" />,
      path: "/setup-member/department-list",
    },
    {
      id: "visitslot-list",
      label: "Visit Slot",
      icon: <Calendar className="w-5 h-5" />,
      path: "/setup-member/site-visit-slot-config-list",
    },
    {
      id: "tds-tutorials-list",
      label: "TDS Tutorials",
      icon: <GraduationCap className="w-5 h-5" />,
      path: "/setup-member/tds-tutorials-list",
    },
    {
      id: "plus-services-list",
      label: "Plus Services",
      icon: <Headset className="w-5 h-5" />,
      path: "/setup-member/plus-services-list",
    },
    {
      id: "smtp-settings-list",
      label: "SMTP Settings",
      icon: <Mail className="w-5 h-5" />,
      path: "/setup-member/smtp-settings-list",
    },
    {
      id: "faq-category-list",
      label: "FAQ Category",
      icon: <HelpCircle className="w-5 h-5" />,
      path: "/setup-member/faq-category-list",
    },
    {
      id: "faq-subcategory-list",
      label: "FAQ SubCategory",
      icon: <HelpCircle className="w-5 h-5" />,
      path: "/setup-member/faq-subcategory-list",
    },
    // Loyalty submenu
    {
      id: "loyalty",
      label: "Loyalty",
      icon: <Gift className="w-5 h-5" />,
      subItems: [
        { id: "loyalty-members", label: "Members", icon: <Users className="w-4 h-4" />, path: "/setup-member/loyalty-members-list" },
        { id: "loyalty-tiers", label: "Tiers", icon: <Award className="w-4 h-4" />, path: "/setup-member/loyalty-tiers-list" },
        { id: "rule-engine", label: "Rule Engine", icon: <Settings className="w-4 h-4" />, path: "/setup-member/rule-engine-list" },
        { id: "loyalty-referral", label: "Referrals", icon: <UserCheck className="w-4 h-4" />, path: "/setup-member/referral-list" },
        { id: "lock-payments", label: "Lock Payments", icon: <Shield className="w-4 h-4" />, path: "/setup-member/lock-payments-list" },
        { id: "home-loan-requests", label: "Home Loan Requests", icon: <Home className="w-4 h-4" />, path: "/setup-member/home-loan-requests-list" },
        { id: "demand-notes", label: "Demand Notes", icon: <FileText className="w-4 h-4" />, path: "/setup-member/demand-notes-list" },
        { id: "orders", label: "Orders", icon: <Briefcase className="w-4 h-4" />, path: "/setup-member/orders-list" },
        { id: "encash", label: "Encash", icon: <Gift className="w-4 h-4" />, path: "/setup-member/encash-list" },
      ]
    },
  ];

  const isActive = (path: string) => {
    // Exact match
    if (location.pathname === path) return true;
    
    // Check if current path is a child route of the menu item
    // For example: /setup-member/banner-add or /setup-member/banner-edit/:id should activate /setup-member/banner-list
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const menuPathSegments = path.split('/').filter(Boolean);
    
    // If the base segments match, consider it active
    // This handles cases like:
    // - /setup-member/banner-list (list page)
    // - /setup-member/banner-add (create page)
    // - /setup-member/banner-edit/123 (edit page)
    if (menuPathSegments.length >= 2 && pathSegments.length >= 2) {
      const menuBase = menuPathSegments.slice(0, 2).join('/'); // e.g., "setup-member/banner"
      const currentBase = pathSegments.slice(0, 2).join('/');
      
      // Extract the module name (e.g., "banner" from "banner-list")
      const menuModule = menuPathSegments[1].replace(/-list$/, '').replace(/-create$/, '').replace(/-add$/, '');
      const currentModule = pathSegments[1].split('-')[0]; // Get first part before hyphen
      
      // Check if the modules match
      if (menuPathSegments[0] === pathSegments[0] && menuModule === currentModule) {
        return true;
      }
    }
    
    return false;
  };

  const isParentActive = (subItems?: MenuItem[]) => {
    if (!subItems) return false;
    return subItems.some(item => {
      if (!item.path) return false;
      
      // Check exact match
      if (location.pathname === item.path) return true;
      
      // Check if current path is related to the menu item
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const menuPathSegments = item.path.split('/').filter(Boolean);
      
      if (menuPathSegments.length >= 2 && pathSegments.length >= 2) {
        const menuModule = menuPathSegments[1].replace(/-list$/, '').replace(/-create$/, '').replace(/-add$/, '');
        const currentModule = pathSegments[1].split('-')[0];
        
        if (menuPathSegments[0] === pathSegments[0] && menuModule === currentModule) {
          return true;
        }
      }
      
      return false;
    });
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
                  ? "bg-[#E8D4BE] text-[#C72030] font-medium"
                  : "text-[#1A1A1A] hover:bg-[#C4B89D54]"
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={hasActiveChild ? "text-[#C72030]" : "text-[#1A1A1A]"}>
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
                        ? "bg-[#C4B89D54] text-[#C72030] font-medium border-l-4 border-[#C72030]"
                        : "text-[#1A1A1A] hover:bg-[#C4B89D54]"
                    }`}
                >
                  <div className={isActive(subItem.path!) ? "text-[#C72030]" : "text-[#1A1A1A]"}>
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
              ? "bg-[#C4B89D54] text-[#C72030] font-medium border-l-4 border-[#C72030]"
              : "text-[#1A1A1A] hover:bg-[#C4B89D54]"
          }`}
      >
        <div className={isActive(item.path!) ? "text-[#C72030]" : "text-[#1A1A1A]"}>
          {item.icon}
        </div>
        <span className="text-sm">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-56 bg-[#f6f4ee] shadow-lg z-40 overflow-y-auto border-r border-[#DBC2A9]">
      {/* Home Section */}
      {homeMenuItems.length > 0 && (
        <>
          <div
            className="flex items-center justify-between px-4 py-4 cursor-pointer border-b border-[#DBC2A9] bg-[#C4B89D54]"
            onClick={() => setIsHomeExpanded(!isHomeExpanded)}
          >
            <div className="flex items-center gap-2">
              <HomeIcon className="w-5 h-5 text-[#1A1A1A]" />
              <span className="font-semibold text-[#1A1A1A]">Home</span>
            </div>
            {isHomeExpanded ? (
              <ChevronUp className="w-5 h-5 text-[#1A1A1A]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#1A1A1A]" />
            )}
          </div>

          {isHomeExpanded && (
            <nav className="py-2">
              {homeMenuItems.map((item) => renderMenuItem(item))}
            </nav>
          )}
        </>
      )}

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

      {/* Setup Member Header */}
      <div
        className="flex items-center justify-between px-4 py-4 cursor-pointer border-b border-[#DBC2A9] bg-[#C4B89D54]"
        onClick={() => setIsSetupMemberExpanded(!isSetupMemberExpanded)}
      >
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-[#1A1A1A]" />
          <span className="font-semibold text-[#1A1A1A]">Setup Member</span>
        </div>
        {isSetupMemberExpanded ? (
          <ChevronUp className="w-5 h-5 text-[#1A1A1A]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#1A1A1A]" />
        )}
      </div>

      {/* Setup Member Menu Items */}
      {isSetupMemberExpanded && (
        <nav className="py-2">
          {setupMemberMenuItems.map((item) => renderMenuItem(item))}
        </nav>
      )}
    </div>
  );
};
