import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { FormControl, Select as MuiSelect, MenuItem } from '@mui/material';
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
  fetchParkingConfigByBuildingAndFloor,
  ParkingConfiguration,
  fetchParkingCategories,
  ParkingCategory
} from '../services/parkingConfigAPI';
import {
  createParkingConfiguration, // Use same function as Add page
  fetchBuildings,
  fetchFloors,
  Building,
  Floor,
  CreateParkingConfigurationRequest
} from '../services/parkingConfigurationsAPI';

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff !important',
    borderRadius: '12px',
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

export const EditSlotConfigurationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setCurrentSection } = useLayout();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [parkingCategories, setParkingCategories] = useState<ParkingCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    building_id: '',
    floor_id: '',
    qrcode_needed: false,
    floorMap: null as File | null,
    parking_image_url: '',
    parking_config_id: 0
  });

  // Slot names per category — the single source of truth for what gets saved.
  const [slots, setSlots] = useState<Record<number, CategorySlots>>({});

  const fetchBuildingsData = useCallback(async () => {
    try {
      const buildingsData = await fetchBuildings();
      setBuildings(buildingsData);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      toast.error('Failed to fetch buildings');
    }
  }, []);

  const fetchFloorsData = useCallback(async (buildingId: string) => {
    try {
      const floorsData = await fetchFloors(buildingId);
      setFloors(floorsData);
    } catch (error) {
      console.error('Error fetching floors:', error);
      toast.error('Failed to fetch floors');
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

    if (!id) return;

    // Parse building_id and floor_id from URL parameter
    const idParts = id.split('-');

    if (idParts.length !== 2) {
      toast.error('Invalid URL format. Expected format: buildingId-floorId');
      navigate('/settings/vas/parking-management/slot-configuration');
      return;
    }

    const buildingId = parseInt(idParts[0]);
    const floorId = parseInt(idParts[1]);

    if (isNaN(buildingId) || isNaN(floorId)) {
      toast.error('Invalid building ID or floor ID');
      navigate('/settings/vas/parking-management/slot-configuration');
      return;
    }

    console.log('Edit Slot Config - Fetching parking config with building ID:', buildingId, 'floor ID:', floorId);
    setLoading(true);

    fetchParkingConfigByBuildingAndFloor(buildingId, floorId)
      .then((data) => {
        console.log('Edit Slot Config - API Response:', data);

        // The API returns grouped_parking_configurations structure
        if (data.grouped_parking_configurations &&
            data.grouped_parking_configurations.length > 0) {

          const groupData = data.grouped_parking_configurations[0];
          const configs: ParkingConfiguration[] = groupData.parking_configurations;

          // Keep every slot's real name, for every category present in the response
          // (2 Wheeler, 4 Wheeler, EV, ...), so removing a slot removes exactly that one.
          const categorySlots: Record<number, CategorySlots> = {};
          configs.forEach((config) => {
            categorySlots[config.parking_category_id] = {
              nonStack: config.parking_numbers.filter(p => !p.stacked && !p.reserved).map(p => p.name),
              stack: config.parking_numbers.filter(p => p.stacked && !p.reserved).map(p => p.name),
              reserved: config.parking_numbers.filter(p => p.reserved).map(p => p.name),
            };
          });
          setSlots(categorySlots);

          const firstConfigWithImage = configs.find(c => c.parking_image_url);

          setFormData({
            building_id: groupData.building_id.toString(),
            floor_id: groupData.floor_id.toString(),
            qrcode_needed: groupData.qrcode_needed === 'true' || groupData.qrcode_needed === true,
            floorMap: null,
            parking_image_url: firstConfigWithImage?.parking_image_url || '',
            parking_config_id: configs[0]?.id || 0
          });

          // Fetch floors for the selected building
          fetchFloorsData(groupData.building_id.toString());
        } else {
          throw new Error(`No parking configurations found for building ${buildingId} and floor ${floorId}`);
        }
      })
      .catch((error) => {
        console.error('Edit Slot Config - Error:', error);

        // Show clean error message, not HTML content
        let errorMessage = 'Slot configuration not found';
        if (error.message && !error.message.includes('<html')) {
          if (error.message.length < 200) {
            errorMessage = error.message;
          }
        }

        toast.error(errorMessage);
        navigate('/settings/vas/parking-management/slot-configuration');
      })
      .finally(() => setLoading(false));
  }, [setCurrentSection, id, navigate, fetchBuildingsData, fetchFloorsData, fetchParkingCategoriesData]);

  // Ensure every fetched parking category has a slot list, even if the site currently has no
  // configured slots for it yet (e.g. a newly added category).
  useEffect(() => {
    if (parkingCategories.length === 0) return;

    setSlots(prev => {
      let changed = false;
      const next = { ...prev };
      parkingCategories.forEach(category => {
        if (!next[category.id]) {
          next[category.id] = emptyCategorySlots();
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [parkingCategories]);

  const handleBack = () => {
    navigate('/settings/vas/parking-management/slot-configuration');
  };

  const handleSubmit = async () => {
    if (!formData.building_id || !formData.floor_id) {
      toast.error('Please select both building and floor');
      return;
    }

    // Check if there are any parking slots to update
    const totalSlots = Object.values(slots).reduce((total, category) => total + totalSlotCount(category), 0);

    if (totalSlots === 0) {
      toast.error('Please add at least one parking slot');
      return;
    }

    if (parkingCategories.length === 0) {
      toast.error('Unable to find parking categories. Please ensure categories are properly configured.');
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

      // Build the request body using same structure as Add page
      const requestData: CreateParkingConfigurationRequest = {
        building_id: formData.building_id,
        floor_id: formData.floor_id,
        qrcode_needed: formData.qrcode_needed // Use checkbox value
      };

      // Add data for each category that has at least one slot configured
      parkingCategories.forEach(category => {
        const categorySlots = buildParkingSlotsData(slots[category.id] ?? emptyCategorySlots());
        if (categorySlots.length > 0) {
          requestData[category.id] = {
            no_of_parkings: categorySlots.length,
            reserved_parkings: categorySlots.filter(slot => slot.reserved).length,
            parking: categorySlots
          };
        }
      });

      // Handle image replacement - always send attachment if new file is selected
      if (formData.floorMap) {
        requestData.attachment = formData.floorMap;
      }
      // If no new file selected, existing image will remain unchanged

      await createParkingConfiguration(requestData); // Use same function as Add page

      toast.success('Parking configuration updated successfully!');
      navigate('/settings/vas/parking-management/slot-configuration');
    } catch (error) {
      console.error('Error updating parking configuration:', error);
      toast.error('Failed to update parking configuration');
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

    // Clean up previous preview URL if it exists
    if (formData.floorMap && typeof formData.floorMap === 'object') {
      URL.revokeObjectURL(URL.createObjectURL(formData.floorMap));
    }

    setFormData(prev => ({ ...prev, floorMap: file }));
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (formData.floorMap && typeof formData.floorMap === 'object') {
        URL.revokeObjectURL(URL.createObjectURL(formData.floorMap));
      }
    };
  }, [formData.floorMap]);

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

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
        <h1 className="text-xl sm:text-2xl font-semibold">Edit Parking Group Configuration</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {/* Location and Floor Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
              Location <span className="text-red-500">*</span>
            </label>
            <FormControl fullWidth variant="outlined">
              <MuiSelect
                value={formData.building_id}
                onChange={(e) => {
                  const value = e.target.value as string;
                  setFormData((prev) => ({ ...prev, building_id: value, floor_id: '' }));
                  fetchFloorsData(value);
                }}
                displayEmpty
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
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
              Floor <span className="text-red-500">*</span>
            </label>
            <FormControl fullWidth variant="outlined">
              <MuiSelect
                value={formData.floor_id}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, floor_id: e.target.value as string }))
                }
                displayEmpty
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
        </div>

        {/* QR Code Configuration */}
        <div className="mb-8">
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
        </div>

        {/* Parking Configuration */}
        <div className="mb-8">
          <div className="text-sm font-semibold text-brand mb-6 border-b pb-2">Parking Configuration</div>

          {/* Dynamic Parking Categories - renders every category returned by the API (2 Wheeler, 4 Wheeler, EV, ...) */}
          {parkingCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl p-6 mb-6 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800 mb-6">
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
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
            <input
              type="file"
              id="floorMap"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex items-center justify-center gap-4">
              <label
                htmlFor="floorMap"
                className="cursor-pointer text-red-600 font-medium hover:text-red-700"
              >
                Choose File
              </label>
              <div className="">
              <span className="text-gray-500">
                {formData.floorMap ? formData.floorMap.name : 'No file chosen'}
              </span>
            </div>
            </div>


            {/* Image Preview */}
            {(formData.floorMap || formData.parking_image_url) && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {formData.floorMap ? 'Preview:' : 'Preview:'}
                </p>
                <div className="w-32 h-32 bg-gray-100 rounded border overflow-hidden mx-auto">
                  {formData.floorMap ? (
                    // Preview new uploaded file
                    formData.floorMap.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(formData.floorMap)}
                        alt="Floor map preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                        PDF Preview
                      </div>
                    )
                  ) : (
                    // Show existing image
                    <img
                      src={formData.parking_image_url}
                      alt="Current floor map"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  )}
                  {/* Fallback for broken images */}
                  {!formData.floorMap && (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs" style={{display: 'none'}}>
                      Image Not Available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fm-action-bar mt-6">
        <button
          type="button"
          onClick={handleCancel}
          disabled={submitting}
          className="fm-action-secondary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !formData.building_id || !formData.floor_id}
          className="fm-action-primary"
        >
          {submitting ? 'Updating...' : 'Update'}
        </button>
      </div>
    </div>
  );
};
