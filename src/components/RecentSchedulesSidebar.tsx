import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Flag, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddCommentModal } from '@/components/AddCommentModal';

interface Schedule {
  id: string;
  activityName: string;
  scheduleId: string;
  category: string;
  status: string;
  tat: string;
  tatStatus: 'normal' | 'warning' | 'critical';
}

const recentSchedules: Schedule[] = [
  {
    id: '1',
    activityName: 'HVAC System Maintenance',
    scheduleId: '11877',
    category: 'Technical',
    status: 'Active',
    tat: '15d 8h',
    tatStatus: 'normal'
  },
  {
    id: '2',
    activityName: 'Fire Safety Inspection',
    scheduleId: '11876',
    category: 'Technical',
    status: 'Inactive',
    tat: '3d 12h',
    tatStatus: 'critical'
  },
  {
    id: '3',
    activityName: 'Cleaning Service - Washrooms',
    scheduleId: '11874',
    category: 'Non Technical',
    status: 'Active',
    tat: '8d 6h',
    tatStatus: 'warning'
  },
  {
    id: '4',
    activityName: 'Security System Check',
    scheduleId: '11873',
    category: 'Technical',
    status: 'Active',
    tat: '12d 4h',
    tatStatus: 'normal'
  },
  {
    id: '5',
    activityName: 'Generator Testing',
    scheduleId: '11871',
    category: 'Technical',
    status: 'Active',
    tat: '25d 2h',
    tatStatus: 'warning'
  }
];

export const RecentSchedulesSidebar = () => {
  const navigate = useNavigate();
  const [flaggedSchedules, setFlaggedSchedules] = useState<Set<string>>(new Set());
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');

  const handleAddComment = (scheduleId: string) => {
    setSelectedScheduleId(scheduleId);
    setCommentModalOpen(true);
  };

  const handleFlag = (scheduleId: string) => {
    const newFlagged = new Set(flaggedSchedules);
    if (newFlagged.has(scheduleId)) {
      newFlagged.delete(scheduleId);
    } else {
      newFlagged.add(scheduleId);
    }
    setFlaggedSchedules(newFlagged);
  };

  const handleViewDetails = (scheduleId: string) => {
    navigate(`/maintenance/schedule/view/${scheduleId}`);
  };

  const getTatColor = (tatStatus: string) => {
    switch (tatStatus) {
      case 'critical':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Inactive':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    return category === 'Technical' 
      ? 'bg-blue-100 text-blue-700' 
      : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-fit">
      <div className="p-4 border-b border-gray-200 bg-[#f6f4ee]">
        <h3 className="text-lg font-semibold text-[#C72030]">Recent Schedules</h3>
      </div>
      
      <div className="max-h-[600px] overflow-y-auto">
        {recentSchedules.map((schedule) => (
          <div key={schedule.id} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
            <div className="space-y-3">
              <div>
                <div className="font-medium text-gray-900 text-sm mb-1">{schedule.activityName}</div>
                <div className="text-xs text-gray-500">Schedule ID: {schedule.scheduleId}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(schedule.status)}`}>
                    {schedule.status}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(schedule.category)}`}>
                    {schedule.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">TAT</div>
                  <div className={`text-xs font-medium ${getTatColor(schedule.tatStatus)}`}>
                    {schedule.tat}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs border-gray-300 hover:bg-gray-50"
                  onClick={() => handleAddComment(schedule.id)}
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Comment
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={`h-8 px-2 border-gray-300 hover:bg-gray-50 ${flaggedSchedules.has(schedule.id) ? 'bg-red-50 border-red-200' : ''}`}
                  onClick={() => handleFlag(schedule.id)}
                >
                  <Flag className={`w-3 h-3 ${flaggedSchedules.has(schedule.id) ? 'text-red-600' : 'text-gray-600'}`} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2 border-gray-300 hover:bg-gray-50"
                  onClick={() => handleViewDetails(schedule.scheduleId)}
                >
                  <Eye className="w-3 h-3 text-gray-600" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddCommentModal
        isOpen={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        itemId={selectedScheduleId}
        itemType="schedule"
      />
    </div>
  );
};