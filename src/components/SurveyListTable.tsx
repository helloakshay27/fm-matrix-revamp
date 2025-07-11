import React, { useState } from 'react';
import { Edit, Copy, Eye, Share2 } from 'lucide-react';
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
      {/* Mobile Card Layout */}
      <div className="block md:hidden">
        {filteredSurveys.map((survey, index) => (
          <div key={`${survey.id}-${index}`} className="p-4 border-b border-gray-200 last:border-b-0 bg-green-50">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-sm">{survey.title}</h3>
                <p className="text-xs text-gray-500">ID: {survey.id}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleAction('Edit', survey.id)} className="p-1 text-gray-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleAction('Copy', survey.id)} className="p-1 text-gray-600">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={() => handleAction('View', survey.id)} className="p-1 text-gray-600">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => handleAction('Share', survey.id)} className="p-1 text-gray-600">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
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
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-gray-500">Ticket Creation:</span>
              <div 
                className={`relative inline-flex items-center h-5 rounded-full w-9 cursor-pointer transition-colors ${
                  survey.ticketCreation ? 'bg-red-500' : 'bg-gray-300'
                }`} 
                onClick={() => handleTicketCreationToggle(index)}
              >
                <span 
                  className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform ${
                    survey.ticketCreation ? 'translate-x-5' : 'translate-x-1'
                  }`} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
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
    </div>
  );
};
