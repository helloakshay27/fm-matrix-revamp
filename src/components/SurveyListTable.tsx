
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
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
          className="flex items-center gap-2 bg-[#f6f4ee] text-white px-4 py-2 rounded-lg hover:bg-[#f6f4ee]/90 transition-colors"
        >
         <Plus className="w-4 h-4 mr-2" style={{ color: '#BF213E' }} />
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
                  <button
                    onClick={() => handleStatusToggle(survey.id)}
                    className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${
                      survey.status === 'Active' 
                        ? 'bg-[#C72030]' 
                        : 'bg-gray-200'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out absolute top-0.5 ${
                        survey.status === 'Active' 
                          ? 'translate-x-5' 
                          : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={survey.active}
                    onCheckedChange={() => handleActiveToggle(survey.id)}
                    className="data-[state=checked]:bg-[#C72030]"
                  />
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleTicketCreationToggle(survey.id)}
                    className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${
                      survey.ticketCreation 
                        ? 'bg-[#C72030]' 
                        : 'bg-gray-200'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out absolute top-0.5 ${
                        survey.ticketCreation 
                          ? 'translate-x-5' 
                          : 'translate-x-0.5'
                      }`}
                    />
                  </button>
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
