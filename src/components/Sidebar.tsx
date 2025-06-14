
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isParentActive = (paths: string[]) => paths.some(path => currentPath.startsWith(path));

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          <Link to="/">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-white hover:bg-gray-700",
                isActive("/") && "bg-gray-700"
              )}
            >
              Home
            </Button>
          </Link>

          {/* Services */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between text-white hover:bg-gray-700",
                  isParentActive(["/services", "/supplier", "/schedule", "/amc"]) && "bg-gray-700"
                )}
              >
                Services
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-4">
              <Link to="/services">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive("/services") && "bg-gray-700"
                  )}
                >
                  Services
                </Button>
              </Link>
              <Link to="/supplier">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive("/supplier") && "bg-gray-700"
                  )}
                >
                  Supplier
                </Button>
              </Link>
              <Link to="/schedule">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive("/schedule") && "bg-gray-700"
                  )}
                >
                  Schedule
                </Button>
              </Link>
              <Link to="/amc">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive("/amc") && "bg-gray-700"
                  )}
                >
                  AMC
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>

          {/* Finance */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between text-white hover:bg-gray-700",
                  isParentActive(["/finance"]) && "bg-gray-700"
                )}
              >
                Finance
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-4">
              <Link to="/finance/material-pr">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive("/finance/material-pr") && "bg-gray-700"
                  )}
                >
                  Material PR
                </Button>
              </Link>
              <Link to="/finance/service-pr">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive("/finance/service-pr") && "bg-gray-700"
                  )}
                >
                  Service PR
                </Button>
              </Link>
              <Link to="/finance/po">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive("/finance/po") && "bg-gray-700"
                  )}
                >
                  PO
                </Button>
              </Link>
              <Link to="/finance/wo">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive("/finance/wo") && "bg-gray-700"
                  )}
                >
                  WO
                </Button>
              </Link>
              <Link to="/finance/grn">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive("/finance/grn") && "bg-gray-700"
                  )}
                >
                  GRN
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>

          {/* Visitors */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between text-white hover:bg-gray-700",
                  isParentActive(["/visitors"]) && "bg-gray-700"
                )}
              >
                Visitors
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-4">
              <Link to="/visitors/visitors">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive("/visitors/visitors") && "bg-gray-700"
                  )}
                >
                  Visitors
                </Button>
              </Link>
              <Link to="/visitors/history">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive("/visitors/history") && "bg-gray-700"
                  )}
                >
                  History
                </Button>
              </Link>
              <Link to="/visitors/vehicle-parkings">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive("/visitors/vehicle-parkings") && "bg-gray-700"
                  )}
                >
                  Vehicle Parking
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>

          {/* Property */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between text-white hover:bg-gray-700",
                  isParentActive(["/property"]) && "bg-gray-700"
                )}
              >
                Property
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-4">
              <Link to="/property/space/bookings">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive("/property/space/bookings") && "bg-gray-700"
                  )}
                >
                  Bookings
                </Button>
              </Link>
              <Link to="/property/booking/setup">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive("/property/booking/setup") && "bg-gray-700"
                  )}
                >
                  Booking Setup
                </Button>
              </Link>
              <Link to="/property/space/seat-type">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive("/property/space/seat-type") && "bg-gray-700"
                  )}
                >
                  Seat Type
                </Button>
              </Link>
              
              {/* Mailroom Submenu */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-between text-white hover:bg-gray-700",
                      isParentActive(["/property/mailroom"]) && "bg-gray-700"
                    )}
                  >
                    Mailroom
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pl-4">
                  <Link to="/property/mailroom/inbound">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start text-white hover:bg-gray-700 text-xs",
                        isActive("/property/mailroom/inbound") && "bg-gray-700"
                      )}
                    >
                      Inbound
                    </Button>
                  </Link>
                </CollapsibleContent>
              </Collapsible>
            </CollapsibleContent>
          </Collapsible>

          {/* Experience */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between text-white hover:bg-gray-700",
                  isParentActive(["/experience"]) && "bg-gray-700"
                )}
              >
                Experience
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-4">
              <Link to="/experience/events">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive("/experience/events") && "bg-gray-700"
                  )}
                >
                  Events
                </Button>
              </Link>
              <Link to="/experience/broadcast">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive("/experience/broadcast") && "bg-gray-700"
                  )}
                >
                  Broadcast
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
