import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Recycle, Building, Trash2, MapPin, ArrowLeft } from 'lucide-react';
import { 
  fetchBuildings, 
  fetchWings, 
  fetchAreas, 
  fetchVendors, 
  fetchCommodities, 
  fetchCategories, 
  fetchOperationalLandlords,
  fetchWasteGenerationById,
  updateWasteGeneration,
  Building as BuildingType,
  Wing,
  Area,
  Vendor,
  Commodity,
  Category,
  OperationalLandlord,
  WasteGeneration,
  UpdateWasteGenerationPayload
} from '@/services/wasteGenerationAPI';
import { toast } from 'sonner';

// Field styles for Material-UI components
const fieldStyles = {
  height: '45px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  '& .MuiOutlinedInput-root': {
    height: '45px',
    '& fieldset': {
      borderColor: '#ddd',
    },
    '&:hover fieldset': {
      borderColor: '#C72030',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
};

const EditWasteGenerationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast: reactToast } = useToast();
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    building: '',
    wing: '',
    area: '',
    date: '',
    vendor: '',
    commodity: '',
    category: '',
    operationalName: '',
    agencyName: '',
    generatedUnit: '',
    recycledUnit: '0',
    uom: '',
    typeOfWaste: ''
  });

  // API data state
  const [buildings, setBuildings] = useState<BuildingType[]>([]);
  const [wings, setWings] = useState<Wing[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [operationalLandlords, setOperationalLandlords] = useState<OperationalLandlord[]>([]);
  const [wasteData, setWasteData] = useState<WasteGeneration | null>(null);

  // Loading states
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loadingCommodities, setLoadingCommodities] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingOperationalLandlords, setLoadingOperationalLandlords] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch existing waste generation data on component mount
  useEffect(() => {
    const fetchExistingData = async () => {
      if (!id) return;
      
      try {
        setInitialLoading(true);
        console.log('Fetching waste generation data for edit, ID:', id);
        
        const existingData = await fetchWasteGenerationById(parseInt(id));
        setWasteData(existingData);
        
        // Format date to YYYY-MM-DD for input
        const formatDate = (dateString: string) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };

        // Populate form with existing data
        setFormData({
          building: existingData.building_id?.toString() || '',
          wing: existingData.wing_id?.toString() || '',
          area: existingData.area_id?.toString() || '',
          date: formatDate(existingData.wg_date),
          vendor: existingData.vendor?.id?.toString() || '',
          commodity: existingData.commodity?.id?.toString() || '',
          category: existingData.category?.id?.toString() || '',
          operationalName: existingData.operational_landlord?.id?.toString() || '',
          agencyName: existingData.agency_name || '',
          generatedUnit: existingData.waste_unit?.toString() || '',
          recycledUnit: existingData.recycled_unit?.toString() || '0',
          uom: '', // Not available in current API response
          typeOfWaste: '' // Not available in current API response
        });
        
      } catch (error) {
        console.error('Error fetching waste generation data:', error);
        toast.error('Failed to load waste generation data');
        navigate('/maintenance/waste/generation');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchExistingData();
  }, [id, navigate]);

  // Fetch all dropdowns data on component mount
  useEffect(() => {
    const fetchAllDropdowns = async () => {
      // Fetch buildings
      setLoadingBuildings(true);
      try {
        const buildingsData = await fetchBuildings();
        setBuildings(Array.isArray(buildingsData) ? buildingsData : []);
      } catch (error) {
        console.error('Error fetching buildings:', error);
        setBuildings([]);
        toast.error('Failed to load buildings');
      } finally {
        setLoadingBuildings(false);
      }

      // Fetch vendors
      setLoadingVendors(true);
      try {
        const vendorsData = await fetchVendors();
        setVendors(Array.isArray(vendorsData) ? vendorsData : []);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        setVendors([]);
        // Don't show error for vendors as they are optional
      } finally {
        setLoadingVendors(false);
      }

      // Fetch commodities
      setLoadingCommodities(true);
      try {
        const commoditiesData = await fetchCommodities();
        console.log('Commodities data received:', commoditiesData);
        setCommodities(Array.isArray(commoditiesData) ? commoditiesData : []);
      } catch (error) {
        console.error('Error fetching commodities:', error);
        setCommodities([]);
        toast.error('Failed to load commodities');
      } finally {
        setLoadingCommodities(false);
      }

      // Fetch categories
      setLoadingCategories(true);
      try {
        const categoriesData = await fetchCategories();
        console.log('Categories data received:', categoriesData);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
        toast.error('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }

      // Fetch operational landlords
      setLoadingOperationalLandlords(true);
      try {
        const operationalLandlordsData = await fetchOperationalLandlords();
        console.log('Operational landlords data received:', operationalLandlordsData);
        setOperationalLandlords(Array.isArray(operationalLandlordsData) ? operationalLandlordsData : []);
      } catch (error) {
        console.error('Error fetching operational landlords:', error);
        setOperationalLandlords([]);
        toast.error('Failed to load operational landlords');
      } finally {
        setLoadingOperationalLandlords(false);
      }
    };

    fetchAllDropdowns();
  }, []);

  // Fetch wings when building changes
  useEffect(() => {
    const fetchWingsData = async () => {
      if (!formData.building) {
        setWings([]);
        setFormData(prev => ({ ...prev, wing: '', area: '' }));
        return;
      }

      setLoadingWings(true);
      try {
        const wingsData = await fetchWings(parseInt(formData.building));
        setWings(Array.isArray(wingsData) ? wingsData : []);
      } catch (error) {
        console.error('Error fetching wings:', error);
        setWings([]);
        toast.error('Failed to fetch wings');
      } finally {
        setLoadingWings(false);
      }
    };

    fetchWingsData();
  }, [formData.building]);

  // Fetch areas when wing changes
  useEffect(() => {
    const fetchAreasData = async () => {
      if (!formData.wing) {
        setAreas([]);
        setFormData(prev => ({ ...prev, area: '' }));
        return;
      }

      setLoadingAreas(true);
      try {
        const areasData = await fetchAreas(parseInt(formData.wing));
        setAreas(Array.isArray(areasData) ? areasData : []);
      } catch (error) {
        console.error('Error fetching areas:', error);
        setAreas([]);
        toast.error('Failed to fetch areas');
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreasData();
  }, [formData.wing]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    if (!id) return;
    
    if (!formData.building || !formData.commodity || !formData.category || !formData.operationalName || !formData.generatedUnit || !formData.date) {
      reactToast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload: UpdateWasteGenerationPayload = {
        pms_waste_generation: {
          building_id: parseInt(formData.building),
          wing_id: formData.wing ? parseInt(formData.wing) : null,
          area_id: formData.area ? parseInt(formData.area) : null,
          vendor_id: formData.vendor ? parseInt(formData.vendor) : null,
          commodity_id: parseInt(formData.commodity),
          category_id: parseInt(formData.category),
          operational_landlord_id: parseInt(formData.operationalName),
          agency_name: formData.agencyName || '',
          waste_unit: parseFloat(formData.generatedUnit),
          recycled_unit: formData.recycledUnit ? parseFloat(formData.recycledUnit) : 0,
          wg_date: formData.date,
          uom: formData.uom || '',
          type_of_waste: formData.typeOfWaste || ''
        }
      };

      console.log('Update payload:', payload);

      const result = await updateWasteGeneration(parseInt(id), payload);
      
      console.log('Update response:', result);
      
      toast.success('Waste generation updated successfully!');
      
      // Navigate back to details page or list page
      navigate(`/maintenance/waste/generation/${id}`);
      
    } catch (error) {
      console.error('Error updating waste generation:', error);
      toast.error('Failed to update waste generation');
      reactToast({
        title: "Error",
        description: "Failed to update waste generation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/maintenance/waste/generation/${id}`);
  };

  const handleCancel = () => {
    navigate(`/maintenance/waste/generation/${id}`);
  };

  if (initialLoading) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading waste generation data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button onClick={handleBack} className="flex items-center gap-1 hover:text-[#C72030] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bold text-[#1a1a1a]">Back to Details</span>
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Edit Waste Generation - #{id}</h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Building */}
          <FormControl fullWidth size="small">
            <InputLabel>Building *</InputLabel>
            <MuiSelect
              value={formData.building}
              label="Building *"
              onChange={(e) => handleInputChange('building', e.target.value)}
              sx={fieldStyles}
              disabled={loadingBuildings}
            >
              {loadingBuildings ? (
                <MenuItem disabled>Loading buildings...</MenuItem>
              ) : buildings.length === 0 ? (
                <MenuItem disabled>No buildings available</MenuItem>
              ) : (
                buildings.map((building) => (
                  <MenuItem key={building.id} value={building.id.toString()}>
                    {building.name}
                  </MenuItem>
                ))
              )}
            </MuiSelect>
          </FormControl>

          {/* Wing */}
          <FormControl fullWidth size="small">
            <InputLabel>Wing</InputLabel>
            <MuiSelect
              value={formData.wing}
              label="Wing"
              onChange={(e) => handleInputChange('wing', e.target.value)}
              sx={fieldStyles}
              disabled={!formData.building || loadingWings}
            >
              <MenuItem value="">
                <em>Select Wing</em>
              </MenuItem>
              {loadingWings ? (
                <MenuItem disabled>Loading wings...</MenuItem>
              ) : wings.length === 0 ? (
                <MenuItem disabled>No wings available</MenuItem>
              ) : (
                wings.map((wing) => (
                  <MenuItem key={wing.id} value={wing.id.toString()}>
                    {wing.name}
                  </MenuItem>
                ))
              )}
            </MuiSelect>
          </FormControl>

          {/* Area */}
          <FormControl fullWidth size="small">
            <InputLabel>Area</InputLabel>
            <MuiSelect
              value={formData.area}
              label="Area"
              onChange={(e) => handleInputChange('area', e.target.value)}
              sx={fieldStyles}
              disabled={!formData.wing || loadingAreas}
            >
              <MenuItem value="">
                <em>Select Area</em>
              </MenuItem>
              {loadingAreas ? (
                <MenuItem disabled>Loading areas...</MenuItem>
              ) : areas.length === 0 ? (
                <MenuItem disabled>No areas available</MenuItem>
              ) : (
                areas.map((area) => (
                  <MenuItem key={area.id} value={area.id.toString()}>
                    {area.name}
                  </MenuItem>
                ))
              )}
            </MuiSelect>
          </FormControl>

          {/* Date */}
          <TextField
            label="Date *"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            size="small"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            sx={fieldStyles}
          />

          {/* Vendor */}
          <FormControl fullWidth size="small">
            <InputLabel>Vendor</InputLabel>
            <MuiSelect
              value={formData.vendor}
              label="Vendor"
              onChange={(e) => handleInputChange('vendor', e.target.value)}
              sx={fieldStyles}
              disabled={loadingVendors}
            >
              <MenuItem value="">
                <em>Select Vendor</em>
              </MenuItem>
              {loadingVendors ? (
                <MenuItem disabled>Loading vendors...</MenuItem>
              ) : vendors.length === 0 ? (
                <MenuItem disabled>No vendors available</MenuItem>
              ) : (
                vendors.map((vendor) => (
                  <MenuItem key={vendor.id} value={vendor.id.toString()}>
                    {vendor.company_name || vendor.full_name}
                  </MenuItem>
                ))
              )}
            </MuiSelect>
          </FormControl>

          {/* Commodity/Source */}
          <FormControl fullWidth size="small">
            <InputLabel>Commodity/Source *</InputLabel>
            <MuiSelect
              value={formData.commodity}
              label="Commodity/Source *"
              onChange={(e) => handleInputChange('commodity', e.target.value)}
              sx={fieldStyles}
              disabled={loadingCommodities}
            >
              {loadingCommodities ? (
                <MenuItem disabled>Loading commodities...</MenuItem>
              ) : commodities.length === 0 ? (
                <MenuItem disabled>No commodities available</MenuItem>
              ) : (
                commodities.map((commodity) => (
                  <MenuItem key={commodity.id} value={commodity.id.toString()}>
                    {commodity.category_name}
                  </MenuItem>
                ))
              )}
            </MuiSelect>
          </FormControl>

          {/* Category */}
          <FormControl fullWidth size="small">
            <InputLabel>Category *</InputLabel>
            <MuiSelect
              value={formData.category}
              label="Category *"
              onChange={(e) => handleInputChange('category', e.target.value)}
              sx={fieldStyles}
              disabled={loadingCategories}
            >
              {loadingCategories ? (
                <MenuItem disabled>Loading categories...</MenuItem>
              ) : categories.length === 0 ? (
                <MenuItem disabled>No categories available</MenuItem>
              ) : (
                categories.map((category) => (
                  <MenuItem key={category.id} value={category.id.toString()}>
                    {category.category_name}
                  </MenuItem>
                ))
              )}
            </MuiSelect>
          </FormControl>

          {/* Operational Name */}
          <FormControl fullWidth size="small">
            <InputLabel>Operational Name *</InputLabel>
            <MuiSelect
              value={formData.operationalName}
              label="Operational Name *"
              onChange={(e) => handleInputChange('operationalName', e.target.value)}
              sx={fieldStyles}
              disabled={loadingOperationalLandlords}
            >
              {loadingOperationalLandlords ? (
                <MenuItem disabled>Loading operational names...</MenuItem>
              ) : operationalLandlords.length === 0 ? (
                <MenuItem disabled>No operational names available</MenuItem>
              ) : (
                operationalLandlords.map((landlord) => (
                  <MenuItem key={landlord.id} value={landlord.id.toString()}>
                    {landlord.category_name}
                  </MenuItem>
                ))
              )}
            </MuiSelect>
          </FormControl>

          {/* Agency Name */}
          <TextField
            label="Agency Name"
            value={formData.agencyName}
            onChange={(e) => handleInputChange('agencyName', e.target.value)}
            size="small"
            fullWidth
            sx={fieldStyles}
          />

          {/* Generated Unit */}
          <TextField
            label="Generated Unit (KG) *"
            type="number"
            value={formData.generatedUnit}
            onChange={(e) => handleInputChange('generatedUnit', e.target.value)}
            size="small"
            fullWidth
            sx={fieldStyles}
            inputProps={{ min: 0, step: 0.01 }}
          />

          {/* Recycled Unit */}
          <TextField
            label="Recycled Unit (KG)"
            type="number"
            value={formData.recycledUnit}
            onChange={(e) => handleInputChange('recycledUnit', e.target.value)}
            size="small"
            fullWidth
            sx={fieldStyles}
            inputProps={{ min: 0, step: 0.01 }}
          />

          {/* UOM */}
          <TextField
            label="Unit of Measurement"
            value={formData.uom}
            onChange={(e) => handleInputChange('uom', e.target.value)}
            size="small"
            fullWidth
            sx={fieldStyles}
          />

          {/* Type of Waste */}
          <TextField
            label="Type of Waste"
            value={formData.typeOfWaste}
            onChange={(e) => handleInputChange('typeOfWaste', e.target.value)}
            size="small"
            fullWidth
            sx={fieldStyles}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="px-6"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate}
            disabled={submitting}
            className="px-6"
            style={{ backgroundColor: '#C72030' }}
          >
            {submitting ? 'Updating...' : 'Update Waste Generation'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditWasteGenerationPage;
