
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SurveyListTableProps {
  onAddSurvey: () => void;
}

const mockSurveyData = [
  {
    id: 1,
    title: "Customer Satisfaction Survey",
    status: "Active",
    active: true,
    ticketCreation: true,
    ticketLevel: "Medium",
    ticketCategory: "Feedback",
    lastModified: "2024-01-15",
    responses: 25
  },
  {
    id: 2,
    title: "Facility Maintenance Survey",
    status: "Draft",
    active: false,
    ticketCreation: false,
    ticketLevel: "Low",
    ticketCategory: "Maintenance",
    lastModified: "2024-01-14",
    responses: 0
  }
];

export const SurveyListTable = ({ onAddSurvey }: SurveyListTableProps) => {
  const { toast } = useToast();
  const [surveys, setSurveys] = useState(mockSurveyData);

  const handleStatusToggle = (surveyId: number) => {
    console.log(`Toggling status for Survey ${surveyId}`);
    
    setSurveys(prevSurveys => 
      prevSurveys.map(survey => 
        survey.id === surveyId 
          ? { ...survey, status: survey.status === 'Active' ? 'Draft' : 'Active' }
          : survey
      )
    );
    
    toast({
      title: "Status Updated",
      description: "Survey status has been updated successfully",
    });
  };

  const handleTicketCreationToggle = (surveyId: number) => {
    console.log(`Toggling ticket creation for Survey ${surveyId}`);
    
    setSurveys(prevSurveys => 
      prevSurveys.map(survey => 
        survey.id === surveyId 
          ? { ...survey, ticketCreation: !survey.ticketCreation }
          : survey
      )
    );
    
    toast({
      title: "Ticket Creation Updated",
      description: "Ticket creation setting has been updated successfully",
    });
  };

  const handleActiveToggle = (surveyId: number) => {
    console.log(`Toggling active status for Survey ${surveyId}`);
    
    setSurveys(prevSurveys => 
      prevSurveys.map(survey => 
        survey.id === surveyId 
          ? { ...survey, active: !survey.active }
          : survey
      )
    );
    
    toast({
      title: "Active Status Updated",
      description: "Survey active status has been updated successfully",
    });
  };

  const handleAddSurvey = () => {
    console.log("Adding new survey...");
    toast({
      title: "Add Survey",
      description: "Add survey functionality initiated",
    });
    onAddSurvey();
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleAddSurvey}
          className="flex items-center gap-2 bg-[#C72030] text-white px-4 py-2 rounded-lg hover:bg-[#C72030]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#D5DbDB]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Ticket Creation</TableHead>
              <TableHead>Ticket Level</TableHead>
              <TableHead>Ticket Category</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Responses</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {surveys.map((survey) => (
              <TableRow key={survey.id}>
                <TableCell className="font-medium">{survey.title}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div
                      className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                        survey.status === 'Active' 
                          ? 'bg-green-500' 
                          : 'bg-gray-300'
                      }`}
                      onClick={() => handleStatusToggle(survey.id)}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          survey.status === 'Active' 
                            ? 'translate-x-6' 
                            : 'translate-x-1'
                        }`}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div
                      className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                        survey.active ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      onClick={() => handleActiveToggle(survey.id)}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          survey.active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div
                      className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                        survey.ticketCreation ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      onClick={() => handleTicketCreationToggle(survey.id)}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          survey.ticketCreation ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>{survey.ticketLevel}</TableCell>
                <TableCell>{survey.ticketCategory}</TableCell>
                <TableCell>{survey.lastModified}</TableCell>
                <TableCell>{survey.responses}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
