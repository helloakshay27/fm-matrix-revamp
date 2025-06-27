
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Eye, Plus } from "lucide-react";

// Sample data for utility requests
const utilityRequestData = [
  {
    id: 1,
    entity: "SIFY TECHNOLOGIES LTD",
    fromDate: "2024-05-01",
    toDate: "2024-05-31",
    totalConsumption: 35.93,
    rate: 28.78,
    amount: 1033.95,
    plantDetail: "",
    status: "pending",
    readingType: "DGKVAH"
  },
  {
    id: 2,
    entity: "Tata Starbucks Private Limited",
    fromDate: "2024-05-01",
    toDate: "2024-05-31",
    totalConsumption: 321.27,
    rate: 28.78,
    amount: 9246.21,
    plantDetail: "",
    status: "pending",
    readingType: "DGKVAH"
  },
  {
    id: 3,
    entity: "Storybook Ventures",
    fromDate: "2024-05-01",
    toDate: "2024-05-31",
    totalConsumption: 155.23,
    rate: 28.78,
    amount: 4467.63,
    plantDetail: "",
    status: "pending",
    readingType: "DGKVAH"
  },
  {
    id: 4,
    entity: "CREST DIGITAL PRIVATE LIMITED (Space Tele)",
    fromDate: "2024-05-01",
    toDate: "2024-05-31",
    totalConsumption: 786.67,
    rate: 28.78,
    amount: 22640.5,
    plantDetail: "",
    status: "pending",
    readingType: "DGKVAH"
  },
  {
    id: 5,
    entity: "Reliance Jio Infocomm Limited",
    fromDate: "2024-05-01",
    toDate: "2024-05-31",
    totalConsumption: 97.85,
    rate: 28.78,
    amount: 2816.01,
    plantDetail: "",
    status: "pending",
    readingType: "DGKVAH"
  },
  {
    id: 6,
    entity: "Synechron Technologies Pvt. Ltd.-SE",
    fromDate: "2024-05-01",
    toDate: "2024-05-31",
    totalConsumption: 3525.64,
    rate: 28.78,
    amount: 101468.0,
    plantDetail: "",
    status: "pending",
    readingType: "DGKVAH"
  },
  {
    id: 7,
    entity: "Northern Operating Solutions Pvt. L",
    fromDate: "2024-05-01",
    toDate: "2024-05-31",
    totalConsumption: 7258.89,
    rate: 28.78,
    amount: 208911.0,
    plantDetail: "",
    status: "pending",
    readingType: "DGKVAH"
  },
  {
    id: 8,
    entity: "ALTERA DIGITAL HEALTH (INDIA) LLP",
    fromDate: "2024-05-01",
    toDate: "2024-05-31",
    totalConsumption: 1671.24,
    rate: 28.78,
    amount: 48098.2,
    plantDetail: "",
    status: "pending",
    readingType: "DGKVAH"
  },
  {
    id: 9,
    entity: "CompuCom CSI Systems India Pvt. Ltd",
    fromDate: "2024-05-01",
    toDate: "2024-05-31",
    totalConsumption: 3094.7,
    rate: 28.78,
    amount: 89065.6,
    plantDetail: "",
    status: "pending",
    readingType: "DGKVAH"
  },
  {
    id: 10,
    entity: "Allianz Services Private Limited",
    fromDate: "2024-05-01",
    toDate: "2024-05-31",
    totalConsumption: 2949.43,
    rate: 28.78,
    amount: 84884.5,
    plantDetail: "",
    status: "pending",
    readingType: "DGKVAH"
  }
];

const UtilityRequestDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 6; // Based on the pagination shown in the image

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Customer Consumption</h1>
      </div>

      {/* Add Button */}
      <div className="flex justify-start">
        <Button 
          className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Action</TableHead>
                <TableHead className="font-semibold text-gray-700">view</TableHead>
                <TableHead className="font-semibold text-gray-700">Entity</TableHead>
                <TableHead className="font-semibold text-gray-700">From date</TableHead>
                <TableHead className="font-semibold text-gray-700">To date</TableHead>
                <TableHead className="font-semibold text-gray-700">Total consumption</TableHead>
                <TableHead className="font-semibold text-gray-700">Rate</TableHead>
                <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                <TableHead className="font-semibold text-gray-700">Plant detail</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Reading type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {utilityRequestData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Button 
                      size="sm" 
                      className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 rounded-none px-2 py-1 h-8 text-xs font-medium"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 rounded-none px-2 py-1 h-8 text-xs font-medium"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{item.entity}</TableCell>
                  <TableCell>{item.fromDate}</TableCell>
                  <TableCell>{item.toDate}</TableCell>
                  <TableCell>{item.totalConsumption}</TableCell>
                  <TableCell>{item.rate}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.plantDetail}</TableCell>
                  <TableCell>
                    <span className="text-orange-600 font-medium">{item.status}</span>
                  </TableCell>
                  <TableCell>{item.readingType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 rounded-none ${
                currentPage === page 
                  ? "bg-[#C72030] hover:bg-[#A01B29] text-white" 
                  : "bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200"
              }`}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 rounded-none bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200"
          >
            6
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-none bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200"
          >
            Last »
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UtilityRequestDashboard;
