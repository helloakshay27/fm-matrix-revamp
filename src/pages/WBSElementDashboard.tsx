
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Plus, Edit, Trash2 } from "lucide-react";
import { AddWBSDialog } from "@/components/AddWBSDialog";
import { BulkUploadDialog } from "@/components/BulkUploadDialog";
import { toast } from "sonner";

interface WBSElement {
  id: string;
  plantCode: string;
  category: string;
  categoryWBSCode: string;
  wbsName: string;
  wbsCode: string;
  site: string;
}

export const WBSElementDashboard = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [wbsData, setWbsData] = useState<WBSElement[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleAddWBS = (data: Omit<WBSElement, 'id'>) => {
    const newWBS: WBSElement = {
      ...data,
      id: Date.now().toString(),
    };
    setWbsData(prev => [...prev, newWBS]);
    toast.success("WBS element added successfully!");
    console.log('WBS added:', newWBS);
  };

  const handleEditWBS = (id: string) => {
    console.log('Edit WBS:', id);
    toast.info("Edit functionality will be implemented");
  };

  const handleDeleteWBS = (id: string) => {
    setWbsData(prev => prev.filter(item => item.id !== id));
    toast.success("WBS element deleted successfully!");
    console.log('WBS deleted:', id);
  };

  const handleBulkImport = (file: File) => {
    console.log('Importing WBS data from file:', file.name);
    // Simulate processing the file
    setTimeout(() => {
      const sampleData: WBSElement[] = [
        {
          id: '1',
          plantCode: 'PLT001',
          category: 'Infrastructure',
          categoryWBSCode: 'INF001',
          wbsName: 'Building Maintenance',
          wbsCode: 'BM001',
          site: 'Site A'
        },
        {
          id: '2',
          plantCode: 'PLT002',
          category: 'Equipment',
          categoryWBSCode: 'EQP001',
          wbsName: 'HVAC System',
          wbsCode: 'HVAC001',
          site: 'Site B'
        }
      ];
      setWbsData(prev => [...prev, ...sampleData]);
      toast.success(`Successfully imported ${sampleData.length} WBS elements`);
    }, 1000);
  };

  const totalPages = Math.ceil(wbsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = wbsData.slice(startIndex, endIndex);

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Home &gt; Finance &gt; WBS
      </div>

      {/* Page Title */}
      <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal mb-6">WBS LIST</h1>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-3">
        <Button 
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
        <Button 
          variant="outline" 
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
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
              <TableHead className="font-semibold">Plant Code</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Category WBS Code</TableHead>
              <TableHead className="font-semibold">WBS Name</TableHead>
              <TableHead className="font-semibold">WBS Code</TableHead>
              <TableHead className="font-semibold">Site</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No WBS elements found
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{item.plantCode}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.categoryWBSCode}</TableCell>
                  <TableCell>{item.wbsName}</TableCell>
                  <TableCell>{item.wbsCode}</TableCell>
                  <TableCell>{item.site}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditWBS(item.id)}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteWBS(item.id)}
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <Button 
          variant="outline" 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="hover:bg-gray-50"
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            style={currentPage === page ? { backgroundColor: '#C72030' } : {}}
            className={currentPage === page ? "text-white" : "hover:bg-gray-50"}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
        <Button 
          variant="outline" 
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="hover:bg-gray-50"
        >
          Next
        </Button>
      </div>

      <AddWBSDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddWBS}
      />

      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        title="Bulk Upload WBS"
        onImport={handleBulkImport}
      />
    </div>
  );
};
