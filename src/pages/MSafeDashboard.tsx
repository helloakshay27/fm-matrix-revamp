
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MSafeDashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'NON FTE USERS',
      path: '/maintenance/safety/m-safe/non-fte-users',
      icon: Users,
      description: 'Manage non-FTE user accounts and permissions'
    },
    {
      title: 'KRCC FORM LIST',
      path: '/maintenance/safety/m-safe/krcc-form-list',
      icon: FileText,
      description: 'View and manage KRCC form submissions'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Maintenance &gt; Safety &gt; M Safe</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">M SAFE</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.title}
            onClick={() => navigate(item.path)}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#C72030] rounded-lg flex items-center justify-center">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a1a]">{item.title}</h3>
            </div>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
