import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import type { Building } from '@/store/slices/locationSlice';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl as MuiFormControl, InputLabel, Select as MuiSelect, MenuItem, TextField } from '@mui/material';
import { Loader2, Plus, Edit, X, Check, Download, Upload, QrCode } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchSites, fetchBuildings, createBuilding, updateBuilding } from '@/store/slices/locationSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildingSchema, type BuildingFormData } from '@/schemas/buildingSchema';
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

export function BuildingPage() {
  const dispatch = useAppDispatch();
  const { sites, buildings } = useAppSelector((state) => state.location);
  const { shouldShow } = useDynamicPermissions();

  const [search, setSearch] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<any>(null);
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string>('all');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<string>('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  console.log(sites)

  const createForm = useForm<BuildingFormData>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      name: '',
      site_id: '',
      other_detail: '',
      has_wing: false,
      has_floor: false,
      has_area: false,
      has_room: false,
      active: true,
    },
  });

  const editForm = useForm<BuildingFormData>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      name: '',
      site_id: '',
      other_detail: '',
      has_wing: false,
      has_floor: false,
      has_area: false,
      has_room: false,
      active: true,
    },
  });

  useEffect(() => {
    dispatch(fetchSites());
    dispatch(fetchBuildings());
  }, [dispatch]);

  // Reset pagination when buildings data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [buildings.data?.length]);

  const filteredBuildings = useMemo(() => {
    if (!buildings.data || !Array.isArray(buildings.data)) return [];
    return buildings.data.filter((building) => {
      const matchesSearch = building.name.toLowerCase().includes(search.toLowerCase()) ||
        building.site_id.toLowerCase().includes(search.toLowerCase());
      const matchesSite = selectedSiteFilter === 'all' || building.site_id === selectedSiteFilter;
      return matchesSearch && matchesSite;
    });
  }, [buildings.data, search, selectedSiteFilter]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCreateBuilding = async (data: BuildingFormData) => {
    try {
      const buildingData = {
        ...data,
        site_id: data.site_id,
      };

      await dispatch(createBuilding(buildingData)).unwrap();
      toast.success('Building created successfully');
      setShowCreateDialog(false);
      createForm.reset();
      dispatch(fetchBuildings());
    } catch (error: any) {
      toast.error(error.message || 'Failed to create building');
    }
  };

  const handleEditBuilding = async (data: BuildingFormData) => {
    if (!editingBuilding) return;

    try {
      const updates = {
        ...data,
        site_id: data.site_id,
      };

      await dispatch(updateBuilding({
        id: editingBuilding.id,
        updates
      })).unwrap();
      toast.success('Building updated successfully');
      setShowEditDialog(false);
      setEditingBuilding(null);
      editForm.reset();
      dispatch(fetchBuildings());
    } catch (error: any) {
      toast.error(error.message || 'Failed to update building');
    }
  };

  const handleToggleStatus = async (buildingId: number, field: 'active' | 'has_wing' | 'has_floor' | 'has_area' | 'has_room') => {
    try {
      const building = buildings.data.find(b => b.id === buildingId);
      if (!building) return;

      const updates = {
        [field]: !building[field]
      };

      await dispatch(updateBuilding({ id: buildingId, updates })).unwrap();
      toast.success(`Building ${field.replace('_', ' ')} updated successfully`);
      dispatch(fetchBuildings());
    } catch (error: any) {
      toast.error(error.message || 'Failed to update building');
    }
  };

  const openEditDialog = (building: any) => {
    setEditingBuilding(building);
    editForm.setValue('name', building.name);
    editForm.setValue('site_id', building.site_id.toString());
    editForm.setValue('other_detail', building.other_detail || '');
    editForm.setValue('has_wing', building.has_wing);
    editForm.setValue('has_floor', building.has_floor);
    editForm.setValue('has_area', building.has_area);
    editForm.setValue('has_room', building.has_room);
    editForm.setValue('active', building.active);
    setShowEditDialog(true);
  };

  const resetCreateForm = () => {
    createForm.reset();
    setShowCreateDialog(false);
  };

  const resetEditForm = () => {
    editForm.reset();
    setShowEditDialog(false);
    setEditingBuilding(null);
  };

  const getSiteName = (siteId: string) => {
    if (!sites.data || !Array.isArray(sites.data)) return siteId;
    const site = sites.data.find(s => s.id.toString() === siteId);
    return site ? site.name : siteId;
  };

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      let baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
      baseUrl = baseUrl.replace(/^https?:\/\//, '');
      const templateUrl = `https://${baseUrl}/building.xlsx`;

      toast.info('Downloading template...');

      const response = await fetch(templateUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download template: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'building.xlsx';
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Template downloaded successfully');
    } catch (error: any) {
      console.error('Error downloading template:', error);
      toast.error(`Failed to download template: ${error.message}`);
    }
  };

  const handleImportBuildings = async () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('pms_building[file]', importFile);

      const token = localStorage.getItem('token') || '';
      let baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
      baseUrl = baseUrl.replace(/^https?:\/\//, '');
      const apiUrl = `https://${baseUrl}/pms/account_setups/building_import.json?token=${token}`;

      toast.info('Starting import...');

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Import failed: ${response.statusText}`);
      }

      const result = await response.json();
      toast.success(`Buildings imported successfully! ${result.imported_count || ''} records processed.`);
      setShowImportDialog(false);
      setImportFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      dispatch(fetchBuildings());
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(error.message || 'Failed to import buildings');
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];

      if (allowedTypes.includes(file.type)) {
        setImportFile(file);
      } else {
        toast.error('Please select a valid Excel or CSV file');
        event.target.value = '';
      }
    }
  };

  const columns: ColumnConfig[] = [
    { key: 'site', label: 'Site', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'name', label: 'Building Name', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'other_detail', label: 'Other Details', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'has_wing', label: 'Has Wing', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'has_area', label: 'Has Area', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'has_floor', label: 'Has Floor', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'has_room', label: 'Has Room', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'qr_code', label: 'QR Code', sortable: false, hideable: true, draggable: true, defaultVisible: true },
    { key: 'active', label: 'Status', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  ];

  type BuildingRow = Building & { qr_code_url?: string };

  const renderBooleanToggle = (
    building: BuildingRow,
    field: 'has_wing' | 'has_area' | 'has_floor' | 'has_room'
  ) => (
    <button
      type="button"
      onClick={() => handleToggleStatus(building.id, field)}
      className="cursor-pointer"
    >
      {building[field] ? (
        <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center hover:bg-green-600 transition-colors">
          <Check className="w-3 h-3 text-white" />
        </div>
      ) : (
        <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center hover:bg-red-600 transition-colors">
          <span className="text-white text-xs">✗</span>
        </div>
      )}
    </button>
  );

  const renderCell = (building: BuildingRow, columnKey: string) => {
    switch (columnKey) {
      case 'site':
        return getSiteName(building.site_id);
      case 'name':
        return <span className="font-medium text-gray-900">{building.name}</span>;
      case 'other_detail':
        return building.other_detail || '-';
      case 'has_wing':
        return renderBooleanToggle(building, 'has_wing');
      case 'has_area':
        return renderBooleanToggle(building, 'has_area');
      case 'has_floor':
        return renderBooleanToggle(building, 'has_floor');
      case 'has_room':
        return renderBooleanToggle(building, 'has_room');
      case 'qr_code':
        return building.qr_code_url ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedQrCode(building.qr_code_url!);
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
      case 'active':
        return (
          <Switch
            checked={building.active}
            onCheckedChange={() => handleToggleStatus(building.id, 'active')}
            className="data-[state=checked]:bg-[#C72030]"
          />
        );
      default:
        return null;
    }
  };

  const renderActions = (building: BuildingRow) =>
    shouldShow('Building', 'update') ? (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => openEditDialog(building)}
        className="h-8 w-8 p-0 text-black hover:bg-gray-100"
        title="Edit"
      >
        <Edit className="w-4 h-4" />
      </Button>
    ) : null;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">BUILDINGS</h1>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                  className="h-9 px-4 text-sm font-medium whitespace-nowrap border border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 [&_svg]:text-[#C72030]"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Sample Format
              </Button>

              <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                      className="h-9 px-4 text-sm font-medium whitespace-nowrap border border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 [&_svg]:text-[#C72030]"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Buildings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Import Buildings</DialogTitle>
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
                        onClick={handleImportBuildings}
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

              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog} modal={false}>
                {shouldShow("Building", "create") && (
                  <DialogTrigger asChild>
                    <Button className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap [&_svg]:text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Building
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
                  <DialogHeader>
                    <DialogTitle>Create New Building</DialogTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-4"
                      onClick={() => setShowCreateDialog(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogHeader>
                  <Form {...createForm}>
                    <form onSubmit={createForm.handleSubmit(handleCreateBuilding)} className="space-y-4">
                      <FormField
                        control={createForm.control}
                        name="site_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Site</FormLabel>
                            <MuiFormControl fullWidth variant="outlined">
                              <InputLabel id="create-site-label">Select Site *</InputLabel>
                              <MuiSelect
                                labelId="create-site-label"
                                label="Select Site *"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                sx={fieldStyles}
                                MenuProps={selectMenuProps}
                              >
                                <MenuItem value=""><em>Select site</em></MenuItem>
                                {sites?.data && Array.isArray(sites.data) && sites.data.map((site) => (
                                  <MenuItem key={site.id} value={site.id.toString()}>
                                    {site.name}
                                  </MenuItem>
                                ))}
                              </MuiSelect>
                            </MuiFormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Building Name</FormLabel>
                            <TextField
                              label="Building Name *"
                              variant="outlined"
                              fullWidth
                              placeholder="Enter building name"
                              value={field.value}
                              onChange={field.onChange}
                              sx={fieldStyles}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
                        name="other_detail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Other Details</FormLabel>
                            <TextField
                              label="Other Details"
                              variant="outlined"
                              fullWidth
                              placeholder="Enter additional details"
                              value={field.value}
                              onChange={field.onChange}
                              sx={fieldStyles}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Checkboxes in a row */}
                      <div className="grid grid-cols-4 gap-4">
                        <FormField
                          control={createForm.control}
                          name="has_wing"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Wing</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createForm.control}
                          name="has_area"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Area</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createForm.control}
                          name="has_floor"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Floor</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createForm.control}
                          name="has_room"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Room</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={resetCreateForm}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createForm.formState.isSubmitting} className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 [&_svg]:text-white">
                          {createForm.formState.isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Create Building
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="w-full min-w-0 max-w-full">
            <EnhancedTable
              data={filteredBuildings as BuildingRow[]}
              columns={columns}
              renderCell={renderCell}
              renderActions={renderActions}
              storageKey="buildings-table"
              enableSearch
              searchTerm={search}
              onSearchChange={handleSearchChange}
              disableClientSearch
              searchPlaceholder="Search buildings..."
              hideTableExport
              loading={buildings.loading}
              emptyMessage={
                buildings.data.length === 0
                  ? 'No buildings available'
                  : 'No buildings match your search'
              }
              pagination
              pageSize={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Edit Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog} modal={false}>
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
              <DialogHeader>
                <DialogTitle>Edit Building</DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4"
                  onClick={() => setShowEditDialog(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogHeader>
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(handleEditBuilding)} className="space-y-4">
                  <FormField
                    control={editForm.control}
                    name="site_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Site</FormLabel>
                        <MuiFormControl fullWidth variant="outlined">
                          <InputLabel id="edit-site-label">Select Site *</InputLabel>
                          <MuiSelect
                            labelId="edit-site-label"
                            label="Select Site *"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            sx={fieldStyles}
                            MenuProps={selectMenuProps}
                          >
                            <MenuItem value=""><em>Select site</em></MenuItem>
                            {sites.data && Array.isArray(sites.data) && sites.data.map((site) => (
                              <MenuItem key={site.id} value={site.id.toString()}>
                                {site.name}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </MuiFormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Building Name</FormLabel>
                        <TextField
                          label="Building Name *"
                          variant="outlined"
                          fullWidth
                          placeholder="Enter building name"
                          value={field.value}
                          onChange={field.onChange}
                          sx={fieldStyles}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="other_detail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Details</FormLabel>
                        <TextField
                          label="Other Details"
                          variant="outlined"
                          fullWidth
                          placeholder="Enter additional details"
                          value={field.value}
                          onChange={field.onChange}
                          sx={fieldStyles}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Checkboxes in a row */}
                  <div className="grid grid-cols-4 gap-4">
                    <FormField
                      control={editForm.control}
                      name="has_wing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Wing</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
                      name="has_area"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Area</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
                      name="has_floor"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Floor</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
                      name="has_room"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Room</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={editForm.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Status</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Enable or disable this building
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-[#C72030]"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={resetEditForm}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={editForm.formState.isSubmitting} className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 [&_svg]:text-white">
                      {editForm.formState.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Building
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* QR Code Modal */}
          <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Building QR Code</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4 py-4">
                {selectedQrCode ? (
                  <>
                    <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                      <img
                        src={selectedQrCode}
                        alt="Building QR Code"
                        className="w-64 h-64 object-contain"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = selectedQrCode;
                        link.download = `building-qr-code-${Date.now()}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        toast('QR Code downloaded successfully');
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