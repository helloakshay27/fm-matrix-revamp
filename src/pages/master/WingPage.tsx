
import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchBuildings, fetchWings, createWing, setSelectedBuilding } from '@/store/slices/locationSlice';
import { toast } from 'sonner';

export function WingPage() {
  const dispatch = useAppDispatch();
  const { buildings, wings, selectedBuilding } = useAppSelector((state) => state.location);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('25');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newWingName, setNewWingName] = useState('');

  useEffect(() => {
    dispatch(fetchBuildings());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBuilding) {
      dispatch(fetchWings(selectedBuilding));
    }
  }, [dispatch, selectedBuilding]);

  const filteredWings = wings.data.filter(wing =>
    wing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBuildingChange = (buildingId: string) => {
    dispatch(setSelectedBuilding(parseInt(buildingId)));
  };

  const handleAddWing = async () => {
    if (selectedBuilding && newWingName.trim()) {
      try {
        await dispatch(createWing({
          name: newWingName,
          building_id: selectedBuilding
        }));
        toast.success('Wing created successfully');
        setNewWingName('');
        setShowAddDialog(false);
        dispatch(fetchWings(selectedBuilding));
      } catch (error) {
        toast.error('Failed to create wing');
      }
    }
  };

  const toggleStatus = (index: number) => {
    // This would require an update API call - placeholder for now
    console.log(`Toggle status for wing at index ${index}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Account &gt; Wing</div>
        <h1 className="text-2xl font-bold">WING</h1>
      </div>

      {/* Building Selection */}
      <div className="space-y-4">
        <div className="w-64">
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
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setShowAddDialog(true)} 
            className="gap-2"
            disabled={!selectedBuilding}
          >
            <Plus className="h-4 w-4" />
            Add Wing
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
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!selectedBuilding ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Please select a building to view wings
                </TableCell>
              </TableRow>
            ) : wings.loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Loading wings...
                </TableCell>
              </TableRow>
            ) : filteredWings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No wings found
                </TableCell>
              </TableRow>
            ) : (
              filteredWings.map((wing, index) => (
                <TableRow key={wing.id}>
                  <TableCell>{wing.building?.name || 'N/A'}</TableCell>
                  <TableCell>{wing.name}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleStatus(index)}
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        wing.active ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${
                          wing.active ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Wing Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ADD WING</DialogTitle>
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
              <label className="text-sm font-medium">Wing Name</label>
              <Input
                value={newWingName}
                onChange={(e) => setNewWingName(e.target.value)}
                placeholder="Enter wing name"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddWing} disabled={!newWingName.trim()}>
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
