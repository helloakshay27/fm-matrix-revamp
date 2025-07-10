
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid3X3, FileDown, Edit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const ApprovalMatrixPage = () => {
  const approvals = [
    { id: 198, function: 'Custom Form 11372', createdOn: '08/10/2024', createdBy: 'Vinayak Mane' },
    { id: 173, function: 'Gdn', createdOn: '10/04/2024', createdBy: 'Vinayak Mane' },
    { id: 172, function: 'Work Order', createdOn: '10/04/2024', createdBy: 'Robert Day2' },
    { id: 108, function: 'Grn', createdOn: '01/08/2023', createdBy: 'Robert Day2' },
    { id: 34, function: 'Work Order Invoice', createdOn: '23/11/2022', createdBy: 'Robert Day2' },
    { id: 33, function: 'Purchase Order', createdOn: '15/11/2022', createdBy: 'Robert Day2' }
  ];

  const handleAddClick = () => {
    console.log('Add button clicked');
  };

  const handleEditClick = (id: number) => {
    console.log('Edit clicked for ID:', id);
  };

  return (
    <div className="flex-1 p-6 bg-background">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-2">
        Setup &gt; Invoice Approvals
      </div>
      
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-foreground mb-6">INVOICE APPROVALS</h1>
      
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={handleAddClick}
          className="bg-[#C72030] hover:bg-[#A01020] text-white px-6 py-2"
        >
          + Add
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search"
              className="pl-10 w-80 bg-background border-border"
            />
          </div>
          <Button variant="outline" size="icon" className="bg-background border-border">
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-background border-border">
            <FileDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-background rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Edit</TableHead>
              <TableHead>Id</TableHead>
              <TableHead>Function</TableHead>
              <TableHead>Created On</TableHead>
              <TableHead>Created by</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.map((approval, index) => (
              <TableRow key={approval.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/10"}>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-foreground p-1"
                    onClick={() => handleEditClick(approval.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-blue-600 font-medium">
                  {approval.id}
                </TableCell>
                <TableCell className="text-foreground">
                  {approval.function}
                </TableCell>
                <TableCell className="text-foreground">
                  {approval.createdOn}
                </TableCell>
                <TableCell className="text-foreground">
                  {approval.createdBy}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
