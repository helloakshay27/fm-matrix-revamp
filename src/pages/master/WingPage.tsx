import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Plus, X, Edit, Check, ChevronLeft, ChevronRight, Download, Upload, Loader2, QrCode } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import {
  fetchBuildings,
  fetchWings,
  createWing,
  updateWing
} from '@/store/slices/locationSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { wingSchema, type WingFormData } from '@/schemas/wingSchema';
import { toast } from 'sonner';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

export function WingPage() {
  const dispatch = useAppDispatch();
  const { buildings, wings } = useAppSelector((state) => state.location);
  const { shouldShow } = useDynamicPermissions();

  const [search, setSearch] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingWing, setEditingWing] = useState<any>(null);
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState<string>('all');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<string>('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const createForm = useForm<WingFormData>({
    resolver: zodResolver(wingSchema),
    defaultValues: {
      name: '',
      building_id: '',
      active: true,
    },
  });

  const editForm = useForm<WingFormData>({
    resolver: zodResolver(wingSchema),
    defaultValues: {
      name: '',
      building_id: '',
      active: true,
    },
  });

  useEffect(() => {
    dispatch(fetchBuildings());
    dispatch(fetchWings(undefined));
  }, [dispatch]);

  // Reset pagination when wings data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [wings.data.length]);

  const filteredWings = useMemo(() => {
    return wings.data.filter((wing) => {
      const matchesSearch = wing.name.toLowerCase().includes(search.toLowerCase()) ||
        wing.building?.name?.toLowerCase().includes(search.toLowerCase());
      const matchesBuilding = selectedBuildingFilter === 'all' || wing.building_id === selectedBuildingFilter;
      return matchesSearch && matchesBuilding;
    });
  }, [wings.data, search, selectedBuildingFilter]);

  // Pagination calculations
  const totalItems = filteredWings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWings = filteredWings.slice(startIndex, endIndex);

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      let baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
      baseUrl = baseUrl.replace(/^https?:\/\//, '');
      const templateUrl = `https://${baseUrl}/wing.xlsx`;

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
      a.download = 'wing.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Template downloaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to download template');
    }
  };

  const handleImportWings = async () => {
    if (!importFile) return;

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('pms_wing[file]', importFile);

      const token = localStorage.getItem('token') || '';
      let baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
      baseUrl = baseUrl.replace(/^https?:\/\//, '');
      const apiUrl = `https://${baseUrl}/pms/account_setups/wing_import.json?token=${token}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to import wings');
      }

      toast.success('Wings imported successfully');
      setShowImportDialog(false);
      setImportFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      dispatch(fetchWings(undefined));
    } catch (error: any) {
      toast.error(error.message || 'Failed to import wings');
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

  const handleCreateWing = async (data: WingFormData) => {
    try {
      await dispatch(createWing({
        name: data.name,
        building_id: parseInt(data.building_id)
      })).unwrap();
      toast.success('Wing created successfully');
      setShowCreateDialog(false);
      createForm.reset();
      dispatch(fetchWings(undefined));
    } catch (error: any) {
      toast.error(error.message || 'Failed to create wing');
    }
  };

  const handleEditWing = async (data: WingFormData) => {
    if (!editingWing) return;

    try {
      await dispatch(updateWing({
        id: editingWing.id,
        updates: {
          name: data.name,
          building_id: data.building_id,
          active: data.active
        }
      })).unwrap();
      toast.success('Wing updated successfully');
      setShowEditDialog(false);
      setEditingWing(null);
      editForm.reset();
      dispatch(fetchWings(undefined));
    } catch (error: any) {
      toast.error(error.message || 'Failed to update wing');
    }
  };

  const handleToggleStatus = async (wingId: number, currentStatus: boolean) => {
    try {
      const wing = wings.data.find(w => w.id === wingId);
      if (!wing) return;

      await dispatch(updateWing({
        id: wingId,
        updates: {
          name: wing.name,
          building_id: wing.building_id,
          active: !currentStatus
        }
      })).unwrap();
      toast.success(`Wing ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      dispatch(fetchWings(undefined));
    } catch (error: any) {
      toast.error(error.message || 'Failed to update wing status');
    }
  };

  const openEditDialog = (wing: any) => {
    setEditingWing(wing);
    editForm.setValue('name', wing.name);
    editForm.setValue('building_id', wing.building_id);
    editForm.setValue('active', wing.active);
    setShowEditDialog(true);
  };

  const resetCreateForm = () => {
    createForm.reset();
    setShowCreateDialog(false);
  };

  const resetEditForm = () => {
    editForm.reset();
    setShowEditDialog(false);
    setEditingWing(null);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">WINGS</h1>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                className="h-9 px-4 text-sm font-medium whitespace-nowrap rounded-lg border border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 [&_svg]:text-[#C72030]"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Sample Format
              </Button>

              <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 px-4 text-sm font-medium whitespace-nowrap rounded-lg border border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 [&_svg]:text-[#C72030]"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Wings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Import Wings</DialogTitle>
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
                        onClick={handleImportWings}
                        disabled={!importFile || isImporting}
                      >
                        {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Import
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                {shouldShow("Wing", "create") && (
                  <DialogTrigger asChild>
                    <Button className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap rounded-lg [&_svg]:text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Wing
                    </Button>
                  </DialogTrigger>
                )}
                <DialogContent className="max-w-2xl">
                  <DialogHeader className="flex flex-row items-center justify-between pb-0">
                    <DialogTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Add Wing
                    </DialogTitle>
                    <button
                      onClick={() => setShowCreateDialog(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </DialogHeader>
                  <Form {...createForm}>
                    <form onSubmit={createForm.handleSubmit(handleCreateWing)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <FormField
                          control={createForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Wing Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter wing name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createForm.control}
                          name="building_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Building</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Building" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {buildings.data.map((building) => (
                                    <SelectItem key={building.id} value={building.id.toString()}>
                                      {building.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetCreateForm}
                          className="border-gray-300"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={createForm.formState.isSubmitting}
                          className="bg-[#C72030] hover:bg-[#B01E2E] text-white"
                        >
                          Submit
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search Controls */}
          <div className="mb-4">
            <div className="text-sm text-muted-foreground">
              Total: {totalItems} wings
            </div>
          </div>

          {/* Table */}
          <div className="w-full min-w-0 max-w-full">
            <EnhancedTable
              data={filteredWings}
              columns={[
                {
                  key: 'building',
                  label: 'Building',
                  sortable: true,
                  hideable: true,
                  draggable: true,
                  defaultVisible: true,
                },
                {
                  key: 'name',
                  label: 'Wing Name',
                  sortable: true,
                  hideable: true,
                  draggable: true,
                  defaultVisible: true,
                },
                {
                  key: 'qr_code',
                  label: 'QR Code',
                  sortable: false,
                  hideable: true,
                  draggable: true,
                  defaultVisible: true,
                },
                {
                  key: 'status',
                  label: 'Status',
                  sortable: false,
                  hideable: true,
                  draggable: true,
                  defaultVisible: true,
                },
              ] as ColumnConfig[]}
              renderCell={(wing: any, columnKey: string) => {
                switch (columnKey) {
                  case 'building':
                    return wing.building?.name || 'N/A';
                  case 'name':
                    return <span className="font-medium text-gray-900">{wing.name}</span>;
                  case 'qr_code':
                    return wing.qr_code_url ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedQrCode(wing.qr_code_url);
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
                        checked={wing.active}
                        onCheckedChange={() => handleToggleStatus(wing.id, wing.active)}
                        className="data-[state=checked]:bg-[#C72030]"
                      />
                    );
                  default:
                    return wing[columnKey] ?? '--';
                }
              }}
              renderActions={(wing: any) =>
                shouldShow('Wing', 'update') ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(wing)}
                    className="h-8 w-8 p-0 text-black hover:bg-gray-100"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                ) : null
              }
              storageKey="wings-table"
              enableSearch
              searchTerm={search}
              onSearchChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
              disableClientSearch
              searchPlaceholder="Search wings..."
              hideTableExport
              loading={wings.loading}
              emptyMessage={
                wings.data.length === 0
                  ? 'No wings available'
                  : 'No wings match your search'
              }
              pagination
              pageSize={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Edit Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader className="flex flex-row items-center justify-between pb-0">
                <DialogTitle>Edit Wing Details</DialogTitle>
                <button
                  onClick={() => setShowEditDialog(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogHeader>
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(handleEditWing)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <FormField
                      control={editForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wing Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter wing name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
                      name="building_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Building</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Building" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white z-50">
                              {buildings.data.map((building) => (
                                <SelectItem key={building.id} value={building.id.toString()}>
                                  {building.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="col-span-2">
                      <FormField
                        control={editForm.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-medium">
                              Active Status
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={editForm.formState.isSubmitting}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                    >
                      Submit
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
                <DialogTitle>Wing QR Code</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4 py-4">
                {selectedQrCode ? (
                  <>
                    <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                      <img
                        src={selectedQrCode}
                        alt="Wing QR Code"
                        className="w-64 h-64 object-contain"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = selectedQrCode;
                        link.download = `wing-qr-code-${Date.now()}.png`;
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
