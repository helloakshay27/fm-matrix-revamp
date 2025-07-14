
import React from 'react';
import { Switch } from '@/components/ui/switch';

interface SurveyHeaderProps {
  createTicket: boolean;
  setCreateTicket: (value: boolean) => void;
}

export const SurveyHeader: React.FC<SurveyHeaderProps> = ({
  createTicket,
  setCreateTicket
}) => {
  const [isFeedback, setIsFeedback] = React.useState(false);

  return (
    <div className="p-6 border-b border-gray-200 bg-white">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-2xl font-semibold text-black mb-2">
            Survey Title
          </div>
          <div className="text-gray-600">
            Description
          </div>
        </div>
        
        <div className="flex items-center gap-6 ml-6">
          <div className="flex items-center gap-2">
            <span className="text-sm">Create Ticket</span>
            <Switch checked={createTicket} onCheckedChange={setCreateTicket} />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Survey</span>
            <Switch checked={isFeedback} onCheckedChange={setIsFeedback} />
            <span className="text-sm font-medium">Feedback</span>
          </div>
        </div>
      </div>
    </div>
  );
};
