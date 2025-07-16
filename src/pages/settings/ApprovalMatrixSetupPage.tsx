import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Search, Edit } from "lucide-react";
const ApprovalMatrixSetupPage = () => {
  const navigate = useNavigate();
  
  // Mock data for the table
  const approvalData = [{
    id: 198,
    function: "Custom Form 11372",
    createdOn: "08/10/2024",
    createdBy: "Vinayak Mane"
  }, {
    id: 173,
    function: "Gdn",
    createdOn: "10/04/2024",
    createdBy: "Vinayak Mane"
  }, {
    id: 172,
    function: "Work Order",
    createdOn: "10/04/2024",
    createdBy: "Robert Day2"
  }, {
    id: 108,
    function: "Grn",
    createdOn: "01/08/2023",
    createdBy: "Robert Day2"
  }, {
    id: 34,
    function: "Work Order Invoice",
    createdOn: "23/11/2022",
    createdBy: "Robert Day2"
  }, {
    id: 33,
    function: "Purchase Order",
    createdOn: "15/11/2022",
    createdBy: "Robert Day2"
  }];
  return <div className="p-8 min-h-screen bg-transparent">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-[#1a1a1a]">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings" className="text-[#1a1a1a]">
              Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/approval-matrix" className="text-[#1a1a1a]">
              Approval Matrix
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-[#C72030]">Setup</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title */}
      <Heading level="h1" className="text-[#1a1a1a] mb-6">
        APPROVAL MATRIX SETUP
      </Heading>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={() => navigate('/settings/approval-matrix/setup/add')}
          className="bg-[#C72030] hover:bg-[#A61B28] text-white"
        >
          + Add
        </Button>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#C72030] w-64" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Edit</TableHead>
              <TableHead className="w-20">Id</TableHead>
              <TableHead>Function</TableHead>
              <TableHead className="w-32">Created On</TableHead>
              <TableHead className="w-32">Created by</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvalData.map(item => <TableRow key={item.id}>
                <TableCell>
                  <Button variant="ghost" size="sm" className="p-1">
                    <Edit className="w-4 h-4 text-[#1a1a1a]" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.function}</TableCell>
                <TableCell>{item.createdOn}</TableCell>
                <TableCell>{item.createdBy}</TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
    </div>;
};
export default ApprovalMatrixSetupPage;