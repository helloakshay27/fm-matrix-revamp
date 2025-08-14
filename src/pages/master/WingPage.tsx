import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, X, Edit, Check, ChevronLeft, ChevronRight } from 'lucide-react';
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

export function WingPage() {
  const dispatch = useAppDispatch();
  const { buildings, wings } = useAppSelector((state) => state.location);
  
  const [search, setSearch] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingWing, setEditingWing] = useState<any>(null);
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState<string>('all');
  
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
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#C72030] hover:bg-[#B01E2E] text-white flex items-center gap-2">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Wing
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Wing</DialogTitle>
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
                  <form onSubmit={createForm.handleSubmit(handleCreateWing)} className="space-y-4">
                    <FormField
                      control={createForm.control}
                      name="building_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Building</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a building" />
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
                    
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={resetCreateForm}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createForm.formState.isSubmitting}>
                        Create Wing
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-end mb-4">
        
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Search:</span>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
                placeholder="Search wings or buildings..."
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
                  <TableHead>Wing Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wings.loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      Loading wings...
                    </TableCell>
                  </TableRow>
                ) : filteredWings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      {wings.data.length === 0 ? 'No wings available' : 'No wings match your search'}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentWings.map((wing) => (
                    <TableRow key={wing.id}>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(wing)}>
                          <Edit className="w-4 h-4 text-[#C72030]" />
                        </Button>
                      </TableCell>
                      <TableCell>{wing.building?.name || 'N/A'}</TableCell>
                      <TableCell>{wing.name}</TableCell>
                      <TableCell>
                        <button onClick={() => handleToggleStatus(wing.id, wing.active)} className="cursor-pointer">
                          {wing.active ? (
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
          {wings.data.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} wings
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

          {/* Edit Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Wing</DialogTitle>
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
                <form onSubmit={editForm.handleSubmit(handleEditWing)} className="space-y-4">
                  <FormField
                    control={editForm.control}
                    name="building_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Building</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a building" />
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
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Status</FormLabel>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={resetEditForm}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={editForm.formState.isSubmitting}>
                      Update Wing
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
