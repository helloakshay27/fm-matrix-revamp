import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { AttachmentUpload } from '@/components/common/AttachmentUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl as MuiFormControl, InputLabel, Select as MuiSelect, MenuItem, TextField } from '@mui/material';
import { Edit, Square, Plus, X, Upload, Download, Loader2, QrCode } from 'lucide-react';
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
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
  },
};

// Portals to document.body so the menu anchors under the field instead of
// inheriting the Radix Dialog's translate transform (which mispositions it).
const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

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
  const { shouldShow } = useDynamicPermissions();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<string>('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

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

  // Filter rooms based on search
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
      const templateUrl = `https://${baseUrl}/room.xlsx`;

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
      dispatch(fetchAllRooms());
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(error.message || 'Failed to import rooms');
    } finally {
      setIsImporting(false);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    const file = files[0];
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

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                size="sm" className="h-9 px-4 text-sm font-medium whitespace-nowrap"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Sample Format
              </Button>

              <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm" className="h-9 px-4 text-sm font-medium whitespace-nowrap"
                  >
                    <Upload className="h-4 w-4 mr-2" />
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
                    <AttachmentUpload
                      label="Select Excel or CSV file"
                      chooseText="Choose File"
                      uploadText="Upload File"
                      accept=".xlsx,.xls,.csv"
                      files={importFile ? [importFile] : []}
                      onFilesSelected={handleFilesSelected}
                      onRemove={() => setImportFile(null)}
                      disabled={isImporting}
                    />
                    <div className="fm-action-bar">
                      <button
                        type="button"
                        className="fm-action-secondary"
                        onClick={() => {
                          setShowImportDialog(false);
                          setImportFile(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleImportRooms}
                        disabled={!importFile || isImporting}
                        className="fm-action-primary"
                      >
                        {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Import
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} modal={false}>
                {shouldShow("Room", "create") && (
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium whitespace-nowrap">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Room
                    </Button>
                  </DialogTrigger>
                )}
                <DialogContent
                  className="max-w-2xl bg-white overflow-visible"
                  onPointerDownOutside={(e) => {
                    if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
                      e.preventDefault();
                    }
                  }}
                  onInteractOutside={(e) => {
                    if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
                      e.preventDefault();
                    }
                  }}
                >
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
                    <div>
                      <MuiFormControl fullWidth variant="outlined">
                        <InputLabel id="add-room-building-label">Select Building</InputLabel>
                        <MuiSelect
                          labelId="add-room-building-label"
                          label="Select Building"
                          value={newRoom.building}
                          onChange={(e) => {
                            const value = e.target.value;
                            setNewRoom({ ...newRoom, building: value, wing: '', area: '', floor: '', unit: '' });
                            if (value) {
                              const buildingId = parseInt(value);
                              dispatch(fetchWings(buildingId));
                              dispatch(fetchAreas({ buildingId }));
                              dispatch(fetchFloors({ buildingId }));
                              dispatch(fetchUnits({ buildingId }));
                            }
                          }}
                          sx={fieldStyles}
                          MenuProps={selectMenuProps}
                        >
                          <MenuItem value=""><em>Select Building</em></MenuItem>
                          {buildings.data.map((building) => (
                            <MenuItem key={building.id} value={building.id.toString()}>
                              {building.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </MuiFormControl>
                    </div>

                    <div>
                      <MuiFormControl fullWidth variant="outlined">
                        <InputLabel id="add-room-wing-label">Select Wing</InputLabel>
                        <MuiSelect
                          labelId="add-room-wing-label"
                          label="Select Wing"
                          value={newRoom.wing}
                          onChange={(e) => {
                            const value = e.target.value;
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
                          sx={fieldStyles}
                          MenuProps={selectMenuProps}
                        >
                          <MenuItem value=""><em>Select Wing</em></MenuItem>
                          {wings.data.map((wing) => (
                            <MenuItem key={wing.id} value={wing.id.toString()}>
                              {wing.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </MuiFormControl>
                    </div>

                    <div>
                      <MuiFormControl fullWidth variant="outlined">
                        <InputLabel id="add-room-area-label">Select Area</InputLabel>
                        <MuiSelect
                          labelId="add-room-area-label"
                          label="Select Area"
                          value={newRoom.area}
                          onChange={(e) => {
                            const value = e.target.value;
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
                          sx={fieldStyles}
                          MenuProps={selectMenuProps}
                        >
                          <MenuItem value=""><em>Select Area (Optional)</em></MenuItem>
                          {areas.data.map((area) => (
                            <MenuItem key={area.id} value={area.id.toString()}>
                              {area.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </MuiFormControl>
                    </div>

                    <div>
                      <MuiFormControl fullWidth variant="outlined">
                        <InputLabel id="add-room-floor-label">Select Floor</InputLabel>
                        <MuiSelect
                          labelId="add-room-floor-label"
                          label="Select Floor"
                          value={newRoom.floor}
                          onChange={(e) => {
                            const value = e.target.value;
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
                          sx={fieldStyles}
                          MenuProps={selectMenuProps}
                        >
                          <MenuItem value=""><em>Select Floor</em></MenuItem>
                          {floors.data.map((floor) => (
                            <MenuItem key={floor.id} value={floor.id.toString()}>
                              {floor.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </MuiFormControl>
                    </div>

                    <div>
                      <MuiFormControl fullWidth variant="outlined">
                        <InputLabel id="add-room-unit-label">Select Unit</InputLabel>
                        <MuiSelect
                          labelId="add-room-unit-label"
                          label="Select Unit"
                          value={newRoom.unit}
                          onChange={(e) => setNewRoom(prev => ({ ...prev, unit: e.target.value }))}
                          disabled={!newRoom.building}
                          sx={fieldStyles}
                          MenuProps={selectMenuProps}
                        >
                          <MenuItem value=""><em>Select Unit (Optional)</em></MenuItem>
                          {units.data.map((unit) => (
                            <MenuItem key={unit.id} value={unit.id.toString()}>
                              {unit.unit_name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </MuiFormControl>
                    </div>

                    <div>
                      <TextField
                        id="roomName"
                        label="Enter Room Name"
                        variant="outlined"
                        fullWidth
                        value={newRoom.roomName}
                        onChange={(e) => setNewRoom(prev => ({ ...prev, roomName: e.target.value }))}
                        placeholder="Enter Room Name"
                        sx={fieldStyles}
                      />
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="createQrCode"
                          checked={newRoom.createQrCode}
                          onCheckedChange={(checked) => setNewRoom(prev => ({ ...prev, createQrCode: !!checked }))}
                        />
                        <label htmlFor="createQrCode" className="text-sm font-medium">Create Qr Code</label>
                      </div>
                    </div>
                  </div>

                  <div className="fm-action-bar pt-4">
                    <button
                      type="button"
                      className="fm-action-secondary"
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
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddRoom}
                      className="fm-action-primary"
                      disabled={!newRoom.building || !newRoom.roomName.trim()}
                    >
                      Submit
                    </button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                onClick={handlePrintAllQR}
                size="sm" variant="outline" className="h-9 px-4 text-sm font-medium whitespace-nowrap"
              >
                Print All QR
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-4" />

          {/* Table */}
          <div className="w-full min-w-0 max-w-full">
            <EnhancedTable
              data={filteredRooms}
              columns={[
                { key: 'building', label: 'Building', sortable: true, hideable: true, draggable: true, defaultVisible: true },
                { key: 'wing', label: 'Wing', sortable: true, hideable: true, draggable: true, defaultVisible: true },
                { key: 'area', label: 'Area', sortable: true, hideable: true, draggable: true, defaultVisible: true },
                { key: 'floor', label: 'Floor', sortable: true, hideable: true, draggable: true, defaultVisible: true },
                { key: 'unit', label: 'Unit', sortable: true, hideable: true, draggable: true, defaultVisible: true },
                { key: 'name', label: 'Room', sortable: true, hideable: true, draggable: true, defaultVisible: true },
                { key: 'qr_code', label: 'QR Code', sortable: false, hideable: true, draggable: true, defaultVisible: true },
                { key: 'status', label: 'Status', sortable: false, hideable: true, draggable: true, defaultVisible: true },
              ] as ColumnConfig[]}
              renderCell={(room: any, columnKey: string) => {
                switch (columnKey) {
                  case 'building':
                    return room.building?.name || 'N/A';
                  case 'wing':
                    return room.wing?.name || 'N/A';
                  case 'area':
                    return room.area?.name || 'N/A';
                  case 'floor':
                    return room.floor?.name || 'N/A';
                  case 'unit':
                    return room.unit?.unit_name || (room.unit_id ? `Unit ${room.unit_id}` : '-');
                  case 'name':
                    return <span className="font-medium text-gray-900">{room.name}</span>;
                  case 'qr_code':
                    return room.room_qr_code ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedQrCode(room.room_qr_code);
                          setIsQrModalOpen(true);
                        }}
                        className="h-8 w-8 p-0 text-black hover:bg-gray-100"
                        title="QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    );
                  case 'status':
                    return (
                      <Switch
                        checked={room.active}
                        onCheckedChange={() => toggleRoomStatus(room.id)}
                        className="data-[state=checked]:bg-brand"
                      />
                    );
                  default:
                    return room[columnKey] ?? '--';
                }
              }}
              renderActions={(room: any) =>
                shouldShow("Room", "update") ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditRoom(room)}
                    className="h-8 w-8 p-0 text-black hover:bg-gray-100"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                ) : null
              }
              storageKey="room-master-table"
              enableSearch
              searchTerm={searchTerm}
              onSearchChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
              disableClientSearch
              searchPlaceholder="Search rooms..."
              hideTableExport
              loading={rooms.loading}
              emptyMessage={
                rooms.error
                  ? `Error: ${rooms.error}`
                  : rooms.data.length === 0
                    ? 'No rooms available'
                    : 'No rooms match your search'
              }
              pagination
              pageSize={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Edit Room Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} modal={false}>
            <DialogContent
              className="max-w-2xl bg-white overflow-visible"
              onPointerDownOutside={(e) => {
                if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
                  e.preventDefault();
                }
              }}
              onInteractOutside={(e) => {
                if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
                  e.preventDefault();
                }
              }}
            >
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
                <div>
                  <MuiFormControl fullWidth variant="outlined">
                    <InputLabel id="edit-room-building-label">Select Building</InputLabel>
                    <MuiSelect
                      labelId="edit-room-building-label"
                      label="Select Building"
                      value={editRoom.building}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEditRoom({ ...editRoom, building: value, wing: '', area: '', floor: '', unit: '' });
                        if (value) {
                          const buildingId = parseInt(value);
                          dispatch(fetchWings(buildingId));
                          dispatch(fetchAreas({ buildingId }));
                          dispatch(fetchFloors({ buildingId }));
                          dispatch(fetchUnits({ buildingId }));
                        }
                      }}
                      sx={fieldStyles}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value=""><em>Select Building</em></MenuItem>
                      {buildings.data.map((building) => (
                        <MenuItem key={building.id} value={building.id.toString()}>
                          {building.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </MuiFormControl>
                </div>

                <div>
                  <MuiFormControl fullWidth variant="outlined">
                    <InputLabel id="edit-room-wing-label">Select Wing</InputLabel>
                    <MuiSelect
                      labelId="edit-room-wing-label"
                      label="Select Wing"
                      value={editRoom.wing}
                      onChange={(e) => {
                        const value = e.target.value;
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
                      sx={fieldStyles}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value=""><em>Select Wing</em></MenuItem>
                      {wings.data.map((wing) => (
                        <MenuItem key={wing.id} value={wing.id.toString()}>
                          {wing.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </MuiFormControl>
                </div>

                <div>
                  <MuiFormControl fullWidth variant="outlined">
                    <InputLabel id="edit-room-area-label">Select Area</InputLabel>
                    <MuiSelect
                      labelId="edit-room-area-label"
                      label="Select Area"
                      value={editRoom.area}
                      onChange={(e) => {
                        const value = e.target.value;
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
                      sx={fieldStyles}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value=""><em>Select Area (Optional)</em></MenuItem>
                      {areas.data.map((area) => (
                        <MenuItem key={area.id} value={area.id.toString()}>
                          {area.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </MuiFormControl>
                </div>

                <div>
                  <MuiFormControl fullWidth variant="outlined">
                    <InputLabel id="edit-room-floor-label">Select Floor</InputLabel>
                    <MuiSelect
                      labelId="edit-room-floor-label"
                      label="Select Floor"
                      value={editRoom.floor}
                      onChange={(e) => {
                        const value = e.target.value;
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
                      sx={fieldStyles}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value=""><em>Select Floor</em></MenuItem>
                      {floors.data.map((floor) => (
                        <MenuItem key={floor.id} value={floor.id.toString()}>
                          {floor.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </MuiFormControl>
                </div>

                <div>
                  <MuiFormControl fullWidth variant="outlined">
                    <InputLabel id="edit-room-unit-label">Select Unit</InputLabel>
                    <MuiSelect
                      labelId="edit-room-unit-label"
                      label="Select Unit"
                      value={editRoom.unit}
                      onChange={(e) => setEditRoom(prev => ({ ...prev, unit: e.target.value }))}
                      disabled={!editRoom.building}
                      sx={fieldStyles}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value=""><em>Select Unit (Optional)</em></MenuItem>
                      {units.data.map((unit) => (
                        <MenuItem key={unit.id} value={unit.id.toString()}>
                          {unit.unit_name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </MuiFormControl>
                </div>

                <div>
                  <TextField
                    id="editRoomName"
                    label="Room Name"
                    variant="outlined"
                    fullWidth
                    value={editRoom.roomName}
                    onChange={(e) => setEditRoom(prev => ({ ...prev, roomName: e.target.value }))}
                    placeholder="Enter Room Name"
                    sx={fieldStyles}
                  />
                </div>

                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="editActive"
                      checked={editRoom.active}
                      onCheckedChange={(checked) => setEditRoom(prev => ({ ...prev, active: !!checked }))}
                    />
                    <label htmlFor="editActive" className="text-sm font-medium">Active</label>
                  </div>
                </div>
              </div>

              <div className="fm-action-bar pt-4">
                <button
                  type="button"
                  onClick={handleUpdateRoom}
                  className="fm-action-primary"
                  disabled={!editRoom.roomName.trim() || !editRoom.building}
                >
                  Submit
                </button>
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
