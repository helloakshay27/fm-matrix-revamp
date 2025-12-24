import React, { useState, useEffect } from 'react';
import { Edit, Building, X, ChevronLeft, ChevronRight, Check, Download, Upload, Loader2, Plus, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { 
  fetchBuildings, 
  fetchWings, 
  fetchAreas, 
  fetchFloors,
  fetchAllFloors,
  createFloor, 
  updateFloor
} from '@/store/slices/locationSlice';
import { toast } from 'sonner';

export function FloorPage() {
  const dispatch = useAppDispatch();
  const { 
    buildings, 
    wings, 
    areas, 
    floors
  } = useAppSelector((state) => state.location);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingFloor, setEditingFloor] = useState<any>(null);
  const [newFloorName, setNewFloorName] = useState('');
  const [newFloorBuilding, setNewFloorBuilding] = useState<number | null>(null);
  const [newFloorWing, setNewFloorWing] = useState<number | null>(null);
  const [newFloorArea, setNewFloorArea] = useState<number | null>(null);
  const [editFloorName, setEditFloorName] = useState('');
  const [editFloorActive, setEditFloorActive] = useState(true);
  const [editFloorBuilding, setEditFloorBuilding] = useState<number | null>(null);
  const [editSelectedWing, setEditSelectedWing] = useState<number | null>(null);
  const [editSelectedArea, setEditSelectedArea] = useState<number | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<string>('');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    dispatch(fetchBuildings());
    dispatch(fetchAllFloors());
  }, [dispatch]);

  // Reset pagination when floors data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [floors.data.length]);

  useEffect(() => {
    if (newFloorBuilding) {
      dispatch(fetchWings(newFloorBuilding));
      dispatch(fetchAreas({ buildingId: newFloorBuilding, wingId: newFloorWing || undefined }));
    }
  }, [dispatch, newFloorBuilding, newFloorWing]);

  useEffect(() => {
    if (editFloorBuilding) {
      console.log('🔄 Edit useEffect triggered:', {
        editFloorBuilding,
        editSelectedWing,
        wingIdToPass: editSelectedWing || undefined
      });
      dispatch(fetchWings(editFloorBuilding));
      dispatch(fetchAreas({ buildingId: editFloorBuilding, wingId: editSelectedWing || undefined }));
    }
  }, [dispatch, editFloorBuilding, editSelectedWing]);

  // Filter floors based on search
  const filteredFloors = floors.data.filter(floor => {
    const searchLower = searchTerm.toLowerCase();
    return (
      floor.name?.toLowerCase().includes(searchLower) ||
      floor.building?.name?.toLowerCase().includes(searchLower) ||
      floor.wing?.name?.toLowerCase().includes(searchLower) ||
      (floor.area?.name && floor.area.name.toLowerCase().includes(searchLower))
    );
  });

  // Pagination calculations
  const totalItems = filteredFloors.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFloors = filteredFloors.slice(startIndex, endIndex);

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

  const handleAddFloor = async () => {
    if (newFloorBuilding && newFloorName.trim()) {
      try {
        await dispatch(createFloor({
          name: newFloorName,
          building_id: newFloorBuilding,
          wing_id: newFloorWing,
          area_id: newFloorArea
        }));
        toast.success('Floor created successfully');
        setNewFloorName('');
        setNewFloorBuilding(null);
        setNewFloorWing(null);
        setNewFloorArea(null);
        setShowAddDialog(false);
        dispatch(fetchAllFloors());
      } catch (error) {
        toast.error('Failed to create floor');
      }
    }
  };

  const handleEditFloor = (floor: any) => {
    setEditingFloor(floor);
    setEditFloorName(floor.name);
    setEditFloorActive(floor.active);
    setEditFloorBuilding(floor.building_id);
    setEditSelectedWing(floor.wing_id);
    setEditSelectedArea(floor.area_id);
    setShowEditDialog(true);
    
    // Fetch wings and areas immediately when editing starts
    if (floor.building_id) {
      dispatch(fetchWings(floor.building_id));
      dispatch(fetchAreas({ buildingId: floor.building_id, wingId: floor.wing_id || undefined }));
    }
  };

  const handleUpdateFloor = async () => {
    if (editingFloor && editFloorName.trim()) {
      try {
        await dispatch(updateFloor({
          id: editingFloor.id,
          updates: {
            name: editFloorName,
            wing_id: editSelectedWing,
            area_id: editSelectedArea,
            active: editFloorActive
          }
        }));
        toast.success('Floor updated successfully');
        setShowEditDialog(false);
        setEditingFloor(null);
        dispatch(fetchAllFloors());
      } catch (error) {
        toast.error('Failed to update floor');
      }
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      let baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
      baseUrl = baseUrl.replace(/^https?:\/\//, '');
      const templateUrl = `https://${baseUrl}/assets/floor.xlsx`;
      
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
      a.download = 'floor.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Template downloaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to download template');
    }
  };

  const handleImportFloors = async () => {
    if (!importFile) return;

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('pms_floor[file]', importFile);
      
      const token = localStorage.getItem('token') || '';
      let baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
      baseUrl = baseUrl.replace(/^https?:\/\//, '');
      const apiUrl = `https://${baseUrl}/pms/account_setups/floor_import.json?token=${token}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to import floors');
      }

      toast.success('Floors imported successfully');
      setShowImportDialog(false);
      setImportFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      dispatch(fetchAllFloors());
    } catch (error: any) {
      toast.error(error.message || 'Failed to import floors');
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

  const toggleFloorStatus = async (floorId: number) => {
    try {
      const floor = floors.data.find(f => f.id === floorId);
      if (!floor) return;

      await dispatch(updateFloor({
        id: floorId,
        updates: {
          name: floor.name,
          wing_id: floor.wing_id,
          area_id: floor.area_id,
          active: !floor.active
        }
      }));
      
      toast.success('Floor status updated successfully');
      dispatch(fetchAllFloors());
    } catch (error) {
      toast.error('Failed to update floor status');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">FLOORS</h1>
            
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
                    Import Floors
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Import Floors</DialogTitle>
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
                        onClick={handleImportFloors}
                        disabled={!importFile || isImporting}
                      >
                        {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Import
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                onClick={() => setShowAddDialog(true)} 
                className="bg-[#C72030] hover:bg-[#B01E2E] text-white flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Floor
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-end mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Search:</span>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
                placeholder="Search floors..."
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Actions</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Wing</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>QR Code</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {floors.loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Loading floors...
                    </TableCell>
                  </TableRow>
                ) : filteredFloors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      {floors.data.length === 0 ? 'No floors available' : 'No floors match your search'}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentFloors.map((floor, index) => (
                    <TableRow key={floor.id}>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleEditFloor(floor)}>
                          <Edit className="w-4 h-4 text-[#C72030]" />
                        </Button>
                      </TableCell>
                      <TableCell>{floor.building?.name || 'N/A'}</TableCell>
                      <TableCell>{floor.wing?.name || 'N/A'}</TableCell>
                      <TableCell>{floor.area?.name || 'N/A'}</TableCell>
                      <TableCell>{floor.name}</TableCell>
                      <TableCell>
                        {floor.qr_code_url ? (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedQrCode(floor.qr_code_url);
                              setIsQrModalOpen(true);
                            }}
                            className="text-[#C72030] hover:text-[#C72030]/80"
                          >
                            <QrCode className="w-4 h-4" />
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <button onClick={() => toggleFloorStatus(floor.id)} className="cursor-pointer">
                          {floor.active ? (
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {floors.data.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} floors
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

      {/* Add Floor Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader className="flex flex-row items-center justify-between pb-0">
            <DialogTitle>ADD FLOOR</DialogTitle>
            <button
              onClick={() => setShowAddDialog(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Building</label>
              <Select 
                value={newFloorBuilding?.toString() || ''} 
                onValueChange={(value) => setNewFloorBuilding(parseInt(value))}
              >
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
                value={newFloorWing?.toString() || ''} 
                onValueChange={(value) => setNewFloorWing(parseInt(value))}
                disabled={!newFloorBuilding}
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
                value={newFloorArea?.toString() || ''} 
                onValueChange={(value) => setNewFloorArea(parseInt(value))}
                disabled={!newFloorBuilding}
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
              <label className="text-sm font-medium">Enter Floor Name</label>
              <Input
                value={newFloorName}
                onChange={(e) => setNewFloorName(e.target.value)}
                placeholder="Enter floor name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  setNewFloorName('');
                  setNewFloorBuilding(null);
                  setNewFloorWing(null);
                  setNewFloorArea(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddFloor} 
                disabled={!newFloorName.trim() || !newFloorBuilding}
                className="bg-[#C72030] hover:bg-[#B01E2E] text-white"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Floor Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader className="flex flex-row items-center justify-between pb-0">
            <DialogTitle>Edit Floor</DialogTitle>
            <button
              onClick={() => setShowEditDialog(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Building</label>
              <Select 
                value={editFloorBuilding?.toString() || ''} 
                onValueChange={(value) => {
                  const buildingId = parseInt(value);
                  console.log('🏢 Building changed in edit:', {
                    newBuildingId: buildingId,
                    previousBuilding: editFloorBuilding,
                    previousWing: editSelectedWing,
                    previousArea: editSelectedArea
                  });
                  setEditFloorBuilding(buildingId);
                  setEditSelectedWing(null);
                  setEditSelectedArea(null);
                  console.log('📡 Fetching wings and areas for building:', buildingId);
                  // Fetch wings and areas for new building immediately
                  dispatch(fetchWings(buildingId));
                  dispatch(fetchAreas({ buildingId, wingId: undefined }));
                }}
              >
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
              <label className="text-sm font-medium">Wing</label>
              <Select 
                value={editSelectedWing?.toString() || ''} 
                onValueChange={(value) => {
                  const wingId = parseInt(value);
                  setEditSelectedWing(wingId);
                  setEditSelectedArea(null);
                  // Fetch areas for selected building and wing
                  if (editFloorBuilding) {
                    dispatch(fetchAreas({ buildingId: editFloorBuilding, wingId }));
                  }
                }}
                disabled={!editFloorBuilding}
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
            <div>
              <label className="text-sm font-medium">Area</label>
              <Select 
                value={editSelectedArea?.toString() || ''} 
                onValueChange={(value) => setEditSelectedArea(parseInt(value))}
                disabled={!editFloorBuilding}
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
            <div>
              <label className="text-sm font-medium">Floor Name</label>
              <Input
                value={editFloorName}
                onChange={(e) => setEditFloorName(e.target.value)}
                placeholder="Enter floor name"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="active" 
                checked={editFloorActive}
                onCheckedChange={(checked) => setEditFloorActive(checked as boolean)}
              />
              <label htmlFor="active" className="text-sm font-medium">
                Active
              </label>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleUpdateFloor} 
                disabled={!editFloorName.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Update Floor
              </Button>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Floor QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            {selectedQrCode ? (
              <>
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                  <img 
                    src={selectedQrCode} 
                    alt="Floor QR Code" 
                    className="w-64 h-64 object-contain"
                  />
                </div>
                <Button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedQrCode;
                    link.download = `floor-qr-code-${Date.now()}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    toast.success('QR Code downloaded successfully');
                  }}
                  className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </>
            ) : (
              <p className="text-gray-500">No QR code available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
        </div>
      </div>
    </div>
  );
}
