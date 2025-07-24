import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Square, Check, Plus, FileDown, X } from 'lucide-react';

interface RoomData {
  id: number;
  site: string;
  building: string;
  wing: string;
  area: string;
  floor: string;
  unit: string;
  room: string;
  status: boolean;
}

const initialRooms: RoomData[] = [
  { id: 1, site: 'Lockated', building: 'TA Building', wing: 'W2', area: 'Common Area', floor: 'F2', unit: '', room: 'TA W2 F2 Common Area', status: true },
  { id: 2, site: 'Lockated', building: 'TA Building', wing: 'W2', area: 'Service Area', floor: 'F2', unit: '', room: 'TA W2 F2 Service Passage 4', status: true },
  { id: 3, site: 'Lockated', building: 'TA Building', wing: 'W2', area: 'Lobby', floor: 'F2', unit: '', room: 'TA W2 F2 Lift Lobby', status: true },
  { id: 4, site: 'Lockated', building: 'TA Building', wing: 'W1', area: 'Service Area', floor: 'F2', unit: '', room: 'TA W1 F2 Service Passage 1', status: true },
  { id: 5, site: 'Lockated', building: 'TA Building', wing: 'W1', area: 'Staircase', floor: 'F2', unit: '', room: 'TA W1 F2 Staircase 2', status: true },
  { id: 6, site: 'Lockated', building: 'Office Building', wing: 'East', area: 'Workstation Area', floor: 'F3', unit: 'Unit A', room: 'WorkStation5', status: true },
  { id: 7, site: 'Lockated', building: 'Office Building', wing: 'East', area: 'Workstation Area', floor: 'F3', unit: 'Unit A', room: 'WorkStation4', status: true },
];

export const RoomPage = () => {
  const [rooms, setRooms] = useState<RoomData[]>(initialRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('25');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomData | null>(null);
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

  const filteredRooms = rooms.filter(room =>
    Object.values(room).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddRoom = () => {
    const newRoomData: RoomData = {
      id: rooms.length + 1,
      site: 'Lockated',
      building: newRoom.building,
      wing: newRoom.wing,
      area: newRoom.area,
      floor: newRoom.floor,
      unit: newRoom.unit,
      room: newRoom.roomName,
      status: true
    };
    
    setRooms(prev => [...prev, newRoomData]);
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
  };

  const handlePrintAllQR = () => {
    // Implementation for printing all QR codes
    console.log('Printing all QR codes...');
  };

  const handleEditRoom = (room: RoomData) => {
    setEditingRoom(room);
    setEditRoom({
      building: room.building,
      wing: room.wing,
      area: room.area,
      floor: room.floor,
      unit: room.unit,
      roomName: room.room,
      active: room.status
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateRoom = () => {
    if (editingRoom) {
      const updatedRooms = rooms.map(room => 
        room.id === editingRoom.id 
          ? {
              ...room,
              building: editRoom.building,
              wing: editRoom.wing,
              area: editRoom.area,
              floor: editRoom.floor,
              unit: editRoom.unit,
              room: editRoom.roomName,
              status: editRoom.active
            }
          : room
      );
      setRooms(updatedRooms);
      setIsEditDialogOpen(false);
      setEditingRoom(null);
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
                      <Select value={newRoom.building} onValueChange={(value) => setNewRoom(prev => ({ ...prev, building: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Building" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ta-building">TA Building</SelectItem>
                          <SelectItem value="office-building">Office Building</SelectItem>
                          <SelectItem value="main-building">Main Building</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="wing">Select Wing</Label>
                      <Select value={newRoom.wing} onValueChange={(value) => setNewRoom(prev => ({ ...prev, wing: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Wing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="w1">W1</SelectItem>
                          <SelectItem value="w2">W2</SelectItem>
                          <SelectItem value="east">East</SelectItem>
                          <SelectItem value="west">West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="area">Select Area</Label>
                      <Select value={newRoom.area} onValueChange={(value) => setNewRoom(prev => ({ ...prev, area: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="common-area">Common Area</SelectItem>
                          <SelectItem value="service-area">Service Area</SelectItem>
                          <SelectItem value="lobby">Lobby</SelectItem>
                          <SelectItem value="workstation-area">Workstation Area</SelectItem>
                          <SelectItem value="staircase">Staircase</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="floor">Select Floor</Label>
                      <Select value={newRoom.floor} onValueChange={(value) => setNewRoom(prev => ({ ...prev, floor: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Floor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="f1">F1</SelectItem>
                          <SelectItem value="f2">F2</SelectItem>
                          <SelectItem value="f3">F3</SelectItem>
                          <SelectItem value="f4">F4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="unit">Select Unit</Label>
                      <Select value={newRoom.unit} onValueChange={(value) => setNewRoom(prev => ({ ...prev, unit: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Unit (Optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unit-a">Unit A</SelectItem>
                          <SelectItem value="unit-b">Unit B</SelectItem>
                          <SelectItem value="unit-c">Unit C</SelectItem>
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
                    <Button onClick={handleAddRoom} className="bg-[#C72030] hover:bg-[#B01E2E] text-white">
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
                placeholder="Search rooms..."
              />
            </div>
          </div>

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
                {filteredRooms.map((room) => (
                  <TableRow key={room.id}>
                     <TableCell>
                       <Button variant="ghost" size="sm" onClick={() => handleEditRoom(room)}>
                         <Edit className="w-4 h-4 text-[#C72030]" />
                       </Button>
                     </TableCell>
                    <TableCell>{room.site}</TableCell>
                    <TableCell>{room.building}</TableCell>
                    <TableCell>{room.wing}</TableCell>
                    <TableCell>{room.area}</TableCell>
                    <TableCell>{room.floor}</TableCell>
                    <TableCell>{room.unit || '-'}</TableCell>
                    <TableCell>{room.room}</TableCell>
                     <TableCell>
                       {room.status ? (
                         <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                           <Check className="w-3 h-3 text-white" />
                         </div>
                       ) : (
                         <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                           <span className="text-white text-xs">✗</span>
                         </div>
                       )}
                     </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination info */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-600">
              Showing 1 to {Math.min(parseInt(entriesPerPage), filteredRooms.length)} of {filteredRooms.length} entries
            </span>
          </div>

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