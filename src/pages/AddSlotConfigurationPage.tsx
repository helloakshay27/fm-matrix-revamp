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

export const AddSlotConfigurationPage = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    building_id: '',
    floor_id: '',
    twoWheeler: {
      nonStack: 0, // Initial value for better visualization
      stack: 0,    // Initial value for better visualization
      reserved: 0  // Initial value for better visualization
    },
    fourWheeler: {
      nonStack: 0, // Initial value for better visualization
      stack: 0,    // Initial value for better visualization
      reserved: 0  // Initial value for better visualization
    },
    floorMap: null as File | null
  });

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

  useEffect(() => {
    setCurrentSection('Settings');
    fetchBuildingsData();
  }, [setCurrentSection, fetchBuildingsData]);

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

    // Check if there are any parking slots to create
    const totalSlots = formData.twoWheeler.nonStack + formData.twoWheeler.stack + formData.twoWheeler.reserved +
                      formData.fourWheeler.nonStack + formData.fourWheeler.stack + formData.fourWheeler.reserved;
    
    if (totalSlots === 0) {
      toast.error('Please add at least one parking slot');
      return;
    }

    try {
      setSubmitting(true);
      
      // Generate parking slots data
      const twoWheelerSlots = generateParkingSlotsData('twoWheeler', 'P');
      const fourWheelerSlots = generateParkingSlotsData('fourWheeler', 'B');

      const requestData: CreateParkingConfigurationRequest = {
        building_id: formData.building_id,
        floor_id: formData.floor_id,
        '5': { // 2 Wheeler category ID
          no_of_parkings: twoWheelerSlots.length,
          reserved_parkings: twoWheelerSlots.filter(slot => slot.reserved).length,
          parking: twoWheelerSlots
        },
        '6': { // 4 Wheeler category ID  
          no_of_parkings: fourWheelerSlots.length,
          reserved_parkings: fourWheelerSlots.filter(slot => slot.reserved).length,
          parking: fourWheelerSlots
        }
      };

      console.log('Submitting parking configuration:', requestData);
      console.log('Two Wheeler Slots:', twoWheelerSlots);
      console.log('Four Wheeler Slots:', fourWheelerSlots);
      
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
    category: 'twoWheeler' | 'fourWheeler', 
    prefix: string
  ): ParkingSlotData[] => {
    const slots: ParkingSlotData[] = [];
    const categoryData = formData[category];
    let slotNumber = 1;

    // Non-stack slots
    for (let i = 0; i < categoryData.nonStack; i++) {
      slots.push({
        parking_name: `${prefix}${slotNumber}`,
        reserved: false
      });
      slotNumber++;
    }

    // Stack slots (come in pairs)
    for (let i = 0; i < categoryData.stack; i++) {
      slots.push({
        parking_name: `${prefix}${slotNumber}A`,
        reserved: false,
        stacked: true
      });
      slots.push({
        parking_name: `${prefix}${slotNumber}B`,
        reserved: false,
        stacked: true
      });
      slotNumber++;
    }

    // Reserved slots
    for (let i = 0; i < categoryData.reserved; i++) {
      slots.push({
        parking_name: `${prefix}${slotNumber}`,
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
    setFormData(prev => ({ ...prev, floorMap: file }));
  };

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
        const prefix = category === 'twoWheeler' ? 'P' : 'B';
        
        if (isStack) {
            const stackPairIndex = Math.floor(index / 2);
            const nonStackCount = formData[category].nonStack;
            const stackSlotNumber = nonStackCount + stackPairIndex + 1;
            const suffix = index % 2 === 0 ? 'A' : 'B';
            return `${prefix}${stackSlotNumber}${suffix}`;
        }
        
        let baseNumber = 1;
        if (type === 'stack') { // This logic is simplified; main logic is in `isStack`
             baseNumber = formData[category].nonStack + 1;
        } else if (type === 'reserved') {
             baseNumber = formData[category].nonStack + formData[category].stack + 1;
        }
        
        return `${prefix}${baseNumber + index}`;
    };

    return (
      <div>
        <h4 className="font-medium mb-4">{title}</h4>
        <div className="bg-white rounded-lg p-4 mb-4 h-[200px] border-2 border-dashed border-gray-200 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: isStack ? count * 2 : count }, (_, index) => (
              <div key={index} className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-10 text-xs bg-white border-gray-300 hover:bg-gray-50 rounded-lg font-medium"
                >
                  {generateSlotName(index)}
                </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Location</label>
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

        {/* Summary Section */}
        {(formData.twoWheeler.nonStack + formData.twoWheeler.stack + formData.twoWheeler.reserved +
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
        )}

        {/* Parking Configuration */}
        <div className="mb-8">
          <div className="text-sm font-semibold text-red-600 mb-6 border-b pb-2">Parking Configuration</div>
          
          {/* 2 Wheeler Section */}
          <div className="bg-pink-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-6">2 Wheeler</h3>
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
            <h3 className="text-lg font-semibold mb-6">4 Wheeler</h3>
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
            <label
              htmlFor="floorMap"
              className="cursor-pointer text-red-600 font-medium hover:text-red-700"
            >
              Choose File
            </label>
            <span className="ml-2 text-gray-500">
              {formData.floorMap ? formData.floorMap.name : 'No file chosen'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
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