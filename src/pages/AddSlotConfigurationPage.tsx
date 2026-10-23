import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { FormControl, Select as MuiSelect, MenuItem, InputLabel } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useLayout } from '../contexts/LayoutContext';
import { ParkingSlotCategory } from '../components/parking/ParkingSlotCategory';
import {
  CategorySlots,
  SlotType,
  buildParkingSlotsData,
  emptyCategorySlots,
  removeSlotAt,
  renameSlotAt,
  resizeSlots,
  totalSlotCount,
  validateCategorySlots,
} from '../components/parking/parkingSlotUtils';
import { 
  createParkingConfiguration, 
  fetchBuildings, 
  fetchFloors,
  Building,
  Floor,
  CreateParkingConfigurationRequest
} from '../services/parkingConfigurationsAPI';
import { 
  fetchParkingCategories, 
  ParkingCategory 
} from '../services/parkingConfigAPI';

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff !important',
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

export const AddSlotConfigurationPage = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [parkingCategories, setParkingCategories] = useState<ParkingCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    building_id: '',
    floor_id: '',
    qrcode_needed: false,
    floorMap: null as File | null,
  });

  // Slot names per category — the single source of truth for what gets created.
  const [slots, setSlots] = useState<Record<number, CategorySlots>>({});

  const fetchBuildingsData = useCallback(async () => {
    try {
      setLoading(true);
      const buildingsData = await fetchBuildings();
      setBuildings(buildingsData);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      toast.error('Failed to fetch buildings');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFloorsData = useCallback(async (buildingId: string) => {
    try {
      setLoading(true);
      const floorsData = await fetchFloors(buildingId);
      setFloors(floorsData);
    } catch (error) {
      console.error('Error fetching floors:', error);
      toast.error('Failed to fetch floors');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchParkingCategoriesData = useCallback(async () => {
    try {
      const categoriesData = await fetchParkingCategories();
      setParkingCategories(categoriesData);
      console.log('Fetched parking categories:', categoriesData);
    } catch (error) {
      console.error('Error fetching parking categories:', error);
      toast.error('Failed to fetch parking categories');
    }
  }, []);

  useEffect(() => {
    setCurrentSection('Settings');
    fetchBuildingsData();
    fetchParkingCategoriesData();
  }, [setCurrentSection, fetchBuildingsData, fetchParkingCategoriesData]);

  // Give every parking category an (empty) slot list once the categories are loaded
  useEffect(() => {
    if (parkingCategories.length > 0) {
      setSlots(prev => {
        const next = { ...prev };
        parkingCategories.forEach(category => {
          if (!next[category.id]) next[category.id] = emptyCategorySlots();
        });
        return next;
      });
    }
  }, [parkingCategories]);

  useEffect(() => {
    if (formData.building_id) {
      fetchFloorsData(formData.building_id);
      // Reset floor selection when building changes
      setFormData(prev => ({ ...prev, floor_id: '' }));
    } else {
      setFloors([]);
    }
  }, [formData.building_id, fetchFloorsData]);

  const handleBack = () => {
    navigate('/settings/vas/parking-management/slot-configuration');
  };

  const handleSubmit = async () => {
    if (!formData.building_id || !formData.floor_id) {
      toast.error('Please select both building and floor');
      return;
    }

    console.log('Current formData:', formData);
    console.log('Available parking categories:', parkingCategories);
    console.log('Form categories data:', formData.categories);

    // Check if there are any parking slots to create
    const totalSlots = Object.values(slots).reduce((total, category) => total + totalSlotCount(category), 0);

    if (totalSlots === 0) {
      toast.error('Please add at least one parking slot');
      return;
    }

    if (parkingCategories.length === 0) {
      toast.error('Unable to find parking categories. Please try again.');
      return;
    }

    // Blank or repeated slot names would be rejected or miscounted by the API
    for (const category of parkingCategories) {
      const message = validateCategorySlots(category.name, slots[category.id] ?? emptyCategorySlots());
      if (message) {
        toast.error(message);
        return;
      }
    }

    try {
      setSubmitting(true);

      const requestData: CreateParkingConfigurationRequest = {
        building_id: formData.building_id,
        floor_id: formData.floor_id,
      };

      // Add data for each category that has at least one slot configured
      parkingCategories.forEach(category => {
        const categorySlots = buildParkingSlotsData(slots[category.id] ?? emptyCategorySlots());
        if (categorySlots.length > 0) {
          requestData[category.id.toString()] = {
            no_of_parkings: categorySlots.length,
            reserved_parkings: categorySlots.filter(slot => slot.reserved).length,
            parking: categorySlots
          };
        }
      });

      // Add image if selected
      if (formData.floorMap) {
        requestData.attachment = formData.floorMap;
      }

      await createParkingConfiguration(requestData);
      toast.success('Parking configuration created successfully!');
      navigate('/settings/vas/parking-management/slot-configuration');
    } catch (error) {
      console.error('Error creating parking configuration:', error);
      toast.error('Failed to create parking configuration');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/settings/vas/parking-management/slot-configuration');
  };

  const updateCategorySlots = (categoryId: number, update: (current: CategorySlots) => CategorySlots) =>
    setSlots(prev => ({ ...prev, [categoryId]: update(prev[categoryId] ?? emptyCategorySlots()) }));

  const handleSlotResize = (categoryId: number, type: SlotType, targetLength: number) =>
    updateCategorySlots(categoryId, current => resizeSlots(current, type, targetLength));

  const handleSlotRemove = (categoryId: number, type: SlotType, index: number) =>
    updateCategorySlots(categoryId, current => removeSlotAt(current, type, index));

  const handleSlotNameChange = (categoryId: number, type: SlotType, index: number, name: string) =>
    updateCategorySlots(categoryId, current => renameSlotAt(current, type, index, name));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    // Clean up previous object URL if it exists
    if (formData.floorMap && formData.floorMap.type.startsWith('image/')) {
      URL.revokeObjectURL(URL.createObjectURL(formData.floorMap));
    }
    
    setFormData(prev => ({ ...prev, floorMap: file }));
  };

  // Cleanup object URL on component unmount
  useEffect(() => {
    return () => {
      if (formData.floorMap && formData.floorMap.type.startsWith('image/')) {
        URL.revokeObjectURL(URL.createObjectURL(formData.floorMap));
      }
    };
  }, [formData.floorMap]);



  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl sm:text-2xl font-semibold">Parking Group Configuration</h1>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Location and Floor Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="location-label">Location *</InputLabel>
            <MuiSelect
              labelId="location-label"
              label="Location *"
              value={formData.building_id}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, building_id: e.target.value as string }))
              }
              disabled={loading}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>{loading ? 'Loading buildings...' : 'Select Location'}</em>
              </MenuItem>
              {buildings.map((building) => (
                <MenuItem key={building.id} value={building.id.toString()}>
                  {building.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="floor-label">Floor *</InputLabel>
            <MuiSelect
              labelId="floor-label"
              label="Floor *"
              value={formData.floor_id}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, floor_id: e.target.value as string }))
              }
              disabled={loading || !formData.building_id}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>
                  {!formData.building_id
                    ? 'Select Location first'
                    : loading
                      ? 'Loading floors...'
                      : 'Select Floor'}
                </em>
              </MenuItem>
              {floors.map((floor) => (
                <MenuItem key={floor.id} value={floor.id.toString()}>
                  {floor.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        </div>

        {/* QR Code Configuration */}
        {/* <div className="mb-8">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="qrcode_needed"
              checked={formData.qrcode_needed}
              onChange={(e) => setFormData(prev => ({ ...prev, qrcode_needed: e.target.checked }))}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-black-500 focus:ring-2"
            />
            <label htmlFor="qrcode_needed" className="text-sm font-medium text-gray-700">
              QR Code Needed for Parking Access
            </label>
          </div>
        </div> */}

        {/* Summary Section */}
      
        {/* Parking Configuration */}
        <div className="mb-8">
          <div className="text-sm font-semibold text-brand mb-6 border-b pb-2">Parking Configuration</div>
          
          {/* Dynamic Parking Categories */}
          {parkingCategories.map((category, index) => (
            <div key={category.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-50'} rounded-lg p-6 mb-6`}>
              <h3 className="text-lg font-semibold mb-6">
                {category.name}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {([
                  ['Non Stack Parking', 'nonStack'],
                  ['Stack Parking', 'stack'],
                  ['Reserved Parking', 'reserved'],
                ] as [string, SlotType][]).map(([title, type]) => (
                  <ParkingSlotCategory
                    key={type}
                    title={title}
                    type={type}
                    isStack={type === 'stack'}
                    slots={slots[category.id]?.[type] ?? []}
                    onResize={(t, length) => handleSlotResize(category.id, t, length)}
                    onRemove={(t, index) => handleSlotRemove(category.id, t, index)}
                    onRename={(t, index, name) => handleSlotNameChange(category.id, t, index, name)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Floor Map */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Floor Map</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              id="floorMap"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="floorMap"
              className="cursor-pointer text-brand font-medium hover:text-brand-hover"
            >
              Choose File
            </label>
            <span className="ml-2 text-gray-500">
              {formData.floorMap ? formData.floorMap.name : 'No file chosen'}
            </span>
            
            {/* Image Preview */}
            {formData.floorMap && formData.floorMap.type.startsWith('image/') && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                <div className="w-32 h-32 bg-gray-100 rounded border overflow-hidden mx-auto">
                  <img 
                    src={URL.createObjectURL(formData.floorMap)} 
                    alt="Floor map preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={submitting || !formData.building_id || !formData.floor_id}
            variant="ghost"
            className="fm-button-fix fm-button-brand px-8 w-full sm:w-auto"
          >
            {submitting ? 'Creating...' : 'SUBMIT'}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={submitting}
            className="border-brand text-brand px-8 w-full sm:w-auto"
          >
            CANCEL
          </Button>
        </div>
      </div>
    </div>
  );
};