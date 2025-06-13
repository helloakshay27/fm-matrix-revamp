
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home,
  Wrench,
  Users,
  Calendar,
  ClipboardList,
  UserCheck,
  BarChart3,
  Building,
  Settings,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Car,
  Shield,
  Package,
  Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const [isVisitorsOpen, setIsVisitorsOpen] = useState(true);
  const [isGoodsOpen, setIsGoodsOpen] = useState(false);
  const [isRVehiclesOpen, setIsRVehiclesOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Services', href: '/services', icon: Wrench },
    { name: 'Supplier', href: '/supplier', icon: Users },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'AMC', href: '/amc', icon: ClipboardList },
    { name: 'Attendance', href: '/attendance', icon: UserCheck },
    { name: 'Tasks', href: '/tasks', icon: BarChart3 },
    {
      name: 'Surveys',
      icon: ClipboardList,
      subItems: [
        { name: 'List', href: '/surveys/list' },
        { name: 'Mapping', href: '/surveys/mapping' },
        { name: 'Response', href: '/surveys/response' },
      ]
    },
    {
      name: 'Assets',
      icon: Building,
      subItems: [
        { name: 'InActive Assets', href: '/assets/inactive' },
      ]
    },
  ];

  const visitorsSubItems = [
    { name: 'Visitors', href: '/visitors/visitors' },
    { name: 'History', href: '/visitors/history' },
    {
      name: 'R Vehicles',
      href: '/visitors/r-vehicles',
      hasSubmenu: true,
      subItems: [
        { name: 'R Vehicles', href: '/visitors/r-vehicles' },
        { name: 'History', href: '/visitors/r-vehicles/history' },
      ]
    },
    { name: 'G Vehicles', href: '/visitors/g-vehicles' },
    { name: 'Staffs', href: '/visitors/staffs' },
    { name: 'Materials', href: '/visitors/materials' },
    { name: 'Patrolling', href: '/visitors/patrolling' },
    { name: 'Patrolling Pending Approvals', href: '/visitors/patrolling-pending' },
    {
      name: 'Goods In/Out',
      hasSubmenu: true,
      subItems: [
        { name: 'Inwards', href: '/visitors/goods/inwards' },
        { name: 'Outwards', href: '/visitors/goods/outwards' },
      ]
    },
    { name: 'Vehicle Parkings', href: '/visitors/vehicle-parkings' },
  ];

  const isActive = (href: string) => location.pathname === href;

  const SidebarItem = ({ item, isSubItem = false, isSubSubItem = false }: { 
    item: any; 
    isSubItem?: boolean; 
    isSubSubItem?: boolean; 
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const Icon = item.icon;
    const hasSubItems = item.subItems && item.subItems.length > 0;

    if (hasSubItems && !item.href) {
      return (
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isSubItem ? "ml-6 text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]" : "text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]",
              isSubSubItem && "ml-12 text-xs"
            )}
          >
            <div className="flex items-center gap-3">
              {Icon && <Icon className="w-5 h-5" />}
              {item.name}
            </div>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {isOpen && (
            <div className="mt-1">
              {item.subItems.map((subItem: any) => (
                <SidebarItem 
                  key={subItem.name} 
                  item={subItem} 
                  isSubItem={!isSubItem} 
                  isSubSubItem={isSubItem}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          isActive(item.href) 
            ? "bg-[#C72030] text-white" 
            : "text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]",
          isSubItem && "ml-6",
          isSubSubItem && "ml-12 text-xs"
        )}
      >
        {Icon && <Icon className="w-5 h-5" />}
        {item.name}
      </Link>
    );
  };

  return (
    <div className="w-64 h-screen bg-[#f6f4ee] border-r border-[#D5DbDB] fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#C72030] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="text-[#1a1a1a] font-semibold text-lg">Lovable</span>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <SidebarItem key={item.name} item={item} />
          ))}

          {/* Visitors Section */}
          <div>
            <button
              onClick={() => setIsVisitorsOpen(!isVisitorsOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                Visitors
              </div>
              {isVisitorsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isVisitorsOpen && (
              <div className="mt-1">
                {visitorsSubItems.map((subItem) => {
                  if (subItem.name === 'R Vehicles') {
                    return (
                      <div key={subItem.name}>
                        <button
                          onClick={() => setIsRVehiclesOpen(!isRVehiclesOpen)}
                          className="flex items-center justify-between w-full gap-3 px-3 py-2 ml-6 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                        >
                          <div className="flex items-center gap-3">
                            <Car className="w-5 h-5" />
                            R Vehicles
                          </div>
                          {isRVehiclesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        {isRVehiclesOpen && (
                          <div className="mt-1">
                            {subItem.subItems?.map((rVehicleItem) => (
                              <Link
                                key={rVehicleItem.name}
                                to={rVehicleItem.href}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2 ml-12 rounded-lg text-xs font-medium transition-colors",
                                  isActive(rVehicleItem.href) 
                                    ? "bg-[#C72030] text-white" 
                                    : "text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                                )}
                              >
                                {rVehicleItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (subItem.name === 'Goods In/Out') {
                    return (
                      <div key={subItem.name}>
                        <button
                          onClick={() => setIsGoodsOpen(!isGoodsOpen)}
                          className="flex items-center justify-between w-full gap-3 px-3 py-2 ml-6 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                        >
                          <div className="flex items-center gap-3">
                            <Package className="w-5 h-5" />
                            Goods In/Out
                          </div>
                          {isGoodsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        {isGoodsOpen && (
                          <div className="mt-1">
                            {subItem.subItems?.map((goodsItem) => (
                              <Link
                                key={goodsItem.name}
                                to={goodsItem.href}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2 ml-12 rounded-lg text-xs font-medium transition-colors",
                                  isActive(goodsItem.href) 
                                    ? "bg-[#C72030] text-white" 
                                    : "text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                                )}
                              >
                                {goodsItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const getIcon = (name: string) => {
                    switch(name) {
                      case 'G Vehicles': return Car;
                      case 'Staffs': return Users;
                      case 'Materials': return Package;
                      case 'Patrolling': return Shield;
                      case 'Patrolling Pending Approvals': return AlertTriangle;
                      case 'Vehicle Parkings': return Truck;
                      default: return Users;
                    }
                  };

                  const ItemIcon = getIcon(subItem.name);

                  return (
                    <Link
                      key={subItem.name}
                      to={subItem.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 ml-6 rounded-lg text-sm font-medium transition-colors",
                        isActive(subItem.href) 
                          ? "bg-[#C72030] text-white" 
                          : "text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                      )}
                    >
                      <ItemIcon className="w-5 h-5" />
                      {subItem.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            to="/setup"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive('/setup') 
                ? "bg-[#C72030] text-white" 
                : "text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            )}
          >
            <Settings className="w-5 h-5" />
            Setup
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
