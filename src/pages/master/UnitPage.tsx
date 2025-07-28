
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Square, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Debug: Log units data when it changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Units state:', units);
      if (units.data.length > 0) {
        console.log('First unit sample:', units.data[0]);
      }
    }
  }, [units]);

  // Reset pagination when units data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [units.data.length]);

  // Fetch dependencies for add/edit forms
  useEffect(() => {
    if (newUnit.building) {
      dispatch(fetchWings(parseInt(newUnit.building)));
    }
  }, [dispatch, newUnit.building]);

  useEffect(() => {
    if (newUnit.building && newUnit.wing) {
      dispatch(fetchAreas({ buildingId: parseInt(newUnit.building), wingId: parseInt(newUnit.wing) }));
    }
  }, [dispatch, newUnit.building, newUnit.wing]);

  useEffect(() => {
    if (newUnit.building && newUnit.wing && newUnit.area) {
      dispatch(fetchFloors({ 
        buildingId: parseInt(newUnit.building), 
        wingId: parseInt(newUnit.wing), 
        areaId: parseInt(newUnit.area)
      }));
    }
  }, [dispatch, newUnit.building, newUnit.wing, newUnit.area]);

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

  const handleAddUnit = async () => {
    if (newUnit.building && newUnit.wing && newUnit.area && newUnit.floor && newUnit.unitName.trim()) {
      try {
        await dispatch(createUnit({
          unit_name: newUnit.unitName,
          building_id: parseInt(newUnit.building),
          wing_id: parseInt(newUnit.wing),
          area_id: parseInt(newUnit.area),
          floor_id: parseInt(newUnit.floor),
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
    } else {
      toast.error('Please fill in all required fields');
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
    setIsEditDialogOpen(true);
  };

  const handleUpdateUnit = async () => {
    if (editingUnit && editUnit.unitName.trim() && editUnit.building && editUnit.wing && editUnit.area && editUnit.floor) {
      try {
        await dispatch(updateUnit({
          id: editingUnit.id,
          updates: {
            unit_name: editUnit.unitName,
            building_id: parseInt(editUnit.building),
            wing_id: parseInt(editUnit.wing),
            area_id: parseInt(editUnit.area),
            floor_id: parseInt(editUnit.floor),
            area: parseInt(editUnit.areaSize) || 0,
            active: editUnit.active
          }
        }));
        toast.success('Unit updated successfully');
        setIsEditDialogOpen(false);
        setEditingUnit(null);
        dispatch(fetchAllUnits());
      } catch (error) {
        console.error('Error updating unit:', error);
        toast.error('Failed to update unit');
      }
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">UNIT</h1>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[#C72030] hover:bg-[#B01E2E] text-white flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
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
                      onValueChange={(value) => setNewUnit(prev => ({ ...prev, building: value, wing: '', area: '', floor: '' }))}
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
                      onValueChange={(value) => setNewUnit(prev => ({ ...prev, wing: value, area: '', floor: '' }))}
                      disabled={!newUnit.building}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Wing" />
                      </SelectTrigger>
                      <SelectContent>
                        {wings.data.filter(wing => wing.building_id?.toString() === newUnit.building).map((wing) => (
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
                      onValueChange={(value) => setNewUnit(prev => ({ ...prev, area: value, floor: '' }))}
                      disabled={!newUnit.wing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Area" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.data.filter(area => area.wing_id?.toString() === newUnit.wing).map((area) => (
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
                      disabled={!newUnit.area}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Floor" />
                      </SelectTrigger>
                      <SelectContent>
                        {floors.data.filter(floor => floor.area_id?.toString() === newUnit.area).map((floor) => (
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="areaSize">Area (Sq.Mtr)</Label>
                    <Input
                      id="areaSize"
                      value={newUnit.areaSize}
                      onChange={(e) => setNewUnit(prev => ({ ...prev, areaSize: e.target.value }))}
                      placeholder="Enter Area"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddUnit} className="bg-[#C72030] hover:bg-[#B01E2E] text-white">
                    Submit
                  </Button>
                  <Button variant="outline" className="border-gray-300">
                    Sample Format
                  </Button>
                  <Button variant="outline" className="border-gray-300 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Import
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
                        <Checkbox
                          checked={unit.active}
                          onCheckedChange={() => toggleActiveStatus(unit.id)}
                        />
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
                  onValueChange={(value) => setEditUnit(prev => ({ ...prev, building: value, wing: '', area: '', floor: '' }))}
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
                  onValueChange={(value) => setEditUnit(prev => ({ ...prev, wing: value, area: '', floor: '' }))}
                  disabled={!editUnit.building}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Wing" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {wings.data.filter(wing => wing.building_id?.toString() === editUnit.building).map((wing) => (
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
                  onValueChange={(value) => setEditUnit(prev => ({ ...prev, area: value, floor: '' }))}
                  disabled={!editUnit.wing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {areas.data.filter(area => area.wing_id?.toString() === editUnit.wing).map((area) => (
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
                  disabled={!editUnit.area}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {floors.data.filter(floor => floor.area_id?.toString() === editUnit.area).map((floor) => (
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
              
              <div className="space-y-2">
                <Label htmlFor="editAreaSize">Area (Sq.Mtr)</Label>
                <Input
                  id="editAreaSize"
                  value={editUnit.areaSize}
                  onChange={(e) => setEditUnit(prev => ({ ...prev, areaSize: e.target.value }))}
                  placeholder="Enter Area"
                />
              </div>
              
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
                disabled={!editUnit.unitName.trim() || !editUnit.building || !editUnit.wing || !editUnit.area || !editUnit.floor}
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
