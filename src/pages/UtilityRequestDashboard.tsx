
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Eye, Plus } from "lucide-react";

// Sample data for utility requests
const utilityRequestData = [
  {
    id: 1,
    entity: "SIFY TECHNOLOGIES LIMITED",
    requestType: "Water",
    amount: 5000,
    status: "Pending",
    requestDate: "2024-01-15",
    description: "Monthly water utility request"
  },
  {
    id: 2,
    entity: "TECH SOLUTIONS PVT LTD",
    requestType: "Electricity",
    amount: 15000,
    status: "Approved",
    requestDate: "2024-01-14",
    description: "Quarterly electricity bill request"
  }
];

export const UtilityRequestDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('all');

  const handleAddRequest = () => {
    console.log('Add new utility request');
  };

  const handleViewRequest = (id: number) => {
    console.log('View request:', id);
  };

  const handleEditRequest = (id: number) => {
    console.log('Edit request:', id);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Utility &gt; Requests
      </div>

      {/* Page Title */}
      <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">UTILITY REQUESTS</h1>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          onClick={handleAddRequest}
          className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
        >
          <Plus className="w-4 h-4" />
          Add Request
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {['all', 'pending', 'approved', 'rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
              selectedTab === tab
                ? 'border-[#C72030] text-[#C72030] bg-[#C72030]/5'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Actions</TableHead>
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Entity</TableHead>
                <TableHead className="font-semibold">Request Type</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Request Date</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {utilityRequestData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No utility requests found
                  </TableCell>
                </TableRow>
              ) : (
                utilityRequestData.map((request) => (
                  <TableRow key={request.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewRequest(request.id)}
                          className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditRequest(request.id)}
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">#{request.id}</TableCell>
                    <TableCell>{request.entity}</TableCell>
                    <TableCell>{request.requestType}</TableCell>
                    <TableCell>₹{request.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell className="max-w-xs truncate">{request.description}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
