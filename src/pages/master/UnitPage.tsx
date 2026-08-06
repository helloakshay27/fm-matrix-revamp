import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl as MuiFormControl, InputLabel, Select as MuiSelect, MenuItem, TextField } from '@mui/material';
import { Edit, Square, Plus, X, Download, Upload, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import {
  fetchBuildings,
  fetchWings,
  fetchAreas,
  fetchFloors,
  fetchAllUnits,
  createUnit,
  updateUnit
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

export const UnitPage = () => {
  const dispatch = useAppDispatch();
  const {
    buildings,
    wings,
    areas,
    floors,
    units
  } = useAppSelector((state) => state.location);
  const { shouldShow } = useDynamicPermissions();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [newUnit, setNewUnit] = useState({
    building: '',
    wing: '',
    area: '',
    floor: '',
    unitName: '',
    areaSize: ''
  });
  const [editUnit, setEditUnit] = useState({
    building: '',
    wing: '',
    area: '',
    floor: '',
    unitName: '',
    areaSize: '',
    active: true
  });

  useEffect(() => {
    dispatch(fetchBuildings());
    dispatch(fetchAllUnits());
  }, [dispatch]);

  // Debug: Log state changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Units state:', units);
      console.log('Buildings state:', buildings);
      console.log('Wings state:', wings);
      console.log('Areas state:', areas);
      console.log('Floors state:', floors);
      if (units.data.length > 0) {
        console.log('First unit sample:', units.data[0]);
      }
    }
  }, [units, buildings, wings, areas, floors]);

  // Reset pagination when units data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [units.data.length]);

  // Debug: Log form state changes
  useEffect(() => {
    console.log('newUnit state:', newUnit);
  }, [newUnit]);

  useEffect(() => {
    console.log('editUnit state:', editUnit);
  }, [editUnit]);

  // Fetch dependencies for add/edit forms
  useEffect(() => {
    if (newUnit.building) {
      console.log('Fetching wings, areas, and floors for building:', newUnit.building);
      dispatch(fetchWings(parseInt(newUnit.building)));
      dispatch(fetchAreas({ buildingId: parseInt(newUnit.building), wingId: newUnit.wing ? parseInt(newUnit.wing) : undefined }));
      dispatch(fetchFloors({
        buildingId: parseInt(newUnit.building),
        wingId: newUnit.wing ? parseInt(newUnit.wing) : undefined,
        areaId: newUnit.area ? parseInt(newUnit.area) : undefined
      }));
    }
  }, [dispatch, newUnit.building, newUnit.wing, newUnit.area]);

  // Fetch dependencies for edit forms
  useEffect(() => {
    if (editUnit.building && editingUnit) {
      console.log('Fetching wings, areas, and floors for building in edit:', editUnit.building);
      dispatch(fetchWings(parseInt(editUnit.building)));
      dispatch(fetchAreas({ buildingId: parseInt(editUnit.building), wingId: editUnit.wing ? parseInt(editUnit.wing) : undefined }));
      dispatch(fetchFloors({
        buildingId: parseInt(editUnit.building),
        wingId: editUnit.wing ? parseInt(editUnit.wing) : undefined,
        areaId: editUnit.area ? parseInt(editUnit.area) : undefined
      }));
    }
  }, [dispatch, editUnit.building, editUnit.wing, editUnit.area, editingUnit]);

  const filteredUnits = units.data.filter(unit => {
    const searchLower = searchTerm.toLowerCase();
    return (
      unit.unit_name?.toLowerCase().includes(searchLower) ||
      unit.building?.name?.toLowerCase().includes(searchLower) ||
      unit.wing?.name?.toLowerCase().includes(searchLower) ||
      (unit.area_obj?.name && unit.area_obj.name.toLowerCase().includes(searchLower)) ||
      unit.floor?.name?.toLowerCase().includes(searchLower)
    );
  });

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      let baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
      baseUrl = baseUrl.replace(/^https?:\/\//, '');
      const templateUrl = `https://${baseUrl}/unit.xlsx`;

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
      a.download = 'unit.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Template downloaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to download template');
    }
  };

  const handleImportUnits = async () => {
    if (!importFile) return;

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('pms_unit[file]', importFile);

      const token = localStorage.getItem('token') || '';
      let baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
      baseUrl = baseUrl.replace(/^https?:\/\//, '');
      const apiUrl = `https://${baseUrl}/pms/account_setups/unit_import.json?token=${token}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to import units');
      }

      toast.success('Units imported successfully');
      setShowImportDialog(false);
      setImportFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      dispatch(fetchAllUnits());
    } catch (error: any) {
      toast.error(error.message || 'Failed to import units');
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

  const handleAddUnit = async () => {
    if (!newUnit.building) {
      toast.error('Please select a building');
      return;
    }
    if (!newUnit.unitName.trim()) {
      toast.error('Please enter unit name');
      return;
    }

    try {
      await dispatch(createUnit({
        unit_name: newUnit.unitName,
        building_id: parseInt(newUnit.building),
        wing_id: newUnit.wing ? parseInt(newUnit.wing) : undefined,
        area_id: newUnit.area ? parseInt(newUnit.area) : undefined,
        floor_id: newUnit.floor ? parseInt(newUnit.floor) : undefined,
        area: parseInt(newUnit.areaSize) || 0
      }));
      toast.success('Unit created successfully');
      setNewUnit({ building: '', wing: '', area: '', floor: '', unitName: '', areaSize: '' });
      setIsAddDialogOpen(false);
      dispatch(fetchAllUnits());
    } catch (error) {
      console.error('Error creating unit:', error);
      toast.error('Failed to create unit');
    }
  };

  const toggleActiveStatus = async (unitId: number) => {
    try {
      const unit = units.data.find(u => u.id === unitId);
      if (!unit) return;

      await dispatch(updateUnit({
        id: unitId,
        updates: { active: !unit.active }
      }));
      dispatch(fetchAllUnits());
      toast.success('Unit status updated successfully');
    } catch (error) {
      console.error('Error updating unit status:', error);
      toast.error('Failed to update unit status');
    }
  };

  const handleEditUnit = (unit: any) => {
    setEditingUnit(unit);
    setEditUnit({
      building: unit.building_id?.toString() || '',
      wing: unit.wing_id?.toString() || '',
      area: unit.area_id?.toString() || '',
      floor: unit.floor_id?.toString() || '',
      unitName: unit.unit_name || '',
      areaSize: unit.area?.toString() || '',
      active: unit.active
    });

    // Load all dependencies immediately when editing starts
    if (unit.building_id) {
      dispatch(fetchWings(unit.building_id));
      dispatch(fetchAreas({ buildingId: unit.building_id, wingId: unit.wing_id || undefined }));
      dispatch(fetchFloors({
        buildingId: unit.building_id,
        wingId: unit.wing_id || undefined,
        areaId: unit.area_id || undefined
      }));
    }

    setIsEditDialogOpen(true);
  };

  const handleUpdateUnit = async () => {
    if (!editingUnit) return;

    if (!editUnit.building) {
      toast.error('Please select a building');
      return;
    }
    if (!editUnit.unitName.trim()) {
      toast.error('Please enter unit name');
      return;
    }

    const payload = {
      unit_name: editUnit.unitName,
      building_id: parseInt(editUnit.building),
      wing_id: editUnit.wing ? parseInt(editUnit.wing) : null,
      area_id: editUnit.area ? parseInt(editUnit.area) : null,
      floor_id: editUnit.floor ? parseInt(editUnit.floor) : null,
      area: parseInt(editUnit.areaSize) || 0,
      active: editUnit.active
    };

    console.log('🚀 Update Unit Payload:', payload);
    console.log('📝 Current editUnit state:', editUnit);

    try {
      await dispatch(updateUnit({
        id: editingUnit.id,
        updates: payload
      }));
      toast.success('Unit updated successfully');
      setIsEditDialogOpen(false);
      setEditingUnit(null);
      dispatch(fetchAllUnits());
    } catch (error) {
      console.error('Error updating unit:', error);
      toast.error('Failed to update unit');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">UNIT</h1>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                className="h-9 px-4 text-sm font-medium whitespace-nowrap  border border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 [&_svg]:text-[#C72030]"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Sample Format
              </Button>

              <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 px-4 text-sm font-medium whitespace-nowrap  border border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 [&_svg]:text-[#C72030]"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Units
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Import Units</DialogTitle>
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
                        onClick={handleImportUnits}
                        disabled={!importFile || isImporting}
                        className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 [&_svg]:text-white"
                      >
                        {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Import
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                {shouldShow("Unit", "create") && (
                  <DialogTrigger asChild>
                    <Button className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap  [&_svg]:text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Unit
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
                      Add Unit
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
                        <InputLabel id="add-unit-building-label">Select Building</InputLabel>
                        <MuiSelect
                          labelId="add-unit-building-label"
                          label="Select Building"
                          value={newUnit.building}
                          onChange={(e) => {
                            const value = e.target.value;
                            const updatedNewUnit = { ...newUnit, building: value, wing: '', area: '', floor: '' };
                            setNewUnit(updatedNewUnit);
                            if (value) {
                              dispatch(fetchWings(parseInt(value)));
                              dispatch(fetchAreas({ buildingId: parseInt(value), wingId: undefined }));
                              dispatch(fetchFloors({ buildingId: parseInt(value), wingId: undefined, areaId: undefined }));
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
                        <InputLabel id="add-unit-wing-label">Select Wing</InputLabel>
                        <MuiSelect
                          labelId="add-unit-wing-label"
                          label="Select Wing"
                          value={newUnit.wing}
                          onChange={(e) => {
                            const value = e.target.value;
                            const updatedNewUnit = { ...newUnit, wing: value, area: '', floor: '' };
                            setNewUnit(updatedNewUnit);
                            if (updatedNewUnit.building) {
                              dispatch(fetchAreas({ buildingId: parseInt(updatedNewUnit.building), wingId: value ? parseInt(value) : undefined }));
                              dispatch(fetchFloors({
                                buildingId: parseInt(updatedNewUnit.building),
                                wingId: value ? parseInt(value) : undefined,
                                areaId: undefined
                              }));
                            }
                          }}
                          disabled={!newUnit.building}
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
                        <InputLabel id="add-unit-area-label">Select Area</InputLabel>
                        <MuiSelect
                          labelId="add-unit-area-label"
                          label="Select Area"
                          value={newUnit.area}
                          onChange={(e) => {
                            const value = e.target.value;
                            const updatedNewUnit = { ...newUnit, area: value, floor: '' };
                            setNewUnit(updatedNewUnit);
                            if (updatedNewUnit.building) {
                              dispatch(fetchFloors({
                                buildingId: parseInt(updatedNewUnit.building),
                                wingId: updatedNewUnit.wing ? parseInt(updatedNewUnit.wing) : undefined,
                                areaId: value ? parseInt(value) : undefined
                              }));
                            }
                          }}
                          disabled={!newUnit.building}
                          sx={fieldStyles}
                          MenuProps={selectMenuProps}
                        >
                          <MenuItem value=""><em>Select Area</em></MenuItem>
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
                        <InputLabel id="add-unit-floor-label">Select Floor</InputLabel>
                        <MuiSelect
                          labelId="add-unit-floor-label"
                          label="Select Floor"
                          value={newUnit.floor}
                          onChange={(e) => setNewUnit(prev => ({ ...prev, floor: e.target.value }))}
                          disabled={!newUnit.building}
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
                      <TextField
                        id="unitName"
                        label="Unit Name"
                        variant="outlined"
                        fullWidth
                        value={newUnit.unitName}
                        onChange={(e) => setNewUnit(prev => ({ ...prev, unitName: e.target.value }))}
                        placeholder="Enter Unit Name"
                        sx={fieldStyles}
                      />
                    </div>

                    {/* <div className="space-y-2">
                    <Label htmlFor="areaSize">Area (Sq.Mtr)</Label>
                    <Input
                      id="areaSize"
                      value={newUnit.areaSize}
                      onChange={(e) => setNewUnit(prev => ({ ...prev, areaSize: e.target.value }))}
                      placeholder="Enter Area"
                    />
                  </div> */}
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setNewUnit({ building: '', wing: '', area: '', floor: '', unitName: '', areaSize: '' });
                      }}
                      className="border-brand"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddUnit} className="bg-[#C72030] hover:bg-[#B01E2E] text-white">
                      Submit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Table */}
          <div className="w-full min-w-0 max-w-full">
            <EnhancedTable
              data={filteredUnits}
              columns={[
                { key: 'status', label: 'Active/Inactive', sortable: false, hideable: true, draggable: true, defaultVisible: true },
                { key: 'building', label: 'Building', sortable: true, hideable: true, draggable: true, defaultVisible: true },
                { key: 'wing', label: 'Wing', sortable: true, hideable: true, draggable: true, defaultVisible: true },
                { key: 'area', label: 'Area', sortable: true, hideable: true, draggable: true, defaultVisible: true },
                { key: 'floor', label: 'Floor', sortable: true, hideable: true, draggable: true, defaultVisible: true },
                { key: 'unit_name', label: 'Unit', sortable: true, hideable: true, draggable: true, defaultVisible: true },
              ] as ColumnConfig[]}
              renderCell={(unit: any, columnKey: string) => {
                switch (columnKey) {
                  case 'status':
                    return (
                      <Switch
                        checked={unit.active}
                        onCheckedChange={() => toggleActiveStatus(unit.id)}
                        className="data-[state=checked]:bg-brand"
                      />
                    );
                  case 'building':
                    return unit.building?.name || 'N/A';
                  case 'wing':
                    return unit.wing?.name || 'N/A';
                  case 'area':
                    return unit.area_obj?.name || 'N/A';
                  case 'floor':
                    return unit.floor?.name || 'N/A';
                  case 'unit_name':
                    return <span className="font-medium text-gray-900">{unit.unit_name}</span>;
                  default:
                    return unit[columnKey] ?? '--';
                }
              }}
              renderActions={(unit: any) =>
                shouldShow("Unit", "update") ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditUnit(unit)}
                    className="h-8 w-8 p-0 text-black hover:bg-gray-100"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                ) : null
              }
              storageKey="units-table"
              enableSearch
              searchTerm={searchTerm}
              onSearchChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
              disableClientSearch
              searchPlaceholder="Search units..."
              hideTableExport
              loading={units.loading}
              emptyMessage={
                units.error
                  ? `Error: ${units.error}`
                  : units.data.length === 0
                    ? 'No units available'
                    : 'No units match your search'
              }
              pagination
              pageSize={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {/* Edit Details Dialog */}
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
              <DialogTitle>Edit Details</DialogTitle>
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
                  <InputLabel id="edit-unit-building-label">Select Building</InputLabel>
                  <MuiSelect
                    labelId="edit-unit-building-label"
                    label="Select Building"
                    value={editUnit.building}
                    onChange={(e) => {
                      const value = e.target.value;
                      const updatedEditUnit = { ...editUnit, building: value, wing: '', area: '', floor: '' };
                      setEditUnit(updatedEditUnit);
                      if (value) {
                        dispatch(fetchWings(parseInt(value)));
                        dispatch(fetchAreas({ buildingId: parseInt(value), wingId: undefined }));
                        dispatch(fetchFloors({ buildingId: parseInt(value), wingId: undefined, areaId: undefined }));
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
                  <InputLabel id="edit-unit-wing-label">Select Wing</InputLabel>
                  <MuiSelect
                    labelId="edit-unit-wing-label"
                    label="Select Wing"
                    value={editUnit.wing}
                    onChange={(e) => {
                      const value = e.target.value;
                      const updatedEditUnit = { ...editUnit, wing: value, area: '', floor: '' };
                      setEditUnit(updatedEditUnit);
                      if (updatedEditUnit.building) {
                        dispatch(fetchAreas({ buildingId: parseInt(updatedEditUnit.building), wingId: value ? parseInt(value) : undefined }));
                        dispatch(fetchFloors({
                          buildingId: parseInt(updatedEditUnit.building),
                          wingId: value ? parseInt(value) : undefined,
                          areaId: undefined
                        }));
                      }
                    }}
                    disabled={!editUnit.building}
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
                  <InputLabel id="edit-unit-area-label">Select Area</InputLabel>
                  <MuiSelect
                    labelId="edit-unit-area-label"
                    label="Select Area"
                    value={editUnit.area}
                    onChange={(e) => {
                      const value = e.target.value;
                      const updatedEditUnit = { ...editUnit, area: value, floor: '' };
                      setEditUnit(updatedEditUnit);
                      if (updatedEditUnit.building) {
                        dispatch(fetchFloors({
                          buildingId: parseInt(updatedEditUnit.building),
                          wingId: updatedEditUnit.wing ? parseInt(updatedEditUnit.wing) : undefined,
                          areaId: value ? parseInt(value) : undefined
                        }));
                      }
                    }}
                    disabled={!editUnit.building}
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value=""><em>Select Area</em></MenuItem>
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
                  <InputLabel id="edit-unit-floor-label">Select Floor</InputLabel>
                  <MuiSelect
                    labelId="edit-unit-floor-label"
                    label="Select Floor"
                    value={editUnit.floor}
                    onChange={(e) => setEditUnit(prev => ({ ...prev, floor: e.target.value }))}
                    disabled={!editUnit.building}
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
                <TextField
                  id="editUnitName"
                  label="Unit Name"
                  variant="outlined"
                  fullWidth
                  value={editUnit.unitName}
                  onChange={(e) => setEditUnit(prev => ({ ...prev, unitName: e.target.value }))}
                  placeholder="Enter Unit Name"
                  sx={fieldStyles}
                />
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="editAreaSize">Area (Sq.Mtr)</Label>
                <Input
                  id="editAreaSize"
                  value={editUnit.areaSize}
                  onChange={(e) => setEditUnit(prev => ({ ...prev, areaSize: e.target.value }))}
                  placeholder="Enter Area"
                />
              </div> */}

              <div className="space-y-2 col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="editActive"
                    checked={editUnit.active}
                    onCheckedChange={(checked) => setEditUnit(prev => ({ ...prev, active: checked as boolean }))}
                  />
                  <label htmlFor="editActive" className="text-sm font-medium">
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleUpdateUnit}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                disabled={!editUnit.unitName.trim() || !editUnit.building}
              >
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
