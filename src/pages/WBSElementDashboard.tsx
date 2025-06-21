
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Plus } from "lucide-react";
import { AddWBSDialog } from "@/components/AddWBSDialog";
import { WBSBulkUploadDialog } from "@/components/WBSBulkUploadDialog";

export const WBSElementDashboard = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  // Sample data - empty as shown in the image
  const wbsData: any[] = [];

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        WBS &gt; WBS List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">WBS LIST</h1>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-3">
        <Button 
          className="text-white"
          style={{ backgroundColor: '#C72030' }}
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
        <Button 
          className="text-white"
          style={{ backgroundColor: '#C72030' }}
          onClick={() => setIsBulkUploadOpen(true)}
        >
          <Download className="h-4 w-4 mr-2" />
          Import
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">Plant Code</TableHead>
              <TableHead className="font-semibold text-gray-700">Category</TableHead>
              <TableHead className="font-semibold text-gray-700">Category WBS Code</TableHead>
              <TableHead className="font-semibold text-gray-700">WBS Name</TableHead>
              <TableHead className="font-semibold text-gray-700">WBS Code</TableHead>
              <TableHead className="font-semibold text-gray-700">Site</TableHead>
              <TableHead className="font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wbsData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              wbsData.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{item.plantCode}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.categoryWBSCode}</TableCell>
                  <TableCell>{item.wbsName}</TableCell>
                  <TableCell>{item.wbsCode}</TableCell>
                  <TableCell>{item.site}</TableCell>
                  <TableCell>{item.actions}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <Button variant="outline" disabled className="text-gray-500">Previous</Button>
        <Button style={{ backgroundColor: '#C72030' }} className="text-white">1</Button>
        <Button variant="outline" disabled className="text-gray-500">Next</Button>
      </div>

      <AddWBSDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      <WBSBulkUploadDialog 
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
      />
    </div>
  );
};
