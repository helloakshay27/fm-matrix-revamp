
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit } from 'lucide-react';
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
  createArea, 
  setSelectedBuilding, 
  setSelectedWing 
} from '@/store/slices/locationSlice';
import { toast } from 'sonner';

export function AreaPage() {
  const dispatch = useAppDispatch();
  const { buildings, wings, areas, selectedBuilding, selectedWing } = useAppSelector((state) => state.location);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('25');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');

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

  const filteredAreas = areas.data.filter(area =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.building?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.wing?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBuildingChange = (buildingId: string) => {
    dispatch(setSelectedBuilding(parseInt(buildingId)));
  };

  const handleWingChange = (wingId: string) => {
    dispatch(setSelectedWing(parseInt(wingId)));
  };

  const handleAddArea = async () => {
    if (selectedBuilding && selectedWing && newAreaName.trim()) {
      try {
        await dispatch(createArea({
          name: newAreaName,
          building_id: selectedBuilding,
          wing_id: selectedWing
        }));
        toast.success('Area created successfully');
        setNewAreaName('');
        setShowAddDialog(false);
        dispatch(fetchAreas({ buildingId: selectedBuilding, wingId: selectedWing }));
      } catch (error) {
        toast.error('Failed to create area');
      }
    }
  };

  const toggleStatus = (index: number) => {
    console.log(`Toggle status for area at index ${index}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Account &gt; Area</div>
        <h1 className="text-2xl font-bold">AREA</h1>
      </div>

      {/* Selection Controls */}
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
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
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setShowAddDialog(true)} 
            className="gap-2"
            disabled={!selectedBuilding || !selectedWing}
          >
            <Plus className="h-4 w-4" />
            Add Area
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
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!selectedBuilding || !selectedWing ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Please select building and wing to view areas
                </TableCell>
              </TableRow>
            ) : areas.loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading areas...
                </TableCell>
              </TableRow>
            ) : filteredAreas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No areas found
                </TableCell>
              </TableRow>
            ) : (
              filteredAreas.map((area, index) => (
                <TableRow key={area.id}>
                  <TableCell>{area.building?.name || 'N/A'}</TableCell>
                  <TableCell>{area.wing?.name || 'N/A'}</TableCell>
                  <TableCell>{area.name}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleStatus(index)}
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        area.active ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${
                          area.active ? 'translate-x-7' : 'translate-x-1'
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

      {/* Add Area Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ADD AREA</DialogTitle>
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
              <label className="text-sm font-medium">Area Name</label>
              <Input
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                placeholder="Enter area name"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddArea} disabled={!newAreaName.trim()}>
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
