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
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Plus, Search, Edit, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchSites, fetchBuildings, createBuilding, updateBuilding } from '@/store/slices/locationSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildingSchema, type BuildingFormData } from '@/schemas/buildingSchema';
import { toast } from 'sonner';

export function BuildingPage() {
  const dispatch = useAppDispatch();
  const { sites, buildings } = useAppSelector((state) => state.location);

  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('25');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<any>(null);
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string>('all');

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
    // Get user ID from localStorage or auth context
    const userId = JSON.parse(localStorage.getItem('user')).id; // Default for demo
    dispatch(fetchSites(userId));
    dispatch(fetchBuildings());
  }, [dispatch]);

  const filteredBuildings = useMemo(() => {
    if (!buildings.data || !Array.isArray(buildings.data)) return [];
    return buildings.data.filter((building) => {
      const matchesSearch = building.name.toLowerCase().includes(search.toLowerCase()) ||
        building.site_id.toLowerCase().includes(search.toLowerCase());
      const matchesSite = selectedSiteFilter === 'all' || building.site_id === selectedSiteFilter;
      return matchesSearch && matchesSite;
    });
  }, [buildings.data, search, selectedSiteFilter]);

  const displayedBuildings = filteredBuildings.slice(0, parseInt(entriesPerPage));

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
    return site ? site.site_name : siteId;
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Buildings</h1>
          <p className="text-muted-foreground">Manage building information</p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Building
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select site" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sites?.data.sites && Array.isArray(sites.data.sites) && sites.data.sites.map((site) => (
                            <SelectItem key={site.id} value={site.id.toString()}>
                              {site.name}
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
                      <FormLabel>Building Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter building name" {...field} />
                      </FormControl>
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
                      <FormControl>
                        <Input placeholder="Enter additional details" {...field} />
                      </FormControl>
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
                  <Button type="submit" disabled={createForm.formState.isSubmitting}>
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

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search buildings..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedSiteFilter} onValueChange={setSelectedSiteFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                {sites.data && Array.isArray(sites.data) && sites.data.map((site) => (
                  <SelectItem key={site.id} value={site.id.toString()}>
                    {site.site_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 entries</SelectItem>
                <SelectItem value="25">25 entries</SelectItem>
                <SelectItem value="50">50 entries</SelectItem>
                <SelectItem value="100">100 entries</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Buildings Table */}
      <Card>
        <CardContent className="p-0">
          {buildings.loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading buildings...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sr No</TableHead>
                  <TableHead>Building Name</TableHead>
                  <TableHead>Site Name</TableHead>
                  <TableHead className="text-center">Wing</TableHead>
                  <TableHead className="text-center">Area</TableHead>
                  <TableHead className="text-center">Floor</TableHead>
                  <TableHead className="text-center">Room</TableHead>
                  <TableHead>Status</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedBuildings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      {search || selectedSiteFilter !== 'all' ? (
                        <div className="text-muted-foreground">
                          No buildings found matching your filters.
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          No buildings found. Create your first building to get started.
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedBuildings.map((building, index) => (
                    <TableRow key={building.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{building.name}</TableCell>
                      <TableCell>{getSiteName(building.site_id)}</TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={building.has_wing}
                          onCheckedChange={() => handleToggleStatus(building.id, 'has_wing')}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={building.has_area}
                          onCheckedChange={() => handleToggleStatus(building.id, 'has_area')}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={building.has_floor}
                          onCheckedChange={() => handleToggleStatus(building.id, 'has_floor')}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={building.has_room}
                          onCheckedChange={() => handleToggleStatus(building.id, 'has_room')}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={building.active}
                          onCheckedChange={() => handleToggleStatus(building.id, 'active')}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                        />
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
        <DialogContent className="max-w-2xl">
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select site" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sites.data && Array.isArray(sites.data) && sites.data.map((site) => (
                          <SelectItem key={site.id} value={site.id.toString()}>
                            {site.site_name}
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
                    <FormLabel>Building Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter building name" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input placeholder="Enter additional details" {...field} />
                    </FormControl>
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
                  Update Building
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}