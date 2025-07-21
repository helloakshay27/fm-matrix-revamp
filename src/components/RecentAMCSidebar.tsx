import React, { useState } from 'react';
import { Star, MessageSquare, Flag, ChevronRight, Building2, User, Globe, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const recentAMCs = [{
  id: 'AMC-001',
  title: 'HVAC System Maintenance',
  resource_type: 'HVAC',
  vendor_name: 'CoolTech Services',
  site: 'GoPhygital',
  priority: 'P1',
  status: 'Active',
  expiry_date: '2024-12-31',
  handledBy: 'John Smith'
}, {
  id: 'AMC-002',
  title: 'Elevator Maintenance',
  resource_type: 'Mechanical',
  vendor_name: 'Elevator Pro',
  site: 'GoPhygital',
  priority: 'P2',
  status: 'Active',
  expiry_date: '2024-11-15',
  handledBy: 'Sarah Johnson'
}, {
  id: 'AMC-003',
  title: 'Security System AMC',
  resource_type: 'Security',
  vendor_name: 'SecureGuard',
  site: 'GoPhygital',
  priority: 'P1',
  status: 'Expiring Soon',
  expiry_date: '2024-08-30',
  handledBy: 'Mike Wilson'
}, {
  id: 'AMC-004',
  title: 'Fire Safety System',
  resource_type: 'Fire Safety',
  vendor_name: 'FireSafe Solutions',
  site: 'GoPhygital',
  priority: 'P1',
  status: 'Active',
  expiry_date: '2025-01-20',
  handledBy: 'Lisa Chen'
}, {
  id: 'AMC-005',
  title: 'Cleaning Services',
  resource_type: 'Housekeeping',
  vendor_name: 'CleanPro Services',
  site: 'GoPhygital',
  priority: 'P3',
  status: 'Active',
  expiry_date: '2024-10-15',
  handledBy: 'David Miller'
}];

export function RecentAMCSidebar() {
  const [flaggedAMCs, setFlaggedAMCs] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const handleFlag = (amcId: string) => {
    setFlaggedAMCs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(amcId)) {
        newSet.delete(amcId);
      } else {
        newSet.add(amcId);
      }
      return newSet;
    });
  };

  const handleViewDetails = (amcId: string) => {
    navigate(`/maintenance/amc/details/${amcId}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'text-red-600 bg-red-50';
      case 'P2': return 'text-orange-600 bg-orange-50';
      case 'P3': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50';
      case 'Expiring Soon': return 'text-orange-600 bg-orange-50';
      case 'Expired': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="w-full bg-[#C4B89D]/25 border-l border-gray-200 p-4 h-full xl:max-h-[1208px] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Recent AMCs</h2>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">Latest AMC contracts and updates</p>
      </div>

      {/* AMC List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {recentAMCs.map((amc) => (
          <div 
            key={amc.id} 
            className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => handleViewDetails(amc.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm leading-tight mb-1 truncate">
                  {amc.title}
                </h3>
                <p className="text-xs text-gray-600 mb-2">ID: {amc.id}</p>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 w-6 p-0 ${flaggedAMCs.has(amc.id) ? 'text-red-500' : 'text-gray-400'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlag(amc.id);
                  }}
                >
                  <Flag className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Resource:</span>
                <span className="font-medium text-gray-900">{amc.resource_type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Vendor:</span>
                <span className="font-medium text-gray-900 truncate max-w-24" title={amc.vendor_name}>
                  {amc.vendor_name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Expires:</span>
                <span className="font-medium text-gray-900">{new Date(amc.expiry_date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Status and Priority */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(amc.status)}`}>
                {amc.status}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(amc.priority)}`}>
                {amc.priority}
              </span>
            </div>

            {/* Handler */}
            <div className="flex items-center mt-2 text-xs text-gray-600">
              <User className="h-3 w-3 mr-1" />
              <span>Handled by {amc.handledBy}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-gray-600 hover:text-gray-900"
          onClick={() => navigate('/maintenance/amc')}
        >
          View All AMCs
        </Button>
      </div>
    </div>
  );
}