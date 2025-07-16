
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, MoreVertical, Grid3X3, ExternalLink, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'sonner';

interface InvoiceApproval {
  id: number;
  approval_function_name: string;
  created_at: string;
  created_by: string;
}

// Function to format date from ISO string to DD/MM/YYYY
const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const InvoiceApprovalsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [invoiceApprovals, setInvoiceApprovals] = useState<InvoiceApproval[]>([]);
  const [filteredData, setFilteredData] = useState<InvoiceApproval[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch invoice approvals data from API
  useEffect(() => {
    const fetchInvoiceApprovals = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/pms/admin/invoice_approvals.json');
        const data = response.data;
        
        // Handle different response formats
        let approvals: InvoiceApproval[] = [];
        if (Array.isArray(data)) {
          approvals = data;
        } else if (data && Array.isArray(data.invoice_approvals)) {
          approvals = data.invoice_approvals;
        } else {
          console.error('Unexpected data format:', data);
        }
        
        setInvoiceApprovals(approvals);
        setFilteredData(approvals);
      } catch (error) {
        console.error('Error fetching invoice approvals:', error);
        toast.error('Failed to load invoice approvals');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceApprovals();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = invoiceApprovals.filter(item => 
      item.approval_function_name.toLowerCase().includes(value.toLowerCase()) ||
      item.created_by.toLowerCase().includes(value.toLowerCase()) ||
      item.id.toString().includes(value)
    );
    setFilteredData(filtered);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Setup &gt; Invoice Approvals
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">INVOICE APPROVALS</h1>
        
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Action Buttons */}
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Grid3X3 className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-start">
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => navigate('/settings/invoice-approvals/add')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-20 text-center">Edit</TableHead>
              <TableHead className="w-24 text-center">Id</TableHead>
              <TableHead className="text-center">Function</TableHead>
              <TableHead className="w-32 text-center">Created On</TableHead>
              <TableHead className="w-32 text-center">Created by</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading invoice approvals...
                </TableCell>
              </TableRow>
            ) : filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm" className="p-1">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {item.id}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.approval_function_name}
                  </TableCell>
                  <TableCell className="text-center text-gray-600">
                    {formatDate(item.created_at)}
                  </TableCell>
                  <TableCell className="text-center text-gray-600">
                    {item.created_by}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No invoice approvals found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex justify-center pt-8">
        <div className="flex items-center text-sm text-gray-500">
          <span>Powered by</span>
          <span className="ml-2 font-semibold">goPhygital.work</span>
        </div>
      </div>
    </div>
  );
};
