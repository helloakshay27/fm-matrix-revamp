import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, X, Plus, ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { fetchSnagChecklistById, fetchSnagChecklistCategories, SnagChecklist } from '@/services/snagChecklistAPI';
import { useToast } from '@/components/ui/use-toast';
export const SurveyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for API data
  const [snagChecklist, setSnagChecklist] = useState<SnagChecklist | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for location configuration
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [locationMappings, setLocationMappings] = useState([]);
  const [locationConfig, setLocationConfig] = useState({
    building: false,
    wing: false,
    floor: false,
    zone: false,
    room: false,
    customerEnabled: false,
    selectedBuildings: ['Gophygital'],
    selectedWings: ['A Wing'],
    selectedFloors: ['Ground Floor'],
    selectedZones: [],
    selectedRooms: []
  });

  const removeSelectedItem = (type, item) => {
    const key = `selected${type.charAt(0).toUpperCase() + type.slice(1)}s`;
    setLocationConfig(prev => ({
      ...prev,
      [key]: prev[key].filter(selected => selected !== item)
    }));
  };

  const addSelectedItem = (type, item) => {
    const key = `selected${type.charAt(0).toUpperCase() + type.slice(1)}s`;
    setLocationConfig(prev => ({
      ...prev,
      [key]: [...prev[key], item]
    }));
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [checklistData, categoriesData] = await Promise.all([
          fetchSnagChecklistById(id),
          fetchSnagChecklistCategories()
        ]);
        
        setSnagChecklist(checklistData);
        setCategories(categoriesData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load survey data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, toast]);

  // Get category name by ID
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const handleBack = () => {
    navigate('/maintenance/survey/list');
  };

  const handleSubmitLocation = () => {
    const newMapping = {
      id: Date.now(),
      building: locationConfig.selectedBuildings.join(', '),
      wing: locationConfig.selectedWings.join(', '),
      floor: locationConfig.selectedFloors.join(', '),
      zone: locationConfig.selectedZones.join(', '),
      room: locationConfig.selectedRooms.join(', ')
    };
    setLocationMappings([...locationMappings, newMapping]);
    setIsDialogOpen(false);
    // Reset form
    setLocationConfig({
      building: false,
      wing: false,
      floor: false,
      zone: false,
      room: false,
      customerEnabled: false,
      selectedBuildings: [],
      selectedWings: [],
      selectedFloors: [],
      selectedZones: [],
      selectedRooms: []
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

      {/* Main Survey Content Card */}
      <Card className="border border-gray-200 bg-gray-50">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading survey data...</div>
            </div>
          ) : !snagChecklist ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Survey not found</div>
            </div>
          ) : (
            <>
              {/* Top Section - Category and Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category*
                  </label>
                  <Select value={getCategoryName(snagChecklist.snag_audit_category_id)} disabled>
                    <SelectTrigger className="w-full bg-gray-50">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
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
                    className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-gray-300"
                    value={snagChecklist.name}
                    disabled
                    readOnly
                  />
                </div>
              </div>

              {/* Questions Counter Section */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">No. of Questions</span>
                  <span className="text-sm font-medium">{snagChecklist.questions.length}</span>
                </div>
              </div>
            </>
          )}

          {/* Questions Grid */}
          {!loading && snagChecklist && (
            <div className="grid grid-cols-1 gap-6">
              {snagChecklist.questions.map((question, index) => (
                <Card key={question.id} className="border border-gray-200 bg-gray-100">
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
                        value={question.descr}
                        disabled
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Answer Type
                      </label>
                      <Select value="Multiple Choice" disabled>
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

                    {question.options.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Answer Options
                        </label>
                        <div className="space-y-3">
                          {question.options.map((option) => (
                            <div key={option.id} className="flex items-center gap-3">
                              <input 
                                type="text" 
                                placeholder="Answer Option"
                                className="flex-1 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                                value={option.qname}
                                disabled
                                readOnly
                              />
                              <Select value={option.option_type.toUpperCase()} disabled>
                                <SelectTrigger className="w-16 h-10 bg-gray-50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="P">P</SelectItem>
                                  <SelectItem value="N">N</SelectItem>
                                </SelectContent>
                              </Select>
                              <X className="w-4 h-4 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox id={`mandatory-${question.id}`} defaultChecked disabled className="data-[state=checked]:bg-gray-400" />
                      <label htmlFor={`mandatory-${question.id}`} className="text-sm text-gray-700">
                        Mandatory
                      </label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Survey Mapping List Table */}
      <Card className="border border-gray-200 bg-gray-50">
        <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
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
                {/* Checkboxes Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Building */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="building" 
                        checked={locationConfig.building}
                        onCheckedChange={(checked) => setLocationConfig({...locationConfig, building: !!checked})}
                        className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <label htmlFor="building" className="text-sm font-medium">Building</label>
                    </div>
                  </div>

                  {/* Wing */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="wing" 
                        checked={locationConfig.wing}
                        onCheckedChange={(checked) => setLocationConfig({...locationConfig, wing: !!checked})}
                        className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <label htmlFor="wing" className="text-sm font-medium">Wing</label>
                    </div>
                  </div>

                  {/* Floor */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="floor" 
                        checked={locationConfig.floor}
                        onCheckedChange={(checked) => setLocationConfig({...locationConfig, floor: !!checked})}
                        className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <label htmlFor="floor" className="text-sm font-medium">Floor</label>
                    </div>
                  </div>

                  {/* Zone */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="zone" 
                        checked={locationConfig.zone}
                        onCheckedChange={(checked) => setLocationConfig({...locationConfig, zone: !!checked})}
                        className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <label htmlFor="zone" className="text-sm font-medium">Zone</label>
                    </div>
                  </div>

                  {/* Room */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="room" 
                        checked={locationConfig.room}
                        onCheckedChange={(checked) => setLocationConfig({...locationConfig, room: !!checked})}
                        className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <label htmlFor="room" className="text-sm font-medium">Room</label>
                    </div>
                  </div>

                  {/* Customer Enabled */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="customerEnabled" 
                        checked={locationConfig.customerEnabled}
                        onCheckedChange={(checked) => setLocationConfig({...locationConfig, customerEnabled: !!checked})}
                        className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <label htmlFor="customerEnabled" className="text-sm font-medium">Customer Enabled</label>
                    </div>
                  </div>
                </div>

                {/* Dropdown sections based on checked items */}
                <div className="space-y-4">
                  {/* Buildings Dropdown */}
                  {locationConfig.building && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Buildings</h4>
                      <Select onValueChange={(value) => {
                        if (!locationConfig.selectedBuildings.includes(value)) {
                          addSelectedItem('building', value);
                        }
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`${locationConfig.selectedBuildings.length} building(s) selected`} />
                          <ChevronDown className="h-4 w-4" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gophygital">Gophygital</SelectItem>
                          <SelectItem value="Building A">Building A</SelectItem>
                          <SelectItem value="Building B">Building B</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Selected buildings */}
                      {locationConfig.selectedBuildings.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {locationConfig.selectedBuildings.map((building) => (
                            <span key={building} className="inline-flex items-center px-2 py-1 bg-gray-100 text-sm rounded">
                              {building}
                              <button
                                onClick={() => removeSelectedItem('building', building)}
                                className="ml-1 text-gray-500 hover:text-gray-700"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Wings Dropdown */}
                  {locationConfig.wing && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Wings</h4>
                      <Select onValueChange={(value) => {
                        if (!locationConfig.selectedWings.includes(value)) {
                          addSelectedItem('wing', value);
                        }
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`${locationConfig.selectedWings.length} wing(s) selected`} />
                          <ChevronDown className="h-4 w-4" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A Wing">A Wing</SelectItem>
                          <SelectItem value="B Wing">B Wing</SelectItem>
                          <SelectItem value="C Wing">C Wing</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Selected wings */}
                      {locationConfig.selectedWings.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {locationConfig.selectedWings.map((wing) => (
                            <span key={wing} className="inline-flex items-center px-2 py-1 bg-gray-100 text-sm rounded">
                              {wing}
                              <button
                                onClick={() => removeSelectedItem('wing', wing)}
                                className="ml-1 text-gray-500 hover:text-gray-700"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Floors Dropdown */}
                  {locationConfig.floor && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Floors</h4>
                      <Select onValueChange={(value) => {
                        if (!locationConfig.selectedFloors.includes(value)) {
                          addSelectedItem('floor', value);
                        }
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`${locationConfig.selectedFloors.length} floor(s) selected`} />
                          <ChevronDown className="h-4 w-4" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ground Floor">Ground Floor</SelectItem>
                          <SelectItem value="First Floor">First Floor</SelectItem>
                          <SelectItem value="Second Floor">Second Floor</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Selected floors */}
                      {locationConfig.selectedFloors.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {locationConfig.selectedFloors.map((floor) => (
                            <span key={floor} className="inline-flex items-center px-2 py-1 bg-gray-100 text-sm rounded">
                              {floor}
                              <button
                                onClick={() => removeSelectedItem('floor', floor)}
                                className="ml-1 text-gray-500 hover:text-gray-700"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Zones Dropdown */}
                  {locationConfig.zone && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Zones</h4>
                      <Select onValueChange={(value) => {
                        if (!locationConfig.selectedZones.includes(value)) {
                          addSelectedItem('zone', value);
                        }
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`${locationConfig.selectedZones.length} zone(s) selected`} />
                          <ChevronDown className="h-4 w-4" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Zone A">Zone A</SelectItem>
                          <SelectItem value="Zone B">Zone B</SelectItem>
                          <SelectItem value="Zone C">Zone C</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Selected zones */}
                      {locationConfig.selectedZones.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {locationConfig.selectedZones.map((zone) => (
                            <span key={zone} className="inline-flex items-center px-2 py-1 bg-gray-100 text-sm rounded">
                              {zone}
                              <button
                                onClick={() => removeSelectedItem('zone', zone)}
                                className="ml-1 text-gray-500 hover:text-gray-700"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rooms Dropdown */}
                  {locationConfig.room && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Rooms</h4>
                      <Select onValueChange={(value) => {
                        if (!locationConfig.selectedRooms.includes(value)) {
                          addSelectedItem('room', value);
                        }
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`${locationConfig.selectedRooms.length} room(s) selected`} />
                          <ChevronDown className="h-4 w-4" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Room 101">Room 101</SelectItem>
                          <SelectItem value="Room 102">Room 102</SelectItem>
                          <SelectItem value="Room 103">Room 103</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Selected rooms */}
                      {locationConfig.selectedRooms.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {locationConfig.selectedRooms.map((room) => (
                            <span key={room} className="inline-flex items-center px-2 py-1 bg-gray-100 text-sm rounded">
                              {room}
                              <button
                                onClick={() => removeSelectedItem('room', room)}
                                className="ml-1 text-gray-500 hover:text-gray-700"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
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
        </CardContent>
      </Card>
    </div>;
};