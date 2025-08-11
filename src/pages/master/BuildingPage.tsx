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
import { Loader2, Plus, Search, Edit, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<any>(null);
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string>('all');

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
    // Get user ID from localStorage or auth context
    const userId = JSON.parse(localStorage.getItem('user')).id; // Default for demo
    dispatch(fetchSites(userId));
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

  // Pagination calculations
  const totalItems = filteredBuildings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBuildings = filteredBuildings.slice(startIndex, endIndex);

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
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">BUILDINGS</h1>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#C72030] hover:bg-[#B01E2E] text-white flex items-center gap-2">
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

          {/* Controls */}
          <div className="flex items-center justify-end mb-4">
         

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Search:</span>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
                placeholder="Search buildings..."
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
                  <TableHead>Building Name</TableHead>
                  <TableHead>Other Details</TableHead>
                  <TableHead>Has Wing</TableHead>
                  <TableHead>Has Area</TableHead>
                  <TableHead>Has Floor</TableHead>
                  <TableHead>Has Room</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buildings.loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      Loading buildings...
                    </TableCell>
                  </TableRow>
                ) : filteredBuildings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      {buildings.data.length === 0 ? 'No buildings available' : 'No buildings match your search'}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentBuildings.map((building, index) => (
                    <TableRow key={building.id}>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(building)}>
                          <Edit className="w-4 h-4 text-[#C72030]" />
                        </Button>
                      </TableCell>
                      <TableCell>{getSiteName(building.site_id)}</TableCell>
                      <TableCell>{building.name}</TableCell>
                      <TableCell>{building.other_detail || '-'}</TableCell>
                      <TableCell>
                        <button onClick={() => handleToggleStatus(building.id, 'has_wing')} className="cursor-pointer">
                          {building.has_wing ? (
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
                      <TableCell>
                        <button onClick={() => handleToggleStatus(building.id, 'has_area')} className="cursor-pointer">
                          {building.has_area ? (
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
                      <TableCell>
                        <button onClick={() => handleToggleStatus(building.id, 'has_floor')} className="cursor-pointer">
                          {building.has_floor ? (
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
                      <TableCell>
                        <button onClick={() => handleToggleStatus(building.id, 'has_room')} className="cursor-pointer">
                          {building.has_room ? (
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
                      <TableCell>
                        <button onClick={() => handleToggleStatus(building.id, 'active')} className="cursor-pointer">
                          {building.active ? (
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
          {buildings.data.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} buildings
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
      </div>
    </div>
  );
}