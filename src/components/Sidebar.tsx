import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar, Settings, ChevronRight, ChevronDown, Mail } from 'lucide-react';
import {
  Sidebar as RadixSidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './ui/sidebar';

export const Sidebar: React.FC = () => {
  return (
    <RadixSidebar>
      <SidebarTrigger asChild>
        <button className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground h-9 w-9">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </button>
      </SidebarTrigger>
      <SidebarContent className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <Link to="/" className="flex items-center space-x-2 font-semibold">
            <Home className="w-6 h-6 text-gray-500" />
            <span>Dashboard</span>
          </Link>
        </div>

        <div className="py-4">
          {/* Property */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-orange-500 font-semibold">Property</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/property/space/bookings" className="text-gray-700 hover:text-orange-500">
                      <Calendar className="w-4 h-4" />
                      <span>Bookings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/property/booking/setup" className="text-gray-700 hover:text-orange-500">
                      <Settings className="w-4 h-4" />
                      <span>Booking Setup</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/property/space/seat-type" className="text-gray-700 hover:text-orange-500">
                      <ChevronRight className="w-4 h-4" />
                      <span>Seat Type</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="text-gray-700 hover:text-orange-500">
                        <Mail className="w-4 h-4" />
                        <span>Mailroom</span>
                        <ChevronDown className="w-4 h-4 ml-auto" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenu className="ml-4">
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <Link to="/property/mailroom/inbound" className="text-gray-600 hover:text-orange-500">
                              <ChevronRight className="w-4 h-4" />
                              <span>Inbound</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Main Sections */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-500 font-semibold">Maintenance</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/services" className="text-gray-700 hover:text-blue-500">Services</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/supplier" className="text-gray-700 hover:text-blue-500">Supplier</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/schedule" className="text-gray-700 hover:text-blue-500">Schedule</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/amc" className="text-gray-700 hover:text-blue-500">AMC</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/attendance" className="text-gray-700 hover:text-blue-500">Attendance</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/tasks" className="text-gray-700 hover:text-blue-500">Tasks</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/operational-audit/scheduled" className="text-gray-700 hover:text-blue-500">Operational Audit</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/vendor-audit/scheduled" className="text-gray-700 hover:text-blue-500">Vendor Audit</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/surveys/list" className="text-gray-700 hover:text-blue-500">Surveys</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/assets/inactive" className="text-gray-700 hover:text-blue-500">Assets</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-green-500 font-semibold">Project</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/projects" className="text-gray-700 hover:text-green-500">Projects</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-purple-500 font-semibold">Finance</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/finance/material-pr" className="text-gray-700 hover:text-purple-500">Material PR</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/finance/service-pr" className="text-gray-700 hover:text-purple-500">Service PR</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/finance/po" className="text-gray-700 hover:text-purple-500">PO</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/finance/wo" className="text-gray-700 hover:text-purple-500">WO</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/finance/grn" className="text-gray-700 hover:text-purple-500">GRN</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/finance/invoices-ses" className="text-gray-700 hover:text-purple-500">Invoices SES</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/finance/pending-approvals" className="text-gray-700 hover:text-purple-500">Pending Approvals</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/finance/gdn" className="text-gray-700 hover:text-purple-500">GDN</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/finance/auto-saved-pr" className="text-gray-700 hover:text-purple-500">Auto Saved PR</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/finance/wbs-element" className="text-gray-700 hover:text-purple-500">WBS Element</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/finance/other-bills" className="text-gray-700 hover:text-purple-500">Other Bills</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/finance/accounting" className="text-gray-700 hover:text-purple-500">Accounting</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/finance/customer-bills" className="text-gray-700 hover:text-purple-500">Customer Bills</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/finance/my-bills" className="text-gray-700 hover:text-purple-500">My Bills</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-orange-500 font-semibold">Visitors</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/visitors/visitors" className="text-gray-700 hover:text-orange-500">Visitors</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/visitors/history" className="text-gray-700 hover:text-orange-500">History</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/visitors/r-vehicles" className="text-gray-700 hover:text-orange-500">R Vehicles</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/visitors/r-vehicles/history" className="text-gray-700 hover:text-orange-500">R Vehicles History</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/visitors/g-vehicles" className="text-gray-700 hover:text-orange-500">G Vehicles</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/visitors/staffs" className="text-gray-700 hover:text-orange-500">Staffs</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/visitors/materials" className="text-gray-700 hover:text-orange-500">Materials</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/visitors/patrolling" className="text-gray-700 hover:text-orange-500">Patrolling</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/visitors/patrolling-pending" className="text-gray-700 hover:text-orange-500">Patrolling Pending</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/visitors/goods" className="text-gray-700 hover:text-orange-500">Goods In Out</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/visitors/goods/inwards" className="text-gray-700 hover:text-orange-500">Inwards</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/visitors/goods/outwards" className="text-gray-700 hover:text-orange-500">Outwards</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/visitors/vehicle-parkings" className="text-gray-700 hover:text-orange-500">Vehicle Parking</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-teal-500 font-semibold">Experience</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/experience/events" className="text-gray-700 hover:text-teal-500">Events</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/experience/broadcast" className="text-gray-700 hover:text-teal-500">Broadcast</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/experience/business" className="text-gray-700 hover:text-teal-500">Business Directory</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/experience/documents/unit" className="text-gray-700 hover:text-teal-500">Unit Documents</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/experience/documents/common" className="text-gray-700 hover:text-teal-500">Common Documents</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/experience/transport/outstation" className="text-gray-700 hover:text-teal-500">Outstation</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/experience/transport/airline" className="text-gray-700 hover:text-teal-500">Airline</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/experience/transport/rail" className="text-gray-700 hover:text-teal-500">Rail</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/experience/transport/hotel" className="text-gray-700 hover:text-teal-500">Hotel</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/experience/transport/self-travel" className="text-gray-700 hover:text-teal-500">Self Travel</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/experience/testimonials" className="text-gray-700 hover:text-teal-500">Testimonials</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/experience/company-partners" className="text-gray-700 hover:text-teal-500">Company Partners</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </RadixSidebar>
  );
};
