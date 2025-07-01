
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, RefreshCw } from 'lucide-react';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';
import { AddCostCenterDialog } from '@/components/AddCostCenterDialog';
import { ExportDropdown } from '@/components/ExportDropdown';

export const MarketPlaceCostCenterPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Column visibility state
  const [columns, setColumns] = useState([
    { key: 'actions', label: 'Actions', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'budget', label: 'Budget', visible: true },
    { key: 'budgetStartDate', label: 'Budget Start date', visible: true },
    { key: 'budgetEndDate', label: 'Budget End date', visible: true }
  ]);

  // Sample data - empty for now as shown in the image
  const costCenterData: any[] = [];

  const handleAdd = () => {
    console.log('Add button clicked');
    setShowAddDialog(true);
  };

  const handleRefresh = () => {
    console.log('Refresh button clicked');
  };

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    console.log(`Column ${columnKey} toggled to ${visible}`);
    setColumns(prev => 
      prev.map(col => 
        col.key === columnKey ? { ...col, visible } : col
      )
    );
  };

  const isColumnVisible = (columnKey: string) => {
    return columns.find(col => col.key === columnKey)?.visible ?? true;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header with Action Buttons */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Button 
              onClick={handleAdd}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-white stroke-white" />
              Add
            </Button>
            
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 border-gray-300 rounded"
              />
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="p-2" onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4 text-white stroke-white" />
                </Button>
                <ColumnVisibilityDropdown
                  columns={columns}
                  onColumnToggle={handleColumnToggle}
                />
                <ExportDropdown />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {isColumnVisible('actions') && <TableHead className="text-left font-semibold">Actions</TableHead>}
                {isColumnVisible('name') && <TableHead className="text-left font-semibold">Name</TableHead>}
                {isColumnVisible('budget') && <TableHead className="text-left font-semibold">Budget</TableHead>}
                {isColumnVisible('budgetStartDate') && <TableHead className="text-left font-semibold">Budget Start date</TableHead>}
                {isColumnVisible('budgetEndDate') && <TableHead className="text-left font-semibold">Budget End date</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {costCenterData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No matching records found
                  </TableCell>
                </TableRow>
              ) : (
                costCenterData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    {isColumnVisible('actions') && <TableCell></TableCell>}
                    {isColumnVisible('name') && <TableCell>{item.name}</TableCell>}
                    {isColumnVisible('budget') && <TableCell>{item.budget}</TableCell>}
                    {isColumnVisible('budgetStartDate') && <TableCell>{item.budgetStartDate}</TableCell>}
                    {isColumnVisible('budgetEndDate') && <TableCell>{item.budgetEndDate}</TableCell>}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer with LOCKATED branding */}
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Powered by</span>
            <div className="w-8 h-8 bg-yellow-500 rounded-sm flex items-center justify-center">
              <span className="text-black font-bold text-xs">L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Cost Center Dialog */}
      <AddCostCenterDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
    </div>
  );
};
