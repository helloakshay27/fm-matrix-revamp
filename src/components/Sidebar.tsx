
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useLayout } from '../contexts/LayoutContext';

const Sidebar = () => {
  const location = useLocation();
  const { currentSection } = useLayout();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path: string) => location.pathname === path;
  const isExpanded = (section: string) => expandedSections[section];

  const utilitySubmenus = [
    { name: 'Energy Meters', path: '/utility/energy-meters' },
    { name: 'Water', path: '/utility/water' },
    { name: 'STP', path: '/utility/stp' },
    { name: 'Daily Readings', path: '/utility/daily-readings' },
    { name: 'Utility Consumption', path: '/utility/consumption' },
    { name: 'EV Consumption', path: '/utility/ev-consumption' },
    { name: 'Solar Generator', path: '/utility/solar-generator' },
    { name: 'Utility Request', path: '/utility/utility-request' },
    { name: 'Waste Generation', path: '/utility/waste-generation' },
  ];

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-[#2D1B69] text-white overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Navigation</h2>
        
        {/* Assets Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('assets')}
            className="flex items-center justify-between w-full text-left py-2 hover:bg-purple-600 rounded px-2"
          >
            <span>Assets</span>
            {isExpanded('assets') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isExpanded('assets') && (
            <div className="ml-4 mt-1 space-y-1">
              <Link
                to="/"
                className={`block py-1 px-2 rounded text-sm ${isActive('/') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
              >
                Asset List
              </Link>
              <Link
                to="/assets/inactive"
                className={`block py-1 px-2 rounded text-sm ${isActive('/assets/inactive') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
              >
                In-Active Assets
              </Link>
            </div>
          )}
        </div>

        {/* Services Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('services')}
            className="flex items-center justify-between w-full text-left py-2 hover:bg-purple-600 rounded px-2"
          >
            <span>Services</span>
            {isExpanded('services') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isExpanded('services') && (
            <div className="ml-4 mt-1 space-y-1">
              <Link
                to="/services"
                className={`block py-1 px-2 rounded text-sm ${isActive('/services') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
              >
                Service List
              </Link>
              <Link
                to="/amc"
                className={`block py-1 px-2 rounded text-sm ${isActive('/amc') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
              >
                AMC
              </Link>
            </div>
          )}
        </div>

        {/* Supplier Section */}
        <div className="mb-4">
          <Link
            to="/supplier"
            className={`block py-2 px-2 rounded ${isActive('/supplier') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
          >
            Supplier
          </Link>
        </div>

        {/* Schedule Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('schedule')}
            className="flex items-center justify-between w-full text-left py-2 hover:bg-purple-600 rounded px-2"
          >
            <span>Schedule</span>
            {isExpanded('schedule') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isExpanded('schedule') && (
            <div className="ml-4 mt-1 space-y-1">
              <Link
                to="/schedule"
                className={`block py-1 px-2 rounded text-sm ${isActive('/schedule') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
              >
                Schedule Dashboard
              </Link>
              <Link
                to="/schedule-list"
                className={`block py-1 px-2 rounded text-sm ${isActive('/schedule-list') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
              >
                Schedule List
              </Link>
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('tasks')}
            className="flex items-center justify-between w-full text-left py-2 hover:bg-purple-600 rounded px-2"
          >
            <span>Tasks</span>
            {isExpanded('tasks') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isExpanded('tasks') && (
            <div className="ml-4 mt-1 space-y-1">
              <Link
                to="/tasks"
                className={`block py-1 px-2 rounded text-sm ${isActive('/tasks') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
              >
                Task Dashboard
              </Link>
              <Link
                to="/task-list"
                className={`block py-1 px-2 rounded text-sm ${isActive('/task-list') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
              >
                Task List
              </Link>
              <Link
                to="/tickets"
                className={`block py-1 px-2 rounded text-sm ${isActive('/tickets') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
              >
                Tickets
              </Link>
              <Link
                to="/tickets/add"
                className={`block py-1 px-2 rounded text-sm ${isActive('/tickets/add') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
              >
                Add Ticket
              </Link>
            </div>
          )}
        </div>

        {/* Utility Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('utility')}
            className="flex items-center justify-between w-full text-left py-2 hover:bg-purple-600 rounded px-2"
          >
            <span>Utility</span>
            {isExpanded('utility') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isExpanded('utility') && (
            <div className="ml-4 mt-1 space-y-1">
              {utilitySubmenus.map((submenu) => (
                <Link
                  key={submenu.path}
                  to={submenu.path}
                  className={`block py-1 px-2 rounded text-sm ${isActive(submenu.path) ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
                >
                  {submenu.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Attendance Section */}
        <div className="mb-4">
          <Link
            to="/attendance"
            className={`block py-2 px-2 rounded ${isActive('/attendance') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
          >
            Attendance
          </Link>
        </div>

        {/* Vendor Section */}
        <div className="mb-4">
          <Link
            to="/vendor"
            className={`block py-2 px-2 rounded ${isActive('/vendor') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
          >
            Vendor
          </Link>
        </div>

        {/* Surveys Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('surveys')}
            className="flex items-center justify-between w-full text-left py-2 hover:bg-purple-600 rounded px-2"
          >
            <span>Surveys</span>
            {isExpanded('surveys') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isExpanded('surveys') && (
            <div className="ml-4 mt-1 space-y-1">
              <Link
                to="/surveys/list"
                className={`block py-1 px-2 rounded text-sm ${isActive('/surveys/list') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
              >
                Survey List
              </Link>
              <Link
                to="/surveys/mapping"
                className={`block py-1 px-2 rounded text-sm ${isActive('/surveys/mapping') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
              >
                Survey Mapping
              </Link>
              <Link
                to="/surveys/response"
                className={`block py-1 px-2 rounded text-sm ${isActive('/surveys/response') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
              >
                Survey Response
              </Link>
            </div>
          )}
        </div>

        {/* Operational Audit Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('operational-audit')}
            className="flex items-center justify-between w-full text-left py-2 hover:bg-purple-600 rounded px-2"
          >
            <span>Operational Audit</span>
            {isExpanded('operational-audit') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isExpanded('operational-audit') && (
            <div className="ml-4 mt-1 space-y-1">
              <Link
                to="/operational-audit/scheduled"
                className={`block py-1 px-2 rounded text-sm ${isActive('/operational-audit/scheduled') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
              >
                Scheduled
              </Link>
              <Link
                to="/operational-audit/conducted"
                className={`block py-1 px-2 rounded text-sm ${isActive('/operational-audit/conducted') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
              >
                Conducted
              </Link>
              <Link
                to="/operational-audit/master-checklists"
                className={`block py-1 px-2 rounded text-sm ${isActive('/operational-audit/master-checklists') ? 'bg-purple-700 text-white' : 'hover:bg-purple-600'}`}
              >
                Master Checklists
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
