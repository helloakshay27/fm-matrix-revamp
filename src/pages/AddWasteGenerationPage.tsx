import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Recycle, Building, Trash2, MapPin } from 'lucide-react';
import { 
  fetchBuildings, 
  fetchWings, 
  fetchAreas, 
  fetchVendors, 
  fetchCommodities, 
  fetchCategories, 
  fetchOperationalLandlords,
  createWasteGeneration,
  Building as BuildingType,
  Wing,
  Area,
  Vendor,
  Commodity,
  Category,
  OperationalLandlord
} from '@/services/wasteGenerationAPI';
import { toast } from 'sonner';

// Field styles for Material-UI components
const fieldStyles = {
  height: "45px",
  backgroundColor: "#fff",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    height: "45px",
    "& fieldset": { borderColor: "#999" },
    "&:hover fieldset": { borderColor: "#1976d2" },
    "&.Mui-focused fieldset": { borderColor: "#1976d2" },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": { color: "#1976d2" },
    "& .MuiInputLabel-asterisk": {
      color: "#C72030 !important",
    },
    "&.Mui-required .MuiInputLabel-asterisk": {
      color: "#C72030 !important",
    },
  },
  "& .MuiFormLabel-asterisk": {
    color: "#C72030 !important",
  },
  "& .MuiInputLabel-asterisk": {
    color: "#C72030 !important",
  },
  // Additional asterisk selectors to ensure red color
  "& .MuiFormLabel-root .MuiFormLabel-asterisk": {
    color: "#C72030 !important",
  },
};

