import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Download, Upload, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { WasteGenerationFilterDialog } from '../components/WasteGenerationFilterDialog';
import { WasteGenerationBulkDialog } from '../components/WasteGenerationBulkDialog';

const UtilityWasteGenerationDashboard = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const handleAdd = () => navigate('/maintenance/audit/waste/generation/add');
  const handleImport = () => setIsImportOpen(true);
  const handleUpdate = () => setIsUpdateOpen(true);
  const handleFilters = () => setIsFilterOpen(true);

  const handleView = (id: number) => console.log('View waste generation record:', id);
  const handleEdit = (id: number) => console.log('Edit waste generation record:', id);
  const handleDelete = (id: number) => console.log('Delete waste generation record:', id);

  const wasteGenerationData = [
    {
      id: 1,
      location: 'Building A - Floor 1',
      vendor: 'EcoWaste Solutions',
      commodity: 'Paper',
      category: 'Recyclable',
      operational: 'ABC Corp',
      uom: 'KG',
      generated: 150,
      recycled: 120,
      agency: 'Green Agency',
      wasteDate: '2024-01-15',
      createdBy: 'John Doe',
      createdOn: '2024-01-15 10:30 AM'
    },
    {
      id: 2,
      location: 'Building B - Floor 2',
      vendor: 'WasteManage Ltd',
      commodity: 'Plastic',
      category: 'Non-Recyclable',
      operational: 'XYZ Inc',
      uom: 'KG',
      generated: 80,
      recycled: 40,
      agency: 'Clean Solutions',
      wasteDate: '2024-01-14',
      createdBy: 'Jane Smith',
      createdOn: '2024-01-14 02:15 PM'
    }
  ];

  return (
    <>
      <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8 pt-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Waste Generation List</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage waste generation records and tracking
            </p>
          </div>
        </div>

        {/* Main Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <CardTitle className="text-base sm:text-lg font-semibold">
                WASTE GENERATION LIST
              </CardTitle>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleAdd}
                  style={{ backgroundColor: '#C72030' }}
                  className="hover:bg-[#A01B26] text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
                <Button
                  onClick={handleImport}
                  variant="outline"
                  style={{ borderColor: '#C72030', color: '#C72030' }}
                  className="hover:bg-[#C72030] hover:text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button
                  onClick={handleUpdate}
                  variant="outline"
                  style={{ borderColor: '#C72030', color: '#C72030' }}
                  className="hover:bg-[#C72030] hover:text-white"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Update
                </Button>
                <Button
                  onClick={handleFilters}
                  variant="outline"
                  style={{ borderColor: '#C72030', color: '#C72030' }}
                  className="hover:bg-[#C72030] hover:text-white"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Table */}
          <CardContent>
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[1200px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Actions</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Commodity/Source</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Operational Name</TableHead>
                    <TableHead>UoM</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Recycled</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Waste Date</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wasteGenerationData.length > 0 ? (
                    wasteGenerationData.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(record.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(record.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(record.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{record.id}</TableCell>
                        <TableCell>{record.location}</TableCell>
                        <TableCell>{record.vendor}</TableCell>
                        <TableCell>{record.commodity}</TableCell>
                        <TableCell>{record.category}</TableCell>
                        <TableCell>{record.operational}</TableCell>
                        <TableCell>{record.uom}</TableCell>
                        <TableCell>{record.generated}</TableCell>
                        <TableCell>{record.recycled}</TableCell>
                        <TableCell>{record.agency}</TableCell>
                        <TableCell>{record.wasteDate}</TableCell>
                        <TableCell>{record.createdBy}</TableCell>
                        <TableCell>{record.createdOn}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={14} className="text-center text-muted-foreground py-8">
                        No waste generation records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <WasteGenerationFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
      <WasteGenerationBulkDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        type="import"
      />
      <WasteGenerationBulkDialog
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        type="update"
      />
    </>
  );
};

export default UtilityWasteGenerationDashboard;
