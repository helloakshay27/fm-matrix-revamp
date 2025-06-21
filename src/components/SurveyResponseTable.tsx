
import React from 'react';
import { Search, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const handleExport = () => {
    console.log('Exporting survey responses...');
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search responses..."
            className="pl-10 pr-4 py-2 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent w-full"
          />
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-[#C72030] text-white px-4 py-2 rounded-lg hover:bg-[#A01B28] transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Table */}
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
                  <button className="text-[#C72030] hover:text-[#A01B28] text-sm font-medium">
                    View Details
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
