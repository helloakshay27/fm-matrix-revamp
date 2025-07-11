
import React from 'react';
import { Edit, Copy, Eye, Share2 } from 'lucide-react';

interface ActionButtonsProps {
  surveyId: string;
  onAction: (action: string, surveyId: string) => void;
}

export const ActionButtons = ({ surveyId, onAction }: ActionButtonsProps) => {
  return (
    <div className="flex gap-1">
      <button 
        onClick={() => onAction('Edit', surveyId)}
        className="p-1 text-gray-600 hover:text-gray-800"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button 
        onClick={() => onAction('Copy', surveyId)}
        className="p-1 text-gray-600 hover:text-gray-800"
      >
        <Copy className="w-4 h-4" />
      </button>
      <button 
        onClick={() => onAction('View', surveyId)}
        className="p-1 text-gray-600 hover:text-gray-800"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button 
        onClick={() => onAction('Share', surveyId)}
        className="p-1 text-gray-600 hover:text-gray-800"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  );
};
