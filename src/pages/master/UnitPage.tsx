
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Square, Plus, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { 
  fetchBuildings, 
  fetchWings, 
  fetchAreas, 
  fetchFloors,
  fetchUnits,
  createUnit, 
  setSelectedBuilding, 
  setSelectedWing,
  setSelectedArea,
  setSelectedFloor,
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
    units, 
    selectedBuilding, 
    selectedWing, 
    selectedArea,
    selectedFloor 
  } = useAppSelector((state) => state.location);

  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('25');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUnit, setNewUnit] = useState({
    unitName: '',
    area: ''
  });

  useEffect(() => {
    dispatch(fetchBuildings());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBuilding) {
      dispatch(fetchWings(selectedBuilding));
    }
  }, [dispatch, selectedBuilding]);

  useEffect(() => {
    if (selectedBuilding && selectedWing) {
      dispatch(fetchAreas({ buildingId: selectedBuilding, wingId: selectedWing }));
    }
  }, [dispatch, selectedBuilding, selectedWing]);

  useEffect(() => {
    if (selectedBuilding && selectedWing && selectedArea) {
      dispatch(fetchFloors({ 
        buildingId: selectedBuilding, 
        wingId: selectedWing, 
        areaId: selectedArea 
      }));
    }
  }, [dispatch, selectedBuilding, selectedWing, selectedArea]);

  useEffect(() => {
    if (selectedBuilding && selectedWing && selectedArea && selectedFloor) {
      dispatch(fetchUnits({ 
        buildingId: selectedBuilding, 
        wingId: selectedWing, 
        areaId: selectedArea,
        floorId: selectedFloor
      }));
    }
  }, [dispatch, selectedBuilding, selectedWing, selectedArea, selectedFloor]);

  const filteredUnits = units.data.filter(unit =>
    unit.unit_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Limit results based on entries per page selection
  const displayedUnits = filteredUnits.slice(0, parseInt(entriesPerPage));

  const handleBuildingChange = (buildingId: string) => {
    dispatch(setSelectedBuilding(parseInt(buildingId)));
  };

  const handleWingChange = (wingId: string) => {
    dispatch(setSelectedWing(parseInt(wingId)));
  };

  const handleAreaChange = (areaId: string) => {
    dispatch(setSelectedArea(parseInt(areaId)));
  };

  const handleFloorChange = (floorId: string) => {
    dispatch(setSelectedFloor(parseInt(floorId)));
  };

  const handleAddUnit = async () => {
    if (selectedBuilding && selectedWing && selectedArea && selectedFloor && newUnit.unitName.trim()) {
      try {
        await dispatch(createUnit({
          unit_name: newUnit.unitName,
          building_id: selectedBuilding,
          wing_id: selectedWing,
          area_id: selectedArea,
          floor_id: selectedFloor,
          area: parseInt(newUnit.area) || 0
        }));
        toast.success('Unit created successfully');
        setNewUnit({ unitName: '', area: '' });
        setIsAddDialogOpen(false);
        dispatch(fetchUnits({ 
          buildingId: selectedBuilding, 
          wingId: selectedWing, 
          areaId: selectedArea,
          floorId: selectedFloor
        }));
      } catch (error) {
        toast.error('Failed to create unit');
      }
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
      
      toast.success('Unit status updated successfully');
    } catch (error) {
      toast.error('Failed to update unit status');
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
                  disabled={!selectedBuilding || !selectedWing || !selectedArea || !selectedFloor}
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
                    <Label>Selected Building</Label>
                    <Input
                      value={buildings.data.find(b => b.id === selectedBuilding)?.name || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Selected Wing</Label>
                    <Input
                      value={wings.data.find(w => w.id === selectedWing)?.name || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Selected Area</Label>
                    <Input
                      value={areas.data.find(a => a.id === selectedArea)?.name || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Selected Floor</Label>
                    <Input
                      value={floors.data.find(f => f.id === selectedFloor)?.name || ''}
                      disabled
                      className="bg-muted"
                    />
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
                      value={newUnit.area}
                      onChange={(e) => setNewUnit(prev => ({ ...prev, area: e.target.value }))}
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

          {/* Selection Controls */}
          <div className="grid grid-cols-4 gap-4 mb-6 max-w-5xl">
            <div>
              <label className="text-sm font-medium">Select Building</label>
              <Select value={selectedBuilding?.toString() || ''} onValueChange={handleBuildingChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select building" />
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
            <div>
              <label className="text-sm font-medium">Select Wing</label>
              <Select 
                value={selectedWing?.toString() || ''} 
                onValueChange={handleWingChange}
                disabled={!selectedBuilding}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select wing" />
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
            <div>
              <label className="text-sm font-medium">Select Area</label>
              <Select 
                value={selectedArea?.toString() || ''} 
                onValueChange={handleAreaChange}
                disabled={!selectedWing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
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
            <div>
              <label className="text-sm font-medium">Select Floor</label>
              <Select 
                value={selectedFloor?.toString() || ''} 
                onValueChange={handleFloorChange}
                disabled={!selectedArea}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select floor" />
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
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show</span>
                <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">entries</span>
              </div>
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
                  <TableHead>Actions</TableHead>
                  <TableHead>Active/Inactive</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Wing</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!selectedBuilding || !selectedWing || !selectedArea || !selectedFloor ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Please select building, wing, area, and floor to view units
                    </TableCell>
                  </TableRow>
                ) : units.loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Loading units...
                    </TableCell>
                  </TableRow>
                ) : displayedUnits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No units found
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedUnits.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell>
                        <Button variant="ghost" size="sm">
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

          {/* Pagination info */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-600">
              Showing 1 to {Math.min(parseInt(entriesPerPage), displayedUnits.length)} of {filteredUnits.length} entries
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
