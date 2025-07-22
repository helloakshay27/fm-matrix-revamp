
import React, { useState, useEffect } from 'react';
import { Search, Plus, Copy, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchBuildings, createBuilding, updateBuilding } from '@/store/slices/locationSlice';
import { toast } from 'sonner';

export function BuildingPage() {
  const dispatch = useAppDispatch();
  const { buildings } = useAppSelector((state) => state.location);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('25');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newBuilding, setNewBuilding] = useState('');

  useEffect(() => {
    dispatch(fetchBuildings());
  }, [dispatch]);

  const filteredBuildings = buildings.data.filter(building =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Limit results based on entries per page selection
  const displayedBuildings = filteredBuildings.slice(0, parseInt(entriesPerPage));

  const handleAddBuilding = async () => {
    if (newBuilding.trim()) {
      try {
        await dispatch(createBuilding({
          name: newBuilding,
          has_wing: false,
          has_floor: false,
          has_area: false,
          has_room: false,
          active: true
        }));
        toast.success('Building created successfully');
        setNewBuilding('');
        setShowAddDialog(false);
        dispatch(fetchBuildings());
      } catch (error) {
        toast.error('Failed to create building');
      }
    }
  };

  const toggleStatus = async (buildingId: number, field: 'active' | 'has_wing' | 'has_floor' | 'has_area' | 'has_room') => {
    try {
      const building = buildings.data.find(b => b.id === buildingId);
      if (!building) return;

      const updates = {
        [field]: !building[field]
      };

      await dispatch(updateBuilding({ id: buildingId, updates }));
      toast.success(`Building ${field.replace('_', ' ')} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update building ${field.replace('_', ' ')}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Account &gt; Building</div>
        <h1 className="text-2xl font-bold">BUILDING</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Building
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
              <TableHead>Building Name</TableHead>
              <TableHead>Site ID</TableHead>
              <TableHead>Wing</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buildings.loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Loading buildings...
                </TableCell>
              </TableRow>
            ) : displayedBuildings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No buildings found
                </TableCell>
              </TableRow>
            ) : (
              displayedBuildings.map((building, index) => (
                <TableRow key={building.id}>
                  <TableCell>{building.name}</TableCell>
                  <TableCell>{building.site_id}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {building.has_wing ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-red-600">✗</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {building.has_floor ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-red-600">✗</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {building.has_area ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-red-600">✗</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {building.has_room ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-red-600">✗</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleStatus(building.id, 'active')}
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        building.active ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${
                          building.active ? 'translate-x-7' : 'translate-x-1'
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

      {/* Add Building Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ADD BUILDING</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Building Name</label>
              <Input
                value={newBuilding}
                onChange={(e) => setNewBuilding(e.target.value)}
                placeholder="Enter building name"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddBuilding} disabled={!newBuilding.trim()}>
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
