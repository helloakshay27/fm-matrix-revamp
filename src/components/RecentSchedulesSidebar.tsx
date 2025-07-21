import React, { useState } from 'react';
import { Star, MessageSquare, Flag, ChevronRight, Building2, User, Globe, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddCommentModal } from '@/components/AddCommentModal';

interface Schedule {
  id: string;
  activityName: string;
  scheduleId: string;
  category: string;
  subCategory: string;
  assigneeName: string;
  site: string;
  priority: string;
  tat: string;
  status: string;
  nextStatus: string;
  handledBy: string;
}

const recentSchedules: Schedule[] = [
  {
    id: '11877',
    activityName: 'HVAC System Maintenance',
    scheduleId: '11877',
    category: 'Technical',
    subCategory: 'HVAC',
    assigneeName: 'Arman',
    site: 'GoPhygital',
    priority: 'P1',
    tat: 'A',
    status: 'Active',
    nextStatus: 'Completed',
    handledBy: 'Arman'
  },
  {
    id: '11876',
    activityName: 'Fire Safety Inspection',
    scheduleId: '11876',
    category: 'Technical',
    subCategory: 'Safety',
    assigneeName: 'John',
    site: 'GoPhygital',
    priority: 'P1',
    tat: 'A',
    status: 'Inactive',
    nextStatus: 'Active',
    handledBy: 'John'
  },
  {
    id: '11874',
    activityName: 'Cleaning Service - Washrooms',
    scheduleId: '11874',
    category: 'Non Technical',
    subCategory: 'Housekeeping',
    assigneeName: 'Sarah',
    site: 'GoPhygital',
    priority: 'P2',
    tat: 'B',
    status: 'Active',
    nextStatus: 'Completed',
    handledBy: 'Sarah'
  },
  {
    id: '11873',
    activityName: 'Security System Check',
    scheduleId: '11873',
    category: 'Technical',
    subCategory: 'Security',
    assigneeName: 'Mike',
    site: 'GoPhygital',
    priority: 'P2',
    tat: 'B',
    status: 'Active',
    nextStatus: 'Completed',
    handledBy: 'Mike'
  },
  {
    id: '11871',
    activityName: 'Generator Testing',
    scheduleId: '11871',
    category: 'Technical',
    subCategory: 'Electrical',
    assigneeName: 'David',
    site: 'GoPhygital',
    priority: 'P3',
    tat: 'C',
    status: 'Active',
    nextStatus: 'Completed',
    handledBy: 'David'
  }
];

export function RecentSchedulesSidebar() {
  const [commentModal, setCommentModal] = useState<{
    isOpen: boolean;
    scheduleId: string;
  }>({
    isOpen: false,
    scheduleId: ''
  });
  const [flaggedSchedules, setFlaggedSchedules] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const handleAddComment = (scheduleId: string) => {
    setCommentModal({
      isOpen: true,
      scheduleId
    });
  };

  const handleFlag = (scheduleId: string) => {
    setFlaggedSchedules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(scheduleId)) {
        newSet.delete(scheduleId);
      } else {
        newSet.add(scheduleId);
      }
      return newSet;
    });
  };

  const handleViewDetails = (scheduleId: string) => {
    navigate(`/maintenance/schedule/view/${scheduleId}`);
  };

  return (
    <>
      <div className="w-full bg-[#C4B89D]/25 border-l border-gray-200 p-4 h-full xl:max-h-[1208px] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            Recent Schedules
          </h2>
          <div className="text-sm font-medium text-gray-800">
            14/07/2025
          </div>
        </div>
        
        {/* Schedules List */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {recentSchedules.map((schedule, index) => (
            <div key={`${schedule.id}-${index}`} className="bg-[#C4B89D]/20 rounded-lg p-4 shadow-sm border border-[#C4B89D] border-opacity-60" style={{ borderWidth: '0.6px' }}>
              {/* Header with ID, Star, and Priority */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-800 text-sm">{schedule.scheduleId}</span>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="bg-pink-300 text-pink-800 px-2 py-1 rounded text-xs font-medium">
                    {schedule.priority}
                  </span>
                </div>
              </div>
              
              {/* Title and TAT */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-base">{schedule.activityName}</h3>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-700">TAT :</span>
                  <span className="text-sm font-bold text-blue-600">"{schedule.tat}"</span>
                </div>
              </div>
              
              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700 min-w-[100px]">Category</span>
                  <span className="text-sm text-gray-700">:</span>
                  <span className="text-sm text-gray-900">{schedule.category}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700 min-w-[100px]">Sub-Category</span>
                  <span className="text-sm text-gray-700">:</span>
                  <span className="text-sm text-gray-900">{schedule.subCategory}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700 min-w-[100px]">Assignee Name</span>
                  <span className="text-sm text-gray-700">:</span>
                  <span className="text-sm text-gray-900">{schedule.assigneeName}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700 min-w-[100px]">Site</span>
                  <span className="text-sm text-gray-700">:</span>
                  <span className="text-sm text-gray-900">{schedule.site}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700 min-w-[100px]">Update</span>
                  <span className="text-sm text-gray-700">:</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="italic text-gray-600">{schedule.status}</span>
                    <ChevronRight className="h-3 w-3 text-gray-600" />
                    <span className="italic text-gray-600">{schedule.nextStatus}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 ml-7">
                  (Handled By {schedule.handledBy})
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-6">
                  <button 
                    className="flex items-center gap-2 text-black text-sm font-medium hover:opacity-80" 
                    onClick={() => handleAddComment(schedule.id)}
                  >
                    <MessageSquare className="h-4 w-4 text-red-500" />
                    Add Comment
                  </button>
                  
                  <button 
                    className={`flex items-center gap-2 text-black text-sm font-medium hover:opacity-80 ${flaggedSchedules.has(schedule.id) ? 'opacity-60' : ''}`} 
                    onClick={() => handleFlag(schedule.id)}
                  >
                    <Flag className="h-4 w-4 text-red-500" />
                    Flag Issue
                  </button>
                </div>
                
                <button 
                  className="text-blue-600 text-sm font-medium underline hover:text-blue-800" 
                  onClick={() => handleViewDetails(schedule.scheduleId)}
                >
                  View Detail&gt;&gt;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddCommentModal 
        isOpen={commentModal.isOpen} 
        onClose={() => setCommentModal({
          isOpen: false,
          scheduleId: ''
        })} 
        itemId={commentModal.scheduleId} 
        itemType="schedule" 
      />
    </>
  );
}