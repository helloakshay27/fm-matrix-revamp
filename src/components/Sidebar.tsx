import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';
import {
  BarChart,
  Building,
  Calendar,
  Car,
  Droplets,
  FileText,
  Home,
  Settings,
  Sun,
  Trash2,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useLayoutContext } from '@/contexts/LayoutContext';

export const Sidebar = () => {
  const location = useLocation();
  const { isSidebarOpen } = useLayoutContext();

  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
      <UISidebar className="bg-[#1E1E1E] text-white border-r border-gray-800">
        <SidebarContent>
          {/* Dashboard Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider">
              Dashboard
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded">
                      <Home className="w-4 h-4" />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Utility Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider">
              Utility
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/utility/energy-meters" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded">
                      <Zap className="w-4 h-4" />
                      <span>Energy Meters</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/utility/water" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded">
                      <Droplets className="w-4 h-4" />
                      <span>Water</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/utility/stp" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded">
                      <Settings className="w-4 h-4" />
                      <span>STP</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/utility/daily-readings" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded">
                      <BarChart className="w-4 h-4" />
                      <span>Daily Readings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/utility/consumption" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded">
                      <TrendingUp className="w-4 h-4" />
                      <span>Utility Consumption</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/utility/ev-consumption" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded">
                      <Car className="w-4 h-4" />
                      <span>EV Consumption</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/utility/solar-generator" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded">
                      <Sun className="w-4 h-4" />
                      <span>Solar Generator</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/utility/utility-request" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded">
                      <FileText className="w-4 h-4" />
                      <span>Utility Request</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/utility/waste-generation" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded">
                      <Trash2 className="w-4 h-4" />
                      <span>Waste Generation</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Property Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider">
              Property
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/property/space/bookings" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded">
                      <Calendar className="w-4 h-4" />
                      <span>Space Bookings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/property/space/seat-type" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded">
                      <Building className="w-4 h-4" />
                      <span>Seat Type</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </UISidebar>
    </SidebarProvider>
  );
};
