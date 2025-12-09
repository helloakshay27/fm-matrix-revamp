import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useLayout } from '../contexts/LayoutContext';
import { 
  createParkingConfiguration, 
  fetchBuildings, 
  fetchFloors,
  Building,
  Floor,
  CreateParkingConfigurationRequest,
  ParkingSlotData 
} from '../services/parkingConfigurationsAPI';
import { 
  fetchParkingCategories, 
  ParkingCategory 
} from '../services/parkingConfigAPI';

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
    categories: {} as Record<number, {
      nonStack: number;
      stack: number;
      reserved: number;
    }>
  });
  
  // Track custom slot names - key format: "categoryId_type_index"
  const [customSlotNames, setCustomSlotNames] = useState<Record<string, string>>({});

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

  // Initialize form categories when parking categories are loaded
  useEffect(() => {
    if (parkingCategories.length > 0) {
      const categoriesFormData: Record<number, {
        nonStack: number;
        stack: number;
        reserved: number;
      }> = {};
      
      parkingCategories.forEach(category => {
        categoriesFormData[category.id] = {
          nonStack: 0,
          stack: 0,
          reserved: 0
        };
      });
      
      setFormData(prev => ({
        ...prev,
        categories: categoriesFormData
      }));
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
    const totalSlots = Object.values(formData.categories).reduce((total, category) => 
      total + category.nonStack + category.stack + category.reserved, 0);
    
    if (totalSlots === 0) {
      toast.error('Please add at least one parking slot');
      return;
    }

    if (parkingCategories.length === 0) {
      toast.error('Unable to find parking categories. Please try again.');
      return;
    }

    try {
      setSubmitting(true);
      
      // Generate parking slots data for all categories
      const requestData: CreateParkingConfigurationRequest = {
        building_id: formData.building_id,
        floor_id: formData.floor_id,
        // qrcode_needed: true, // Add QR code generation flag
      };

      // Add data for each category dynamically
      parkingCategories.forEach(category => {
        const categoryData = formData.categories[category.id];
        if (categoryData) {
          const totalCategorySlots = categoryData.nonStack + categoryData.stack + categoryData.reserved;
          
          // Only include categories that have at least one slot configured
          if (totalCategorySlots > 0) {
            const prefix = 'P'; // Use 'P' prefix for all categories
            const categorySlots = generateParkingSlotsData(category.id, prefix);
            
            console.log(`Category ${category.name} (ID: ${category.id}) slots:`, categorySlots);
            console.log(`Category ${category.name} data:`, {
              nonStack: categoryData.nonStack,
              stack: categoryData.stack,
              reserved: categoryData.reserved,
              totalSlots: categorySlots.length,
              generatedSlots: categorySlots
            });
            
            requestData[category.id.toString()] = {
              no_of_parkings: categorySlots.length,
              reserved_parkings: categorySlots.filter(slot => slot.reserved).length,
              parking: categorySlots
            };
          }
        }
      });

      // Add image if selected
      if (formData.floorMap) {
        requestData.attachment = formData.floorMap;
      }

      console.log('Submitting parking configuration:', requestData);
      console.log('Final request data keys:', Object.keys(requestData));
      console.log('Request data details:', JSON.stringify(requestData, null, 2));
      console.log('Floor Map File:', formData.floorMap ? formData.floorMap.name : 'None selected');
      
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

  const generateParkingSlotsData = (
    categoryId: number, 
    prefix: string
  ): ParkingSlotData[] => {
    const slots: ParkingSlotData[] = [];
    const categoryData = formData.categories[categoryId];
    
    if (!categoryData) return slots;
    
    let slotNumber = 1;

    // Non-stack slots
    for (let i = 0; i < categoryData.nonStack; i++) {
      const key = `${categoryId}_nonStack_${i}`;
      const customName = customSlotNames[key];
      slots.push({
        parking_name: customName || `${prefix}${slotNumber}`,
        reserved: false
      });
      slotNumber++;
    }

    // Stack slots (come in pairs)
    for (let i = 0; i < categoryData.stack; i++) {
      const keyA = `${categoryId}_stack_${i * 2}`;
      const keyB = `${categoryId}_stack_${i * 2 + 1}`;
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
      const key = `${categoryId}_reserved_${i}`;
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
    categoryId: number,
    type: 'nonStack' | 'stack' | 'reserved',
    value: number
  ) => {
    // Ensure the value is not negative
    const newValue = Math.max(0, value);
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryId]: {
          ...prev.categories[categoryId],
          [type]: newValue
        }
      }
    }));
  };

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

  // A reusable component for rendering a parking slot category
  const ParkingSlotCategory = ({
    title,
    categoryId,
    type,
    count,
    buttonColorClass,
    isStack = false,
  }: {
    title: string;
    categoryId: number;
    type: 'nonStack' | 'stack' | 'reserved';
    count: number;
    buttonColorClass: string;
    isStack?: boolean;
  }) => {

    const generateSlotName = (index: number) => {
        const key = `${categoryId}_${type}_${index}`;
        const customName = customSlotNames[key];
        if (customName) return customName;
        
        const prefix = 'P'; // Use 'P' prefix for all categories
        
        if (isStack) {
            const stackPairIndex = Math.floor(index / 2);
            const nonStackCount = formData.categories[categoryId]?.nonStack || 0;
            const stackSlotNumber = nonStackCount + stackPairIndex + 1;
            const suffix = index % 2 === 0 ? 'A' : 'B';
            return `${prefix}${stackSlotNumber}${suffix}`;
        }
        
        let baseNumber = 1;
        if (type === 'stack') {
             baseNumber = (formData.categories[categoryId]?.nonStack || 0) + 1;
        } else if (type === 'reserved') {
             baseNumber = (formData.categories[categoryId]?.nonStack || 0) + (formData.categories[categoryId]?.stack || 0) + 1;
        }
        
        return `${prefix}${baseNumber + index}`;
    };
    
    const handleSlotNameChange = (index: number, newName: string) => {
      const key = `${categoryId}_${type}_${index}`;
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
            {Array.from({ length: isStack ? count * 2 : count }, (_, index) => (
              <div key={index} className="relative">
                <Input
                  value={generateSlotName(index)}
                  onChange={(e) => handleSlotNameChange(index, e.target.value)}
                  className="w-full h-10 text-xs text-center bg-white border-gray-300 rounded-lg font-medium"
                  placeholder="Slot name"
                />
                <button
                  className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 text-xs border-2 border-white"
                  onClick={() => handleSlotCountChange(categoryId, type, count - 1)}
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
            onChange={(e) => handleSlotCountChange(categoryId, type, parseInt(e.target.value, 10) || 0)}
            className="w-16 h-8 text-center"
            min="0"
          />
          <Button
            size="sm"
            className={`${buttonColorClass} text-white`}
            onClick={() => handleSlotCountChange(categoryId, type, count + 1)}
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
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Location <span className="text-red-500">*</span></label>
            <Select 
              value={formData.building_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, building_id: value }))}
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
            <label className="block text-sm font-medium mb-2 text-gray-700">Floor <span className="text-red-500">*</span></label>
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
          <div className="text-sm font-semibold text-red-600 mb-6 border-b pb-2">Parking Configuration</div>
          
          {/* 2 Wheeler Section */}
          {/* Dynamic Parking Categories */}
          {parkingCategories.map((category, index) => (
            <div key={category.id} className={`${index % 2 === 0 ? 'bg-pink-50' : 'bg-blue-50'} rounded-lg p-6 mb-6`}>
              <h3 className="text-lg font-semibold mb-6">
                {category.name}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ParkingSlotCategory
                  title="Non Stack Parking"
                  categoryId={category.id}
                  type="nonStack"
                  count={formData.categories[category.id]?.nonStack || 0}
                  buttonColorClass="bg-purple-600 hover:bg-purple-700"
                />
                <ParkingSlotCategory
                  title="Stack Parking"
                  categoryId={category.id}
                  type="stack"
                  count={formData.categories[category.id]?.stack || 0}
                  buttonColorClass="bg-cyan-500 hover:bg-cyan-600"
                  isStack
                />
                <ParkingSlotCategory
                  title="Reserved Parking"
                  categoryId={category.id}
                  type="reserved"
                  count={formData.categories[category.id]?.reserved || 0}
                  buttonColorClass={index % 2 === 0 ? "bg-purple-600 hover:bg-purple-700" : "bg-cyan-500 hover:bg-cyan-600"}
                />
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
              className="cursor-pointer text-red-600 font-medium hover:text-red-700"
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
        <div className="flex justify-center items-center gap-4">
          <Button
            onClick={handleSubmit}
            disabled={submitting || !formData.building_id || !formData.floor_id}
            className="bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating...' : 'Submit'}
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