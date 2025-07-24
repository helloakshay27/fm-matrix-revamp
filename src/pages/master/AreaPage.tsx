
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, X } from 'lucide-react';
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
  setSelectedWing,
  updateArea
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

  // Limit results based on entries per page selection
  const displayedAreas = filteredAreas.slice(0, parseInt(entriesPerPage));

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

  const toggleStatus = async (areaId: number) => {
    try {
      const area = areas.data.find(a => a.id === areaId);
      if (!area) return;

      await dispatch(updateArea({
        id: areaId,
        updates: { active: !area.active }
      }));
      
      toast.success('Area status updated successfully');
    } catch (error) {
      toast.error('Failed to update area status');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        
        <h1 className="text-2xl font-bold">AREA</h1>
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
            ) : displayedAreas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No areas found
                </TableCell>
              </TableRow>
            ) : (
              displayedAreas.map((area, index) => (
                <TableRow key={area.id}>
                  <TableCell>{area.building?.name || 'N/A'}</TableCell>
                  <TableCell>{area.wing?.name || 'N/A'}</TableCell>
                  <TableCell>{area.name}</TableCell>
                  <TableCell>
                     <button
                       onClick={() => toggleStatus(area.id)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ADD AREA</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setShowAddDialog(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Building</label>
                <Select value={selectedBuilding?.toString() || ''} onValueChange={(value) => dispatch(setSelectedBuilding(parseInt(value)))}>
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
                <label className="text-sm font-medium">Select Wing</label>
                <Select value={selectedWing?.toString() || ''} onValueChange={(value) => dispatch(setSelectedWing(parseInt(value)))} disabled={!selectedBuilding}>
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
                <label className="text-sm font-medium">Area Name</label>
                <Input
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                  placeholder="Enter Area Name"
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                onClick={handleAddArea} 
                disabled={!selectedBuilding || !selectedWing || !newAreaName.trim()}
                className="bg-[#6B2C91] hover:bg-[#5A2478] text-white px-6"
              >
                Submit
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
                onClick={() => toast.info('Sample format functionality')}
              >
                Sample Format
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
                onClick={() => toast.info('Import functionality')}
              >
                Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
