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
  nextStatus: 'Renewal Due',
  handledBy: 'John Smith'
}, {
  id: 'AMC-002',
  title: 'Elevator Maintenance',
  resource_type: 'Mechanical',
  vendor_name: 'Elevator Pro',
  site: 'GoPhygital',
  priority: 'P2',
  status: 'Active',
  nextStatus: 'Service Due',
  handledBy: 'Sarah Johnson'
}, {
  id: 'AMC-003',
  title: 'Security System AMC',
  resource_type: 'Security',
  vendor_name: 'SecureGuard',
  site: 'GoPhygital',
  priority: 'P1',
  status: 'Expiring Soon',
  nextStatus: 'Renewal Required',
  handledBy: 'Mike Wilson'
}, {
  id: 'AMC-004',
  title: 'Fire Safety System',
  resource_type: 'Fire Safety',
  vendor_name: 'FireSafe Solutions',
  site: 'GoPhygital',
  priority: 'P1',
  status: 'Active',
  nextStatus: 'Service Due',
  handledBy: 'Lisa Chen'
}, {
  id: 'AMC-005',
  title: 'Cleaning Services',
  resource_type: 'Housekeeping',
  vendor_name: 'CleanPro Services',
  site: 'GoPhygital',
  priority: 'P3',
  status: 'Active',
  nextStatus: 'Review Due',
  handledBy: 'David Miller'
}];

export function RecentAMCSidebar() {
  const [flaggedAMCs, setFlaggedAMCs] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const handleAddComment = (amcId: string) => {
    console.log('Add comment for AMC:', amcId);
    // Add comment functionality
  };

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

  return (
    <div className="w-full bg-[#C4B89D]/25 border-l border-gray-200 p-4 h-full xl:max-h-[1208px] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-red-600 mb-2">
          Recent AMCs
        </h2>
        <div className="text-sm font-medium text-gray-800">
          {new Date().toLocaleDateString('en-GB')}
        </div>
      </div>
      
      {/* AMCs List */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {recentAMCs.map((amc, index) => (
          <div 
            key={`${amc.id}-${index}`} 
            className="bg-[#C4B89D]/20 rounded-lg p-4 shadow-sm border border-[#C4B89D] border-opacity-60" 
            style={{ borderWidth: '0.6px' }}
          >
            {/* Header with ID, Star, and Priority */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-800 text-sm">{amc.id}</span>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="bg-pink-300 text-pink-800 px-2 py-1 rounded text-xs font-medium">
                  {amc.priority}
                </span>
              </div>
            </div>
            
            {/* Title and Contract Status */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-base">{amc.title}</h3>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-700">Status :</span>
                <span className="text-sm font-bold text-blue-600">"{amc.status}"</span>
              </div>
            </div>
            
            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700 min-w-[100px]">Resource Type</span>
                <span className="text-sm text-gray-700">:</span>
                <span className="text-sm text-gray-900">{amc.resource_type}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700 min-w-[100px]">Vendor</span>
                <span className="text-sm text-gray-700">:</span>
                <span className="text-sm text-gray-900">{amc.vendor_name}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700 min-w-[100px]">Handled By</span>
                <span className="text-sm text-gray-700">:</span>
                <span className="text-sm text-gray-900">{amc.handledBy}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700 min-w-[100px]">Site</span>
                <span className="text-sm text-gray-700">:</span>
                <span className="text-sm text-gray-900">{amc.site}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <RotateCcw className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700 min-w-[100px]">Update</span>
                <span className="text-sm text-gray-700">:</span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="italic text-gray-600">{amc.status}</span>
                  <ChevronRight className="h-3 w-3 text-gray-600" />
                  <span className="italic text-gray-600">{amc.nextStatus}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 ml-7">
                (Handled By {amc.handledBy})
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-6">
                <button 
                  className="flex items-center gap-2 text-black text-sm font-medium hover:opacity-80" 
                  onClick={() => handleAddComment(amc.id)}
                >
                  <MessageSquare className="h-4 w-4 text-red-500" />
                  Add Comment
                </button>
                
                <button 
                  className={`flex items-center gap-2 text-black text-sm font-medium hover:opacity-80 ${flaggedAMCs.has(amc.id) ? 'opacity-60' : ''}`} 
                  onClick={() => handleFlag(amc.id)}
                >
                  <Flag className="h-4 w-4 text-red-500" />
                  Flag Issue
                </button>
              </div>
              
              <button 
                className="text-blue-600 text-sm font-medium underline hover:text-blue-800" 
                onClick={() => handleViewDetails(amc.id)}
              >
                View Detail&gt;&gt;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}