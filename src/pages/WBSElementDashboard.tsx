
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { AddWBSDialog } from "@/components/AddWBSDialog";
import { BulkUploadModal } from "@/components/BulkUploadModal";

export const WBSElementDashboard = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  // Sample data - empty as shown in the image
  const wbsData: any[] = [];

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>WBS</span>
          <span className="mx-2">{'>'}</span>
          <span>WBS List</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">WBS LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-3">
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90"
        >
          + Add
        </Button>
        <Button 
          onClick={() => setIsBulkUploadOpen(true)}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90"
        >
          <Download className="h-4 w-4 mr-2" />
          Import
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">Plant Code</TableHead>
              <TableHead className="font-semibold text-gray-900">Category</TableHead>
              <TableHead className="font-semibold text-gray-900">Category WBS Code</TableHead>
              <TableHead className="font-semibold text-gray-900">WBS Name</TableHead>
              <TableHead className="font-semibold text-gray-900">WBS Code</TableHead>
              <TableHead className="font-semibold text-gray-900">Site</TableHead>
              <TableHead className="font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wbsData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                  No WBS elements found
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
        <Button variant="outline" disabled className="px-4 py-2">
          Previous
        </Button>
        <Button 
          style={{ backgroundColor: '#C72030' }}
          className="text-white px-4 py-2"
        >
          1
        </Button>
        <Button variant="outline" disabled className="px-4 py-2">
          Next
        </Button>
      </div>

      <AddWBSDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        title="Bulk Upload"
      />
    </div>
  );
};
