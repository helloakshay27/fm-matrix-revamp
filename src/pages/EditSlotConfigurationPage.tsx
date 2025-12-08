import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useLayout } from '../contexts/LayoutContext';
import { 
  fetchParkingConfigByBuildingAndFloor, 
  ParkingNumber, 
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
  CreateParkingConfigurationRequest,
  ParkingSlotData 
} from '../services/parkingConfigurationsAPI';

export const EditSlotConfigurationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setCurrentSection } = useLayout();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [parkingCategories, setParkingCategories] = useState<ParkingCategory[]>([]);
  const [twoWheelerCategoryId, setTwoWheelerCategoryId] = useState<number | null>(null);
  const [fourWheelerCategoryId, setFourWheelerCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    building_id: '',
    floor_id: '',
    qrcode_needed: false,
    twoWheeler: {
      nonStack: 0,
      stack: 0,
      reserved: 0,
      parkingNumbers: [] as ParkingNumber[]
    },
    fourWheeler: {
      nonStack: 0,
      stack: 0,
      reserved: 0,
      parkingNumbers: [] as ParkingNumber[]
    },
    floorMap: null as File | null,
    parking_image_url: '',
    parking_config_id: 0
  });
  
  // Track custom slot names - key format: "category_type_index"
  const [customSlotNames, setCustomSlotNames] = useState<Record<string, string>>({});

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
          const configs = groupData.parking_configurations;
          
          // Dynamically find category IDs from the configurations
          // Use the parking_category_id to distinguish between different categories
          // Sort configs by parking_category_id to ensure consistent assignment
          const sortedConfigs = configs.sort((a, b) => a.parking_category_id - b.parking_category_id);
          
          const twoWheelerConfig = sortedConfigs.find(config => 
            config.parking_category_id === 5 || // Usually 5 for 2-wheeler
            config.category_name.toLowerCase().includes('2') ||
            config.category_name.toLowerCase().includes('two') ||
            config.category_name.toLowerCase().includes('wheeler')
          );
          const fourWheelerConfig = sortedConfigs.find(config => 
            config.parking_category_id === 6 || // Usually 6 for 4-wheeler
            (config.category_name.toLowerCase().includes('4') ||
            config.category_name.toLowerCase().includes('four') ||
            config.category_name.toLowerCase().includes('car')) &&
            config.parking_category_id !== twoWheelerConfig?.parking_category_id
          );
          
          // Store the category IDs for later use
          if (twoWheelerConfig) {
            setTwoWheelerCategoryId(twoWheelerConfig.parking_category_id);
            console.log('Two Wheeler Config found:', twoWheelerConfig.category_name, 'ID:', twoWheelerConfig.parking_category_id);
          }
          if (fourWheelerConfig) {
            setFourWheelerCategoryId(fourWheelerConfig.parking_category_id);
            console.log('Four Wheeler Config found:', fourWheelerConfig.category_name, 'ID:', fourWheelerConfig.parking_category_id);
          }
          
          // Count different parking types for each category and populate custom slot names
          const get2WheelerCounts = (config: ParkingConfiguration | undefined) => {
            if (!config) return { nonStack: 0, stack: 0, reserved: 0, parkingNumbers: [] };
            
            const nonStackSlots = config.parking_numbers.filter(p => !p.stacked && !p.reserved);
            const stackSlots = config.parking_numbers.filter(p => p.stacked && !p.reserved);
            const reservedSlots = config.parking_numbers.filter(p => p.reserved);
            
            // Populate custom slot names from API data
            const customNames: Record<string, string> = {};
            
            nonStackSlots.forEach((slot, index) => {
              customNames[`twoWheeler_nonStack_${index}`] = slot.name;
            });
            
            stackSlots.forEach((slot, index) => {
              customNames[`twoWheeler_stack_${index}`] = slot.name;
            });
            
            reservedSlots.forEach((slot, index) => {
              customNames[`twoWheeler_reserved_${index}`] = slot.name;
            });
            
            // Update customSlotNames state
            setCustomSlotNames(prev => ({ ...prev, ...customNames }));
            
            return {
              nonStack: nonStackSlots.length,
              stack: stackSlots.length / 2, // Stack comes in pairs
              reserved: reservedSlots.length,
              parkingNumbers: config.parking_numbers
            };
          };

          const get4WheelerCounts = (config: ParkingConfiguration | undefined) => {
            if (!config) return { nonStack: 0, stack: 0, reserved: 0, parkingNumbers: [] };
            
            const nonStackSlots = config.parking_numbers.filter(p => !p.stacked && !p.reserved);
            const stackSlots = config.parking_numbers.filter(p => p.stacked && !p.reserved);
            const reservedSlots = config.parking_numbers.filter(p => p.reserved);
            
            // Populate custom slot names from API data
            const customNames: Record<string, string> = {};
            
            nonStackSlots.forEach((slot, index) => {
              customNames[`fourWheeler_nonStack_${index}`] = slot.name;
            });
            
            stackSlots.forEach((slot, index) => {
              customNames[`fourWheeler_stack_${index}`] = slot.name;
            });
            
            reservedSlots.forEach((slot, index) => {
              customNames[`fourWheeler_reserved_${index}`] = slot.name;
            });
            
            // Update customSlotNames state
            setCustomSlotNames(prev => ({ ...prev, ...customNames }));
            
            return {
              nonStack: nonStackSlots.length,
              stack: stackSlots.length / 2, // Stack comes in pairs
              reserved: reservedSlots.length,
              parkingNumbers: config.parking_numbers
            };
          };

          setFormData({
            building_id: groupData.building_id.toString(),
            floor_id: groupData.floor_id.toString(),
            qrcode_needed: groupData.qrcode_needed === 'true' || groupData.qrcode_needed === true,
            twoWheeler: get2WheelerCounts(twoWheelerConfig),
            fourWheeler: get4WheelerCounts(fourWheelerConfig),
            floorMap: null,
            parking_image_url: twoWheelerConfig?.parking_image_url || fourWheelerConfig?.parking_image_url || '',
            parking_config_id: twoWheelerConfig?.id || fourWheelerConfig?.id || 0
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

  const handleBack = () => {
    navigate('/settings/vas/parking-management/slot-configuration');
  };

  const handleSubmit = async () => {
    if (!formData.building_id || !formData.floor_id) {
      toast.error('Please select both building and floor');
      return;
    }

    // Check if there are any parking slots to update
    const totalSlots = formData.twoWheeler.nonStack + formData.twoWheeler.stack + formData.twoWheeler.reserved +
                      formData.fourWheeler.nonStack + formData.fourWheeler.stack + formData.fourWheeler.reserved;
    
    if (totalSlots === 0) {
      toast.error('Please add at least one parking slot');
      return;
    }

    // Find category IDs dynamically from state (which were set during data loading)
    const twoWheelerCategory = twoWheelerCategoryId 
      ? parkingCategories.find(cat => cat.id === twoWheelerCategoryId)
      : null;
    
    const fourWheelerCategory = fourWheelerCategoryId 
      ? parkingCategories.find(cat => cat.id === fourWheelerCategoryId)
      : null;

    if (!twoWheelerCategory || !fourWheelerCategory) {
      toast.error('Unable to find parking categories. Please ensure categories are properly configured.');
      return;
    }

    console.log('Found categories:', {
      twoWheeler: twoWheelerCategory,
      fourWheeler: fourWheelerCategory
    });

    try {
      setSubmitting(true);
      
      // Generate parking slots data for update
      const twoWheelerSlots = generateParkingSlotsData('twoWheeler', 'P');
      const fourWheelerSlots = generateParkingSlotsData('fourWheeler', 'P');

      // Build the request body using same structure as Add page
      const requestData: CreateParkingConfigurationRequest = {
        building_id: formData.building_id,
        floor_id: formData.floor_id,
        qrcode_needed: formData.qrcode_needed // Use checkbox value
      };

      // Add 2 Wheeler category data if there are slots
      if (formData.twoWheeler.nonStack > 0 || formData.twoWheeler.stack > 0 || formData.twoWheeler.reserved > 0) {
        requestData[twoWheelerCategory.id] = {
          no_of_parkings: twoWheelerSlots.length,
          reserved_parkings: twoWheelerSlots.filter(slot => slot.reserved).length,
          parking: twoWheelerSlots
        };
      }

      // Add 4 Wheeler category data if there are slots
      if (formData.fourWheeler.nonStack > 0 || formData.fourWheeler.stack > 0 || formData.fourWheeler.reserved > 0) {
        requestData[fourWheelerCategory.id] = {
          no_of_parkings: fourWheelerSlots.length,
          reserved_parkings: fourWheelerSlots.filter(slot => slot.reserved).length,
          parking: fourWheelerSlots
        };
      }

      // Handle image replacement - always send attachment if new file is selected
      if (formData.floorMap) {
        requestData.attachment = formData.floorMap;
        console.log('Replacing existing floor map with new file:', formData.floorMap.name);
      }
      // If no new file selected, existing image will remain unchanged

      console.log('Updating parking config with requestData:', requestData);
      console.log('Two Wheeler Slots:', twoWheelerSlots);
      console.log('Four Wheeler Slots:', fourWheelerSlots);
      console.log('Floor Map File:', formData.floorMap ? formData.floorMap.name : 'None selected');
      console.log('Existing Image URL:', formData.parking_image_url || 'None');
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

  const generateParkingSlotsData = (
    category: 'twoWheeler' | 'fourWheeler', 
    prefix: string
  ): ParkingSlotData[] => {
    const slots: ParkingSlotData[] = [];
    const categoryData = formData[category];
    let slotNumber = 1;

    // Non-stack slots
    for (let i = 0; i < categoryData.nonStack; i++) {
      const key = `${category}_nonStack_${i}`;
      const customName = customSlotNames[key];
      slots.push({
        parking_name: customName || `${prefix}${slotNumber}`,
        reserved: false
      });
      slotNumber++;
    }

    // Stack slots (come in pairs)
    for (let i = 0; i < categoryData.stack; i++) {
      const keyA = `${category}_stack_${i * 2}`;
      const keyB = `${category}_stack_${i * 2 + 1}`;
      const customNameA = customSlotNames[keyA];
      const customNameB = customSlotNames[keyB];
      slots.push({
        parking_name: customNameA || `${prefix}${slotNumber}A`,
        reserved: false,
        stacked: true
      });
      slots.push({
        parking_name: customNameB || `${prefix}${slotNumber}B`,
        reserved: false,
        stacked: true
      });
      slotNumber++;
    }

    // Reserved slots
    for (let i = 0; i < categoryData.reserved; i++) {
      const key = `${category}_reserved_${i}`;
      const customName = customSlotNames[key];
      slots.push({
        parking_name: customName || `${prefix}${slotNumber}`,
        reserved: true
      });
      slotNumber++;
    }

    return slots;
  };

  const handleCancel = () => {
    navigate('/settings/vas/parking-management/slot-configuration');
  };

  const handleSlotCountChange = (
    category: 'twoWheeler' | 'fourWheeler',
    type: 'nonStack' | 'stack' | 'reserved',
    value: number
  ) => {
    // Ensure the value is not negative
    const newValue = Math.max(0, value);
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: newValue
      }
    }));
  };

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

  // A reusable component for rendering a parking slot category
  const ParkingSlotCategory = ({
    title,
    category,
    type,
    count,
    buttonColorClass,
    isStack = false,
  }: {
    title: string;
    category: 'twoWheeler' | 'fourWheeler';
    type: 'nonStack' | 'stack' | 'reserved';
    count: number;
    buttonColorClass: string;
    isStack?: boolean;
  }) => {

    const generateSlotName = (index: number) => {
        const key = `${category}_${type}_${index}`;
        const customName = customSlotNames[key];
        if (customName) return customName;
        
        const prefix = category === 'twoWheeler' ? 'P' : 'P';
        
        if (isStack) {
            const stackPairIndex = Math.floor(index / 2);
            const nonStackCount = formData[category].nonStack;
            const stackSlotNumber = nonStackCount + stackPairIndex + 1;
            const suffix = index % 2 === 0 ? 'A' : 'B';
            return `${prefix}${stackSlotNumber}${suffix}`;
        }
        
        let baseNumber = 1;
        if (type === 'stack') {
             baseNumber = formData[category].nonStack + 1;
        } else if (type === 'reserved') {
             baseNumber = formData[category].nonStack + formData[category].stack + 1;
        }
        
        return `${prefix}${baseNumber + index}`;
    };
    
    const handleSlotNameChange = (index: number, newName: string) => {
      const key = `${category}_${type}_${index}`;
      setCustomSlotNames(prev => ({
        ...prev,
        [key]: newName
      }));
    };

    return (
      <div>
        <h4 className="font-medium mb-4">{title}</h4>
        <div className="bg-white rounded-lg p-4 mb-4 h-[200px] border-2 border-dashed border-gray-200 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: isStack ? count * 2 : count }, (_, index) => index)
              .sort((a, b) => {
                // Sort slots by their display names
                const nameA = generateSlotName(a);
                const nameB = generateSlotName(b);
                
                // Extract numeric part for proper sorting
                const matchA = nameA.match(/(\d+)([A-Z]?)/);
                const matchB = nameB.match(/(\d+)([A-Z]?)/);
                
                if (matchA && matchB) {
                  const numA = parseInt(matchA[1]);
                  const numB = parseInt(matchB[1]);
                  
                  if (numA !== numB) return numA - numB;
                  
                  // If numbers are same, sort by suffix (A before B)
                  const suffixA = matchA[2] || '';
                  const suffixB = matchB[2] || '';
                  return suffixA.localeCompare(suffixB);
                }
                
                return nameA.localeCompare(nameB);
              })
              .map((index) => (
              <div key={index} className="relative">
                <Input
                  value={generateSlotName(index)}
                  onChange={(e) => handleSlotNameChange(index, e.target.value)}
                  className="w-full h-10 text-xs text-center bg-white border-gray-300 rounded-lg font-medium"
                  placeholder="Slot name"
                />
                <button
                  className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 text-xs border-2 border-white"
                  onClick={() => handleSlotCountChange(category, type, count - 1)}
                >
                  &#x2715;
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={count}
            onChange={(e) => handleSlotCountChange(category, type, parseInt(e.target.value, 10) || 0)}
            className="w-16 h-8 text-center"
            min="0"
          />
          <Button
            size="sm"
            className={`${buttonColorClass} text-white`}
            onClick={() => handleSlotCountChange(category, type, count + 1)}
          >
            Add
          </Button>
          <span className="text-sm font-medium text-gray-600">
            Total: {isStack ? count * 2 : count}
          </span>
        </div>
      </div>
    );
  };

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

      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Location and Floor Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Location</label>
            <Select 
              value={formData.building_id} 
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, building_id: value, floor_id: '' }));
                fetchFloorsData(value);
              }}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={loading ? "Loading buildings..." : "Select Location"} />
              </SelectTrigger>
              <SelectContent>
                {buildings.map((building) => (
                  <SelectItem key={building.id} value={building.id.toString()}>
                    {building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Floor</label>
            <Select 
              value={formData.floor_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, floor_id: value }))}
              disabled={loading || !formData.building_id}
            >
              <SelectTrigger className="w-full">
                <SelectValue 
                  placeholder={
                    !formData.building_id ? "Select Location first" :
                    loading ? "Loading floors..." : 
                    "Select Floor"
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                {floors.map((floor) => (
                  <SelectItem key={floor.id} value={floor.id.toString()}>
                    {floor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

        {/* Summary Section */}
        {/* {(formData.twoWheeler.nonStack + formData.twoWheeler.stack + formData.twoWheeler.reserved +
          formData.fourWheeler.nonStack + formData.fourWheeler.stack + formData.fourWheeler.reserved) > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Parking Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-700">2 Wheeler Total:</span>
                <span className="ml-2 text-blue-600">
                  {formData.twoWheeler.nonStack + formData.twoWheeler.stack * 2 + formData.twoWheeler.reserved} slots
                </span>
              </div>
              <div>
                <span className="font-medium text-blue-700">4 Wheeler Total:</span>
                <span className="ml-2 text-blue-600">
                  {formData.fourWheeler.nonStack + formData.fourWheeler.stack * 2 + formData.fourWheeler.reserved} slots
                </span>
              </div>
            </div>
          </div>
        )} */}

        {/* Parking Configuration */}
        <div className="mb-8">
          <div className="text-sm font-semibold text-red-600 mb-6 border-b pb-2">Parking Configuration</div>
          
          {/* 2 Wheeler Section */}
          <div className="bg-pink-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-6">
              {twoWheelerCategoryId 
                ? parkingCategories.find(cat => cat.id === twoWheelerCategoryId)?.name || ''
                : '2 Wheeler'
              }
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <ParkingSlotCategory
                    title="Non Stack Parking"
                    category="twoWheeler"
                    type="nonStack"
                    count={formData.twoWheeler.nonStack}
                    buttonColorClass="bg-purple-600 hover:bg-purple-700"
                />
                <ParkingSlotCategory
                    title="Stack Parking"
                    category="twoWheeler"
                    type="stack"
                    count={formData.twoWheeler.stack}
                    buttonColorClass="bg-cyan-500 hover:bg-cyan-600"
                    isStack
                />
                <ParkingSlotCategory
                    title="Reserved Parking"
                    category="twoWheeler"
                    type="reserved"
                    count={formData.twoWheeler.reserved}
                    buttonColorClass="bg-purple-600 hover:bg-purple-700"
                />
            </div>
          </div>

          {/* 4 Wheeler Section */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-6">
              {fourWheelerCategoryId 
                ? parkingCategories.find(cat => cat.id === fourWheelerCategoryId)?.name || '4 Wheeler'
                : '4 Wheeler'
              }
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ParkingSlotCategory
                    title="Non Stack Parking"
                    category="fourWheeler"
                    type="nonStack"
                    count={formData.fourWheeler.nonStack}
                    buttonColorClass="bg-purple-600 hover:bg-purple-700"
                />
                <ParkingSlotCategory
                    title="Stack Parking"
                    category="fourWheeler"
                    type="stack"
                    count={formData.fourWheeler.stack}
                    buttonColorClass="bg-cyan-500 hover:bg-cyan-600"
                    isStack
                />
                <ParkingSlotCategory
                    title="Reserved Parking"
                    category="fourWheeler"
                    type="reserved"
                    count={formData.fourWheeler.reserved}
                    buttonColorClass="bg-cyan-500 hover:bg-cyan-600"
                />
            </div>
          </div>
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
              {/* {formData.parking_image_url && !formData.floorMap && (
                <a
                  href={formData.parking_image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium hover:text-blue-700 underline"
                >
                  View Current Image
                </a>
              )} */}
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

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-4">
          <Button
            onClick={handleSubmit}
            disabled={submitting || !formData.building_id || !formData.floor_id}
            className="bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Updating...' : 'Update'}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};