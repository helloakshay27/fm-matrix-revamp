
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Survey, SurveyListTableProps } from './SurveyTable/types';
import { mockSurveyData } from './SurveyTable/mockData';
import { MobileCard } from './SurveyTable/MobileCard';
import { DesktopTable } from './SurveyTable/DesktopTable';

export const SurveyListTable = ({ searchTerm }: SurveyListTableProps) => {
  const { toast } = useToast();
  const [surveys, setSurveys] = useState<Survey[]>(mockSurveyData);

  console.log('Survey data:', surveys);
  console.log('First survey status:', surveys[0]?.status);
  console.log('First survey validFrom:', surveys[0]?.validFrom);
  console.log('First survey validTo:', surveys[0]?.validTo);

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

  const handleStatusChange = (index: number, newStatus: string) => {
    setSurveys(prevSurveys => 
      prevSurveys.map((survey, i) => 
        i === index ? { ...survey, status: newStatus } : survey
      )
    );
    toast({
      title: "Status Updated",
      description: `Survey status changed to ${newStatus}`
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
          <MobileCard
            key={`${survey.id}-${index}`}
            survey={survey}
            index={index}
            onAction={handleAction}
            onStatusChange={handleStatusChange}
            onTicketCreationToggle={handleTicketCreationToggle}
          />
        ))}
      </div>

      {/* Desktop Table Layout */}
      <DesktopTable
        surveys={filteredSurveys}
        onAction={handleAction}
        onStatusChange={handleStatusChange}
        onTicketCreationToggle={handleTicketCreationToggle}
      />
    </div>
  );
};
