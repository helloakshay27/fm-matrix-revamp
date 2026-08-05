import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight, Check, X, Download, Upload, Loader2, QrCode } from "lucide-react";
import { toast } from "sonner";
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { FormControl as MuiFormControl, InputLabel, Select as MuiSelect, MenuItem, TextField } from '@mui/material';
import { apiClient } from "@/utils/apiClient";
import { AddAreaDialog } from '@/components/AddAreaDialog';
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

export const AreaPage = () => {
  const { shouldShow } = useDynamicPermissions();
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<any | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<string>('');
  const [name, setName] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [wingId, setWingId] = useState('');
  const [active, setActive] = useState(true);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [wings, setWings] = useState<any[]>([]);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImportingFile, setIsImportingFile] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchAreas = async () => {
    try {
      const response = await apiClient.get('/pms/areas.json');
      setAreas(response.data.areas || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
      toast.error('Failed to fetch areas');
    } finally {
      setLoading(false);
    }
  };

  const fetchBuildings = async () => {
    try {
      const response = await apiClient.get('/buildings.json?order=name');
      setBuildings(response.data);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      toast.error('Failed to fetch buildings');
    }
  };

  const fetchWings = async (buildingId?: number) => {
    try {
      let url = '/pms/wings.json';
      if (buildingId) {
        url += `?building_id=${buildingId}`;
      }
      const response = await apiClient.get(url);
      setWings(response.data.wings || []);
    } catch (error) {
      console.error('Error fetching wings:', error);
      toast.error('Failed to fetch wings');
    }
  };

  useEffect(() => {
    fetchAreas();
    fetchBuildings();
    fetchWings();
  }, []);

  // Reset pagination when areas data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [areas.length]);

  // Filter areas based on search term
  const filteredAreas = areas.filter(area => {
    const searchLower = searchTerm.toLowerCase();
    return (
      area.name?.toLowerCase().includes(searchLower) ||
      area.building?.name?.toLowerCase().includes(searchLower) ||
      area.wing?.name?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination calculations
  const totalItems = filteredAreas.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAreas = filteredAreas.slice(startIndex, endIndex);

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

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      let baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
      baseUrl = baseUrl.replace(/^https?:\/\//, '');
      const templateUrl = `https://${baseUrl}/area.xlsx`;

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
      a.download = 'area.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Template downloaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to download template');
    }
  };

  const handleImportAreas = async () => {
    if (!importFile) return;

    setIsImportingFile(true);
    try {
      const formData = new FormData();
      formData.append('pms_area[file]', importFile);

      const token = localStorage.getItem('token') || '';
      let baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
      baseUrl = baseUrl.replace(/^https?:\/\//, '');
      const apiUrl = `https://${baseUrl}/pms/account_setups/area_import.json?token=${token}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to import areas');
      }

      toast.success('Areas imported successfully');
      setShowImportDialog(false);
      setImportFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchAreas();
    } catch (error: any) {
      toast.error(error.message || 'Failed to import areas');
    } finally {
      setIsImportingFile(false);
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

  const handleEdit = (area: any) => {
    setSelectedArea(area);
    setName(area.name);
    setBuildingId(area.building_id?.toString() || '');
    setWingId(area.wing_id?.toString() || '');
    setActive(area.active);

    // Load wings for the selected building immediately when editing starts
    if (area.building_id) {
      fetchWings(area.building_id);
    }

    setIsEditModalOpen(true);
  };

  const handleUpdateArea = async () => {
    if (!selectedArea) return;

    try {
      const response = await apiClient.put(`/pms/areas/${selectedArea.id}.json`, {
        pms_area: {
          name,
          building_id: buildingId,
          wing_id: wingId,
          active,
        },
      });

      if (response.status === 200) {
        toast.success('Area updated successfully');
        setIsEditModalOpen(false);
        fetchAreas();
      } else {
        toast.error('Failed to update area');
      }
    } catch (error) {
      console.error('Error updating area:', error);
      toast.error('Failed to update area');
    }
  };

  const handleDeleteArea = async (id: string) => {
    try {
      const response = await apiClient.delete(`/pms/areas/${id}.json`);

      if (response.status === 200) {
        toast.success('Area deleted successfully');
        fetchAreas();
      } else {
        toast.error('Failed to delete area');
      }
    } catch (error) {
      console.error('Error deleting area:', error);
      toast.error('Failed to delete area');
    }
  };

  const handleToggleStatus = async (area: any) => {
    try {
      const response = await apiClient.put(`/pms/areas/${area.id}.json`, {
        pms_area: {
          ...area,
          active: !area.active,
        },
      });

      if (response.status === 200) {
        toast.success(`Area ${!area.active ? 'activated' : 'deactivated'} successfully`);
        fetchAreas();
      } else {
        toast.error('Failed to update area status');
      }
    } catch (error) {
      console.error('Error updating area status:', error);
      toast.error('Failed to update area status');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">AREA</h1>

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
                  <Button variant="outline" className="h-9 px-4 text-sm font-medium whitespace-nowrap border border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 [&_svg]:text-[#C72030]">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Areas
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Import Areas</DialogTitle>
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
                        onClick={handleImportAreas}
                        disabled={!importFile || isImportingFile}
                        className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 [&_svg]:text-white"
                      >
                        {isImportingFile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Import
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {shouldShow("Area", "create") && (
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap [&_svg]:text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Area
                </Button>
              )}
            </div>
          </div>

          {/* Search Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Total: {totalItems} areas
            </div>
          </div>

          {/* Table */}
          <div className="w-full min-w-0 max-w-full">
            <EnhancedTable
              data={filteredAreas}
              columns={[
                { key: 'name', label: 'Name', sortable: true, hideable: true, draggable: true, defaultVisible: true },
                { key: 'building', label: 'Building', sortable: true, hideable: true, draggable: true, defaultVisible: true },
                { key: 'wing', label: 'Wing', sortable: true, hideable: true, draggable: true, defaultVisible: true },
                { key: 'qr_code', label: 'QR Code', sortable: false, hideable: true, draggable: true, defaultVisible: true },
                { key: 'status', label: 'Status', sortable: false, hideable: true, draggable: true, defaultVisible: true },
              ] as ColumnConfig[]}
              renderCell={(area: any, columnKey: string) => {
                switch (columnKey) {
                  case 'name':
                    return <span className="font-medium text-gray-900">{area.name}</span>;
                  case 'building':
                    return area.building?.name || 'N/A';
                  case 'wing':
                    return area.wing?.name || 'N/A';
                  case 'qr_code':
                    return area.qr_code_url ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedQrCode(area.qr_code_url);
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
                        checked={area.active}
                        onCheckedChange={() => handleToggleStatus(area)}
                        className="data-[state=checked]:bg-brand"
                      />
                    );
                  default:
                    return area[columnKey] ?? '--';
                }
              }}
              renderActions={(area: any) =>
                shouldShow("Area", "update") ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(area)}
                    className="h-8 w-8 p-0 text-black hover:bg-gray-100"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                ) : null
              }
              storageKey="areas-table"
              enableSearch
              searchTerm={searchTerm}
              onSearchChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
              disableClientSearch
              searchPlaceholder="Search areas..."
              hideTableExport
              loading={loading}
              emptyMessage={
                areas.length === 0
                  ? 'No areas available'
                  : 'No areas match your search'
              }
              pagination
              pageSize={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>



        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen} modal={false}>
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
              <DialogTitle>Edit Area Details</DialogTitle>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <TextField
                  label="Area Name"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter Area Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={fieldStyles}
                />
              </div>

              <div className="space-y-2">
                <MuiFormControl fullWidth variant="outlined">
                  <InputLabel id="edit-area-building-label">Select Building</InputLabel>
                  <MuiSelect
                    labelId="edit-area-building-label"
                    label="Select Building"
                    value={buildingId}
                    onChange={(e) => {
                      setBuildingId(e.target.value);
                      setWingId(''); // Reset wing when building changes
                      if (e.target.value) {
                        fetchWings(parseInt(e.target.value)); // Fetch wings for selected building
                      }
                    }}
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value=""><em>Select Building</em></MenuItem>
                    {buildings.map((building) => (
                      <MenuItem key={building.id} value={building.id.toString()}>
                        {building.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </MuiFormControl>
              </div>

              <div className="space-y-2">
                <MuiFormControl fullWidth variant="outlined">
                  <InputLabel id="edit-area-wing-label">Select Wing</InputLabel>
                  <MuiSelect
                    labelId="edit-area-wing-label"
                    label="Select Wing"
                    value={wingId}
                    onChange={(e) => setWingId(e.target.value)}
                    disabled={!buildingId}
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value=""><em>Select Wing</em></MenuItem>
                    {wings.map((wing) => (
                      <MenuItem key={wing.id} value={wing.id.toString()}>
                        {wing.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </MuiFormControl>
              </div>

              <div className="space-y-2">
                <span className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Status
                </span>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={active}
                    onCheckedChange={setActive}
                    className="data-[state=checked]:bg-brand"
                  />
                  <span className="text-sm">{active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleUpdateArea}
                variant="ghost"
                className="fm-button-fix fm-button-brand px-8"
                disabled={!name.trim() || !buildingId}
              >
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Area Dialog */}
        <AddAreaDialog
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onAreaAdded={fetchAreas}
        />

        {/* QR Code Modal */}
        <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Area QR Code</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4 py-4">
              {selectedQrCode ? (
                <>
                  <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                    <img
                      src={selectedQrCode}
                      alt="Area QR Code"
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = selectedQrCode;
                      link.download = `area-qr-code-${Date.now()}.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      toast.success('QR Code downloaded successfully');
                    }}
                    className="fm-button-fix fm-button-brand"
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
  );
};
