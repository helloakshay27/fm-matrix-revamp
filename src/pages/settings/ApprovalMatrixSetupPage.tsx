import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Search, Edit } from "lucide-react";
import { apiClient } from "@/utils/apiClient";
import { format } from "date-fns";
interface ApprovalData {
  id: number;
  approval_function_name: string;
  created_at: string;
  created_by: string;
}

const ApprovalMatrixSetupPage = () => {
  const navigate = useNavigate();
  const [approvalData, setApprovalData] = useState<ApprovalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovalData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/pms/admin/invoice_approvals.json');
        setApprovalData(response.data);
      } catch (error) {
        console.error('Error fetching approval data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovalData();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : approvalData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No approval matrix data found
                </TableCell>
              </TableRow>
            ) : (
              approvalData.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1"
                      onClick={() => navigate(`/settings/approval-matrix/setup/edit/${item.id}`)}
                    >
                      <Edit className="w-4 h-4 text-[#1a1a1a]" />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.approval_function_name}</TableCell>
                  <TableCell>{formatDate(item.created_at)}</TableCell>
                  <TableCell>{item.created_by}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>;
};
export default ApprovalMatrixSetupPage;