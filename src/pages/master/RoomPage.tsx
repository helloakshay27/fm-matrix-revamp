import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Square, Check, Plus, FileDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Fetch dependencies for add/edit forms
  useEffect(() => {
    if (newRoom.building) {
      dispatch(fetchWings(parseInt(newRoom.building)));
    }
  }, [dispatch, newRoom.building]);

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
    if (newRoom.building && newRoom.wing && newRoom.floor && newRoom.roomName.trim()) {
      try {
        await dispatch(createRoom({
          name: newRoom.roomName,
          building_id: parseInt(newRoom.building),
          wing_id: parseInt(newRoom.wing),
          area_id: newRoom.area ? parseInt(newRoom.area) : undefined,
          floor_id: parseInt(newRoom.floor),
          unit_id: newRoom.unit ? parseInt(newRoom.unit) : undefined,
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
    }
  };

  const handlePrintAllQR = () => {
    // Implementation for printing all QR codes
    console.log('Printing all QR codes...');
  };

  const handleEditRoom = (room: any) => {
    setEditingRoom(room);
    setEditRoom({
      building: room.building_id.toString(),
      wing: room.wing_id.toString(),
      area: room.area_id?.toString() || '',
      floor: room.floor_id.toString(),
      unit: room.unit_id?.toString() || '',
      roomName: room.name,
      active: room.active
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateRoom = async () => {
    if (editingRoom && editRoom.roomName.trim()) {
      try {
        await dispatch(updateRoom({
          id: editingRoom.id,
          updates: {
            name: editRoom.roomName,
            building_id: parseInt(editRoom.building),
            wing_id: parseInt(editRoom.wing),
            area_id: editRoom.area ? parseInt(editRoom.area) : null,
            floor_id: parseInt(editRoom.floor),
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
                      <Select value={newRoom.building} onValueChange={(value) => setNewRoom(prev => ({ ...prev, building: value, wing: '', area: '', floor: '', unit: '' }))}>
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
                        onValueChange={(value) => setNewRoom(prev => ({ ...prev, wing: value, area: '', floor: '', unit: '' }))}
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
                        onValueChange={(value) => setNewRoom(prev => ({ ...prev, area: value, floor: '', unit: '' }))}
                        disabled={!newRoom.wing}
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
                        onValueChange={(value) => setNewRoom(prev => ({ ...prev, floor: value, unit: '' }))}
                        disabled={!newRoom.wing}
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
                        disabled={!newRoom.floor}
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
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleAddRoom} 
                      className="bg-[#C72030] hover:bg-[#B01E2E] text-white"
                      disabled={!newRoom.building || !newRoom.wing || !newRoom.floor || !newRoom.roomName.trim()}
                    >
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
                  <TableHead>Site</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Wing</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      Loading rooms...
                    </TableCell>
                  </TableRow>
                ) : rooms.error ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4 text-red-500">
                      Error: {rooms.error}
                    </TableCell>
                  </TableRow>
                ) : filteredRooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
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
                      <TableCell>-</TableCell>
                      <TableCell>{room.building?.name || 'N/A'}</TableCell>
                      <TableCell>{room.wing?.name || 'N/A'}</TableCell>
                      <TableCell>{room.area?.name || 'N/A'}</TableCell>
                      <TableCell>{room.floor?.name || 'N/A'}</TableCell>
                      <TableCell>
                        {room.unit?.unit_name || (room.unit_id ? `Unit ${room.unit_id}` : '-')}
                      </TableCell>
                      <TableCell>{room.name}</TableCell>
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
            <DialogContent className="max-w-lg">
              <DialogHeader className="flex flex-row items-center justify-between pb-0">
                <DialogTitle>Edit Room</DialogTitle>
                <button
                  onClick={() => setIsEditDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Building</Label>
                  <Input
                    value={editRoom.building}
                    onChange={(e) => setEditRoom(prev => ({ ...prev, building: e.target.value }))}
                    placeholder="Building"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Wing</Label>
                  <Input
                    value={editRoom.wing}
                    onChange={(e) => setEditRoom(prev => ({ ...prev, wing: e.target.value }))}
                    placeholder="Wing"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Area</Label>
                  <Select 
                    value={editRoom.area} 
                    onValueChange={(value) => setEditRoom(prev => ({ ...prev, area: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="Common Area">Common Area</SelectItem>
                      <SelectItem value="Service Area">Service Area</SelectItem>
                      <SelectItem value="Lobby">Lobby</SelectItem>
                      <SelectItem value="Workstation Area">Workstation Area</SelectItem>
                      <SelectItem value="Staircase">Staircase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Floor</Label>
                  <Input
                    value={editRoom.floor}
                    onChange={(e) => setEditRoom(prev => ({ ...prev, floor: e.target.value }))}
                    placeholder="Floor"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Room Name</Label>
                  <Input
                    value={editRoom.roomName}
                    onChange={(e) => setEditRoom(prev => ({ ...prev, roomName: e.target.value }))}
                    placeholder="Room Name"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="editActive"
                    checked={editRoom.active}
                    onCheckedChange={(checked) => setEditRoom(prev => ({ ...prev, active: !!checked }))}
                  />
                  <Label htmlFor="editActive">Active</Label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  onClick={handleUpdateRoom} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!editRoom.roomName.trim()}
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};