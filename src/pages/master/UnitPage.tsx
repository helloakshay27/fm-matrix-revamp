import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Square, Plus, X, ChevronLeft, ChevronRight, Check, Download, Upload, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { 
  fetchBuildings, 
  fetchWings, 
  fetchAreas, 
  fetchFloors,
  fetchAllUnits,
  createUnit, 
  updateUnit
} from '@/store/slices/locationSlice';
import { toast } from 'sonner';

export const UnitPage = () => {
  const dispatch = useAppDispatch();
  const { 
    buildings, 
    wings, 
    areas, 
    floors,
    units
  } = useAppSelector((state) => state.location);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [newUnit, setNewUnit] = useState({
    building: '',
    wing: '',
    area: '',
    floor: '',
    unitName: '',
    areaSize: ''
  });
  const [editUnit, setEditUnit] = useState({
    building: '',
    wing: '',
    area: '',
    floor: '',
    unitName: '',
    areaSize: '',
    active: true
  });

  useEffect(() => {
    dispatch(fetchBuildings());
    dispatch(fetchAllUnits());
  }, [dispatch]);

  // Debug: Log state changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Units state:', units);
      console.log('Buildings state:', buildings);
      console.log('Wings state:', wings);
      console.log('Areas state:', areas);
      console.log('Floors state:', floors);
      if (units.data.length > 0) {
        console.log('First unit sample:', units.data[0]);
      }
    }
  }, [units, buildings, wings, areas, floors]);

  // Reset pagination when units data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [units.data.length]);

  // Debug: Log form state changes
  useEffect(() => {
    console.log('newUnit state:', newUnit);
  }, [newUnit]);

  useEffect(() => {
    console.log('editUnit state:', editUnit);
  }, [editUnit]);

  // Fetch dependencies for add/edit forms
  useEffect(() => {
    if (newUnit.building) {
      console.log('Fetching wings, areas, and floors for building:', newUnit.building);
      dispatch(fetchWings(parseInt(newUnit.building)));
      dispatch(fetchAreas({ buildingId: parseInt(newUnit.building), wingId: newUnit.wing ? parseInt(newUnit.wing) : undefined }));
      dispatch(fetchFloors({ 
        buildingId: parseInt(newUnit.building), 
        wingId: newUnit.wing ? parseInt(newUnit.wing) : undefined,
        areaId: newUnit.area ? parseInt(newUnit.area) : undefined
      }));
    }
  }, [dispatch, newUnit.building, newUnit.wing, newUnit.area]);

  // Fetch dependencies for edit forms
  useEffect(() => {
    if (editUnit.building && editingUnit) {
      console.log('Fetching wings, areas, and floors for building in edit:', editUnit.building);
      dispatch(fetchWings(parseInt(editUnit.building)));
      dispatch(fetchAreas({ buildingId: parseInt(editUnit.building), wingId: editUnit.wing ? parseInt(editUnit.wing) : undefined }));
      dispatch(fetchFloors({ 
        buildingId: parseInt(editUnit.building), 
        wingId: editUnit.wing ? parseInt(editUnit.wing) : undefined,
        areaId: editUnit.area ? parseInt(editUnit.area) : undefined
      }));
    }
  }, [dispatch, editUnit.building, editUnit.wing, editUnit.area, editingUnit]);

  // Pagination calculations
  const filteredUnits = units.data.filter(unit => {
    const searchLower = searchTerm.toLowerCase();
    return (
      unit.unit_name?.toLowerCase().includes(searchLower) ||
      unit.building?.name?.toLowerCase().includes(searchLower) ||
      unit.wing?.name?.toLowerCase().includes(searchLower) ||
      (unit.area_obj?.name && unit.area_obj.name.toLowerCase().includes(searchLower)) ||
      unit.floor?.name?.toLowerCase().includes(searchLower)
    );
  });

  const totalItems = filteredUnits.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUnits = filteredUnits.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      let baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
      baseUrl = baseUrl.replace(/^https?:\/\//, '');
      const templateUrl = `https://${baseUrl}/assets/unit.xlsx`;
      
      const response = await fetch(templateUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'unit.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Template downloaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to download template');
    }
  };

  const handleImportUnits = async () => {
    if (!importFile) return;

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('pms_unit[file]', importFile);
      
      const token = localStorage.getItem('token') || '';
      let baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
      baseUrl = baseUrl.replace(/^https?:\/\//, '');
      const apiUrl = `https://${baseUrl}/pms/account_setups/unit_import.json?token=${token}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to import units');
      }

      toast.success('Units imported successfully');
      setShowImportDialog(false);
      setImportFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      dispatch(fetchAllUnits());
    } catch (error: any) {
      toast.error(error.message || 'Failed to import units');
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      if (validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        setImportFile(file);
      } else {
        toast.error('Please select a valid Excel or CSV file');
        event.target.value = '';
      }
    }
  };

  const handleAddUnit = async () => {
    if (!newUnit.building) {
      toast.error('Please select a building');
      return;
    }
    if (!newUnit.unitName.trim()) {
      toast.error('Please enter unit name');
      return;
    }
    
    try {
      await dispatch(createUnit({
        unit_name: newUnit.unitName,
        building_id: parseInt(newUnit.building),
        wing_id: newUnit.wing ? parseInt(newUnit.wing) : undefined,
        area_id: newUnit.area ? parseInt(newUnit.area) : undefined,
        floor_id: newUnit.floor ? parseInt(newUnit.floor) : undefined,
        area: parseInt(newUnit.areaSize) || 0
      }));
      toast.success('Unit created successfully');
      setNewUnit({ building: '', wing: '', area: '', floor: '', unitName: '', areaSize: '' });
      setIsAddDialogOpen(false);
      dispatch(fetchAllUnits());
    } catch (error) {
      console.error('Error creating unit:', error);
      toast.error('Failed to create unit');
    }
  };

  const toggleActiveStatus = async (unitId: number) => {
    try {
      const unit = units.data.find(u => u.id === unitId);
      if (!unit) return;

      await dispatch(updateUnit({
        id: unitId,
        updates: { active: !unit.active }
      }));
      dispatch(fetchAllUnits());
      toast.success('Unit status updated successfully');
    } catch (error) {
      console.error('Error updating unit status:', error);
      toast.error('Failed to update unit status');
    }
  };

  const handleEditUnit = (unit: any) => {
    setEditingUnit(unit);
    setEditUnit({
      building: unit.building_id?.toString() || '',
      wing: unit.wing_id?.toString() || '',
      area: unit.area_id?.toString() || '',
      floor: unit.floor_id?.toString() || '',
      unitName: unit.unit_name || '',
      areaSize: unit.area?.toString() || '',
      active: unit.active
    });
    
    // Load all dependencies immediately when editing starts
    if (unit.building_id) {
      dispatch(fetchWings(unit.building_id));
      dispatch(fetchAreas({ buildingId: unit.building_id, wingId: unit.wing_id || undefined }));
      dispatch(fetchFloors({ 
        buildingId: unit.building_id, 
        wingId: unit.wing_id || undefined, 
        areaId: unit.area_id || undefined
      }));
    }
    
    setIsEditDialogOpen(true);
  };

  const handleUpdateUnit = async () => {
    if (!editingUnit) return;
    
    if (!editUnit.building) {
      toast.error('Please select a building');
      return;
    }
    if (!editUnit.unitName.trim()) {
      toast.error('Please enter unit name');
      return;
    }
    
    const payload = {
      unit_name: editUnit.unitName,
      building_id: parseInt(editUnit.building),
      wing_id: editUnit.wing ? parseInt(editUnit.wing) : null,
      area_id: editUnit.area ? parseInt(editUnit.area) : null,
      floor_id: editUnit.floor ? parseInt(editUnit.floor) : null,
      area: parseInt(editUnit.areaSize) || 0,
      active: editUnit.active
    };
    
    console.log('🚀 Update Unit Payload:', payload);
    console.log('📝 Current editUnit state:', editUnit);
    
    try {
      await dispatch(updateUnit({
        id: editingUnit.id,
        updates: payload
      }));
      toast.success('Unit updated successfully');
      setIsEditDialogOpen(false);
      setEditingUnit(null);
      dispatch(fetchAllUnits());
    } catch (error) {
      console.error('Error updating unit:', error);
      toast.error('Failed to update unit');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">UNIT</h1>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Sample Format
              </Button>

              <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Import Units
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Import Units</DialogTitle>
                    <button
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowImportDialog(false)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Select Excel or CSV file
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileSelect}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {importFile && (
                        <p className="mt-2 text-sm text-gray-600">
                          Selected: {importFile.name}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowImportDialog(false);
                          setImportFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleImportUnits}
                        disabled={!importFile || isImporting}
                      >
                        {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Import
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-[#C72030] hover:bg-[#B01E2E] text-white flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Unit
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader className="flex flex-row items-center justify-between pb-0">
                  <DialogTitle className="flex items-center gap-2">
                    <Square className="w-5 h-5" />
                    Add Unit
                  </DialogTitle>
                  <button
                    onClick={() => setIsAddDialogOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Select Building</Label>
                    <Select 
                      value={newUnit.building} 
                      onValueChange={(value) => {
                        const updatedNewUnit = { ...newUnit, building: value, wing: '', area: '', floor: '' };
                        setNewUnit(updatedNewUnit);
                        if (value) {
                          dispatch(fetchWings(parseInt(value)));
                          dispatch(fetchAreas({ buildingId: parseInt(value), wingId: undefined }));
                          dispatch(fetchFloors({ buildingId: parseInt(value), wingId: undefined, areaId: undefined }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Building" />
                      </SelectTrigger>
                      <SelectContent>
                        {buildings.data.map((building) => (
                          <SelectItem key={building.id} value={building.id.toString()}>
                            {building.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Select Wing</Label>
                    <Select 
                      value={newUnit.wing} 
                      onValueChange={(value) => {
                        const updatedNewUnit = { ...newUnit, wing: value, area: '', floor: '' };
                        setNewUnit(updatedNewUnit);
                        if (updatedNewUnit.building) {
                          dispatch(fetchAreas({ buildingId: parseInt(updatedNewUnit.building), wingId: value ? parseInt(value) : undefined }));
                          dispatch(fetchFloors({ 
                            buildingId: parseInt(updatedNewUnit.building), 
                            wingId: value ? parseInt(value) : undefined,
                            areaId: undefined
                          }));
                        }
                      }}
                      disabled={!newUnit.building}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Wing" />
                      </SelectTrigger>
                      <SelectContent>
                        {wings.data.map((wing) => (
                          <SelectItem key={wing.id} value={wing.id.toString()}>
                            {wing.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Select Area</Label>
                    <Select 
                      value={newUnit.area} 
                      onValueChange={(value) => {
                        const updatedNewUnit = { ...newUnit, area: value, floor: '' };
                        setNewUnit(updatedNewUnit);
                        if (updatedNewUnit.building) {
                          dispatch(fetchFloors({ 
                            buildingId: parseInt(updatedNewUnit.building), 
                            wingId: updatedNewUnit.wing ? parseInt(updatedNewUnit.wing) : undefined,
                            areaId: value ? parseInt(value) : undefined
                          }));
                        }
                      }}
                      disabled={!newUnit.building}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Area" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.data.map((area) => (
                          <SelectItem key={area.id} value={area.id.toString()}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Select Floor</Label>
                    <Select 
                      value={newUnit.floor} 
                      onValueChange={(value) => setNewUnit(prev => ({ ...prev, floor: value }))}
                      disabled={!newUnit.building}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Floor" />
                      </SelectTrigger>
                      <SelectContent>
                        {floors.data.map((floor) => (
                          <SelectItem key={floor.id} value={floor.id.toString()}>
                            {floor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unitName">Unit Name</Label>
                    <Input
                      id="unitName"
                      value={newUnit.unitName}
                      onChange={(e) => setNewUnit(prev => ({ ...prev, unitName: e.target.value }))}
                      placeholder="Enter Unit Name"
                    />
                  </div>
                  
                  {/* <div className="space-y-2">
                    <Label htmlFor="areaSize">Area (Sq.Mtr)</Label>
                    <Input
                      id="areaSize"
                      value={newUnit.areaSize}
                      onChange={(e) => setNewUnit(prev => ({ ...prev, areaSize: e.target.value }))}
                      placeholder="Enter Area"
                    />
                  </div> */}
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setNewUnit({ building: '', wing: '', area: '', floor: '', unitName: '', areaSize: '' });
                    }}
                    className="border-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddUnit} className="bg-[#C72030] hover:bg-[#B01E2E] text-white">
                    Submit
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            </div>
          </div>

          {/* Search Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Total: {totalItems} units
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Search:</span>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
                placeholder="Search units..."
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-3 text-left font-medium">Actions</TableHead>
                  <TableHead className="px-4 py-3 text-left font-medium">Active/Inactive</TableHead>
                  <TableHead className="px-4 py-3 text-left font-medium">Building</TableHead>
                  <TableHead className="px-4 py-3 text-left font-medium">Wing</TableHead>
                  <TableHead className="px-4 py-3 text-left font-medium">Area</TableHead>
                  <TableHead className="px-4 py-3 text-left font-medium">Floor</TableHead>
                  <TableHead className="px-4 py-3 text-left font-medium">Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Loading units...
                    </TableCell>
                  </TableRow>
                ) : units.error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-red-600">
                      Error: {units.error}
                    </TableCell>
                  </TableRow>
                ) : currentUnits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No units found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentUnits.map((unit) => (
                    <TableRow key={unit.id}>
                       <TableCell>
                         <Button variant="ghost" size="sm" onClick={() => handleEditUnit(unit)}>
                           <Edit className="w-4 h-4 text-[#C72030]" />
                         </Button>
                       </TableCell>
                      <TableCell>
                        <button onClick={() => toggleActiveStatus(unit.id)} className="cursor-pointer">
                          {unit.active ? (
                            <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center hover:bg-green-600 transition-colors">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center hover:bg-red-600 transition-colors">
                              <span className="text-white text-xs">✗</span>
                            </div>
                          )}
                        </button>
                      </TableCell>
                      <TableCell>{unit.building?.name || 'N/A'}</TableCell>
                      <TableCell>{unit.wing?.name || 'N/A'}</TableCell>
                      <TableCell>{unit.area_obj?.name || 'N/A'}</TableCell>
                      <TableCell>{unit.floor?.name || 'N/A'}</TableCell>
                      <TableCell>{unit.unit_name}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {units.data.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} units
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {/* Show first page */}
                  {currentPage > 3 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(1)}
                        className="w-8 h-8 p-0"
                      >
                        1
                      </Button>
                      {currentPage > 4 && <span className="px-2">...</span>}
                    </>
                  )}
                  
                  {/* Show pages around current page */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => page >= currentPage - 2 && page <= currentPage + 2)
                    .map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  
                  {/* Show last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(totalPages)}
                        className="w-8 h-8 p-0"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Edit Details Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader className="flex flex-row items-center justify-between pb-0">
              <DialogTitle>Edit Details</DialogTitle>
              <button
                onClick={() => setIsEditDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Select Building</Label>
                <Select 
                  value={editUnit.building} 
                  onValueChange={(value) => {
                    const updatedEditUnit = { ...editUnit, building: value, wing: '', area: '', floor: '' };
                    setEditUnit(updatedEditUnit);
                    if (value) {
                      dispatch(fetchWings(parseInt(value)));
                      dispatch(fetchAreas({ buildingId: parseInt(value), wingId: undefined }));
                      dispatch(fetchFloors({ buildingId: parseInt(value), wingId: undefined, areaId: undefined }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Building" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {buildings.data.map((building) => (
                      <SelectItem key={building.id} value={building.id.toString()}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Select Wing</Label>
                <Select 
                  value={editUnit.wing} 
                  onValueChange={(value) => {
                    const updatedEditUnit = { ...editUnit, wing: value, area: '', floor: '' };
                    setEditUnit(updatedEditUnit);
                    if (updatedEditUnit.building) {
                      dispatch(fetchAreas({ buildingId: parseInt(updatedEditUnit.building), wingId: value ? parseInt(value) : undefined }));
                      dispatch(fetchFloors({ 
                        buildingId: parseInt(updatedEditUnit.building), 
                        wingId: value ? parseInt(value) : undefined,
                        areaId: undefined
                      }));
                    }
                  }}
                  disabled={!editUnit.building}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Wing" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {wings.data.map((wing) => (
                      <SelectItem key={wing.id} value={wing.id.toString()}>
                        {wing.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Select Area</Label>
                <Select 
                  value={editUnit.area} 
                  onValueChange={(value) => {
                    const updatedEditUnit = { ...editUnit, area: value, floor: '' };
                    setEditUnit(updatedEditUnit);
                    if (updatedEditUnit.building) {
                      dispatch(fetchFloors({ 
                        buildingId: parseInt(updatedEditUnit.building), 
                        wingId: updatedEditUnit.wing ? parseInt(updatedEditUnit.wing) : undefined,
                        areaId: value ? parseInt(value) : undefined
                      }));
                    }
                  }}
                  disabled={!editUnit.building}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {areas.data.map((area) => (
                      <SelectItem key={area.id} value={area.id.toString()}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Select Floor</Label>
                <Select 
                  value={editUnit.floor} 
                  onValueChange={(value) => setEditUnit(prev => ({ ...prev, floor: value }))}
                  disabled={!editUnit.building}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {floors.data.map((floor) => (
                      <SelectItem key={floor.id} value={floor.id.toString()}>
                        {floor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editUnitName">Unit Name</Label>
                <Input
                  id="editUnitName"
                  value={editUnit.unitName}
                  onChange={(e) => setEditUnit(prev => ({ ...prev, unitName: e.target.value }))}
                  placeholder="Enter Unit Name"
                />
              </div>
              
              {/* <div className="space-y-2">
                <Label htmlFor="editAreaSize">Area (Sq.Mtr)</Label>
                <Input
                  id="editAreaSize"
                  value={editUnit.areaSize}
                  onChange={(e) => setEditUnit(prev => ({ ...prev, areaSize: e.target.value }))}
                  placeholder="Enter Area"
                />
              </div> */}
              
              <div className="space-y-2 col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="editActive" 
                    checked={editUnit.active}
                    onCheckedChange={(checked) => setEditUnit(prev => ({ ...prev, active: checked as boolean }))}
                  />
                  <label htmlFor="editActive" className="text-sm font-medium">
                    Active
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleUpdateUnit} 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                disabled={!editUnit.unitName.trim() || !editUnit.building}
              >
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
