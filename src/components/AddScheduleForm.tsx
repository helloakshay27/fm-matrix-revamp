
import React from 'react';
import { X } from 'lucide-react';

interface AddScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddScheduleForm = ({ isOpen, onClose }: AddScheduleFormProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#1a1a1a]">Add New Schedule</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1">
              Activity Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
              placeholder="Enter activity name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1">
              Schedule Type
            </label>
            <select className="w-full px-3 py-2 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent">
              <option value="">Select type</option>
              <option value="Service">Service</option>
              <option value="PPM">PPM</option>
              <option value="Routine">Routine</option>
            </select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
            >
              Add Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
