
import React from 'react';
import { Survey } from './types';
import { ActionButtons } from './ActionButtons';
import { StatusDropdown } from './StatusDropdown';
import { ToggleSwitch } from './ToggleSwitch';

interface MobileCardProps {
  survey: Survey;
  index: number;
  onAction: (action: string, surveyId: string) => void;
  onStatusChange: (index: number, newStatus: string) => void;
  onTicketCreationToggle: (index: number) => void;
}

export const MobileCard = ({ 
  survey, 
  index, 
  onAction, 
  onStatusChange, 
  onTicketCreationToggle 
}: MobileCardProps) => {
  return (
    <div className="p-4 border-b border-gray-200 last:border-b-0">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-sm">{survey.title}</h3>
          <p className="text-xs text-gray-500">ID: {survey.id}</p>
        </div>
        <ActionButtons surveyId={survey.id} onAction={onAction} />
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-gray-500">Category:</span>
          <p className="font-medium">{survey.ticketCategory}</p>
        </div>
        <div>
          <span className="text-gray-500">Level:</span>
          <p className="font-medium">{survey.ticketLevel}</p>
        </div>
        <div>
          <span className="text-gray-500">Associations:</span>
          <p className="font-medium">{survey.noOfAssociation}</p>
        </div>
        <div>
          <span className="text-gray-500">Type:</span>
          <p className="font-medium">{survey.typeOfSurvey}</p>
        </div>
        <div>
          <span className="text-gray-500">Status:</span>
          <StatusDropdown 
            status={survey.status} 
            onStatusChange={(newStatus) => onStatusChange(index, newStatus)} 
          />
        </div>
        <div>
          <span className="text-gray-500">Valid From:</span>
          <p className="font-medium">{survey.validFrom}</p>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500">Valid To:</span>
          <p className="font-medium">{survey.validTo}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-gray-500">Ticket Creation:</span>
        <ToggleSwitch 
          isOn={survey.ticketCreation} 
          onToggle={() => onTicketCreationToggle(index)}
          size="small"
        />
      </div>
    </div>
  );
};
