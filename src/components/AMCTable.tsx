
import React from 'react';
import { Plus, Search, RotateCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface AMCTableProps {
  onAddAMC: () => void;
}

export const AMCTable = ({ onAddAMC }: AMCTableProps) => {
  return (
    <div className="bg-white rounded-lg border border-[#D5DbDB]">
      {/* Table Header Actions */}
      <div className="p-4 border-b border-[#D5DbDB] flex items-center gap-3">
        <button
          onClick={onAddAMC}
          className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
        
        <div className="flex-1 flex justify-end items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search AMC..."
              className="pl-10 pr-4 py-2 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors">
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Asset Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>First Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created on</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={10} className="text-center py-8 text-gray-500">
              No AMC records found
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
