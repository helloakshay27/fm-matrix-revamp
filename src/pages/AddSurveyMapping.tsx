import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2, MapPin, List, Plus, X, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';

interface Survey {
  id: number;
  name: string;
  snag_audit_category: string | null;
  snag_audit_sub_category: string | null;
  questions_count: number;
  active: number;
  check_type: string;
}

interface LocationItem {
  id: number;
  name: string;
}

interface FormData {
  surveyId: string;
  selectedBuildingIds: number[];
  selectedWingIds: number[];
  selectedFloorIds: number[];
  selectedRoomIds: number[];
}

export const AddSurveyMapping = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    surveyId: '',
    selectedBuildingIds: [],
    selectedWingIds: [],
    selectedFloorIds: [],
    selectedRoomIds: []
  });

  // Survey data
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loadingSurveys, setLoadingSurveys] = useState(false);

  // Location data
  const [buildings, setBuildings] = useState<LocationItem[]>([]);
  const [wings, setWings] = useState<LocationItem[]>([]);
  const [floors, setFloors] = useState<LocationItem[]>([]);
  const [rooms, setRooms] = useState<LocationItem[]>([]);

  // Loading states
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Selected items for display
  const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);
  const [selectedWings, setSelectedWings] = useState<string[]>([]);
  const [selectedFloors, setSelectedFloors] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  // Search terms for filtering location lists
  const [buildingSearch, setBuildingSearch] = useState('');
  const [wingSearch, setWingSearch] = useState('');
  const [floorSearch, setFloorSearch] = useState('');
  const [roomSearch, setRoomSearch] = useState('');

  // Fetch surveys on component mount
  useEffect(() => {
    fetchSurveys();
    fetchBuildings();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoadingSurveys(true);
      const siteId = localStorage.getItem('site_id') || '2189';
      const url = `/pms/admin/snag_checklists.json?site_id=${siteId}&q[name_cont]=&q[check_type_eq]=Survey&q[snag_audit_sub_category_id_eq]=&q[snag_audit_category_id_eq]=`;
      
      const response = await fetch(getFullUrl(url), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch surveys');
      }
      
      const surveyData = await response.json();
      console.log('Surveys data response:', surveyData);
      
      // Filter only active surveys
      const activeSurveys = (surveyData || []).filter((survey: Survey) => survey.active === 1);
      setSurveys(activeSurveys);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      toast({
        title: "Error",
        description: "Failed to fetch surveys",
        variant: "destructive"
      });
      setSurveys([]);
    } finally {
      setLoadingSurveys(false);
    }
  };

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
      setBuildings([]);
      toast({
        title: "Error",
        description: "Failed to load buildings",
        variant: "destructive"
      });
    } finally {
      setLoadingBuildings(false);
    }
  };

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
      setWings([]);
    } finally {
      setLoadingWings(false);
    }
  };

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
      setFloors([]);
    } finally {
      setLoadingFloors(false);
    }
  };

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
      // Note: Based on SurveyDetailsPage, it's a direct array, not wrapped in an object
      setRooms(roomsData.map((room: any) => ({
        id: room.id,
        name: room.name
      })));
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  };

  // Load all location data when component mounts
  useEffect(() => {
    fetchWings();
    fetchFloors();
    fetchRooms();
  }, []);

  const addSelectedItem = (type: 'building' | 'wing' | 'floor' | 'room', name: string) => {
    switch (type) {
      case 'building':
        if (!selectedBuildings.includes(name)) {
          setSelectedBuildings(prev => [...prev, name]);
        }
        break;
      case 'wing':
        if (!selectedWings.includes(name)) {
          setSelectedWings(prev => [...prev, name]);
        }
        break;
      case 'floor':
        if (!selectedFloors.includes(name)) {
          setSelectedFloors(prev => [...prev, name]);
        }
        break;
      case 'room':
        if (!selectedRooms.includes(name)) {
          setSelectedRooms(prev => [...prev, name]);
        }
        break;
    }
  };

  const removeSelectedItem = (type: 'building' | 'wing' | 'floor' | 'room', name: string) => {
    const setterMap = {
      'building': setSelectedBuildings,
      'wing': setSelectedWings,
      'floor': setSelectedFloors,
      'room': setSelectedRooms
    };
    
    const idFieldMap = {
      'building': 'selectedBuildingIds',
      'wing': 'selectedWingIds',
      'floor': 'selectedFloorIds',
      'room': 'selectedRoomIds'
    };

    setterMap[type]((prev: string[]) => prev.filter(item => item !== name));
    
    // Also remove from form data IDs
    const items = type === 'building' ? buildings : 
                 type === 'wing' ? wings :
                 type === 'floor' ? floors : rooms;
    const item = items.find(item => item.name === name);
    
    if (item) {
      setFormData(prev => ({
        ...prev,
        [idFieldMap[type]]: (prev[idFieldMap[type] as keyof FormData] as number[]).filter(id => id !== item.id)
      }));
    }
  };

  const handleSurveyChange = (surveyId: string) => {
    setFormData(prev => ({
      ...prev,
      surveyId
    }));
  };

  const handleLocationSelect = (type: 'building' | 'wing' | 'floor' | 'room', value: string) => {
    const items = type === 'building' ? buildings : 
                 type === 'wing' ? wings :
                 type === 'floor' ? floors : rooms;
    
    const selectedItem = items.find(item => item.id.toString() === value);
    
    if (selectedItem) {
      // Check if item is already selected
      const selectedNames = type === 'building' ? selectedBuildings :
                           type === 'wing' ? selectedWings :
                           type === 'floor' ? selectedFloors : selectedRooms;
      
      if (!selectedNames.includes(selectedItem.name)) {
        addSelectedItem(type, selectedItem.name);
        
        // Add to form data IDs
        const idFieldMap = {
          'building': 'selectedBuildingIds',
          'wing': 'selectedWingIds',
          'floor': 'selectedFloorIds',
          'room': 'selectedRoomIds'
        };
        
        setFormData(prev => ({
          ...prev,
          [idFieldMap[type]]: [...(prev[idFieldMap[type] as keyof FormData] as number[]), selectedItem.id]
        }));
        
        console.log(`Selected ${type} ID:`, value, 'Name:', selectedItem.name);
      }
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.surveyId) {
      toast({
        title: "Error",
        description: "Please select a survey",
        variant: "destructive"
      });
      return;
    }

    if (formData.selectedBuildingIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one building",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare the API request payload to match SurveyDetailsPage format
      const requestData = {
        survey_id: parseInt(formData.surveyId), // Convert to number as required by API
        building_ids: formData.selectedBuildingIds,
        wing_ids: formData.selectedWingIds,
        floor_ids: formData.selectedFloorIds,
        room_ids: formData.selectedRoomIds
      };

      console.log('Submitting survey mapping:', requestData);

      // Make the POST API call using the same pattern as SurveyDetailsPage
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
        description: "Survey mapping created successfully"
      });

      // Navigate back to survey mapping dashboard
      navigate('/maintenance/survey/mapping');

    } catch (error: any) {
      console.error('Error creating survey mapping:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create survey mapping",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/maintenance/survey/mapping');
  };

  const selectedSurvey = surveys.find(survey => survey.id.toString() === formData.surveyId);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Survey Mapping
        </Button>
      </div>

      <div>
        <Heading level="h1" variant="default">Add Survey Mapping</Heading>
        <p className="text-muted-foreground text-sm mt-2">
          Map a survey to specific locations for QR code generation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Survey Selection Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="w-5 h-5 text-[#C72030]" />
              Survey Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="survey" className="text-sm font-medium">
                Select Survey <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.surveyId} 
                onValueChange={handleSurveyChange}
                disabled={loadingSurveys}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={loadingSurveys ? "Loading surveys..." : "Select a survey"} />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  {surveys.map((survey) => (
                    <SelectItem key={survey.id} value={survey.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{survey.name}</span>
                        <span className="text-xs text-gray-500">
                          {survey.questions_count} questions • {survey.check_type}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Survey Info */}
            {selectedSurvey && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Selected Survey</h4>
                <div className="space-y-1 text-sm">
                  <div><span className="font-medium">Name:</span> {selectedSurvey.name}</div>
                  <div><span className="font-medium">Questions:</span> {selectedSurvey.questions_count}</div>
                  <div><span className="font-medium">Type:</span> {selectedSurvey.check_type}</div>
                  {selectedSurvey.snag_audit_category && (
                    <div><span className="font-medium">Category:</span> {selectedSurvey.snag_audit_category}</div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Selection Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#C72030]" />
              Location Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Buildings Dropdown */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Buildings <span className="text-red-500">*</span>
                </Label>
                <Select 
                  onValueChange={(value) => handleLocationSelect('building', value)}
                  disabled={loadingBuildings}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingBuildings ? "Loading..." : `${selectedBuildings.length} building(s) selected`} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    {buildings.map((building) => (
                      <SelectItem key={building.id} value={building.id.toString()}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Selected buildings */}
                {selectedBuildings.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedBuildings.map((building) => (
                      <span key={building} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                        {building}
                        <button
                          onClick={() => removeSelectedItem('building', building)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Wings Dropdown */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">Wings</Label>
                <Select 
                  onValueChange={(value) => handleLocationSelect('wing', value)}
                  disabled={loadingWings}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingWings ? "Loading..." : `${selectedWings.length} wing(s) selected`} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    {wings.map((wing) => (
                      <SelectItem key={wing.id} value={wing.id.toString()}>
                        {wing.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Selected wings */}
                {selectedWings.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedWings.map((wing) => (
                      <span key={wing} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                        {wing}
                        <button
                          onClick={() => removeSelectedItem('wing', wing)}
                          className="ml-1 text-green-600 hover:text-green-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Floors Dropdown */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">Floors</Label>
                <Select 
                  onValueChange={(value) => handleLocationSelect('floor', value)}
                  disabled={loadingFloors}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingFloors ? "Loading..." : `${selectedFloors.length} floor(s) selected`} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    {floors.map((floor) => (
                      <SelectItem key={floor.id} value={floor.id.toString()}>
                        {floor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Selected floors */}
                {selectedFloors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedFloors.map((floor) => (
                      <span key={floor} className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                        {floor}
                        <button
                          onClick={() => removeSelectedItem('floor', floor)}
                          className="ml-1 text-yellow-600 hover:text-yellow-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Rooms Dropdown */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">Rooms</Label>
                <Select 
                  onValueChange={(value) => handleLocationSelect('room', value)}
                  disabled={loadingRooms}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingRooms ? "Loading..." : "Select rooms"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id.toString()}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Selected rooms */}
                {selectedRooms.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRooms.map((room) => (
                      <span key={room} className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                        {room}
                        <button
                          onClick={() => removeSelectedItem('room', room)}
                          className="ml-1 text-purple-600 hover:text-purple-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Location Summary */}
            {(selectedBuildings.length > 0 || selectedWings.length > 0 || selectedFloors.length > 0 || selectedRooms.length > 0) && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Selected Locations</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Buildings:</span> {selectedBuildings.length || 0}
                  </div>
                  <div>
                    <span className="font-medium">Wings:</span> {selectedWings.length || 0}
                  </div>
                  <div>
                    <span className="font-medium">Floors:</span> {selectedFloors.length || 0}
                  </div>
                  <div>
                    <span className="font-medium">Rooms:</span> {selectedRooms.length || 0}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6">
        <Button 
          variant="outline" 
          onClick={handleBack}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={submitting || !formData.surveyId || formData.selectedBuildingIds.length === 0}
          className="bg-[#C72030] hover:bg-[#B01E2E] text-white"
        >
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Survey Mapping
        </Button>
      </div>
    </div>
  );
};
