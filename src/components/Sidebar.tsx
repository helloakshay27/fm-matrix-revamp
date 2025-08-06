import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  Calendar, 
  Users, 
  Building, 
  Wrench, 
  ClipboardList, 
  FileText, 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  BarChart3, 
  ChevronDown, 
  ChevronRight, 
  Menu,
  X,
  User,
  LogOut,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  Lock
} from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModeToggle } from "@/components/mode-toggle"
import { Skeleton } from "@/components/ui/skeleton"

interface SidebarItem {
  name: string;
  icon: React.ElementType;
  href?: string;
  hasChildren?: boolean;
  children?: SidebarItem[];
}

const mockNotifications = [
  {
    id: '1',
    message: 'Your request has been approved',
    time: '5 minutes ago',
    status: 'success'
  },
  {
    id: '2',
    message: 'New work order assigned to you',
    time: '30 minutes ago',
    status: 'info'
  },
  {
    id: '3',
    message: 'Asset maintenance is overdue',
    time: '1 hour ago',
    status: 'warning'
  },
  {
    id: '4',
    message: 'Your request has been approved',
    time: '5 minutes ago',
    status: 'success'
  },
  {
    id: '5',
    message: 'New work order assigned to you',
    time: '30 minutes ago',
    status: 'info'
  },
  {
    id: '6',
    message: 'Asset maintenance is overdue',
    time: '1 hour ago',
    status: 'warning'
  },
  {
    id: '7',
    message: 'Your request has been approved',
    time: '5 minutes ago',
    status: 'success'
  },
  {
    id: '8',
    message: 'New work order assigned to you',
    time: '30 minutes ago',
    status: 'info'
  },
  {
    id: '9',
    message: 'Asset maintenance is overdue',
    time: '1 hour ago',
    status: 'warning'
  }
];

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    icon: Home,
    href: '/'
  },
  {
    name: 'Asset Management',
    icon: Package,
    hasChildren: true,
    children: [
      { name: 'Asset Register', icon: Package, href: '/asset-management/asset-register' },
      { name: 'Asset Transfer', icon: Package, href: '/asset-management/asset-transfer' },
      { name: 'Asset Disposal', icon: Package, href: '/asset-management/asset-disposal' },
      { name: 'AMC', icon: Package, href: '/asset-management/amc' },
      { name: 'Warranty', icon: Package, href: '/asset-management/warranty' }
    ]
  },
  {
    name: 'Maintenance',
    icon: Wrench,
    hasChildren: true,
    children: [
      { name: 'Work Order', icon: Wrench, href: '/maintenance/work-order' },
      { name: 'PPM', icon: Wrench, href: '/maintenance/ppm' },
      { name: 'Breakdown', icon: Wrench, href: '/maintenance/breakdown' },
      { name: 'Checklist', icon: Wrench, href: '/maintenance/checklist' },
      { name: 'Attendance', icon: Wrench, href: '/maintenance/attendance' },
      { name: 'M Safe', icon: Shield, href: '/maintenance/m-safe' }
    ]
  },
  {
    name: 'Inventory',
    icon: ShoppingCart,
    hasChildren: true,
    children: [
      { name: 'Stock Management', icon: ShoppingCart, href: '/inventory/stock-management' },
      { name: 'Purchase Order', icon: ShoppingCart, href: '/inventory/purchase-order' },
      { name: 'Vendor Management', icon: ShoppingCart, href: '/inventory/vendor-management' }
    ]
  },
  {
    name: 'Energy Management',
    icon: Zap,
    hasChildren: true,
    children: [
      { name: 'Energy Dashboard', icon: Zap, href: '/energy/dashboard' },
      { name: 'Consumption Analysis', icon: Zap, href: '/energy/consumption' }
    ]
  },
  {
    name: 'Master',
    icon: Settings,
    href: '/master'
  },
  {
    name: 'Reports',
    icon: BarChart3,
    hasChildren: true,
    children: [
      { name: 'Asset Reports', icon: BarChart3, href: '/reports/asset' },
      { name: 'Maintenance Reports', icon: BarChart3, href: '/reports/maintenance' },
      { name: 'Inventory Reports', icon: BarChart3, href: '/reports/inventory' }
    ]
  }
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isSidebarCollapsed, toggleSidebarCollapse } = useLayout();
  const [isClosing, setIsClosing] = useState(false);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const renderMenuItem = (item: SidebarItem, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.name);
    const hasActiveChild = item.children?.some((child: SidebarItem) => child.href && isActiveRoute(child.href));
    const isActive = item.href && isActiveRoute(item.href);

    if (item.hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpanded(item.name)}
            className={`flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-colors hover:bg-accent hover:text-accent-foreground ${isActive || hasActiveChild ? 'text-primary' : 'text-muted-foreground'}`}
            style={{ paddingLeft: `${16 + (level * 12)}px` }}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              {item.name}
            </div>
            {isExpanded ?
              <ChevronDown className="w-4 h-4" /> :
              <ChevronRight className="w-4 h-4" />
            }
          </button>
          {isExpanded && (
            <div className="space-y-1">
              {item.children?.map((child: SidebarItem) => (
                <div key={child.name}>
                  <button
                    onClick={() => child.href && handleNavigation(child.href)}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${child.href && isActiveRoute(child.href) ? 'text-primary' : 'text-muted-foreground'}`}
                    style={{ paddingLeft: `${28 + (level * 12)}px` }}
                  >
                    {child.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.name}>
        <button
          onClick={() => item.href && handleNavigation(item.href)}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          style={{ paddingLeft: `${16 + (level * 12)}px` }}
        >
          <item.icon className="w-5 h-5" />
          {item.name}
        </button>
      </div>
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-2 left-2 z-50 p-2 bg-secondary rounded-md shadow-md md:hidden"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 h-full bg-background border-r border-border shadow-sm transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isSidebarCollapsed ? 'w-16' : 'w-64'} md:w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between py-4 px-3 h-16 border-b">
            <Link to="/" className="flex items-center space-x-2 font-semibold">
              <Package className="w-6 h-6" />
              {!isSidebarCollapsed && <span>Facility Management</span>}
            </Link>
            <ModeToggle />
          </div>

          {/* User Info */}
          <div className="py-4 px-3 border-b">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
                        <AvatarFallback>FM</AvatarFallback>
                      </Avatar>
                      {!isSidebarCollapsed && <div className="space-y-0.5">
                        <p className="text-sm font-medium leading-none">John Doe</p>
                        <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                      </div>}
                    </div>
                    {!isSidebarCollapsed && <ChevronDown className="w-4 h-4 opacity-50" />}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4 px-3">
            <nav className="grid gap-2">
              {sidebarItems.map((item) => renderMenuItem(item))}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="py-4 px-3 border-t">
            <button
              onClick={toggleSidebarCollapse}
              className="flex items-center justify-center w-full gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-secondary"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              {!isSidebarCollapsed && <span>Collapse</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ChevronLeft = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);
