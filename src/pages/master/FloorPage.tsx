
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { 
  fetchBuildings, 
  fetchWings, 
  fetchAreas, 
  fetchFloors,
  createFloor, 
  setSelectedBuilding, 
  setSelectedWing,
  setSelectedArea,
  updateFloor
} from '@/store/slices/locationSlice';
import { toast } from 'sonner';

export function FloorPage() {
  const dispatch = useAppDispatch();
  const { 
    buildings, 
    wings, 
    areas, 
    floors, 
    selectedBuilding, 
    selectedWing, 
    selectedArea 
  } = useAppSelector((state) => state.location);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('25');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newFloorName, setNewFloorName] = useState('');

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

  const filteredFloors = floors.data.filter(floor =>
    floor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Limit results based on entries per page selection
  const displayedFloors = filteredFloors.slice(0, parseInt(entriesPerPage));

  const handleBuildingChange = (buildingId: string) => {
    dispatch(setSelectedBuilding(parseInt(buildingId)));
  };

  const handleWingChange = (wingId: string) => {
    dispatch(setSelectedWing(parseInt(wingId)));
  };

  const handleAreaChange = (areaId: string) => {
    dispatch(setSelectedArea(parseInt(areaId)));
  };

  const handleAddFloor = async () => {
    if (selectedBuilding && selectedWing && selectedArea && newFloorName.trim()) {
      try {
        await dispatch(createFloor({
          name: newFloorName,
          building_id: selectedBuilding,
          wing_id: selectedWing,
          area_id: selectedArea
        }));
        toast.success('Floor created successfully');
        setNewFloorName('');
        setShowAddDialog(false);
        dispatch(fetchFloors({ 
          buildingId: selectedBuilding, 
          wingId: selectedWing, 
          areaId: selectedArea 
        }));
      } catch (error) {
        toast.error('Failed to create floor');
      }
    }
  };

  const toggleStatus = async (floorId: number) => {
    try {
      const floor = floors.data.find(f => f.id === floorId);
      if (!floor) return;

      await dispatch(updateFloor({
        id: floorId,
        updates: { active: !floor.active }
      }));
      
      toast.success('Floor status updated successfully');
    } catch (error) {
      toast.error('Failed to update floor status');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Account &gt; Floor</div>
        <h1 className="text-2xl font-bold">FLOOR</h1>
      </div>

      {/* Selection Controls */}
      <div className="grid grid-cols-3 gap-4 max-w-4xl">
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
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setShowAddDialog(true)} 
            className="gap-2"
            disabled={!selectedBuilding || !selectedWing || !selectedArea}
          >
            <Building className="h-4 w-4" />
            Add Floor
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Show</span>
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
            <span className="text-sm">entries</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Building</TableHead>
              <TableHead>Wing</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!selectedBuilding || !selectedWing || !selectedArea ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Please select building, wing, and area to view floors
                </TableCell>
              </TableRow>
            ) : floors.loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading floors...
                </TableCell>
              </TableRow>
            ) : displayedFloors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No floors found
                </TableCell>
              </TableRow>
            ) : (
              displayedFloors.map((floor, index) => (
                <TableRow key={floor.id}>
                  <TableCell>{floor.building?.name || 'N/A'}</TableCell>
                  <TableCell>{floor.wing?.name || 'N/A'}</TableCell>
                  <TableCell>{floor.area?.name || 'N/A'}</TableCell>
                  <TableCell>{floor.name}</TableCell>
                  <TableCell>
                     <button
                       onClick={() => toggleStatus(floor.id)}
                       className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                         floor.active ? 'bg-green-500' : 'bg-gray-300'
                       }`}
                     >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${
                          floor.active ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Floor Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ADD FLOOR</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Selected Building</label>
              <Input
                value={buildings.data.find(b => b.id === selectedBuilding)?.name || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Selected Wing</label>
              <Input
                value={wings.data.find(w => w.id === selectedWing)?.name || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Selected Area</label>
              <Input
                value={areas.data.find(a => a.id === selectedArea)?.name || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Enter Floor Name</label>
              <Input
                value={newFloorName}
                onChange={(e) => setNewFloorName(e.target.value)}
                placeholder="Enter floor name"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddFloor} disabled={!newFloorName.trim()}>
                Submit
              </Button>
              <Button variant="outline">Sample Format</Button>
              <Button variant="outline">Import</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
