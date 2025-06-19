
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Download, Upload, Filter, Eye, Edit, Trash2 } from "lucide-react";

const UtilityWasteGenerationDashboard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', file.name);
    }
  };

  const handleAdd = () => {
    console.log('Add new waste generation record');
  };

  const handleImport = () => {
    console.log('Import waste generation data');
  };

  const handleUpdate = () => {
    console.log('Update waste generation data');
  };

  const handleFilters = () => {
    console.log('Open filters modal');
  };

  const handleView = (id: number) => {
    console.log('View waste generation record:', id);
  };

  const handleEdit = (id: number) => {
    console.log('Edit waste generation record:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete waste generation record:', id);
  };

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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Waste Generation List</h2>
          <p className="text-muted-foreground">
            Manage waste generation records and tracking
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>WASTE GENERATION LIST</CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={handleAdd}
                style={{ backgroundColor: '#C72030' }}
                className="hover:bg-[#A01B26] text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
              <div className="relative">
                <input
                  type="file"
                  id="import-file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  accept=".csv,.xlsx,.xls"
                />
                <Button 
                  onClick={handleImport}
                  variant="outline" 
                  style={{ borderColor: '#C72030', color: '#C72030' }}
                  className="hover:bg-[#C72030] hover:text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
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
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Actions</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Commodity/Source</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Operational Name of Landlord/Tenant</TableHead>
                <TableHead>UoM</TableHead>
                <TableHead>Generated Unit</TableHead>
                <TableHead>Recycled Unit</TableHead>
                <TableHead>Agency Name</TableHead>
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
                      <div className="flex space-x-2">
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
                    No waste generation records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UtilityWasteGenerationDashboard;
