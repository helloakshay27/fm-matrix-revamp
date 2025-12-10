import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Square, Check, Plus, FileDown, X, ChevronLeft, ChevronRight, Upload, Download, Loader2, QrCode } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { 
  fetchBuildings, 
  fetchWings, 
  fetchAreas, 
  fetchFloors,
  fetchUnits,
  fetchAllRooms,
  createRoom, 
  updateRoom
} from '@/store/slices/locationSlice';
import { toast } from 'sonner';

export const RoomPage = () => {
  const dispatch = useAppDispatch();
  const { 
    buildings, 
    wings, 
    areas, 
    floors,
    units,
    rooms
  } = useAppSelector((state) => state.location);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<string>('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [newRoom, setNewRoom] = useState({
    building: '',
    wing: '',
    area: '',
    floor: '',
    unit: '',
    roomName: '',
    createQrCode: false
  });
  
  const [editRoom, setEditRoom] = useState({
    building: '',
    wing: '',
    area: '',
    floor: '',
    unit: '',
    roomName: '',
    active: true
  });

  useEffect(() => {
    dispatch(fetchBuildings());
    dispatch(fetchAllRooms());
    
    // Debug localStorage values
    console.log('=== DEBUG localStorage VALUES ===');
    console.log('baseUrl:', localStorage.getItem('baseUrl'));
    console.log('token:', localStorage.getItem('token') ? 'Present' : 'Missing');
    console.log('================================');
  }, [dispatch]);

  // Debug: Log rooms data when it changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Rooms state:', rooms);
      if (rooms.data.length > 0) {
        console.log('First room sample:', rooms.data[0]);
      }
    }
  }, [rooms]);

  // Reset pagination when rooms data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [rooms.data.length]);

  // Fetch dependencies for add form when building changes
  useEffect(() => {
    if (newRoom.building) {
      const buildingId = parseInt(newRoom.building);
      dispatch(fetchWings(buildingId));
      dispatch(fetchAreas({ buildingId, wingId: newRoom.wing ? parseInt(newRoom.wing) : undefined }));
      dispatch(fetchFloors({ buildingId, wingId: newRoom.wing ? parseInt(newRoom.wing) : undefined, areaId: newRoom.area ? parseInt(newRoom.area) : undefined }));
      dispatch(fetchUnits({ buildingId, wingId: newRoom.wing ? parseInt(newRoom.wing) : undefined, areaId: newRoom.area ? parseInt(newRoom.area) : undefined, floorId: newRoom.floor ? parseInt(newRoom.floor) : undefined }));
    }
  }, [dispatch, newRoom.building, newRoom.wing, newRoom.area, newRoom.floor]);

  // Fetch dependencies for edit form when building changes
  useEffect(() => {
    if (editRoom.building) {
      const buildingId = parseInt(editRoom.building);
      dispatch(fetchWings(buildingId));
      dispatch(fetchAreas({ buildingId, wingId: editRoom.wing ? parseInt(editRoom.wing) : undefined }));
      dispatch(fetchFloors({ buildingId, wingId: editRoom.wing ? parseInt(editRoom.wing) : undefined, areaId: editRoom.area ? parseInt(editRoom.area) : undefined }));
      dispatch(fetchUnits({ buildingId, wingId: editRoom.wing ? parseInt(editRoom.wing) : undefined, areaId: editRoom.area ? parseInt(editRoom.area) : undefined, floorId: editRoom.floor ? parseInt(editRoom.floor) : undefined }));
    }
  }, [dispatch, editRoom.building, editRoom.wing, editRoom.area, editRoom.floor]);

  useEffect(() => {
    if (newRoom.building && newRoom.wing) {
      dispatch(fetchAreas({ buildingId: parseInt(newRoom.building), wingId: parseInt(newRoom.wing) }));
    }
  }, [dispatch, newRoom.building, newRoom.wing]);

  useEffect(() => {
    if (newRoom.building && newRoom.wing && newRoom.area) {
      dispatch(fetchFloors({ 
        buildingId: parseInt(newRoom.building), 
        wingId: parseInt(newRoom.wing), 
        areaId: parseInt(newRoom.area) 
      }));
    }
  }, [dispatch, newRoom.building, newRoom.wing, newRoom.area]);

  useEffect(() => {
    if (newRoom.building && newRoom.wing && newRoom.area && newRoom.floor) {
      dispatch(fetchUnits({ 
        buildingId: parseInt(newRoom.building), 
        wingId: parseInt(newRoom.wing), 
        areaId: parseInt(newRoom.area),
        floorId: parseInt(newRoom.floor)
      }));
    }
  }, [dispatch, newRoom.building, newRoom.wing, newRoom.area, newRoom.floor]);

  // Fetch dependencies for edit forms
  useEffect(() => {
    if (editRoom.building && editingRoom) {
      dispatch(fetchWings(parseInt(editRoom.building)));
    }
  }, [dispatch, editRoom.building, editingRoom]);

  useEffect(() => {
    if (editRoom.building && editRoom.wing && editingRoom) {
      dispatch(fetchAreas({ buildingId: parseInt(editRoom.building), wingId: parseInt(editRoom.wing) }));
    }
  }, [dispatch, editRoom.building, editRoom.wing, editingRoom]);

  useEffect(() => {
    if (editRoom.building && editRoom.wing && editRoom.area && editingRoom) {
      dispatch(fetchFloors({ 
        buildingId: parseInt(editRoom.building), 
        wingId: parseInt(editRoom.wing), 
        areaId: parseInt(editRoom.area) 
      }));
    }
  }, [dispatch, editRoom.building, editRoom.wing, editRoom.area, editingRoom]);

  useEffect(() => {
    if (editRoom.building && editRoom.wing && editRoom.area && editRoom.floor && editingRoom) {
      dispatch(fetchUnits({ 
        buildingId: parseInt(editRoom.building), 
        wingId: parseInt(editRoom.wing), 
        areaId: parseInt(editRoom.area),
        floorId: parseInt(editRoom.floor)
      }));
    }
  }, [dispatch, editRoom.building, editRoom.wing, editRoom.area, editRoom.floor, editingRoom]);

  // Pagination calculations
  const filteredRooms = rooms.data.filter(room => {
    const searchLower = searchTerm.toLowerCase();
    return (
      room.name?.toLowerCase().includes(searchLower) ||
      room.building?.name?.toLowerCase().includes(searchLower) ||
      room.wing?.name?.toLowerCase().includes(searchLower) ||
      (room.area?.name && room.area.name.toLowerCase().includes(searchLower)) ||
      room.floor?.name?.toLowerCase().includes(searchLower)
    );
  });

  const totalItems = filteredRooms.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRooms = filteredRooms.slice(startIndex, endIndex);

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

  const handleAddRoom = async () => {
    if (!newRoom.building) {
      toast.error('Please select a building');
      return;
    }
    if (!newRoom.roomName.trim()) {
      toast.error('Please enter room name');
      return;
    }
    
    try {
      await dispatch(createRoom({
        name: newRoom.roomName,
        building_id: parseInt(newRoom.building),
        wing_id: newRoom.wing ? parseInt(newRoom.wing) : null,
        area_id: newRoom.area ? parseInt(newRoom.area) : null,
        floor_id: newRoom.floor ? parseInt(newRoom.floor) : null,
        unit_id: newRoom.unit ? parseInt(newRoom.unit) : null,
        create_qr: newRoom.createQrCode
      }));
      toast.success('Room created successfully');
      setNewRoom({
        building: '',
        wing: '',
        area: '',
        floor: '',
        unit: '',
        roomName: '',
        createQrCode: false
      });
      setIsAddDialogOpen(false);
      dispatch(fetchAllRooms());
    } catch (error) {
      toast.error('Failed to create room');
    }
  };

  const handlePrintAllQR = () => {
    // Implementation for printing all QR codes
    console.log('Printing all QR codes...');
  };

  const handleDownloadTemplate = async () => {
    try {
      // Debug all localStorage keys
      console.log('=== ALL localStorage KEYS ===');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          console.log(`${key}:`, localStorage.getItem(key));
        }
      }
      console.log('============================');
      
      // Get baseUrl from localStorage, fallback to default
      let baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
      
      console.log('Original baseUrl from localStorage:', baseUrl);
      
      // Remove any protocol if present and ensure https
      baseUrl = baseUrl.replace(/^https?:\/\//, '');
      const templateUrl = `https://${baseUrl}/assets/room.xlsx`;
      
      console.log('Final Template URL:', templateUrl);
      toast.info('Downloading template...');
      
      const response = await fetch(templateUrl, {
        method: 'GET',
        mode: 'cors',
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`Failed to download template: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      console.log('Downloaded blob size:', blob.size);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'room.xlsx';
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Template downloaded successfully');
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error(`Failed to download template: ${error.message}`);
    }
  };

  const handleImportRooms = async () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('pms_room[file]', importFile);

      const token = localStorage.getItem('token') || '';
      let baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
      
      console.log('Original baseUrl from localStorage:', baseUrl);
      
      // Remove any protocol if present and ensure https
      baseUrl = baseUrl.replace(/^https?:\/\//, '');
      const apiUrl = `https://${baseUrl}/pms/account_setups/room_import.json?token=${token}`;
      
      console.log('Final Import API URL:', apiUrl);
      toast.info('Starting import...');
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Import failed: ${response.statusText}`);
      }

      const result = await response.json();
      toast.success(`Rooms imported successfully! ${result.imported_count || ''} records processed.`);
      setShowImportDialog(false);
      setImportFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      dispatch(fetchAllRooms());
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(error.message || 'Failed to import rooms');
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv' // .csv
      ];
      
      if (allowedTypes.includes(file.type)) {
        setImportFile(file);
      } else {
        toast.error('Please select a valid Excel or CSV file');
        event.target.value = '';
      }
    }
  };

  const handleEditRoom = (room: any) => {
    setEditingRoom(room);
    setEditRoom({
      building: room.building_id?.toString() || '',
      wing: room.wing_id?.toString() || '',
      area: room.area_id?.toString() || '',
      floor: room.floor_id?.toString() || '',
      unit: room.unit_id?.toString() || '',
      roomName: room.name || '',
      active: room.active
    });
    
    // Load the dependencies immediately when editing starts
    if (room.building_id) {
      dispatch(fetchWings(room.building_id));
      
      if (room.wing_id) {
        dispatch(fetchAreas({ buildingId: room.building_id, wingId: room.wing_id }));
        
        if (room.area_id) {
          dispatch(fetchFloors({ 
            buildingId: room.building_id, 
            wingId: room.wing_id, 
            areaId: room.area_id 
          }));
          
          if (room.floor_id) {
            dispatch(fetchUnits({ 
              buildingId: room.building_id, 
              wingId: room.wing_id, 
              areaId: room.area_id,
              floorId: room.floor_id
            }));
          }
        }
      }
    }
    
    setIsEditDialogOpen(true);
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom) return;
    
    if (!editRoom.building) {
      toast.error('Please select a building');
      return;
    }
    if (!editRoom.roomName.trim()) {
      toast.error('Please enter room name');
      return;
    }
    
    try {
      await dispatch(updateRoom({
        id: editingRoom.id,
        updates: {
          name: editRoom.roomName,
          building_id: parseInt(editRoom.building),
          wing_id: editRoom.wing ? parseInt(editRoom.wing) : null,
          area_id: editRoom.area ? parseInt(editRoom.area) : null,
          floor_id: editRoom.floor ? parseInt(editRoom.floor) : null,
          unit_id: editRoom.unit ? parseInt(editRoom.unit) : null,
          active: editRoom.active
        }
      }));
      toast.success('Room updated successfully');
      setIsEditDialogOpen(false);
      setEditingRoom(null);
      dispatch(fetchAllRooms());
    } catch (error) {
      toast.error('Failed to update room');
    }
  };

  const toggleRoomStatus = async (roomId: number) => {
    try {
      const room = rooms.data.find(r => r.id === roomId);
      if (!room) return;

      await dispatch(updateRoom({
        id: roomId,
        updates: { active: !room.active }
      }));
      
      toast.success('Room status updated successfully');
    } catch (error) {
      toast.error('Failed to update room status');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">ROOM</h1>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {/* Download Template */}
                Download Sample Format
              </Button>

              <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Import Rooms
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Import Rooms</DialogTitle>
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
                        onClick={handleImportRooms}
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
                  <Button className="bg-[#C72030] hover:bg-[#B01E2E] text-white flex items-center gap-2">
                    <Square className="w-4 h-4" />
                    Add Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader className="flex flex-row items-center justify-between pb-0">
                    <DialogTitle className="flex items-center gap-2">
                      <Square className="w-5 h-5" />
                      Add Room
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
                      <Label htmlFor="building">Select Building</Label>
                      <Select 
                        value={newRoom.building} 
                        onValueChange={(value) => {
                          setNewRoom({ ...newRoom, building: value, wing: '', area: '', floor: '', unit: '' });
                          if (value) {
                            const buildingId = parseInt(value);
                            dispatch(fetchWings(buildingId));
                            dispatch(fetchAreas({ buildingId }));
                            dispatch(fetchFloors({ buildingId }));
                            dispatch(fetchUnits({ buildingId }));
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
                      <Label htmlFor="wing">Select Wing</Label>
                      <Select 
                        value={newRoom.wing} 
                        onValueChange={(value) => {
                          setNewRoom({ ...newRoom, wing: value, area: '', floor: '', unit: '' });
                          if (value && newRoom.building) {
                            const buildingId = parseInt(newRoom.building);
                            const wingId = parseInt(value);
                            dispatch(fetchAreas({ buildingId, wingId }));
                            dispatch(fetchFloors({ buildingId, wingId }));
                            dispatch(fetchUnits({ buildingId, wingId }));
                          }
                        }}
                        disabled={!newRoom.building}
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
                      <Label htmlFor="area">Select Area</Label>
                      <Select 
                        value={newRoom.area} 
                        onValueChange={(value) => {
                          setNewRoom({ ...newRoom, area: value, floor: '', unit: '' });
                          if (value && newRoom.building) {
                            const buildingId = parseInt(newRoom.building);
                            const wingId = newRoom.wing ? parseInt(newRoom.wing) : undefined;
                            const areaId = parseInt(value);
                            dispatch(fetchFloors({ buildingId, wingId, areaId }));
                            dispatch(fetchUnits({ buildingId, wingId, areaId }));
                          }
                        }}
                        disabled={!newRoom.building}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Area (Optional)" />
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
                      <Label htmlFor="floor">Select Floor</Label>
                      <Select 
                        value={newRoom.floor} 
                        onValueChange={(value) => {
                          setNewRoom({ ...newRoom, floor: value, unit: '' });
                          if (value && newRoom.building) {
                            const buildingId = parseInt(newRoom.building);
                            const wingId = newRoom.wing ? parseInt(newRoom.wing) : undefined;
                            const areaId = newRoom.area ? parseInt(newRoom.area) : undefined;
                            const floorId = parseInt(value);
                            dispatch(fetchUnits({ buildingId, wingId, areaId, floorId }));
                          }
                        }}
                        disabled={!newRoom.building}
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
                      <Label htmlFor="unit">Select Unit</Label>
                      <Select 
                        value={newRoom.unit} 
                        onValueChange={(value) => setNewRoom(prev => ({ ...prev, unit: value }))}
                        disabled={!newRoom.building}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Unit (Optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {units.data.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id.toString()}>
                              {unit.unit_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="roomName">Enter Room Name</Label>
                      <Input
                        id="roomName"
                        value={newRoom.roomName}
                        onChange={(e) => setNewRoom(prev => ({ ...prev, roomName: e.target.value }))}
                        placeholder="Enter Room Name"
                      />
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="createQrCode"
                          checked={newRoom.createQrCode}
                          onCheckedChange={(checked) => setNewRoom(prev => ({ ...prev, createQrCode: !!checked }))}
                        />
                        <Label htmlFor="createQrCode">Create Qr Code</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setNewRoom({
                          building: '',
                          wing: '',
                          area: '',
                          floor: '',
                          unit: '',
                          roomName: '',
                          createQrCode: false
                        });
                      }}
                      className="border-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddRoom} 
                      className="bg-[#C72030] hover:bg-[#B01E2E] text-white"
                      disabled={!newRoom.building || !newRoom.roomName.trim()}
                    >
                      Submit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                onClick={handlePrintAllQR}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                Print All QR
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
                placeholder="Search rooms..."
              />
            </div>
          </div>

          {/* Debug info - remove this later */}
         

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
                  <TableHead>Unit</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>QR Code</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4">
                      Loading rooms...
                    </TableCell>
                  </TableRow>
                ) : rooms.error ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4 text-red-500">
                      Error: {rooms.error}
                    </TableCell>
                  </TableRow>
                ) : filteredRooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4">
                      {rooms.data.length === 0 ? 'No rooms available' : 'No rooms match your search'}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentRooms.map((room) => (
                    <TableRow key={room.id}>
                       <TableCell>
                         <Button variant="ghost" size="sm" onClick={() => handleEditRoom(room)}>
                           <Edit className="w-4 h-4 text-[#C72030]" />
                         </Button>
                       </TableCell>
                      <TableCell>{room.building?.name || 'N/A'}</TableCell>
                      <TableCell>{room.wing?.name || 'N/A'}</TableCell>
                      <TableCell>{room.area?.name || 'N/A'}</TableCell>
                      <TableCell>{room.floor?.name || 'N/A'}</TableCell>
                      <TableCell>
                        {room.unit?.unit_name || (room.unit_id ? `Unit ${room.unit_id}` : '-')}
                      </TableCell>
                      <TableCell>{room.name}</TableCell>
                      <TableCell>
                        {room.room_qr_code ? (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedQrCode(room.room_qr_code);
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
                         <button onClick={() => toggleRoomStatus(room.id)} className="cursor-pointer">
                           {room.active ? (
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
          {rooms.data.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} rooms
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

          {/* Edit Room Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader className="flex flex-row items-center justify-between pb-0">
                <DialogTitle>Edit Room Details</DialogTitle>
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
                    value={editRoom.building} 
                    onValueChange={(value) => {
                      setEditRoom({ ...editRoom, building: value, wing: '', area: '', floor: '', unit: '' });
                      if (value) {
                        const buildingId = parseInt(value);
                        dispatch(fetchWings(buildingId));
                        dispatch(fetchAreas({ buildingId }));
                        dispatch(fetchFloors({ buildingId }));
                        dispatch(fetchUnits({ buildingId }));
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
                    value={editRoom.wing} 
                    onValueChange={(value) => {
                      setEditRoom({ ...editRoom, wing: value, area: '', floor: '', unit: '' });
                      if (value && editRoom.building) {
                        const buildingId = parseInt(editRoom.building);
                        const wingId = parseInt(value);
                        dispatch(fetchAreas({ buildingId, wingId }));
                        dispatch(fetchFloors({ buildingId, wingId }));
                        dispatch(fetchUnits({ buildingId, wingId }));
                      }
                    }}
                    disabled={!editRoom.building}
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
                    value={editRoom.area} 
                    onValueChange={(value) => {
                      setEditRoom({ ...editRoom, area: value, floor: '', unit: '' });
                      if (value && editRoom.building) {
                        const buildingId = parseInt(editRoom.building);
                        const wingId = editRoom.wing ? parseInt(editRoom.wing) : undefined;
                        const areaId = parseInt(value);
                        dispatch(fetchFloors({ buildingId, wingId, areaId }));
                        dispatch(fetchUnits({ buildingId, wingId, areaId }));
                      }
                    }}
                    disabled={!editRoom.building}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Area (Optional)" />
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
                    value={editRoom.floor} 
                    onValueChange={(value) => {
                      setEditRoom({ ...editRoom, floor: value, unit: '' });
                      if (value && editRoom.building) {
                        const buildingId = parseInt(editRoom.building);
                        const wingId = editRoom.wing ? parseInt(editRoom.wing) : undefined;
                        const areaId = editRoom.area ? parseInt(editRoom.area) : undefined;
                        const floorId = parseInt(value);
                        dispatch(fetchUnits({ buildingId, wingId, areaId, floorId }));
                      }
                    }}
                    disabled={!editRoom.building}
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
                  <Label>Select Unit</Label>
                  <Select 
                    value={editRoom.unit} 
                    onValueChange={(value) => setEditRoom(prev => ({ ...prev, unit: value }))}
                    disabled={!editRoom.building}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Unit (Optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {units.data.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id.toString()}>
                          {unit.unit_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editRoomName">Room Name</Label>
                  <Input
                    id="editRoomName"
                    value={editRoom.roomName}
                    onChange={(e) => setEditRoom(prev => ({ ...prev, roomName: e.target.value }))}
                    placeholder="Enter Room Name"
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="editActive"
                      checked={editRoom.active}
                      onCheckedChange={(checked) => setEditRoom(prev => ({ ...prev, active: !!checked }))}
                    />
                    <Label htmlFor="editActive">Active</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleUpdateRoom} 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                  disabled={!editRoom.roomName.trim() || !editRoom.building}
                >
                  Submit
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* QR Code Modal */}
          <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Room QR Code</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4 py-4">
                {selectedQrCode ? (
                  <>
                    <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                      <img 
                        src={selectedQrCode} 
                        alt="Room QR Code" 
                        className="w-64 h-64 object-contain"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = selectedQrCode;
                        link.download = `room-qr-code-${Date.now()}.png`;
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
};