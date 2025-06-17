
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, Trash2, Download, Filter, Plus, Upload } from "lucide-react";
import { AddPatrollingForm } from "../components/AddPatrollingForm";
import { PatrollingFilterModal } from "../components/PatrollingFilterModal";
import { BulkUploadModal } from "../components/BulkUploadModal";
import { ExportModal } from "../components/ExportModal";

const patrollingData = [
  {
    id: 1,
    location: "Site - Loctated / Building - Jyoti Tower / Wing - NA / Floor - NA / Room - NA",
    schedule: "7:00 AM, 3:00 PM, 11:00 PM"
  },
  {
    id: 2,
    location: "Site - Loctated / Building - Jyoti Tower / Wing - NA / Floor - NA / Room - NA",
    schedule: "12:00 AM, 1:00 AM, 2:00 AM, 3:00 AM, 4:00 AM, 5:00 AM, 6:00 AM, 7:00 AM, 8:00 AM, 9:00 AM, 10:00 AM, 11:00 AM"
  },
  {
    id: 3,
    location: "Site - Loctated / Building - Jyoti Tower / Wing - NA / Floor - NA / Room - NA",
    schedule: "5:00 PM, 6:00 PM, 7:00 PM"
  },
  {
    id: 4,
    location: "Site - Loctated / Building - Hay / Wing - NA / Floor - NA / Room - NA",
    schedule: "12:00 AM, 4:00 AM, 8:00 AM, 12:00 PM, 4:00 PM, 8:00 PM"
  },
  {
    id: 5,
    location: "Site - Loctated / Building - Jyoti Tower / Wing - NA / Floor - NA / Room - NA",
    schedule: "12:00 AM, 5:00 AM, 10:00 AM, 3:00 PM, 8:00 PM"
  }
];

export const PatrollingDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>visitors</span>
          <span>&gt;</span>
          <span>Patrolling</span>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">PATROLLING LIST</h1>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3 mb-4">
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#8B5A5A] hover:bg-[#7A4949] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add</DialogTitle>
                  </DialogHeader>
                  <AddPatrollingForm onClose={() => setIsAddModalOpen(false)} />
                </DialogContent>
              </Dialog>

              <Dialog open={isBulkUploadModalOpen} onOpenChange={setIsBulkUploadModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-gray-700">
                    <Download className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Bulk Upload</DialogTitle>
                  </DialogHeader>
                  <BulkUploadModal onClose={() => setIsBulkUploadModalOpen(false)} />
                </DialogContent>
              </Dialog>

              <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-gray-700">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Export</DialogTitle>
                  </DialogHeader>
                  <ExportModal onClose={() => setIsExportModalOpen(false)} />
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="text-gray-700">
                Print QR
              </Button>

              <Button variant="outline" className="text-gray-700">
                Print All QR
              </Button>

              <PatrollingFilterModal 
                isOpen={isFilterModalOpen} 
                onClose={() => setIsFilterModalOpen(false)} 
              >
                <Button variant="outline" onClick={() => setIsFilterModalOpen(true)}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </PatrollingFilterModal>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input type="checkbox" className="rounded" />
                  </TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Schedule</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patrollingData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <input type="checkbox" className="rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <span className="text-sm">{item.location}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{item.schedule}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
