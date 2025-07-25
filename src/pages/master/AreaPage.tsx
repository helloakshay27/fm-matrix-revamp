
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { 
  fetchBuildings, 
  fetchWings, 
  setSelectedBuilding, 
  setSelectedWing,
} from '@/store/slices/locationSlice';
import { toast } from 'sonner';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

interface Area {
  id: number;
  name: string;
  building_id: number;
  wing_id: number;
  active: boolean;
  building?: {
    id: number;
    name: string;
  };
  wing?: {
    id: number;
    name: string;
  };
}

export function AreaPage() {
  const dispatch = useAppDispatch();
  const { buildings, wings, selectedBuilding, selectedWing } = useAppSelector((state) => state.location);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('25');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [editAreaName, setEditAreaName] = useState('');
  const [editAreaStatus, setEditAreaStatus] = useState(true);
  const [editSelectedBuilding, setEditSelectedBuilding] = useState<number | null>(null);
  const [editSelectedWing, setEditSelectedWing] = useState<number | null>(null);
  
  // Areas state
  const [areas, setAreas] = useState<Area[]>([]);
  const [areasLoading, setAreasLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchBuildings());
    fetchAreas();
  }, [dispatch]);

  useEffect(() => {
    if (selectedBuilding) {
      dispatch(fetchWings(selectedBuilding));
    }
  }, [dispatch, selectedBuilding]);

  useEffect(() => {
    if (editSelectedBuilding) {
      dispatch(fetchWings(editSelectedBuilding));
    }
  }, [dispatch, editSelectedBuilding]);

  // Fetch all areas
  const fetchAreas = async () => {
    setAreasLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/areas.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch areas');
      }
      
      const data = await response.json();
      setAreas(data.areas || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
      toast.error('Failed to fetch areas');
      setAreas([]);
    } finally {
      setAreasLoading(false);
    }
  };

  // Refresh areas data
  const handleRefresh = () => {
    fetchAreas();
  };

  const filteredAreas = areas.filter(area =>
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
      setIsSubmitting(true);
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/pms/areas.json`, {
          method: 'POST',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pms_area: {
              name: newAreaName,
              building_id: selectedBuilding,
              wing_id: selectedWing,
              active: true
            }
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create area');
        }

        toast.success('Area created successfully');
        setNewAreaName('');
        setShowAddDialog(false);
        fetchAreas(); // Refresh areas list
      } catch (error) {
        console.error('Error creating area:', error);
        toast.error('Failed to create area');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const toggleStatus = async (areaId: number) => {
    const area = areas.find(a => a.id === areaId);
    if (!area) return;

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/areas/${areaId}.json`, {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pms_area: {
            name: area.name,
            building_id: area.building_id,
            wing_id: area.wing_id,
            active: !area.active
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update area status');
      }

      toast.success('Area status updated successfully');
      fetchAreas(); // Refresh areas list
    } catch (error) {
      console.error('Error updating area status:', error);
      toast.error('Failed to update area status');
    }
  };

  const handleEditArea = (area: Area) => {
    setEditingArea(area);
    setEditAreaName(area.name);
    setEditAreaStatus(area.active);
    setEditSelectedBuilding(area.building_id);
    setEditSelectedWing(area.wing_id);
    setShowEditDialog(true);
  };

  const handleSaveChanges = async () => {
    if (!editingArea || !editAreaName.trim()) {
      toast.error('Please enter a valid area name');
      return;
    }

    if (!editSelectedBuilding || !editSelectedWing) {
      toast.error('Please select building and wing');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/areas/${editingArea.id}.json`, {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pms_area: {
            name: editAreaName,
            building_id: editSelectedBuilding,
            wing_id: editSelectedWing,
            active: editAreaStatus
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update area');
      }

      toast.success('Area updated successfully');
      setShowEditDialog(false);
      resetEditForm();
      fetchAreas(); // Refresh areas list
    } catch (error) {
      console.error('Error updating area:', error);
      toast.error('Failed to update area');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetEditForm = () => {
    setEditingArea(null);
    setEditAreaName('');
    setEditAreaStatus(true);
    setEditSelectedBuilding(null);
    setEditSelectedWing(null);
  };

  const handleEditDialogClose = () => {
    setShowEditDialog(false);
    resetEditForm();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AREA</h1>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={areasLoading}
        >
          <RefreshCw className={`h-4 w-4 ${areasLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setShowAddDialog(true)} 
            className="gap-2"
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
            {areasLoading ? (
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
              displayedAreas.map((area) => (
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditArea(area)}
                    >
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
                <Select value={selectedBuilding?.toString() || ''} onValueChange={handleBuildingChange}>
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
                <Select value={selectedWing?.toString() || ''} onValueChange={handleWingChange} disabled={!selectedBuilding}>
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
                disabled={!selectedBuilding || !selectedWing || !newAreaName.trim() || isSubmitting}
                className="bg-[#6B2C91] hover:bg-[#5A2478] text-white px-6"
              >
                {isSubmitting ? 'Creating...' : 'Submit'}
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

      {/* Edit Area Dialog */}
      <Dialog open={showEditDialog} onOpenChange={handleEditDialogClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Area - {editingArea?.name}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={handleEditDialogClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Building</label>
                <Select 
                  value={editSelectedBuilding?.toString() || ''} 
                  onValueChange={(value) => setEditSelectedBuilding(parseInt(value))}
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
                <label className="text-sm font-medium">Wing</label>
                <Select 
                  value={editSelectedWing?.toString() || ''} 
                  onValueChange={(value) => setEditSelectedWing(parseInt(value))}
                  disabled={!editSelectedBuilding}
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
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Area Name</label>
                <Input
                  value={editAreaName}
                  onChange={(e) => setEditAreaName(e.target.value)}
                  placeholder="Enter area name"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="editAreaStatus"
                    checked={editAreaStatus}
                    onChange={(e) => setEditAreaStatus(e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="editAreaStatus" className="text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
                onClick={handleEditDialogClose}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveChanges} 
                disabled={!editAreaName.trim() || !editSelectedBuilding || !editSelectedWing || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
