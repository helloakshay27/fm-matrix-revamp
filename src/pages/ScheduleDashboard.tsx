
import React, { useState } from 'react';
import { ScheduleTable } from '../components/ScheduleTable';
import { AddScheduleForm } from '../components/AddScheduleForm';

export const ScheduleDashboard = () => {
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Schedule</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Schedule List</h1>
        </div>
      </div>
      
      {/* Schedule Table */}
      <ScheduleTable onAddSchedule={() => setIsAddScheduleOpen(true)} />

      {/* Add Schedule Form Modal */}
      <AddScheduleForm 
        isOpen={isAddScheduleOpen} 
        onClose={() => setIsAddScheduleOpen(false)} 
      />
    </div>
  );
};
