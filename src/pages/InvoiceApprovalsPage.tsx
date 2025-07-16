
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, MoreVertical, Grid3X3, ExternalLink, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InvoiceApproval {
  id: number;
  function: string;
  createdOn: string;
  createdBy: string;
}

const mockData: InvoiceApproval[] = [
  {
    id: 198,
    function: "Custom Form 11372",
    createdOn: "08/10/2024",
    createdBy: "Vinayak Mane"
  },
  {
    id: 173,
    function: "Gdn",
    createdOn: "10/04/2024",
    createdBy: "Vinayak Mane"
  },
  {
    id: 172,
    function: "Work Order",
    createdOn: "10/04/2024",
    createdBy: "Robert Day2"
  },
  {
    id: 108,
    function: "Grn",
    createdOn: "01/08/2023",
    createdBy: "Robert Day2"
  },
  {
    id: 34,
    function: "Work Order Invoice",
    createdOn: "23/11/2022",
    createdBy: "Robert Day2"
  },
  {
    id: 33,
    function: "Purchase Order",
    createdOn: "15/11/2022",
    createdBy: "Robert Day2"
  }
];

export const InvoiceApprovalsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(mockData);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockData.filter(item => 
      item.function.toLowerCase().includes(value.toLowerCase()) ||
      item.createdBy.toLowerCase().includes(value.toLowerCase()) ||
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
            {filteredData.map((item) => (
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
                  {item.function}
                </TableCell>
                <TableCell className="text-center text-gray-600">
                  {item.createdOn}
                </TableCell>
                <TableCell className="text-center text-gray-600">
                  {item.createdBy}
                </TableCell>
              </TableRow>
            ))}
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
