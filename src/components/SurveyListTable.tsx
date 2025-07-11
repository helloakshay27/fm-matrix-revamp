
import React, { useState } from 'react';
import { Edit, Copy, Eye, Share2, Switch } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SurveyListTableProps {
  searchTerm: string;
}

const mockSurveyData = [
  {
    id: "12345",
    title: "Survey Title 123",
    ticketCreation: true,
    ticketCategory: "Category 123",
    ticketLevel: "Survey",
    noOfAssociation: 2,
    typeOfSurvey: "QR"
  },
  {
    id: "12345",
    title: "Survey Title 123",
    ticketCreation: true,
    ticketCategory: "Category 123",
    ticketLevel: "Survey",
    noOfAssociation: 3,
    typeOfSurvey: "Link"
  },
  {
    id: "12345",
    title: "Survey Title 123",
    ticketCreation: true,
    ticketCategory: "Category 123",
    ticketLevel: "Question",
    noOfAssociation: 4,
    typeOfSurvey: "Link"
  },
  {
    id: "12345",
    title: "Survey Title 123",
    ticketCreation: true,
    ticketCategory: "Category 123",
    ticketLevel: "Survey",
    noOfAssociation: 3,
    typeOfSurvey: "QR"
  },
  {
    id: "12345",
    title: "Survey Title 123",
    ticketCreation: true,
    ticketCategory: "Category 123",
    ticketLevel: "Question",
    noOfAssociation: 0,
    typeOfSurvey: "Link"
  },
  {
    id: "12345",
    title: "Survey Title 123",
    ticketCreation: true,
    ticketCategory: "Category 123",
    ticketLevel: "Survey",
    noOfAssociation: 5,
    typeOfSurvey: "QR"
  },
  {
    id: "12345",
    title: "Survey Title 123",
    ticketCreation: true,
    ticketCategory: "Category 123",
    ticketLevel: "Question",
    noOfAssociation: 2,
    typeOfSurvey: "Link"
  },
  {
    id: "12345",
    title: "Survey Title 123",
    ticketCreation: true,
    ticketCategory: "Category 123",
    ticketLevel: "Survey",
    noOfAssociation: 1,
    typeOfSurvey: "QR"
  }
];

export const SurveyListTable = ({ searchTerm }: SurveyListTableProps) => {
  const { toast } = useToast();
  const [surveys, setSurveys] = useState(mockSurveyData);

  const handleTicketCreationToggle = (index: number) => {
    setSurveys(prevSurveys => 
      prevSurveys.map((survey, i) => 
        i === index ? { ...survey, ticketCreation: !survey.ticketCreation } : survey
      )
    );
    toast({
      title: "Ticket Creation Updated",
      description: "Ticket creation setting has been updated successfully"
    });
  };

  const handleAction = (action: string, surveyId: string) => {
    console.log(`${action} action for survey ${surveyId}`);
    toast({
      title: `${action} Action`,
      description: `${action} action performed for survey ${surveyId}`
    });
  };

  const filteredSurveys = surveys.filter(survey =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.ticketCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Edit</TableHead>
            <TableHead className="w-16">Copy</TableHead>
            <TableHead className="w-16">View</TableHead>
            <TableHead className="w-16">Share</TableHead>
            <TableHead className="w-24">ID</TableHead>
            <TableHead>Survey Title</TableHead>
            <TableHead className="w-32">Ticket Creation</TableHead>
            <TableHead>Ticket Category</TableHead>
            <TableHead>Ticket Level</TableHead>
            <TableHead className="w-32">No. Of Association</TableHead>
            <TableHead>Type Of Survey</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSurveys.map((survey, index) => (
            <TableRow key={`${survey.id}-${index}`}>
              <TableCell>
                <button 
                  onClick={() => handleAction('Edit', survey.id)}
                  className="p-1 text-gray-600 hover:text-gray-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </TableCell>
              <TableCell>
                <button 
                  onClick={() => handleAction('Copy', survey.id)}
                  className="p-1 text-gray-600 hover:text-gray-800"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </TableCell>
              <TableCell>
                <button 
                  onClick={() => handleAction('View', survey.id)}
                  className="p-1 text-gray-600 hover:text-gray-800"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </TableCell>
              <TableCell>
                <button 
                  onClick={() => handleAction('Share', survey.id)}
                  className="p-1 text-gray-600 hover:text-gray-800"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </TableCell>
              <TableCell className="font-medium">{survey.id}</TableCell>
              <TableCell>{survey.title}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div 
                    className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                      survey.ticketCreation ? 'bg-red-500' : 'bg-gray-300'
                    }`} 
                    onClick={() => handleTicketCreationToggle(index)}
                  >
                    <span 
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        survey.ticketCreation ? 'translate-x-6' : 'translate-x-1'
                      }`} 
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>{survey.ticketCategory}</TableCell>
              <TableCell>{survey.ticketLevel}</TableCell>
              <TableCell className="text-center">{survey.noOfAssociation}</TableCell>
              <TableCell>{survey.typeOfSurvey}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
