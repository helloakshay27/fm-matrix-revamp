import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { useLayout } from '../contexts/LayoutContext';

export const AddSlotConfigurationPage = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();
  const [formData, setFormData] = useState({
    location: '',
    floor: '',
    twoWheeler: {
      nonStack: 0,
      stack: 0,
      reserved: 0
    },
    fourWheeler: {
      nonStack: 0,
      stack: 0,
      reserved: 0
    },
    floorMap: null as File | null
  });

  React.useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);

  const handleBack = () => {
    navigate('/settings/vas/parking-management/slot-configuration');
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission logic here
    navigate('/settings/vas/parking-management/slot-configuration');
  };

  const handleCancel = () => {
    navigate('/settings/vas/parking-management/slot-configuration');
  };

  const handleSliderChange = (category: 'twoWheeler' | 'fourWheeler', type: 'nonStack' | 'stack' | 'reserved', value: number) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: value
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, floorMap: file }));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Parking Group Configuration</h1>
      </div>

      <div className="bg-white rounded-lg p-6">
        {/* Location and Floor Selection */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sai-radhe">Sai Radhe</SelectItem>
                <SelectItem value="building-a">Building A</SelectItem>
                <SelectItem value="building-b">Building B</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Floor</label>
            <Select value={formData.floor} onValueChange={(value) => setFormData(prev => ({ ...prev, floor: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ground">Ground Floor</SelectItem>
                <SelectItem value="first">First Floor</SelectItem>
                <SelectItem value="second">Second Floor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Parking Configuration */}
        <div className="mb-8">
          <div className="text-sm text-red-600 mb-6">Parking Configuration</div>
          
          {/* 2 Wheeler Section */}
          <div className="bg-pink-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-6">2 Wheeler</h3>
            <div className="grid grid-cols-3 gap-8">
              {/* Non Stack Parking */}
              <div>
                <h4 className="font-medium mb-4">Non Stack Parking</h4>
                <div className="bg-white rounded-lg p-4 mb-4 h-[200px] border-2 border-dashed border-gray-200 overflow-auto">
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: formData.twoWheeler.nonStack }, (_, index) => (
                      <div key={index} className="relative bg-gray-50 rounded-lg border border-gray-200 p-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-14 h-8 text-xs bg-white border-gray-200 hover:bg-gray-50 rounded-lg font-medium"
                        >
                          P{index + 1}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 w-5 h-5 min-w-5 min-h-5 p-0 rounded-full bg-red-500 text-white hover:bg-red-600 text-[10px] flex items-center justify-center border-0 z-10 aspect-square"
                          onClick={() => handleSliderChange('twoWheeler', 'nonStack', formData.twoWheeler.nonStack - 1)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={formData.twoWheeler.nonStack}
                    onChange={(e) => handleSliderChange('twoWheeler', 'nonStack', parseInt(e.target.value) || 0)}
                    className="w-16 h-8 text-center"
                    min="0"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                    onClick={() => handleSliderChange('twoWheeler', 'nonStack', formData.twoWheeler.nonStack + 1)}
                  >
                    Add
                  </Button>
                  <span className="text-sm">{formData.twoWheeler.nonStack}</span>
                </div>
              </div>

              {/* Stack Parking */}
              <div>
                <h4 className="font-medium mb-4">Stack Parking</h4>
                <div className="bg-white rounded-lg p-4 mb-4 h-[200px] border-2 border-dashed border-gray-200 overflow-auto">
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: formData.twoWheeler.stack }, (_, index) => (
                      <div key={index} className="relative bg-gray-50 rounded-lg border border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-14 h-8 text-xs bg-white border-gray-200 hover:bg-gray-50 rounded-lg font-medium relative"
                        >
                          P{index + 11}C
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 w-4 h-4 p-0 rounded-full bg-orange-500 text-white hover:bg-orange-600 text-[10px] flex items-center justify-center"
                          onClick={() => handleSliderChange('twoWheeler', 'stack', formData.twoWheeler.stack - 1)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={formData.twoWheeler.stack}
                    onChange={(e) => handleSliderChange('twoWheeler', 'stack', parseInt(e.target.value) || 0)}
                    className="w-16 h-8 text-center"
                    min="0"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                    onClick={() => handleSliderChange('twoWheeler', 'stack', formData.twoWheeler.stack + 1)}
                  >
                    Add
                  </Button>
                  <span className="text-sm">{formData.twoWheeler.stack}</span>
                </div>
              </div>

              {/* Reserved Parkings */}
              <div>
                <h4 className="font-medium mb-4">Reserved Parkings</h4>
                <div className="bg-white rounded-lg p-4 mb-4 h-[200px] border-2 border-dashed border-gray-200 overflow-auto">
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: formData.twoWheeler.reserved }, (_, index) => (
                      <div key={index} className="relative bg-gray-50 rounded-lg border border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-14 h-8 text-xs bg-white border-gray-200 hover:bg-gray-50 rounded-lg font-medium relative"
                        >
                          P{index + 11}H
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 w-4 h-4 p-0 rounded-full bg-orange-500 text-white hover:bg-orange-600 text-[10px] flex items-center justify-center"
                          onClick={() => handleSliderChange('twoWheeler', 'reserved', formData.twoWheeler.reserved - 1)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={formData.twoWheeler.reserved}
                    onChange={(e) => handleSliderChange('twoWheeler', 'reserved', parseInt(e.target.value) || 0)}
                    className="w-16 h-8 text-center"
                    min="0"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                    onClick={() => handleSliderChange('twoWheeler', 'reserved', formData.twoWheeler.reserved + 1)}
                  >
                    Add
                  </Button>
                  <span className="text-sm">{formData.twoWheeler.reserved}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Wheeler Section */}
          <div className="bg-pink-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-6">4 Wheeler</h3>
            <div className="grid grid-cols-3 gap-8">
              {/* Non Stack Parking */}
              <div>
                <h4 className="font-medium mb-4">Non Stack Parking</h4>
                <div className="bg-white rounded-lg p-4 mb-4 h-[200px] border-2 border-dashed border-gray-200 overflow-auto">
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: formData.fourWheeler.nonStack }, (_, index) => (
                      <div key={index} className="relative bg-gray-50 rounded-lg border border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-14 h-8 text-xs bg-white border-gray-200 hover:bg-gray-50 rounded-lg font-medium relative"
                        >
                          P{index + 1}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 w-4 h-4 p-0 rounded-full bg-orange-500 text-white hover:bg-orange-600 text-[10px] flex items-center justify-center"
                          onClick={() => handleSliderChange('fourWheeler', 'nonStack', formData.fourWheeler.nonStack - 1)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={formData.fourWheeler.nonStack}
                    onChange={(e) => handleSliderChange('fourWheeler', 'nonStack', parseInt(e.target.value) || 0)}
                    className="w-16 h-8 text-center"
                    min="0"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                    onClick={() => handleSliderChange('fourWheeler', 'nonStack', formData.fourWheeler.nonStack + 1)}
                  >
                    Add
                  </Button>
                  <span className="text-sm">{formData.fourWheeler.nonStack}</span>
                </div>
              </div>

              {/* Stack Parking */}
              <div>
                <h4 className="font-medium mb-4">Stack Parking</h4>
                <div className="bg-white rounded-lg p-4 mb-4 h-[200px] border-2 border-dashed border-gray-200 overflow-auto">
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: formData.fourWheeler.stack }, (_, index) => (
                      <div key={index} className="relative bg-gray-50 rounded-lg border border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-14 h-8 text-xs bg-white border-gray-200 hover:bg-gray-50 rounded-lg font-medium relative"
                        >
                          P{index + 4}A
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 w-4 h-4 p-0 rounded-full bg-orange-500 text-white hover:bg-orange-600 text-[10px] flex items-center justify-center"
                          onClick={() => handleSliderChange('fourWheeler', 'stack', formData.fourWheeler.stack - 1)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={formData.fourWheeler.stack}
                    onChange={(e) => handleSliderChange('fourWheeler', 'stack', parseInt(e.target.value) || 0)}
                    className="w-16 h-8 text-center"
                    min="0"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                    onClick={() => handleSliderChange('fourWheeler', 'stack', formData.fourWheeler.stack + 1)}
                  >
                    Add
                  </Button>
                  <span className="text-sm">{formData.fourWheeler.stack}</span>
                </div>
              </div>

              {/* Reserved Parkings */}
              <div>
                <h4 className="font-medium mb-4">Reserved Parkings</h4>
                <div className="bg-white rounded-lg p-4 mb-4 h-[200px] border-2 border-dashed border-gray-200 overflow-auto">
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: formData.fourWheeler.reserved }, (_, index) => (
                      <div key={index} className="relative bg-gray-50 rounded-lg border border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-14 h-8 text-xs bg-white border-gray-200 hover:bg-gray-50 rounded-lg font-medium relative"
                        >
                          P{index + 9}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 w-4 h-4 p-0 rounded-full bg-orange-500 text-white hover:bg-orange-600 text-[10px] flex items-center justify-center"
                          onClick={() => handleSliderChange('fourWheeler', 'reserved', formData.fourWheeler.reserved - 1)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={formData.fourWheeler.reserved}
                    onChange={(e) => handleSliderChange('fourWheeler', 'reserved', parseInt(e.target.value) || 0)}
                    className="w-16 h-8 text-center"
                    min="0"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-cyan-500 text-white border-cyan-500 hover:bg-cyan-600"
                    onClick={() => handleSliderChange('fourWheeler', 'reserved', formData.fourWheeler.reserved + 1)}
                  >
                    Add
                  </Button>
                  <span className="text-sm">{formData.fourWheeler.reserved}</span>
                </div>
              </div>
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
              className="cursor-pointer text-red-600 hover:text-red-700"
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
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Submit
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};