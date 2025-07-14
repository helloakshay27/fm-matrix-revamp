import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download, Upload, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { WasteGenerationFilterDialog } from '../components/WasteGenerationFilterDialog';
import { WasteGenerationBulkDialog } from '../components/WasteGenerationBulkDialog';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
const UtilityWasteGenerationDashboard = () => {
  console.log('UtilityWasteGenerationDashboard component loaded successfully');
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const handleAdd = () => navigate('/maintenance/waste/generation/add');
  const handleImport = () => setIsImportOpen(true);
  const handleUpdate = () => setIsUpdateOpen(true);
  const handleFilters = () => setIsFilterOpen(true);
  const handleView = (id: number) => console.log('View waste generation record:', id);
  const handleEdit = (id: number) => console.log('Edit waste generation record:', id);
  const handleDelete = (id: number) => console.log('Delete waste generation record:', id);
  const wasteGenerationData = [{
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
  }, {
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
  }, {
    id: 3,
    location: 'Building C - Floor 3',
    vendor: 'GreenCycle Corp',
    commodity: 'Glass',
    category: 'Recyclable',
    operational: 'Tech Innovations',
    uom: 'KG',
    generated: 200,
    recycled: 180,
    agency: 'Eco Handlers',
    wasteDate: '2024-01-13',
    createdBy: 'Mike Johnson',
    createdOn: '2024-01-13 09:45 AM'
  }, {
    id: 4,
    location: 'Building D - Floor 1',
    vendor: 'WastePro Services',
    commodity: 'Metal',
    category: 'Recyclable',
    operational: 'Manufacturing Co',
    uom: 'KG',
    generated: 350,
    recycled: 320,
    agency: 'Metal Recovery Inc',
    wasteDate: '2024-01-12',
    createdBy: 'Sarah Davis',
    createdOn: '2024-01-12 03:20 PM'
  }, {
    id: 5,
    location: 'Building E - Floor 2',
    vendor: 'BioCycle Ltd',
    commodity: 'Organic',
    category: 'Compostable',
    operational: 'Food Services',
    uom: 'KG',
    generated: 120,
    recycled: 100,
    agency: 'Organic Solutions',
    wasteDate: '2024-01-11',
    createdBy: 'David Wilson',
    createdOn: '2024-01-11 11:15 AM'
  }, {
    id: 6,
    location: 'Building F - Floor 4',
    vendor: 'TechWaste Pro',
    commodity: 'Electronic',
    category: 'E-Waste',
    operational: 'IT Department',
    uom: 'Units',
    generated: 45,
    recycled: 40,
    agency: 'E-Waste Specialists',
    wasteDate: '2024-01-10',
    createdBy: 'Emily Brown',
    createdOn: '2024-01-10 01:30 PM'
  }, {
    id: 7,
    location: 'Building G - Floor 1',
    vendor: 'CleanWaste Solutions',
    commodity: 'Cardboard',
    category: 'Recyclable',
    operational: 'Logistics Dept',
    uom: 'KG',
    generated: 280,
    recycled: 250,
    agency: 'Paper Recovery Co',
    wasteDate: '2024-01-09',
    createdBy: 'Robert Taylor',
    createdOn: '2024-01-09 08:45 AM'
  }];

  const columns = [
    { key: 'id', label: 'ID', sortable: true, draggable: true },
    { key: 'location', label: 'Location', sortable: true, draggable: true },
    { key: 'vendor', label: 'Vendor', sortable: true, draggable: true },
    { key: 'commodity', label: 'Commodity/Source', sortable: true, draggable: true },
    { key: 'category', label: 'Category', sortable: true, draggable: true },
    { key: 'operational', label: 'Operational Name', sortable: true, draggable: true },
    { key: 'uom', label: 'UoM', sortable: true, draggable: true },
    { key: 'generated', label: 'Generated', sortable: true, draggable: true },
    { key: 'recycled', label: 'Recycled', sortable: true, draggable: true },
    { key: 'agency', label: 'Agency', sortable: true, draggable: true },
    { key: 'wasteDate', label: 'Waste Date', sortable: true, draggable: true },
    { key: 'createdBy', label: 'Created By', sortable: true, draggable: true },
    { key: 'createdOn', label: 'Created On', sortable: true, draggable: true }
  ];

  const renderActions = (record: any) => (
    <div className="flex space-x-1">
      <Button variant="ghost" size="sm" onClick={() => handleView(record.id)} className="h-8 w-8 p-0">
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleEdit(record.id)} className="h-8 w-8 p-0">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)} className="h-8 w-8 p-0 text-red-600 hover:text-red-800">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
  return <>
      <div className="flex-1 space-y-4 p-4 sm:p-5 md:p-3 pt-6">
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
        <Card className="bg-transparent">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <CardTitle className="text-base sm:text-lg font-semibold">
                WASTE GENERATION LIST
              </CardTitle>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleAdd} style={{
                backgroundColor: '#C72030'
              }} className="hover:bg-[#A01B26] text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
                <Button onClick={handleImport} variant="outline" style={{
                borderColor: '#C72030',
                color: '#C72030'
              }} className="hover:bg-[#C72030] hover:text-white">
                  <Download className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button onClick={handleUpdate} variant="outline" style={{
                borderColor: '#C72030',
                color: '#C72030'
              }} className="hover:bg-[#C72030] hover:text-white">
                  <Upload className="mr-2 h-4 w-4" />
                  Update
                </Button>
                <Button onClick={handleFilters} variant="outline" style={{
                borderColor: '#C72030',
                color: '#C72030'
              }} className="hover:bg-[#C72030] hover:text-white">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Enhanced Table */}
          <CardContent>
            <EnhancedTable
              data={wasteGenerationData}
              columns={columns}
              selectable={true}
              renderActions={renderActions}
              storageKey="waste-generation-table"
              enableExport={true}
              exportFileName="waste-generation-data"
            />
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <WasteGenerationFilterDialog isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
      <WasteGenerationBulkDialog isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} type="import" />
      <WasteGenerationBulkDialog isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} type="update" />
    </>;
};
export default UtilityWasteGenerationDashboard;