const AddWasteGenerationPage = () => {
  const navigate = useNavigate();
  const { toast: reactToast } = useToast();
  
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
    uom: 'KG',
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

  // Loading states
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loadingCommodities, setLoadingCommodities] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingOperationalLandlords, setLoadingOperationalLandlords] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSave = async () => {
    if (!formData.building || !formData.vendor || !formData.commodity || !formData.category || !formData.operationalName || !formData.generatedUnit || !formData.date) {
      reactToast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
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

      console.log('Submitting waste generation data:', payload);
      
      const response = await createWasteGeneration(payload);
      
      toast.success('Waste generation record saved successfully');
      navigate('/maintenance/waste/generation');
    } catch (error) {
      console.error('Error saving waste generation:', error);
      toast.error('Failed to save waste generation record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/maintenance/waste/generation');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ADD WASTE GENERATION</h1>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
        {/* Waste Generation Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <Recycle size={16} color="#C72030" />
              </span>
              WASTE GENERATION DETAILS
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Location Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <FormControl
                fullWidth
                variant="outlined"
                // required
                // sx={{ '& .MuiInputBase-root': fieldStyles }}
                sx={fieldStyles}
              >
                <InputLabel shrink>Building <span className="text-red-500">*</span></InputLabel>
                <MuiSelect
                  value={formData.building}
                  onChange={(e) => handleInputChange('building', e.target.value)}
                  label="Building*"
                  notched
                  displayEmpty
                  disabled={loadingBuildings}
                >
                  <MenuItem value="">
                    {loadingBuildings ? 'Loading buildings...' : 'Select Building'}
                  </MenuItem>
                  {Array.isArray(buildings) && buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id.toString()}>
                      {building.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              
              <FormControl
                fullWidth
                variant="outlined"
                // sx={{ '& .MuiInputBase-root': fieldStyles }}
                sx={fieldStyles}
              >
                <InputLabel shrink>Wing</InputLabel>
                <MuiSelect
                  value={formData.wing}
                  onChange={(e) => handleInputChange('wing', e.target.value)}
                  label="Wing"
                  notched
                  displayEmpty
                  disabled={loadingWings || !formData.building}
                >
                  <MenuItem value="">
                    {loadingWings ? 'Loading wings...' : 
                     !formData.building ? 'Select Building First' : 
                     'Select Wing (Optional)'}
                  </MenuItem>
                  {Array.isArray(wings) && wings.map((wing) => (
                    <MenuItem key={wing.id} value={wing.id.toString()}>
                      {wing.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              
              <FormControl
                fullWidth
                variant="outlined"
                // sx={{ '& .MuiInputBase-root': fieldStyles }}
                sx={fieldStyles}
              >
                <InputLabel shrink>Area</InputLabel>
                <MuiSelect
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  label="Area"
                  notched
                  displayEmpty
                  disabled={loadingAreas || !formData.wing}
                >
                  <MenuItem value="">
                    {loadingAreas ? 'Loading areas...' : 
                     !formData.wing ? 'Select Wing First' : 
                     'Select Area (Optional)'}
                  </MenuItem>
                  {Array.isArray(areas) && areas.map((area) => (
                    <MenuItem key={area.id} value={area.id.toString()}>
                      {area.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              
              <TextField
                label={<span>Date <span className="text-red-500">*</span></span>}
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                // InputProps={{
                //   sx: fieldStyles,
                // }}
                sx={fieldStyles}
              />
            </div>

            {/* Waste Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <FormControl
                fullWidth
                variant="outlined"
                // required
                // sx={{ '& .MuiInputBase-root': fieldStyles }}
                sx={fieldStyles}
              >
                <InputLabel shrink>Vendor <span className="text-red-500">*</span></InputLabel>
                <MuiSelect
                  value={formData.vendor}
                  onChange={(e) => handleInputChange('vendor', e.target.value)}
                  label="Vendor*"
                  notched
                  displayEmpty
                  disabled={loadingVendors}
                >
                  <MenuItem value="">
                    {loadingVendors ? 'Loading vendors...' : 'Select Vendor'}
                  </MenuItem>
                  {Array.isArray(vendors) && vendors.map((vendor) => (
                    <MenuItem key={vendor.id} value={vendor.id.toString()}>
                      {vendor.company_name || vendor.full_name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              
              <FormControl
                fullWidth
                variant="outlined"
                // required
                // sx={{ '& .MuiInputBase-root': fieldStyles }}
                sx={fieldStyles}
              >
                <InputLabel shrink>Commodity <span className="text-red-500">*</span></InputLabel>
                <MuiSelect
                  value={formData.commodity}
                  onChange={(e) => handleInputChange('commodity', e.target.value)}
                  label="Commodity*"
                  notched
                  displayEmpty
                  disabled={loadingCommodities}
                >
                  <MenuItem value="">
                    {loadingCommodities ? 'Loading commodities...' : 'Select Commodity'}
                  </MenuItem>
                  {Array.isArray(commodities) && commodities.map((commodity) => (
                    <MenuItem key={commodity.id} value={commodity.id.toString()}>
                      {commodity.category_name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              
              <FormControl
                fullWidth
                variant="outlined"
                // required
                // sx={{ '& .MuiInputBase-root': fieldStyles }}
                sx={fieldStyles}
              >
                <InputLabel shrink>Category <span className="text-red-500">*</span></InputLabel>
                <MuiSelect
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  label="Category*"
                  notched
                  displayEmpty
                  disabled={loadingCategories}
                >
                  <MenuItem value="">
                    {loadingCategories ? 'Loading categories...' : 'Select Category'}
                  </MenuItem>
                  {Array.isArray(categories) && categories.map((category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.category_name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
               <TextField
                fullWidth
                label="UoM"
                variant="outlined"
                value={formData.uom}
                onChange={(e) => handleInputChange('uom', e.target.value)}
                placeholder="Enter UoM"
                // sx={{ '& .MuiInputBase-root': fieldStyles }}
                sx={fieldStyles}
                InputLabelProps={{ shrink: true }}
              />
            </div>

            {/* Additional Waste Details */}
            <div className="">
             
              
              {/* <TextField
                fullWidth
                label="Type of Waste"
                variant="outlined"
                value={formData.typeOfWaste}
                onChange={(e) => handleInputChange('typeOfWaste', e.target.value)}
                placeholder="Enter type of waste"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
                InputLabelProps={{ shrink: true }}
              /> */}
            </div>

            {/* Organization Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <FormControl
                fullWidth
                variant="outlined"
                // required
                // sx={{ '& .MuiInputBase-root': fieldStyles }}
                sx={fieldStyles}
              >
                <InputLabel shrink>Operational Name of Landlord/ Tenant <span className="text-red-500">*</span></InputLabel>
                <MuiSelect
                  value={formData.operationalName}
                  onChange={(e) => handleInputChange('operationalName', e.target.value)}
                  label="Operational Name of Landlord/ Tenant*"
                  notched
                  displayEmpty
                  disabled={loadingOperationalLandlords}
                >
                  <MenuItem value="">
                    {loadingOperationalLandlords ? 'Loading...' : 'Select Operational Name'}
                  </MenuItem>
                  {Array.isArray(operationalLandlords) && operationalLandlords.map((landlord) => (
                    <MenuItem key={landlord.id} value={landlord.id.toString()}>
                      {landlord.category_name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              
              <TextField
                label="Agency Name"
                placeholder="Enter Agency Name"
                value={formData.agencyName}
                onChange={(e) => handleInputChange('agencyName', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                sx={fieldStyles}
                // InputProps={{
                //   sx: fieldStyles,
                // }}
              />
              
              <TextField
                // label="Generated Unit*"
                label={<span>Generated Unit <span className="text-red-500">*</span></span>}
                type="number"
                placeholder="Enter Unit"
                value={formData.generatedUnit}
                onChange={(e) => handleInputChange('generatedUnit', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                sx={fieldStyles}
                // InputProps={{
                //   sx: fieldStyles,
                // }}
              />
              
              <TextField
                label="Recycled Unit"
                type="number"
                placeholder="0"
                value={formData.recycledUnit}
                onChange={(e) => handleInputChange('recycledUnit', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                sx={fieldStyles}
                // InputProps={{
                //   sx: fieldStyles,
                // }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-6">
          <Button 
            type="submit"
            disabled={submitting}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : 'Save'}
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={submitting}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2 disabled:opacity-50"
          >
            Back
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddWasteGenerationPage;