
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Survey } from './types';
import { ActionButtons } from './ActionButtons';
import { StatusDropdown } from './StatusDropdown';
import { ToggleSwitch } from './ToggleSwitch';

interface DesktopTableProps {
  surveys: Survey[];
  onAction: (action: string, surveyId: string) => void;
  onStatusChange: (index: number, newStatus: string) => void;
  onTicketCreationToggle: (index: number) => void;
}

export const DesktopTable = ({ 
  surveys, 
  onAction, 
  onStatusChange, 
  onTicketCreationToggle 
}: DesktopTableProps) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 lg:w-16">Edit</TableHead>
            <TableHead className="w-12 lg:w-16">Copy</TableHead>
            <TableHead className="w-12 lg:w-16">View</TableHead>
            <TableHead className="w-12 lg:w-16">Share</TableHead>
            <TableHead className="w-16 lg:w-24">ID</TableHead>
            <TableHead className="min-w-[150px]">Survey Title</TableHead>
            <TableHead className="w-24 lg:w-32">Ticket Creation</TableHead>
            <TableHead className="min-w-[120px]">Ticket Category</TableHead>
            <TableHead className="min-w-[100px]">Ticket Level</TableHead>
            <TableHead className="w-24 lg:w-32 text-center">No. Of Association</TableHead>
            <TableHead className="min-w-[100px]">Type Of Survey</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[100px]">Valid From</TableHead>
            <TableHead className="min-w-[100px]">Valid To</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {surveys.map((survey, index) => {
            console.log(`Rendering survey ${index}:`, {
              id: survey.id,
              status: survey.status,
              validFrom: survey.validFrom,
              validTo: survey.validTo
            });
            
            return (
              <TableRow key={`${survey.id}-${index}`}>
                <TableCell>
                  <button 
                    onClick={() => onAction('Edit', survey.id)}
                    className="p-1 text-gray-600 hover:text-gray-800"
                  >
                    <ActionButtons surveyId={survey.id} onAction={onAction} />
                  </button>
                </TableCell>
                <TableCell>
                  <button 
                    onClick={() => onAction('Copy', survey.id)}
                    className="p-1 text-gray-600 hover:text-gray-800"
                  >
                  </button>
                </TableCell>
                <TableCell>
                  <button 
                    onClick={() => onAction('View', survey.id)}
                    className="p-1 text-gray-600 hover:text-gray-800"
                  >
                  </button>
                </TableCell>
                <TableCell>
                  <button 
                    onClick={() => onAction('Share', survey.id)}
                    className="p-1 text-gray-600 hover:text-gray-800"
                  >
                  </button>
                </TableCell>
                <TableCell className="font-medium">{survey.id}</TableCell>
                <TableCell>{survey.title}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <ToggleSwitch 
                      isOn={survey.ticketCreation} 
                      onToggle={() => onTicketCreationToggle(index)}
                      size="medium"
                    />
                  </div>
                </TableCell>
                <TableCell>{survey.ticketCategory}</TableCell>
                <TableCell>{survey.ticketLevel}</TableCell>
                <TableCell className="text-center">{survey.noOfAssociation}</TableCell>
                <TableCell>{survey.typeOfSurvey}</TableCell>
                <TableCell>
                  <StatusDropdown 
                    status={survey.status} 
                    onStatusChange={(newStatus) => onStatusChange(index, newStatus)} 
                  />
                </TableCell>
                <TableCell>{survey.validFrom}</TableCell>
                <TableCell>{survey.validTo}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
