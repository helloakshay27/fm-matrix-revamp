
import React from 'react';
import { Plus } from 'lucide-react';
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
    ticketCreation: "Yes",
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
    ticketCreation: "No",
    ticketLevel: "Low",
    ticketCategory: "Maintenance",
    lastModified: "2024-01-14",
    responses: 0
  }
];

export const SurveyListTable = ({ onAddSurvey }: SurveyListTableProps) => {
  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={onAddSurvey}
          className="flex items-center gap-2 bg-[#C72030] text-white px-4 py-2 rounded-lg hover:bg-[#A01B28] transition-colors"
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
            {mockSurveyData.map((survey) => (
              <TableRow key={survey.id}>
                <TableCell className="font-medium">{survey.title}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    survey.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {survey.status}
                  </span>
                </TableCell>
                <TableCell>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={survey.active}
                      className="sr-only peer"
                      onChange={() => {}}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C72030]"></div>
                  </label>
                </TableCell>
                <TableCell>{survey.ticketCreation}</TableCell>
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
