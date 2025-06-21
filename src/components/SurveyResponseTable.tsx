
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

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

export const SurveyResponseTable = () => {
  const { toast } = useToast();

  const handleViewDetails = (responseId: number) => {
    console.log("Viewing details for response:", responseId);
    toast({
      title: "View Details",
      description: `Opening details for response ${responseId}`,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-[#D5DbDB]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Survey Title</TableHead>
            <TableHead>Respondent</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Submitted Date</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockResponseData.map((response) => (
            <TableRow key={response.id}>
              <TableCell className="font-medium">{response.surveyTitle}</TableCell>
              <TableCell>{response.respondent}</TableCell>
              <TableCell>{response.email}</TableCell>
              <TableCell>{response.submittedDate}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span>{response.rating}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {response.status}
                </span>
              </TableCell>
              <TableCell>
                <button 
                  className="text-[#C72030] hover:text-[#C72030]/80 text-sm font-medium"
                  onClick={() => handleViewDetails(response.id)}
                >
                  View Details
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
