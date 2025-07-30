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
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';
export const SurveyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for API data
  const [snagChecklist, setSnagChecklist] = useState<SnagChecklist | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buildings, setBuildings] = useState<Array<{id: number, name: string}>>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [wings, setWings] = useState<Array<{id: number, name: string}>>([]);
  const [loadingWings, setLoadingWings] = useState(false);
  const [floors, setFloors] = useState<Array<{id: number, name: string}>>([]);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [zones, setZones] = useState<Array<{id: number, name: string}>>([]);
  const [loadingZones, setLoadingZones] = useState(false);
  const [rooms, setRooms] = useState<Array<{id: number, name: string}>>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  
  // State for location configuration
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [locationMappings, setLocationMappings] = useState([]);
  const [surveyMappings, setSurveyMappings] = useState<any[]>([]);
  const [loadingSurveyMappings, setLoadingSurveyMappings] = useState(false);
  const [locationConfig, setLocationConfig] = useState({
    building: false,
    wing: false,
    floor: false,
    zone: false,
    room: false,
    selectedBuildings: [],
    selectedWings: [],
    selectedFloors: [],
    selectedZones: [],
    selectedRooms: [],
    selectedBuildingIds: [], // Add this to track building IDs
    selectedWingIds: [], // Add this to track wing IDs
    selectedFloorIds: [], // Add this to track floor IDs
    selectedRoomIds: [] // Add this to track room IDs
  });

  const removeSelectedItem = (type, item) => {
    const key = `selected${type.charAt(0).toUpperCase() + type.slice(1)}s`;
    setLocationConfig(prev => ({
      ...prev,
      [key]: prev[key].filter(selected => selected !== item)
    }));
    
    // Also remove from selectedRoomIds if removing a room
    if (type === 'room') {
      const room = rooms.find(r => r.name === item);
      if (room) {
        setLocationConfig(prev => ({
          ...prev,
          selectedRoomIds: prev.selectedRoomIds.filter(id => id !== room.id)
        }));
      }
    }
  };

  const addSelectedItem = (type, item) => {
    const key = `selected${type.charAt(0).toUpperCase() + type.slice(1)}s`;
    setLocationConfig(prev => ({
      ...prev,
      [key]: [...prev[key], item]
    }));
  };

  // Fetch buildings
  const fetchBuildings = async () => {
    try {
      setLoadingBuildings(true);
      const response = await fetch(getFullUrl('/buildings.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch buildings');
      }
      
      const buildingsData = await response.json();
      setBuildings(buildingsData.map((building: any) => ({
        id: building.id,
        name: building.name
      })));
    } catch (error) {
      console.error('Error fetching buildings:', error);
    } finally {
      setLoadingBuildings(false);
    }
  };

  // Fetch wings
  const fetchWings = async () => {
    try {
      setLoadingWings(true);
      const response = await fetch(getFullUrl('/pms/wings.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch wings');
      }
      
      const wingsData = await response.json();
      setWings(wingsData.wings.map((wing: any) => ({
        id: wing.id,
        name: wing.name
      })));
    } catch (error) {
      console.error('Error fetching wings:', error);
    } finally {
      setLoadingWings(false);
    }
  };

  // Fetch floors
  const fetchFloors = async () => {
    try {
      setLoadingFloors(true);
      const response = await fetch(getFullUrl('/pms/floors.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch floors');
      }
      
      const floorsData = await response.json();
      setFloors(floorsData.floors.map((floor: any) => ({
        id: floor.id,
        name: floor.name
      })));
    } catch (error) {
      console.error('Error fetching floors:', error);
    } finally {
      setLoadingFloors(false);
    }
  };

  // Fetch zones
  const fetchZones = async () => {
    try {
      setLoadingZones(true);
      const response = await fetch(getFullUrl('/pms/zones.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch zones');
      }
      
      const zonesData = await response.json();
      setZones(zonesData.zones.map((zone: any) => ({
        id: zone.id,
        name: zone.name
      })));
    } catch (error) {
      console.error('Error fetching zones:', error);
    } finally {
      setLoadingZones(false);
    }
  };

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      setLoadingRooms(true);
      const response = await fetch(getFullUrl('/pms/rooms.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      
      const roomsData = await response.json();
      // Note: Based on the JSON structure provided, it's a direct array, not wrapped in an object
      setRooms(roomsData.map((room: any) => ({
        id: room.id,
        name: room.name
      })));
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoadingRooms(false);
    }
  };

  // Fetch survey mappings
  const fetchSurveyMappings = async () => {
    if (!id) return;
    
    try {
      setLoadingSurveyMappings(true);
      const apiUrl = `/survey_mappings.json?q[survey_id_eq]=${id}`;
      console.log('Fetching survey mappings from:', getFullUrl(apiUrl));
      
      const response = await fetch(getFullUrl(apiUrl), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch survey mappings: ${response.status}`);
      }
      
      const mappingsData = await response.json();
      console.log('Survey mappings response:', mappingsData);
      setSurveyMappings(mappingsData);
    } catch (error) {
      console.error('Error fetching survey mappings:', error);
      toast({
        title: "Error",
        description: "Failed to load survey mappings",
        variant: "destructive"
      });
    } finally {
      setLoadingSurveyMappings(false);
    }
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
    fetchBuildings();
    fetchWings();
    fetchFloors();
    fetchZones();
    fetchRooms();
    fetchSurveyMappings();
  }, [id, toast]);

  // Get category name by ID
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const handleBack = () => {
    navigate('/maintenance/survey/list');
  };

  const handleSubmitLocation = async () => {
    try {
      // Validate that we have room IDs selected
      if (locationConfig.selectedRoomIds.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one room",
          variant: "destructive"
        });
        return;
      }

      // Prepare the API request
      const requestData = {
        survey_id: parseInt(id!), // Convert to number as required by API
        building_ids: locationConfig.selectedBuildingIds,
        wing_ids: locationConfig.selectedWingIds,
        floor_ids: locationConfig.selectedFloorIds,
        room_ids: locationConfig.selectedRoomIds
      };

      console.log('Submitting survey mapping:', requestData);

      // Make the POST API call
      const response = await fetch(getFullUrl('/survey_mappings.json'), {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Failed to create survey mapping');
      }

      const result = await response.json();
      console.log('Survey mapping created successfully:', result);

      // Show success message
      toast({
        title: "Success",
        description: "Survey mapping created successfully",
      });

      // Immediately refresh survey mappings data to show the new entry
      await fetchSurveyMappings();

      // Close the dialog
      setIsDialogOpen(false);

      // Reset form
      setLocationConfig({
        building: false,
        wing: false,
        floor: false,
        zone: false,
        room: false,
        selectedBuildings: [],
        selectedWings: [],
        selectedFloors: [],
        selectedZones: [],
        selectedRooms: [],
        selectedBuildingIds: [],
        selectedWingIds: [],
        selectedFloorIds: [],
        selectedRoomIds: []
      });
    } catch (error) {
      console.error('Error creating survey mapping:', error);
      toast({
        title: "Error",
        description: "Failed to create survey mapping",
        variant: "destructive"
      });
    }
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
                <div className="hidden">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category*
                  </label>
                  <Select value={snagChecklist.snag_audit_category} disabled>
                    <SelectTrigger className="w-full bg-gray-50">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      )) || []}
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
                  <span className="text-sm font-medium">{snagChecklist?.questions_count || 0}</span>
                </div>
              </div>
            </>
          )}

          {/* Questions Grid */}
          {!loading && snagChecklist && (
            <div className="grid grid-cols-1 gap-6">
              {snagChecklist.snag_questions?.map((question, index) => (
                <Card key={question.id} className="border border-gray-200 bg-gray-100">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-base font-medium">
                      Question
                    </CardTitle>
                    <X className="w-4 h-4 text-gray-400" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question
                        </label>
                        <input 
                          type="text"
                          className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700" 
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
                          <SelectTrigger className="w-full h-10 bg-gray-50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                            <SelectItem value="Text Area">Text Area</SelectItem>
                            <SelectItem value="Short Answer">Short Answer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>


                    {question.snag_quest_options && question.snag_quest_options.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Answer Options
                        </label>
                        <div className="space-y-3">
                          {question.snag_quest_options?.map((option) => (
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
                          )) || []}
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
              )) || []}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Survey Mapping List Table */}
      <Card className="border border-gray-200 bg-gray-50">
        <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-gray-900">Survey Mapping List</h3>
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

                </div>

                {/* Dropdown sections based on checked items */}
                <div className="space-y-4">
                  {/* Buildings Dropdown */}
                  {locationConfig.building && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Buildings</h4>
                       <Select onValueChange={(value) => {
                         // value contains the building ID, find the building name for display
                         const selectedBuilding = buildings.find(b => b.id.toString() === value)
                         if (selectedBuilding && !locationConfig.selectedBuildings.includes(selectedBuilding.name)) {
                           addSelectedItem('building', selectedBuilding.name);
                           // Also store the building ID for the API call
                           setLocationConfig(prev => ({
                             ...prev,
                             selectedBuildingIds: [...prev.selectedBuildingIds, selectedBuilding.id]
                           }));
                           console.log('Selected building ID:', value, 'Name:', selectedBuilding.name)
                         }
                       }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`${locationConfig.selectedBuildings.length} building(s) selected`} />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingBuildings ? (
                            <SelectItem value="loading" disabled>Loading buildings...</SelectItem>
                          ) : (
                            buildings.map((building) => (
                              <SelectItem key={building.id} value={building.id.toString()}>
                                {building.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                       {/* Selected buildings */}
                    </div>
                  )}

                  {/* Wings Dropdown */}
                  {locationConfig.wing && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Wings</h4>
                       <Select onValueChange={(value) => {
                         // value contains the wing ID, find the wing name for display
                         const selectedWing = wings.find(w => w.id.toString() === value);
                         if (selectedWing && !locationConfig.selectedWings.includes(selectedWing.name)) {
                           addSelectedItem('wing', selectedWing.name);
                           // Also store the wing ID for the API call
                           setLocationConfig(prev => ({
                             ...prev,
                             selectedWingIds: [...prev.selectedWingIds, selectedWing.id]
                           }));
                           console.log('Selected wing ID:', value, 'Name:', selectedWing.name);
                         }
                       }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`${locationConfig.selectedWings.length} wing(s) selected`} />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingWings ? (
                            <SelectItem value="loading" disabled>Loading wings...</SelectItem>
                          ) : (
                            wings.map((wing) => (
                              <SelectItem key={wing.id} value={wing.id.toString()}>
                                {wing.name}
                              </SelectItem>
                            ))
                          )}
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
                          // value contains the floor ID, find the floor name for display
                          const selectedFloor = floors.find(f => f.id.toString() === value);
                          if (selectedFloor && !locationConfig.selectedFloors.includes(selectedFloor.name)) {
                            addSelectedItem('floor', selectedFloor.name);
                            // Also store the floor ID for the API call
                            setLocationConfig(prev => ({
                              ...prev,
                              selectedFloorIds: [...prev.selectedFloorIds, selectedFloor.id]
                            }));
                            console.log('Selected floor ID:', value, 'Name:', selectedFloor.name);
                          }
                        }}>
                         <SelectTrigger className="w-full">
                           <SelectValue placeholder={`${locationConfig.selectedFloors.length} floor(s) selected`} />
                         </SelectTrigger>
                         <SelectContent>
                           {loadingFloors ? (
                             <SelectItem value="loading" disabled>Loading floors...</SelectItem>
                           ) : (
                             floors.map((floor) => (
                               <SelectItem key={floor.id} value={floor.id.toString()}>
                                 {floor.name}
                               </SelectItem>
                             ))
                           )}
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
                         // value contains the zone ID, find the zone name for display
                         const selectedZone = zones.find(z => z.id.toString() === value);
                         if (selectedZone && !locationConfig.selectedZones.includes(selectedZone.name)) {
                           addSelectedItem('zone', selectedZone.name);
                           // You can also store the ID separately if needed for backend
                           console.log('Selected zone ID:', value, 'Name:', selectedZone.name);
                         }
                       }}>
                         <SelectTrigger className="w-full">
                           <SelectValue placeholder={`${locationConfig.selectedZones.length} zone(s) selected`} />
                         </SelectTrigger>
                         <SelectContent>
                           {loadingZones ? (
                             <SelectItem value="loading" disabled>Loading zones...</SelectItem>
                           ) : (
                             zones.map((zone) => (
                               <SelectItem key={zone.id} value={zone.id.toString()}>
                                 {zone.name}
                               </SelectItem>
                             ))
                           )}
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
                         // value contains the room ID, find the room name for display
                         const selectedRoom = rooms.find(r => r.id.toString() === value);
                         if (selectedRoom && !locationConfig.selectedRooms.includes(selectedRoom.name)) {
                           addSelectedItem('room', selectedRoom.name);
                           // Also store the room ID for the API call
                           setLocationConfig(prev => ({
                             ...prev,
                             selectedRoomIds: [...prev.selectedRoomIds, selectedRoom.id]
                           }));
                           console.log('Selected room ID:', value, 'Name:', selectedRoom.name);
                         }
                       }}>
                         <SelectTrigger className="w-full">
                           <SelectValue placeholder={`${locationConfig.selectedRooms.length} room(s) selected`} />
                         </SelectTrigger>
                         <SelectContent>
                           {loadingRooms ? (
                             <SelectItem value="loading" disabled>Loading rooms...</SelectItem>
                           ) : (
                             rooms.map((room) => (
                               <SelectItem key={room.id} value={room.id.toString()}>
                                 {room.name}
                               </SelectItem>
                             ))
                           )}
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
          <div className="grid grid-cols-6 bg-gray-100">
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
            <div className="p-4 font-medium text-gray-700 border-r border-gray-200">
              Room
            </div>
            <div className="p-4 font-medium text-gray-700">
              QR Code
            </div>
          </div>
          
          {/* Table Body */}
          {loadingSurveyMappings ? (
            <div className="p-8 text-center text-gray-500">
              Loading survey mappings...
            </div>
          ) : surveyMappings.length > 0 ? (
            surveyMappings.map((mapping) => (
                <div key={mapping.id} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0">
                  <div className="p-4 text-gray-700 border-r border-gray-200">{mapping.building_name || '-'}</div>
                  <div className="p-4 text-gray-700 border-r border-gray-200">{mapping.wing_name || '-'}</div>
                  <div className="p-4 text-gray-700 border-r border-gray-200">{mapping.floor_name || '-'}</div>
                  <div className="p-4 text-gray-700 border-r border-gray-200">{mapping.area_name || '-'}</div>
                  <div className="p-4 text-gray-700 border-r border-gray-200">{mapping.room_name || '-'}</div>
                  <div className="p-4 text-gray-700">{mapping.qr_code || '-'}</div>
                </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No survey mappings found
            </div>
           )}
         </div>
        </CardContent>
      </Card>
    </div>;
};