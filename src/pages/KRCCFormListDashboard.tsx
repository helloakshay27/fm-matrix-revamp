
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filter, Download } from 'lucide-react';
import { KRCCFormFilterDialog } from '@/components/KRCCFormFilterDialog';

export const KRCCFormListDashboard = () => {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>(null);

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    console.log('Applied filters:', filters);
    // Here you would typically fetch filtered data
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting KRCC Form List data...');
    // Here you would typically trigger a download or API call
    alert('Export functionality triggered');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <span>Krcc Forms</span>
        <span className="mx-2">{'>'}</span>
        <span>KRCC FORM List</span>
      </div>
      
      <h1 className="text-2xl font-semibold text-gray-900">KRCC FORM LIST</h1>
      
      <div className="flex gap-4 mb-6">
        <Button 
          variant="outline" 
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
          onClick={() => setIsFilterDialogOpen(true)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button 
          className="text-white hover:opacity-90"
          style={{ backgroundColor: '#C72030' }}
          onClick={handleExport}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {appliedFilters && (
        <div className="bg-blue-50 p-3 rounded-md mb-4">
          <p className="text-sm text-blue-800">
            Filters applied: 
            {appliedFilters.startDate && ` Start Date: ${appliedFilters.startDate.toDateString()}`}
            {appliedFilters.endDate && ` End Date: ${appliedFilters.endDate.toDateString()}`}
            {appliedFilters.email && ` Email: ${appliedFilters.email}`}
            {appliedFilters.circle && ` Circle: ${appliedFilters.circle}`}
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Action</TableHead>
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">User Email</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                No data available
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <KRCCFormFilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
