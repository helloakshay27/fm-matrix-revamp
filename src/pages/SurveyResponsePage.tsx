
import React, { useState } from 'react';
import { Eye, Upload, Filter, Download, Search, RotateCcw, Activity, ThumbsUp, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    id: 12345,
    surveyTitle: "Survey Title 123",
    responses: 1,
    tickets: 1,
    expiryDate: "01/07/2025"
  },
  {
    id: 12345,
    surveyTitle: "Survey Title 123",
    responses: 2,
    tickets: 2,
    expiryDate: "01/07/2025"
  },
  {
    id: 12345,
    surveyTitle: "Survey Title 123",
    responses: 2,
    tickets: 2,
    expiryDate: "01/07/2025"
  },
  {
    id: 12345,
    surveyTitle: "Survey Title 123",
    responses: 4,
    tickets: 4,
    expiryDate: "01/07/2025"
  },
  {
    id: 12345,
    surveyTitle: "Survey Title 123",
    responses: 5,
    tickets: 5,
    expiryDate: "01/07/2025"
  },
  {
    id: 12345,
    surveyTitle: "Survey Title 123",
    responses: 7,
    tickets: 7,
    expiryDate: "01/07/2025"
  },
  {
    id: 12345,
    surveyTitle: "Survey Title 123",
    responses: 8,
    tickets: 8,
    expiryDate: "01/07/2025"
  }
];

export const SurveyResponsePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewDetails = (id: number) => {
    console.log('Viewing details for survey:', id);
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Survey</span>
          <span className="mx-2">{'>'}</span>
          <span>Response</span>
        </nav>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Response List</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#F6F4EE] p-4 rounded-lg flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#C72030]">20</div>
            <div className="text-sm text-gray-600">Total Active</div>
          </div>
        </div>

        <div className="bg-[#F6F4EE] p-4 rounded-lg flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <ThumbsUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#C72030]">10</div>
            <div className="text-sm text-gray-600">Feedback</div>
          </div>
        </div>

        <div className="bg-[#F6F4EE] p-4 rounded-lg flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#C72030]">10</div>
            <div className="text-sm text-gray-600">Survey</div>
          </div>
        </div>
      </div>

      {/* Search and Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="text-[#C72030] border-[#C72030] hover:bg-[#C72030] hover:text-white">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" className="text-[#C72030] border-[#C72030] hover:bg-[#C72030] hover:text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="text-[#C72030] border-[#C72030] hover:bg-[#C72030] hover:text-white">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] outline-none"
            />
          </div>
          <Button variant="outline" className="text-[#C72030] border-[#C72030] hover:bg-[#C72030] hover:text-white">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-600 font-medium">View</TableHead>
              <TableHead className="text-gray-600 font-medium">ID</TableHead>
              <TableHead className="text-gray-600 font-medium">Survey Title</TableHead>
              <TableHead className="text-gray-600 font-medium">No. Of Responses</TableHead>
              <TableHead className="text-gray-600 font-medium">No. Of Tickets</TableHead>
              <TableHead className="text-gray-600 font-medium">Expiry Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockResponseData.map((item, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell>
                  <button
                    onClick={() => handleViewDetails(item.id)}
                    className="text-gray-600 hover:text-[#C72030] transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </TableCell>
                <TableCell className="font-medium text-gray-900">{item.id}</TableCell>
                <TableCell className="text-gray-700">{item.surveyTitle}</TableCell>
                <TableCell className="text-center text-gray-700">{item.responses}</TableCell>
                <TableCell className="text-center text-gray-700">{item.tickets}</TableCell>
                <TableCell className="text-gray-700">{item.expiryDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
