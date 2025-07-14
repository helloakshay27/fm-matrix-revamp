
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { EnhancedTable } from "./enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

const mockResponseData = [
  {
    id: 1,
    surveyTitle: "Customer Satisfaction Survey",
    respondent: "John Doe",
    email: "john.doe@example.com",
    submittedDate: "2024-01-15",
    rating: 4.5,
    status: "Completed"
  },
  {
    id: 2,
    surveyTitle: "Facility Maintenance Survey",
    respondent: "Jane Smith",
    email: "jane.smith@example.com",
    submittedDate: "2024-01-14",
    rating: 3.8,
    status: "Completed"
  }
];

const columns: ColumnConfig[] = [
  { key: 'surveyTitle', label: 'Survey Title', sortable: true, hideable: true, draggable: true },
  { key: 'respondent', label: 'Respondent', sortable: true, hideable: true, draggable: true },
  { key: 'email', label: 'Email', sortable: true, hideable: true, draggable: true },
  { key: 'submittedDate', label: 'Submitted Date', sortable: true, hideable: true, draggable: true },
  { key: 'rating', label: 'Rating', sortable: true, hideable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true },
  { key: 'actions', label: 'Actions', sortable: false, hideable: false, draggable: false }
];

export const SurveyResponseTable = () => {
  const { toast } = useToast();

  const handleViewDetails = (responseId: number) => {
    console.log("Viewing details for response:", responseId);
    toast({
      title: "View Details",
      description: `Opening details for response ${responseId}`,
    });
  };

  const renderRow = (item: any) => ({
    surveyTitle: item.surveyTitle,
    respondent: item.respondent,
    email: item.email,
    submittedDate: item.submittedDate,
    rating: (
      <div className="flex items-center gap-1">
        <span className="text-yellow-500">★</span>
        <span>{item.rating}</span>
      </div>
    ),
    status: (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        {item.status}
      </span>
    ),
    actions: (
      <button 
        className="text-[#C72030] hover:text-[#C72030]/80 text-sm font-medium"
        onClick={() => handleViewDetails(item.id)}
      >
        View Details
      </button>
    )
  });

  return (
    <div className="w-full">
      <EnhancedTable
        data={mockResponseData}
        columns={columns}
        renderRow={renderRow}
        enableSearch={true}
        enableSelection={true}
        enableExport={true}
        storageKey="survey-response-table"
      />
    </div>
  );
};
