import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Users, UserCheck, UserCog } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['crm']);

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuKey) 
        ? prev.filter(key => key !== menuKey)
        : [...prev, menuKey]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isMenuExpanded = (menuKey: string) => expandedMenus.includes(menuKey);

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white overflow-y-auto">
      <div className="p-4">
        {/* CRM Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleMenu('crm')}
            className="flex items-center justify-between w-full text-left p-2 hover:bg-purple-700 rounded"
          >
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>CRM</span>
            </div>
            {isMenuExpanded('crm') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          
          {isMenuExpanded('crm') && (
            <div className="ml-6 mt-2 space-y-1">
              <Link
                to="/crm/customers"
                className={`flex items-center space-x-2 p-2 rounded hover:bg-purple-700 ${
                  isActive('/crm/customers') ? 'bg-purple-700' : ''
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Customers</span>
              </Link>
              <Link
                to="/crm/fm-users"
                className={`flex items-center space-x-2 p-2 rounded hover:bg-purple-700 ${
                  isActive('/crm/fm-users') ? 'bg-purple-700' : ''
                }`}
              >
                <UserCog className="w-4 h-4" />
                <span>FM Users</span>
              </Link>
              <Link
                to="/crm/occupant-users"
                className={`flex items-center space-x-2 p-2 rounded hover:bg-purple-700 ${
                  isActive('/crm/occupant-users') ? 'bg-purple-700' : ''
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Occupant Users</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { Sidebar };
