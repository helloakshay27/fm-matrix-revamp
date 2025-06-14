import * as React from "react";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  Home,
  ListChecks,
  LucideIcon,
  MessageSquare,
  Settings,
  ShoppingCart,
  SquareKanban,
  User2,
  Users,
  Zap,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  ParkingSquare,
  Bell,
  Ticket,
  Coins,
  BarChart4,
  File,
  Truck,
  Store,
  CalendarClock,
  BadgeCheck,
  Landmark,
  Lightbulb,
  TrendingUp,
  Mailbox,
  Newspaper,
  Bus,
  Hotel,
  Globe2,
  ThumbsUp,
  Building2,
  CircleUserRound,
  ScrollText,
  Car,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  FileSearch2,
  Layout,
  FileSignature,
  FileAlert,
  PenBox,
  Puzzle,
  Factory,
  Waves,
  Droplets,
  GaugeCircle,
  ChargingPile,
  SolarPanel,
  PackageCheck,
  Recycle
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useState } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  navItems?: NavItem[];
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Services", href: "/services", icon: Settings },
  { name: "Supplier", href: "/supplier", icon: Truck },
  { name: "Schedule", href: "/schedule", icon: CalendarClock },
  { name: "AMC", href: "/amc", icon: BadgeCheck },
  { name: "Attendance", href: "/attendance", icon: User2 },
  { name: "Tasks", href: "/tasks", icon: ListChecks },
  { name: "Vendor", href: "/vendor", icon: Store },
  { name: "Schedule List", href: "/schedule-list", icon: CalendarDays },
  { name: "Task List", href: "/task-list", icon: ClipboardList },
  { name: "Tickets", href: "/tickets", icon: Ticket },
  { name: "Operational Audit", href: "/operational-audit/scheduled", icon: FileText },
  { name: "Maintenance", href: "/maintenance/vendor-audit/scheduled", icon: Settings },
  { name: "Surveys", href: "/surveys/list", icon: MessageSquare },
  { name: "Assets", href: "/assets/inactive", icon: Building2 },
  { name: "Projects", href: "/projects", icon: Landmark },
  { name: "Utility", href: "/utility/energy-meters", icon: Zap },
  { name: "Finance", href: "/finance/material-pr", icon: Coins },
  { name: "Property", href: "/property/space/bookings", icon: Home },
  { name: "Visitors", href: "/visitors/visitors", icon: Users },
  { name: "Experience", href: "/experience/events", icon: Lightbulb },
  { name: "Tickets", href: "/tickets/add", icon: Ticket },
  { name: "CRM", href: "/crm/customers", icon: TrendingUp },
];

const Sidebar = () => {
  const [isUtilityOpen, setIsUtilityOpen] = useState(false);
  const [isWasteGenerationOpen, setIsWasteGenerationOpen] = useState(false);

  return (
    <div className="w-64 h-screen bg-[#5A1A2B] text-white border-r border-[#D5DbDB] fixed left-0 top-0 overflow-y-auto z-10">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#C72030] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-white font-semibold text-lg">Dashboard</span>
        </div>
      </div>
      
      <nav className="mt-8">
        {navItems.slice(0, 12).map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="flex items-center gap-3 px-6 py-2 text-sm hover:bg-[#6A2A3B] transition-colors"
          >
            <item.icon className="w-4 h-4" />
            <span>{item.name}</span>
          </Link>
        ))}
        
        {/* Utility Section */}
        <div className="mb-4">
          <button
            onClick={() => setIsUtilityOpen(!isUtilityOpen)}
            className="flex items-center justify-between w-full px-6 py-2 text-sm hover:bg-[#6A2A3B] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4" />
              <span>Utility</span>
            </div>
            {isUtilityOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          
          {isUtilityOpen && (
            <div className="ml-6 mt-2 space-y-1">
              <a href="/utility/energy-meters" className="block px-6 py-2 text-sm hover:bg-[#6A2A3B] transition-colors">
                Energy Meters
              </a>
              <a href="/utility/water" className="block px-6 py-2 text-sm hover:bg-[#6A2A3B] transition-colors">
                Water
              </a>
              <a href="/utility/stp" className="block px-6 py-2 text-sm hover:bg-[#6A2A3B] transition-colors">
                STP
              </a>
              <a href="/utility/daily-readings" className="block px-6 py-2 text-sm hover:bg-[#6A2A3B] transition-colors">
                Daily Readings
              </a>
              <a href="/utility/consumption" className="block px-6 py-2 text-sm hover:bg-[#6A2A3B] transition-colors">
                Consumption
              </a>
              <a href="/utility/ev-consumption" className="block px-6 py-2 text-sm hover:bg-[#6A2A3B] transition-colors">
                EV Consumption
              </a>
              <a href="/utility/solar-generator" className="block px-6 py-2 text-sm hover:bg-[#6A2A3B] transition-colors">
                Solar Generator
              </a>
              <a href="/utility/utility-request" className="block px-6 py-2 text-sm hover:bg-[#6A2A3B] transition-colors">
                Utility Request
              </a>
              
              {/* Waste Generation Submenu */}
              <div>
                <button
                  onClick={() => setIsWasteGenerationOpen(!isWasteGenerationOpen)}
                  className="flex items-center justify-between w-full px-6 py-2 text-sm hover:bg-[#6A2A3B] transition-colors"
                >
                  <span>Waste Generation</span>
                  {isWasteGenerationOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
                
                {isWasteGenerationOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    <a href="/utility/waste-generation" className="block px-6 py-2 text-sm hover:bg-[#6A2A3B] transition-colors">
                      Waste Generation
                    </a>
                    <a href="/utility/waste-generation/setup" className="block px-6 py-2 text-sm hover:bg-[#6A2A3B] transition-colors">
                      Setup
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {navItems.slice(13).map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="flex items-center gap-3 px-6 py-2 text-sm hover:bg-[#6A2A3B] transition-colors"
          >
            <item.icon className="w-4 h-4" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export { Sidebar };
