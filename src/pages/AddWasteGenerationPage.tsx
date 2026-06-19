import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { TextField } from '@mui/material';
import { Recycle, ArrowLeft } from 'lucide-react';
import { FormSearchSelect } from '@/components/FormSearchSelect';
import {
  fetchBuildings,
  fetchWings,
  fetchAreas,
  fetchCommodities,
  fetchCategories,
  fetchOperationalLandlords,
  createWasteGeneration,
  Building as BuildingType,
  Wing,
  Area,
  Commodity,
  Category,
  OperationalLandlord
} from '@/services/wasteGenerationAPI';
import { SupplierSearchSelect } from '@/components/SupplierSearchSelect';
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
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [operationalLandlords, setOperationalLandlords] = useState<OperationalLandlord[]>([]);

  // Loading states
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
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

 if (
    (field === "generatedUnit" || field === "recycledUnit") &&
    Number(value) < 0
  ) {
    return;
  }




    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // if (!formData.building || !formData.vendor || !formData.commodity || !formData.category || !formData.operationalName || !formData.generatedUnit || !formData.date) {
  //   reactToast({
  //     title: "Error",
  //     description: "Please fill in all required fields",
  //     variant: "destructive"
  //   });
  //   return;
  // }

  const handleSave = async () => {
    if (!formData.building) {
      toast.error("Validation Error: Building is required.");
      return;
    }

    if (!formData.date) {
      toast.error("Validation Error: Date is required.");
      return;
    }

    if (!formData.vendor) {
      toast.error("Validation Error: Vendor is required.");
      return;
    }

    if (!formData.commodity) {
      toast.error("Validation Error: Commodity is required.");
      return;
    }

    if (!formData.category) {
      toast.error("Validation Error: Category is required.");
      return;
    }

    if (!formData.operationalName) {
      toast.error("Validation Error: Operational Name of Landlord/Tenant is required.");
      return;
    }

    if (!formData.generatedUnit) {
      toast.error("Validation Error: Generated Unit is required.");
      return;
    }

    if (parseFloat(formData.generatedUnit) <= 0) {
      toast.error("Validation Error: Generated Unit must be greater than 0.");
      return;
    }

    if (formData.recycledUnit && parseFloat(formData.recycledUnit) < 0) {
      toast.error("Validation Error: Recycled Unit cannot be negative.");
      return;
    }

    if (
      parseFloat(formData.recycledUnit || "0") >
      parseFloat(formData.generatedUnit)
    ) {
      toast.error("Validation Error: Recycled Unit cannot be greater than Generated Unit.");
      return;
    }
    // continue with API call...



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

  const buildingOptions = useMemo(
    () => buildings.map((b) => ({ value: b.id.toString(), label: b.name })),
    [buildings]
  );
  const wingOptions = useMemo(
    () => wings.map((w) => ({ value: w.id.toString(), label: w.name })),
    [wings]
  );
  const areaOptions = useMemo(
    () => areas.map((a) => ({ value: a.id.toString(), label: a.name })),
    [areas]
  );
  const commodityOptions = useMemo(
    () =>
      commodities.map((c) => ({
        value: c.id.toString(),
        label: c.category_name,
      })),
    [commodities]
  );
  const categoryOptions = useMemo(
    () =>
      categories.map((c) => ({
        value: c.id.toString(),
        label: c.category_name,
      })),
    [categories]
  );
  const operationalLandlordOptions = useMemo(
    () =>
      operationalLandlords.map((l) => ({
        value: l.id.toString(),
        label: l.category_name,
      })),
    [operationalLandlords]
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 text-amber-900">ADD WASTE GENERATION</h1>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        {/* Waste Generation Details */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <Recycle size={16} color="#C72030" />
              </span>
              WASTE GENERATION DETAILS
            </h2>
          </div>
          <div className="p-6 space-y-10">
            {/* Location Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-10">
              <FormSearchSelect
                label={<>Building <span className="text-red-500">*</span></>}
                value={formData.building}
                onChange={(v) => handleInputChange('building', v)}
                options={buildingOptions}
                placeholder="Select Building"
                isLoading={loadingBuildings}
                disabled={loadingBuildings}
              />

              <FormSearchSelect
                label="Wing"
                value={formData.wing}
                onChange={(v) => handleInputChange('wing', v)}
                options={wingOptions}
                placeholder={
                  !formData.building
                    ? 'Select Building First'
                    : 'Select Wing (Optional)'
                }
                isLoading={loadingWings}
                disabled={loadingWings || !formData.building}
              />

              <FormSearchSelect
                label="Area"
                value={formData.area}
                onChange={(v) => handleInputChange('area', v)}
                options={areaOptions}
                placeholder={
                  !formData.wing ? 'Select Wing First' : 'Select Area (Optional)'
                }
                isLoading={loadingAreas}
                disabled={loadingAreas || !formData.wing}
              />

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-10">
              {/* Vendor — uses virtualized SupplierSearchSelect to handle large record sets without freezing */}
              <SupplierSearchSelect
                value={formData.vendor}
                onChange={(vendorId) => handleInputChange('vendor', vendorId)}
                label={<span>Vendor <span style={{ color: '#C72030' }}>*</span></span>}
                size="schedule"
                error={false}
              />

              <FormSearchSelect
                label={<>Commodity <span className="text-red-500">*</span></>}
                value={formData.commodity}
                onChange={(v) => handleInputChange('commodity', v)}
                options={commodityOptions}
                placeholder="Select Commodity"
                isLoading={loadingCommodities}
                disabled={loadingCommodities}
              />

              <FormSearchSelect
                label={<>Category <span className="text-red-500">*</span></>}
                value={formData.category}
                onChange={(v) => handleInputChange('category', v)}
                options={categoryOptions}
                placeholder="Select Category"
                isLoading={loadingCategories}
                disabled={loadingCategories}
              />
              <TextField
                fullWidth
                label="UOM"
                variant="outlined"
                value={formData.uom}
                onChange={(e) => handleInputChange('uom', e.target.value)}
                placeholder="Enter UOM"
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-10">
              <FormSearchSelect
                label={
                  <>
                    <span className="text-red-500">*</span> Operational Name of
                    Landlord/ Tenant
                  </>
                }
                value={formData.operationalName}
                onChange={(v) => handleInputChange('operationalName', v)}
                options={operationalLandlordOptions}
                placeholder="Select Operational Name"
                isLoading={loadingOperationalLandlords}
                disabled={loadingOperationalLandlords}
              />

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
                inputProps={{ min: "0" }}
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
                inputProps={{ min: "0" }}
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

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center px-6 py-6 border-t border-gray-200">
            <Button
              type="submit"
              disabled={submitting}
              style={{ backgroundColor: '#C72030', color: '#ffffff' }}
              className="hover:bg-[#A01B26] px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
            >
              {submitting ? 'Saving...' : 'Save'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={submitting}
              style={{ borderColor: '#d1d5db', color: '#374151' }}
              className="hover:bg-gray-50 px-8 py-2 disabled:opacity-50 rounded-md"
            >
              Back
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddWasteGenerationPage;