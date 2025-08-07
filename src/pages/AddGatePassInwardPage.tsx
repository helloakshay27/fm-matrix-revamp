import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AddGatePassInwardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    // Goods Detail
    itemType: '',
    itemCategory: '',
    itemName: '',
    itemQuantity: '',
    unit: '',
    description: '',
    // Visitor Detail
    visitorName: '',
    mobileNo: '',
    companyName: '',
    vehicleNo: '',
    reportingTime: '',
    modeOfTransport: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.visitorName || !formData.mobileNo) {
      toast({
        title: "Validation Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Here you would typically call your API
      console.log('Form Data:', formData);
      
      toast({
        title: "Success",
        description: "Gate pass inward entry created successfully!"
      });
      
      navigate('/security/gate-pass/inwards');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to create entry. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--analytics-background))]">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/security/gate-pass/inwards')}
            className="mb-4 p-0 h-auto text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inwards List
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">ADD GATE PASS INWARD</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goods Detail Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-200">
              <h2 className="text-lg font-medium text-[#C72030]">GOODS DETAIL</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Type*
                  </label>
                  <Select value={formData.itemType} onValueChange={(value) => handleInputChange('itemType', value)}>
                    <SelectTrigger className="h-11 bg-white border-gray-300">
                      <SelectValue placeholder="Select Item Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Category*
                  </label>
                  <Select value={formData.itemCategory} onValueChange={(value) => handleInputChange('itemCategory', value)}>
                    <SelectTrigger className="h-11 bg-white border-gray-300">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="tools">Tools</SelectItem>
                      <SelectItem value="supplies">Supplies</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name*
                  </label>
                  <Input
                    value={formData.itemName}
                    onChange={(e) => handleInputChange('itemName', e.target.value)}
                    placeholder="Fill Item Name"
                    className="h-11 bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Quantity*
                  </label>
                  <Input
                    value={formData.itemQuantity}
                    onChange={(e) => handleInputChange('itemQuantity', e.target.value)}
                    placeholder="01"
                    className="h-11 bg-white border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit*
                  </label>
                  <Input
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    placeholder="01"
                    className="h-11 bg-white border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description*
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Type here"
                  className="min-h-[100px] bg-white border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments*
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <Button 
                    type="button"
                    variant="outline"
                    className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
                  >
                    Add Item
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Visitor Detail Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-200">
              <h2 className="text-lg font-medium text-[#C72030]">VISITOR DETAIL</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visitor Name*
                  </label>
                  <Input
                    value={formData.visitorName}
                    onChange={(e) => handleInputChange('visitorName', e.target.value)}
                    placeholder="Enter Name"
                    className="h-11 bg-white border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile No.*
                  </label>
                  <Input
                    value={formData.mobileNo}
                    onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                    placeholder="+91"
                    className="h-11 bg-white border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name*
                  </label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Lockated"
                    className="h-11 bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle No.*
                  </label>
                  <Input
                    value={formData.vehicleNo}
                    onChange={(e) => handleInputChange('vehicleNo', e.target.value)}
                    placeholder="MH04BA-1009"
                    className="h-11 bg-white border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reporting Time*
                  </label>
                  <Input
                    value={formData.reportingTime}
                    onChange={(e) => handleInputChange('reportingTime', e.target.value)}
                    placeholder="22:24 hrs"
                    className="h-11 bg-white border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Mode Of Transport*
                  </label>
                  <Select value={formData.modeOfTransport} onValueChange={(value) => handleInputChange('modeOfTransport', value)}>
                    <SelectTrigger className="h-11 bg-white border-gray-300">
                      <SelectValue placeholder="Type Here" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="bike">Bike</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="walk">Walking</SelectItem>
                      <SelectItem value="bicycle">Bicycle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              className="px-12 py-3 bg-[#C72030] hover:bg-[#A01928] text-white font-medium"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};