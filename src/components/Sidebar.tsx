import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight, Home, Building, Users, Calendar, ClipboardList, FileText, Wrench, Car, Camera, Globe, Plane, Receipt, Settings, CheckSquare, AlertTriangle, Shield, Lightbulb, Package } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon?: React.ReactNode
  disabled?: boolean
  external?: boolean
  label?: string
}

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  items?: NavItem[]
}

const MainSidebar: React.FC<SidebarProps> = ({ className, items, ...props }) => {
  const { pathname } = useLocation()

  const navigation = [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          href: "/",
          icon: <Home className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          title: "Services",
          href: "/services",
          icon: <ClipboardList className="mr-2 h-4 w-4" />,
        },
        {
          title: "Supplier",
          href: "/supplier",
          icon: <Users className="mr-2 h-4 w-4" />,
        },
        {
          title: "Schedule",
          href: "/schedule",
          icon: <Calendar className="mr-2 h-4 w-4" />,
        },
        {
          title: "AMC",
          href: "/amc",
          icon: <FileText className="mr-2 h-4 w-4" />,
        },
        {
          title: "Attendance",
          href: "/attendance",
          icon: <Users className="mr-2 h-4 w-4" />,
        },
        {
          title: "Tasks",
          href: "/tasks",
          icon: <ClipboardList className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      title: "Maintenance",
      items: [
        {
          title: "Operational Audit",
          items: [
            {
              title: "Scheduled",
              href: "/operational-audit/scheduled",
            },
            {
              title: "Conducted",
              href: "/operational-audit/conducted",
            },
            {
              title: "Master Checklists",
              href: "/operational-audit/master-checklists",
            },
          ],
        },
        {
          title: "Vendor Audit",
          items: [
            {
              title: "Scheduled",
              href: "/maintenance/vendor-audit/scheduled",
            },
            {
              title: "Conducted",
              href: "/maintenance/vendor-audit/conducted",
            },
          ],
        },
        {
          title: "Incident",
          items: [
            {
              title: "Setup",
              href: "/maintenance/incident/setup",
            },
            {
              title: "List",
              href: "/maintenance/incident/list",
            },
          ],
        },
        {
          title: "Permit",
          items: [
            {
              title: "Setup",
              href: "/maintenance/permit/setup",
            },
            {
              title: "List",
              href: "/maintenance/permit/list",
            },
            {
              title: "Pending Approvals",
              href: "/maintenance/permit/pending-approvals",
            },
          ],
        },
        {
          title: "Design Insights",
          items: [
            {
              title: "List",
              href: "/maintenance/design-insights/list",
            },
            {
              title: "Setup",
              href: "/maintenance/design-insights/setup",
            },
          ],
        },
        {
          title: "Inventory",
          href: "/maintenance/inventory",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
        {
          title: "Inactive Assets",
          href: "/assets/inactive",
          icon: <Wrench className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      title: "Surveys",
      items: [
        {
          title: "List",
          href: "/surveys/list",
          icon: <ClipboardList className="mr-2 h-4 w-4" />,
        },
        {
          title: "Mapping",
          href: "/surveys/mapping",
          icon: <Globe className="mr-2 h-4 w-4" />,
        },
        {
          title: "Response",
          href: "/surveys/response",
          icon: <Users className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      title: "Finance",
      items: [
        {
          title: "Material PR",
          href: "/finance/material-pr",
          icon: <Receipt className="mr-2 h-4 w-4" />,
        },
        {
          title: "Service PR",
          href: "/finance/service-pr",
          icon: <Receipt className="mr-2 h-4 w-4" />,
        },
        {
          title: "PO",
          href: "/finance/po",
          icon: <Receipt className="mr-2 h-4 w-4" />,
        },
        {
          title: "WO",
          href: "/finance/wo",
          icon: <Receipt className="mr-2 h-4 w-4" />,
        },
        {
          title: "GRN",
          href: "/finance/grn",
          icon: <Receipt className="mr-2 h-4 w-4" />,
        },
        {
          title: "Invoices SES",
          href: "/finance/invoices-ses",
          icon: <Receipt className="mr-2 h-4 w-4" />,
        },
        {
          title: "Pending Approvals",
          href: "/finance/pending-approvals",
          icon: <AlertTriangle className="mr-2 h-4 w-4" />,
        },
        {
          title: "GDN",
          href: "/finance/gdn",
          icon: <Receipt className="mr-2 h-4 w-4" />,
        },
        {
          title: "Auto Saved PR",
          href: "/finance/auto-saved-pr",
          icon: <Receipt className="mr-2 h-4 w-4" />,
        },
        {
          title: "WBS Element",
          href: "/finance/wbs-element",
          icon: <Receipt className="mr-2 h-4 w-4" />,
        },
        {
          title: "Other Bills",
          href: "/finance/other-bills",
          icon: <Receipt className="mr-2 h-4 w-4" />,
        },
        {
          title: "Accounting",
          href: "/finance/accounting",
          icon: <Receipt className="mr-2 h-4 w-4" />,
        },
        {
          title: "Customer Bills",
          href: "/finance/customer-bills",
          icon: <Receipt className="mr-2 h-4 w-4" />,
        },
         {
          title: "My Bills",
          href: "/finance/my-bills",
          icon: <Receipt className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      title: "Property",
      items: [
        {
          title: "Space",
          items: [
            {
              title: "Bookings",
              href: "/property/space/bookings",
            },
            {
              title: "Seat Type",
              href: "/property/space/seat-type",
            },
          ],
        },
        {
          title: "Booking",
          items: [
            {
              title: "Setup",
              href: "/property/booking/setup",
            },
          ],
        },
        {
          title: "Parking",
          href: "/property/parking",
          icon: <Car className="mr-2 h-4 w-4" />
        },
      ],
    },
    {
      title: "Visitors",
      items: [
        {
          title: "Visitors",
          href: "/visitors/visitors",
          icon: <Users className="mr-2 h-4 w-4" />,
        },
        {
          title: "History",
          href: "/visitors/history",
          icon: <ClipboardList className="mr-2 h-4 w-4" />,
        },
        {
          title: "R-Vehicles",
          href: "/visitors/r-vehicles",
          icon: <Car className="mr-2 h-4 w-4" />,
        },
        {
          title: "G-Vehicles",
          href: "/visitors/g-vehicles",
          icon: <Car className="mr-2 h-4 w-4" />,
        },
        {
          title: "Staffs",
          href: "/visitors/staffs",
          icon: <Users className="mr-2 h-4 w-4" />,
        },
        {
          title: "Materials",
          href: "/visitors/materials",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
        {
          title: "Patrolling",
          href: "/visitors/patrolling",
          icon: <Shield className="mr-2 h-4 w-4" />,
        },
        {
          title: "Goods",
          href: "/visitors/goods",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
        {
          title: "Vehicle Parkings",
          href: "/visitors/vehicle-parkings",
          icon: <Car className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      title: "Experience",
      items: [
        {
          title: "Events",
          href: "/experience/events",
          icon: <Calendar className="mr-2 h-4 w-4" />,
        },
        {
          title: "Broadcast",
          href: "/experience/broadcast",
          icon: <Globe className="mr-2 h-4 w-4" />,
        },
        {
          title: "Business Directory",
          href: "/experience/business",
          icon: <Users className="mr-2 h-4 w-4" />,
        },
        {
          title: "Documents Unit",
          href: "/experience/documents/unit",
          icon: <FileText className="mr-2 h-4 w-4" />,
        },
        {
          title: "Documents Common",
          href: "/experience/documents/common",
          icon: <FileText className="mr-2 h-4 w-4" />,
        },
        {
          title: "Transport",
          items: [
            {
              title: "Outstation",
              href: "/experience/transport/outstation",
              icon: <Car className="mr-2 h-4 w-4" />,
            },
            {
              title: "Airline",
              href: "/experience/transport/airline",
              icon: <Plane className="mr-2 h-4 w-4" />,
            },
            {
              title: "Rail",
              href: "/experience/transport/rail",
              icon: <Plane className="mr-2 h-4 w-4" />,
            },
            {
              title: "Hotel",
              href: "/experience/transport/hotel",
              icon: <Plane className="mr-2 h-4 w-4" />,
            },
            {
              title: "Self Travel",
              href: "/experience/transport/self-travel",
              icon: <Plane className="mr-2 h-4 w-4" />,
            },
          ],
        },
        {
          title: "Testimonials",
          href: "/experience/testimonials",
          icon: <Lightbulb className="mr-2 h-4 w-4" />,
        },
        {
          title: "Company Partners",
          href: "/experience/company-partners",
          icon: <Users className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      title: "Projects",
      items: [
        {
          title: "Projects",
          href: "/projects",
          icon: <ClipboardList className="mr-2 h-4 w-4" />,
        },
      ],
    },
  ]

  return (
    <Sidebar className={cn("bg-stone-900 text-gray-50", className)} {...props}>
      <SidebarContent>
        {navigation.map((section, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel className="text-white/70 font-medium">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items?.map((item, index) =>
                  item.items ? (
                    <SidebarMenuItem key={index}>
                      <Collapsible>
                        <SidebarMenuButton
                          asChild
                          className="text-white hover:bg-white/10"
                        >
                          <CollapsibleTrigger className="flex w-full items-center">
                            {item.icon}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          </CollapsibleTrigger>
                        </SidebarMenuButton>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem, index) => (
                              <SidebarMenuSubItem key={index}>
                                <SidebarMenuSubButton asChild>
                                  <Link to={subItem.href}>{subItem.title}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  ) : (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton asChild className="text-white hover:bg-white/10">
                        <Link to={item.href}>
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

export default MainSidebar
