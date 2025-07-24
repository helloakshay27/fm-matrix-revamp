
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Plus, Search, Edit, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchBuildings, fetchWings, createWing, updateWing } from '@/store/slices/locationSlice';
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
    return wings.data.filter((wing) => {
      const matchesSearch = wing.name.toLowerCase().includes(search.toLowerCase()) ||
                           wing.building?.name?.toLowerCase().includes(search.toLowerCase());
      const matchesBuilding = selectedBuildingFilter === 'all' || wing.building_id === selectedBuildingFilter;
      return matchesSearch && matchesBuilding;
    });
  }, [wings.data, search, selectedBuildingFilter]);

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
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Wings</h1>
          <p className="text-muted-foreground">Manage building wings</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
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
                    {createForm.formState.isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Wing
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search wings or buildings..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedBuildingFilter} onValueChange={setSelectedBuildingFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by building" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buildings</SelectItem>
                {buildings.data.map((building) => (
                  <SelectItem key={building.id} value={building.id.toString()}>
                    {building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Wings Table */}
      <Card>
        <CardContent className="p-0">
          {wings.loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading wings...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wing Name</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      {search || selectedBuildingFilter ? (
                        <div className="text-muted-foreground">
                          No wings found matching your filters.
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          No wings found. Create your first wing to get started.
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWings.map((wing) => (
                    <TableRow key={wing.id}>
                      <TableCell className="font-medium">{wing.name}</TableCell>
                      <TableCell>{wing.building?.name || 'N/A'}</TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={wing.active}
                          onCheckedChange={() => handleToggleStatus(wing.id, wing.active)}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                          aria-label={`Toggle ${wing.name} status`}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(wing)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
                      <div className="text-sm text-muted-foreground">
                        Enable or disable this wing
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
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
                  {editForm.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Wing
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
