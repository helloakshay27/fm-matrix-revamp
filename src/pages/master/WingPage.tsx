import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Search, Edit, Upload, FileText } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchBuildings, fetchWings, createWing, updateWing } from '@/store/slices/locationSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { wingSchema, type WingFormData } from '@/schemas/wingSchema';
import { toast } from 'sonner';
import { Heading } from '@/components/ui/heading';

export function WingPage() {
  const dispatch = useAppDispatch();
  const { buildings, wings } = useAppSelector((state) => state.location);
  
  const [search, setSearch] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingWing, setEditingWing] = useState<any>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [entriesPerPage, setEntriesPerPage] = useState<string>('10');

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

  const filteredWings = useMemo(() => {
    if (!selectedBuilding) return [];
    
    return wings.data.filter((wing) => {
      const matchesSearch = wing.name.toLowerCase().includes(search.toLowerCase());
      const matchesBuilding = wing.building_id.toString() === selectedBuilding;
      return matchesSearch && matchesBuilding;
    });
  }, [wings.data, search, selectedBuilding]);

  const handleCreateWing = async (data: WingFormData) => {
    try {
      await dispatch(createWing({
        name: data.name,
        building_id: parseInt(selectedBuilding)
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
    editForm.setValue('building_id', wing.building_id.toString());
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

  const selectedBuildingName = buildings.data.find(b => b.id === parseInt(selectedBuilding))?.name || '';

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        Account &gt; Wing
      </div>

      {/* Header */}
      <div>
        <Heading level="h1" variant="primary" spacing="none">
          WING
        </Heading>
      </div>

      {/* Building Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Select Building <span className="text-red-500">*</span>
        </label>
        <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
          <SelectTrigger className="w-64">
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

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setShowCreateDialog(true)}
            disabled={!selectedBuilding}
            className="bg-[#C72030] hover:bg-[#B01E2E] text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Wing
          </Button>
          
          <Button variant="outline" disabled={!selectedBuilding}>
            <FileText className="mr-2 h-4 w-4" />
            Sample Format
          </Button>
          
          <Button variant="outline" disabled={!selectedBuilding}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Show</span>
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
            <span className="text-sm font-medium">entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Search:</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search wings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64"
                disabled={!selectedBuilding}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Wings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {wings.loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading wings...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Actions</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Wing</TableHead>
                <TableHead className="w-24">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!selectedBuilding ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    Please select a building to view wings.
                  </TableCell>
                </TableRow>
              ) : filteredWings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    {search ? 'No wings found matching your search.' : 'No wings found for this building.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredWings.map((wing) => (
                  <TableRow key={wing.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(wing.id, wing.active)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                            wing.active 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : 'bg-gray-400 hover:bg-gray-500'
                          }`}
                          title={wing.active ? 'Deactivate' : 'Activate'}
                        >
                          {wing.active ? '✓' : '✗'}
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(wing)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{wing.building?.name || selectedBuildingName}</TableCell>
                    <TableCell className="font-medium">{wing.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        wing.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {wing.active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ADD WING</DialogTitle>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateWing)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <FormLabel>Building</FormLabel>
                  <Input 
                    value={selectedBuildingName} 
                    disabled 
                    className="bg-gray-50"
                  />
                </div>
                
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Wing Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter wing name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetCreateForm}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createForm.formState.isSubmitting}
                  className="bg-[#C72030] hover:bg-[#B01E2E] text-white"
                >
                  {createForm.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>EDIT WING</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditWing)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="building_id"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Building <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select building" />
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
                
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Wing Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter wing name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetEditForm}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={editForm.formState.isSubmitting}
                  className="bg-[#C72030] hover:bg-[#B01E2E] text-white"
                >
                  {editForm.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}