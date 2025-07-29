import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, X, Plus, ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
export const SurveyDetailsPage = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  
  // State for location configuration
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [locationMappings, setLocationMappings] = useState([]);
  const [locationConfig, setLocationConfig] = useState({
    building: true,
    wing: true,
    floor: true,
    zone: true,
    room: true,
    customerEnabled: true,
    selectedBuilding: '',
    selectedWing: '',
    selectedFloor: '',
    selectedZone: '',
    selectedRoom: ''
  });

  // Mock data - in real app, this would be fetched based on the id
  const surveyData = {
    id: id,
    title: "Customer Satisfaction Survey",
    category: "Feedback",
    questions: [{
      id: "1",
      text: "How satisfied are you with our service?",
      type: "Multiple Choice",
      mandatory: true,
      options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"]
    }, {
      id: "2",
      text: "What improvements would you suggest?",
      type: "Text Area",
      mandatory: false,
      options: []
    }]
  };

  const handleBack = () => {
    navigate('/maintenance/survey/list');
  };

  const handleSubmitLocation = () => {
    const newMapping = {
      id: Date.now(),
      building: locationConfig.selectedBuilding,
      wing: locationConfig.selectedWing,
      floor: locationConfig.selectedFloor,
      zone: locationConfig.selectedZone,
      room: locationConfig.selectedRoom
    };
    setLocationMappings([...locationMappings, newMapping]);
    setIsDialogOpen(false);
    // Reset form
    setLocationConfig({
      ...locationConfig,
      selectedBuilding: '',
      selectedWing: '',
      selectedFloor: '',
      selectedZone: '',
      selectedRoom: ''
    });
  };
  return <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="w-4 h-4" />
          Back to Survey List
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Survey Details</h1>
      </div>

      {/* Top Section - Category and Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category*
          </label>
          <Select defaultValue={surveyData.category} disabled>
            <SelectTrigger className="w-full bg-gray-50">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Feedback">Feedback</SelectItem>
              <SelectItem value="Research">Research</SelectItem>
              <SelectItem value="Satisfaction">Satisfaction</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title*
          </label>
          <input 
            type="text" 
            placeholder="Enter the title"
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
            value={surveyData.title}
            disabled
            readOnly
          />
        </div>
      </div>

      {/* Questions Counter Section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">No. of Questions</span>
          <span className="text-sm font-medium">2</span>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Question 1 */}
        <Card className="border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-medium">
              New Question
            </CardTitle>
            <X className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 min-h-[80px] resize-none" 
                placeholder="Enter your Question"
                defaultValue={surveyData.questions[0]?.text}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Answer Type
              </label>
              <Select defaultValue="Multiple Choice" disabled>
                <SelectTrigger className="w-full bg-gray-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                  <SelectItem value="Text Area">Text Area</SelectItem>
                  <SelectItem value="Short Answer">Short Answer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Answer Options
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Select defaultValue="P" disabled>
                    <SelectTrigger className="w-16 h-10 bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P">P</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                    </SelectContent>
                  </Select>
                  <input 
                    type="text" 
                    placeholder="Answer Option"
                    className="flex-1 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    defaultValue="Very Satisfied"
                    disabled
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Select defaultValue="P" disabled>
                    <SelectTrigger className="w-16 h-10 bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P">P</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                    </SelectContent>
                  </Select>
                  <input 
                    type="text" 
                    placeholder="Answer Option"
                    className="flex-1 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    defaultValue="Satisfied"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="mandatory-1" defaultChecked disabled className="data-[state=checked]:bg-gray-400" />
              <label htmlFor="mandatory-1" className="text-sm text-gray-700">
                Mandatory
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Question 2 */}
        <Card className="border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-medium">
              New Question
            </CardTitle>
            <X className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 min-h-[80px] resize-none" 
                placeholder="Enter your Question"
                defaultValue={surveyData.questions[1]?.text}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Answer Type
              </label>
              <Select defaultValue="Text Area" disabled>
                <SelectTrigger className="w-full bg-gray-50">
                  <SelectValue placeholder="Choose Answer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                  <SelectItem value="Text Area">Text Area</SelectItem>
                  <SelectItem value="Short Answer">Short Answer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="mandatory-2" disabled />
              <label htmlFor="mandatory-2" className="text-sm text-gray-700">
                Mandatory
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Survey Mapping List Table */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              6
            </div>
            <h3 className="text-lg font-medium text-red-600">Survey Mapping List</h3>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Location Configuration</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Checkboxes Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="building" 
                      checked={locationConfig.building}
                      onCheckedChange={(checked) => setLocationConfig({...locationConfig, building: !!checked})}
                    />
                    <label htmlFor="building" className="text-sm font-medium">Building</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="wing" 
                      checked={locationConfig.wing}
                      onCheckedChange={(checked) => setLocationConfig({...locationConfig, wing: !!checked})}
                    />
                    <label htmlFor="wing" className="text-sm font-medium">Wing</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="floor" 
                      checked={locationConfig.floor}
                      onCheckedChange={(checked) => setLocationConfig({...locationConfig, floor: !!checked})}
                    />
                    <label htmlFor="floor" className="text-sm font-medium">Floor</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="zone" 
                      checked={locationConfig.zone}
                      onCheckedChange={(checked) => setLocationConfig({...locationConfig, zone: !!checked})}
                    />
                    <label htmlFor="zone" className="text-sm font-medium">Zone</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="room" 
                      checked={locationConfig.room}
                      onCheckedChange={(checked) => setLocationConfig({...locationConfig, room: !!checked})}
                    />
                    <label htmlFor="room" className="text-sm font-medium">Room</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="customerEnabled" 
                      checked={locationConfig.customerEnabled}
                      onCheckedChange={(checked) => setLocationConfig({...locationConfig, customerEnabled: !!checked})}
                    />
                    <label htmlFor="customerEnabled" className="text-sm font-medium">Customer Enabled</label>
                  </div>
                </div>

                {/* Dropdowns */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Buildings</label>
                    <Select value={locationConfig.selectedBuilding} onValueChange={(value) => setLocationConfig({...locationConfig, selectedBuilding: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Building" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gophygital">Gophygital</SelectItem>
                        <SelectItem value="Building A">Building A</SelectItem>
                        <SelectItem value="Building B">Building B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Wings</label>
                    <Select value={locationConfig.selectedWing} onValueChange={(value) => setLocationConfig({...locationConfig, selectedWing: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Wing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A Wing">A Wing</SelectItem>
                        <SelectItem value="B Wing">B Wing</SelectItem>
                        <SelectItem value="C Wing">C Wing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Floors</label>
                    <Select value={locationConfig.selectedFloor} onValueChange={(value) => setLocationConfig({...locationConfig, selectedFloor: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Floor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ground Floor">Ground Floor</SelectItem>
                        <SelectItem value="First Floor">First Floor</SelectItem>
                        <SelectItem value="Second Floor">Second Floor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zones</label>
                    <Select value={locationConfig.selectedZone} onValueChange={(value) => setLocationConfig({...locationConfig, selectedZone: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select zones" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Zone A">Zone A</SelectItem>
                        <SelectItem value="Zone B">Zone B</SelectItem>
                        <SelectItem value="Zone C">Zone C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
                    <Select value={locationConfig.selectedRoom} onValueChange={(value) => setLocationConfig({...locationConfig, selectedRoom: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Room 101">Room 101</SelectItem>
                        <SelectItem value="Room 102">Room 102</SelectItem>
                        <SelectItem value="Room 103">Room 103</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSubmitLocation} className="bg-red-600 hover:bg-red-700 text-white">
                    Submit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 bg-gray-100">
            <div className="p-4 font-medium text-gray-700 border-r border-gray-200">
              Building
            </div>
            <div className="p-4 font-medium text-gray-700 border-r border-gray-200">
              Wing
            </div>
            <div className="p-4 font-medium text-gray-700 border-r border-gray-200">
              Floor
            </div>
            <div className="p-4 font-medium text-gray-700 border-r border-gray-200">
              Zone
            </div>
            <div className="p-4 font-medium text-gray-700">
              Room
            </div>
          </div>
          
          {/* Table Body */}
          {locationMappings.length > 0 ? (
            locationMappings.map((mapping) => (
              <div key={mapping.id} className="grid grid-cols-5 border-b border-gray-200 last:border-b-0">
                <div className="p-4 text-gray-700 border-r border-gray-200">{mapping.building}</div>
                <div className="p-4 text-gray-700 border-r border-gray-200">{mapping.wing}</div>
                <div className="p-4 text-gray-700 border-r border-gray-200">{mapping.floor}</div>
                <div className="p-4 text-gray-700 border-r border-gray-200">{mapping.zone}</div>
                <div className="p-4 text-gray-700">{mapping.room}</div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No location mappings found
            </div>
          )}
        </div>
      </div>
    </div>;
};