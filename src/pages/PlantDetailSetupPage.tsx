import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Edit, Plus, Trash2, Search, Loader2 } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AddPlantDetailDialog } from '@/components/AddPlantDetailDialog';
import { EditPlantDetailDialog } from '@/components/EditPlantDetailDialog';
import { apiClient } from '@/utils/apiClient';

interface PlantDetail {
  id: string | number;
  plant_name: string;
  site_name: string;
  valuation_area: string;
  plant_category: string;
  company_name: string;
  company_code: string;
  sale_org_code: string;
  pms_site_id?: number;
  created_at?: string;
  updated_at?: string;
}

export const PlantDetailSetupPage = () => {
  const { setCurrentSection } = useLayout();
  const { toast } = useToast();

  useEffect(() => {
    setCurrentSection('Master');
  }, [setCurrentSection]);

  const [plantDetails, setPlantDetails] = useState<PlantDetail[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantDetail | null>(null);

  useEffect(() => {
    fetchPlantDetails();
  }, []);

  const fetchPlantDetails = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/plant_details.json');
      setPlantDetails(response.data.data || []);
    } catch (error) {
      console.error('Error fetching plant details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch plant details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlant = async (formData: Omit<PlantDetail, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await apiClient.post('/plant_details.json', { plant_detail: formData });

      toast({
        title: 'Success',
        description: 'Plant detail added successfully',
      });

      setIsAddDialogOpen(false);
      fetchPlantDetails();
    } catch (error) {
      console.error('Error adding plant detail:', error);
      toast({
        title: 'Error',
        description: 'Failed to add plant detail',
        variant: 'destructive',
      });
    }
  };

  const handleUpdatePlant = async (formData: PlantDetail) => {
    if (!selectedPlant?.id) return;

    try {
      await apiClient.patch(`/plant_details/${selectedPlant.id}.json`, { plant_detail: formData });

      toast({
        title: 'Success',
        description: 'Plant detail updated successfully',
      });

      setIsEditDialogOpen(false);
      setSelectedPlant(null);
      fetchPlantDetails();
    } catch (error) {
      console.error('Error updating plant detail:', error);
      toast({
        title: 'Error',
        description: 'Failed to update plant detail',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePlant = async (id: string) => {
    try {
      await apiClient.delete(`/plant_details/${id}.json`);

      toast({
        title: 'Success',
        description: 'Plant detail deleted successfully',
      });

      fetchPlantDetails();
    } catch (error) {
      console.error('Error deleting plant detail:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete plant detail',
        variant: 'destructive',
      });
    }
  };

  const handleEditPlant = (plant: PlantDetail) => {
    setSelectedPlant(plant);
    setIsEditDialogOpen(true);
  };

  const filteredPlants = plantDetails.filter(plant =>
    plant.plant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.plant_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#fafafa] p-6">
      <div className="w-full space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">PLANT DETAIL SETUP</h1>
         
        </div>
        <div className="flex justify-start">
             <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-[#C72030] hover:bg-[#C72030]/90 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Plant
          </Button>
        </div>

        {/* Plant Details Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#1a1a1a]">Plant Details</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search plant details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#C72030]" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f6f4ee]">
                  <TableHead className="font-medium">Plant Name</TableHead>
                  <TableHead className="font-medium">Site Name</TableHead>
                  <TableHead className="font-medium">Plant Category</TableHead>
                  <TableHead className="font-medium">Company Name</TableHead>
                  <TableHead className="font-medium">Company Code</TableHead>
                  <TableHead className="font-medium">Sale Org Code</TableHead>
                  <TableHead className="font-medium">Valuation Area</TableHead>
                  <TableHead className="font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No plant details found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlants.map((plant) => (
                    <TableRow key={plant.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{plant.plant_name}</TableCell>
                      <TableCell>{plant.site_name}</TableCell>
                      <TableCell>{plant.plant_category}</TableCell>
                      <TableCell>{plant.company_name}</TableCell>
                      <TableCell>{plant.company_code}</TableCell>
                      <TableCell>{plant.sale_org_code}</TableCell>
                      <TableCell>{plant.valuation_area}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPlant(plant)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            {/* <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger> */}
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the plant detail.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeletePlant(plant.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add Dialog */}
      <AddPlantDetailDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddPlant}
      />

      {/* Edit Dialog */}
      <EditPlantDetailDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdatePlant}
        plantDetail={selectedPlant}
      />
    </div>
  );
};
