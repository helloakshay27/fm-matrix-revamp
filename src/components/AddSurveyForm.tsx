
import React from 'react';
import { X } from 'lucide-react';

interface AddSurveyFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSurveyForm = ({ isOpen, onClose }: AddSurveyFormProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1a1a1a]">Add New Survey</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1">
              Survey Title
            </label>
            <input
              type="text"
              className="w-full border border-[#D5DbDB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C72030]"
              placeholder="Enter survey title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1">
              Category
            </label>
            <select className="w-full border border-[#D5DbDB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C72030]">
              <option>Select category</option>
              <option>Feedback</option>
              <option>Maintenance</option>
              <option>Security</option>
            </select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#C72030] text-white rounded-lg hover:bg-[#A01B28]"
            >
              Add Survey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
