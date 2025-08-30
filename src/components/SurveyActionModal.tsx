import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { X, User, Edit, Download, Copy, Share2, Trash2, Loader2, Map, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { apiClient } from '@/utils/apiClient';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';

interface SurveyObject {
  id: number;
  name: string;
  snag_audit_category: string;
  snag_audit_sub_category: string | null;
  questions_count: number;
  active: number;
}

interface LocationItem {
  id: number;
  name: string;
}

interface SurveySelectionPanelProps {
  selectedSurveys: string[];
  selectedSurveyObjects: SurveyObject[];
  onClearSelection: () => void;
}

export const SurveySelectionPanel: React.FC<SurveySelectionPanelProps> = ({
  selectedSurveys,
  selectedSurveyObjects,
  onClearSelection
}) => {
  const navigate = useNavigate();
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDuplicateLoading, setIsDuplicateLoading] = useState(false);
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isAddMappingLoading, setIsAddMappingLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Location configuration state
  const [locationConfig, setLocationConfig] = useState({
    selectedBuildings: [] as string[],
    selectedWings: [] as string[],
    selectedFloors: [] as string[],
    selectedRooms: [] as string[],
    selectedBuildingIds: [] as number[],
    selectedWingIds: [] as number[],
    selectedFloorIds: [] as number[],
    selectedRoomIds: [] as number[]
  });
  
  // Location data state
  const [buildings, setBuildings] = useState<LocationItem[]>([]);
  const [wings, setWings] = useState<LocationItem[]>([]);
  const [floors, setFloors] = useState<LocationItem[]>([]);
  const [rooms, setRooms] = useState<LocationItem[]>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  
  const { toast } = useToast();

  const handleView = () => {
    if (selectedSurveys.length === 1) {
      console.log('SurveySelectionPanel - View clicked for survey:', selectedSurveys[0]);
      setIsViewLoading(true);
      navigate(`/maintenance/survey/details/${selectedSurveys[0]}`);
    } else {
      toast({
        title: "Single Selection Required",
        description: "Please select only one survey to view details.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = () => {
    if (selectedSurveys.length === 1) {
      console.log('SurveySelectionPanel - Edit clicked for survey:', selectedSurveys[0]);
      setIsEditLoading(true);
      navigate(`/maintenance/survey/edit/${selectedSurveys[0]}`);
    } else {
      toast({
        title: "Single Selection Required",
        description: "Please select only one survey to edit.",
        variant: "destructive"
      });
    }
  };

  const handleDuplicate = async () => {
    console.log('SurveySelectionPanel - Duplicate clicked for surveys:', selectedSurveys);
    setIsDuplicateLoading(true);
    
    try {
      // TODO: Implement duplicate API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Duplicate Successful",
        description: `Successfully duplicated ${selectedSurveys.length} survey${selectedSurveys.length > 1 ? 's' : ''}.`
      });
      
      onClearSelection();
    } catch (error) {
      console.error('Duplicate failed:', error);
      toast({
        title: "Duplicate Failed",
        description: "Failed to duplicate surveys. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDuplicateLoading(false);
    }
  };

  const handleShare = async () => {
    console.log('SurveySelectionPanel - Share clicked for surveys:', selectedSurveys);
    setIsShareLoading(true);
    
    try {
      // TODO: Implement share API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Share Successful",
        description: `Successfully shared ${selectedSurveys.length} survey${selectedSurveys.length > 1 ? 's' : ''}.`
      });
      
      onClearSelection();
    } catch (error) {
      console.error('Share failed:', error);
      toast({
        title: "Share Failed",
        description: "Failed to share surveys. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsShareLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedSurveys.length} survey${selectedSurveys.length > 1 ? 's' : ''}?`)) {
      console.log('SurveySelectionPanel - Delete clicked for surveys:', selectedSurveys);
      setIsDeleteLoading(true);
      
      try {
        // TODO: Implement delete API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        toast({
          title: "Delete Successful",
          description: `Successfully deleted ${selectedSurveys.length} survey${selectedSurveys.length > 1 ? 's' : ''}.`
        });
        
        onClearSelection();
      } catch (error) {
        console.error('Delete failed:', error);
        toast({
          title: "Delete Failed",
          description: "Failed to delete surveys. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsDeleteLoading(false);
      }
    }
  };

  const handleAddMapping = () => {
    console.log('SurveySelectionPanel - Add Mapping clicked for surveys:', selectedSurveys);
    setIsDialogOpen(true);
    // Load all location data when dialog opens
    fetchBuildings();
    fetchWings();
    fetchFloors();
    fetchRooms();
  };

  // Location data fetching functions
  const fetchBuildings = useCallback(async () => {
    setLoadingBuildings(true);
    try {
      const buildingsData = await ticketManagementAPI.getBuildings();
      console.log('Buildings API response:', buildingsData);
      // Handle different response structures
      const buildings = Array.isArray(buildingsData) ? buildingsData : 
                       buildingsData?.buildings ? buildingsData.buildings :
                       buildingsData?.data ? buildingsData.data : [];
      setBuildings(buildings);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      setBuildings([]); // Set empty array on error
      toast({
        title: "Error",
        description: "Failed to load buildings",
        variant: "destructive"
      });
    } finally {
      setLoadingBuildings(false);
    }
  }, [toast]);

  const fetchWings = useCallback(async () => {
    setLoadingWings(true);
    try {
      const wingsData = await ticketManagementAPI.getWings();
      console.log('Wings API response:', wingsData);
      const wings = Array.isArray(wingsData) ? wingsData : 
                   wingsData?.wings ? wingsData.wings :
                   wingsData?.data ? wingsData.data : [];
      setWings(wings);
    } catch (error) {
      console.error('Error fetching wings:', error);
      setWings([]);
      toast({
        title: "Error",
        description: "Failed to load wings",
        variant: "destructive"
      });
    } finally {
      setLoadingWings(false);
    }
  }, [toast]);

  const fetchFloors = useCallback(async () => {
    setLoadingFloors(true);
    try {
      const floorsData = await ticketManagementAPI.getFloors();
      console.log('Floors API response:', floorsData);
      const floors = Array.isArray(floorsData) ? floorsData : 
                    floorsData?.floors ? floorsData.floors :
                    floorsData?.data ? floorsData.data : [];
      setFloors(floors);
    } catch (error) {
      console.error('Error fetching floors:', error);
      setFloors([]);
      toast({
        title: "Error",
        description: "Failed to load floors",
        variant: "destructive"
      });
    } finally {
      setLoadingFloors(false);
    }
  }, [toast]);

  const fetchRooms = useCallback(async () => {
    setLoadingRooms(true);
    try {
      const roomsData = await ticketManagementAPI.getRooms();
      console.log('Rooms API response:', roomsData);
      const rooms = Array.isArray(roomsData) ? roomsData : 
                   roomsData?.rooms ? roomsData.rooms :
                   roomsData?.data ? roomsData.data : [];
      setRooms(rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
      toast({
        title: "Error",
        description: "Failed to load rooms",
        variant: "destructive"
      });
    } finally {
      setLoadingRooms(false);
    }
  }, [toast]);

  // Helper functions for location configuration
  const addSelectedItem = (type: string, name: string) => {
    setLocationConfig(prev => ({
      ...prev,
      [`selected${type.charAt(0).toUpperCase() + type.slice(1)}s`]: [
        ...prev[`selected${type.charAt(0).toUpperCase() + type.slice(1)}s` as keyof typeof prev] as string[],
        name
      ]
    }));
  };

  const removeSelectedItem = (type: string, name: string) => {
    const fieldName = `selected${type.charAt(0).toUpperCase() + type.slice(1)}s`;
    const idFieldName = `selected${type.charAt(0).toUpperCase() + type.slice(1)}Ids`;
    
    setLocationConfig(prev => ({
      ...prev,
      [fieldName]: (prev[fieldName as keyof typeof prev] as string[]).filter(item => item !== name),
      [idFieldName]: (prev[idFieldName as keyof typeof prev] as number[]).filter(id => {
        // Find the corresponding item and remove its ID
        const items: LocationItem[] = type === 'building' ? buildings : 
                     type === 'wing' ? wings :
                     type === 'floor' ? floors : rooms;
        const item = items.find((item: LocationItem) => item.name === name);
        return item ? id !== item.id : true;
      })
    }));
  };

  const handleSubmitLocation = async () => {
    try {
      // TODO: Implement survey mapping API call
      const mappingData = {
        survey_ids: selectedSurveys,
        building_ids: locationConfig.selectedBuildingIds,
        wing_ids: locationConfig.selectedWingIds,
        floor_ids: locationConfig.selectedFloorIds,
        room_ids: locationConfig.selectedRoomIds
      };
      
      console.log('Submitting survey mapping:', mappingData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Mapping Added Successfully",
        description: `Survey mapping has been configured for ${selectedSurveys.length} survey${selectedSurveys.length > 1 ? 's' : ''}.`
      });
      
      setIsDialogOpen(false);
      onClearSelection();
      
      // Reset location config
      setLocationConfig({
        selectedBuildings: [],
        selectedWings: [],
        selectedFloors: [],
        selectedRooms: [],
        selectedBuildingIds: [],
        selectedWingIds: [],
        selectedFloorIds: [],
        selectedRoomIds: []
      });
      
    } catch (error) {
      console.error('Error submitting location mapping:', error);
      toast({
        title: "Error",
        description: "Failed to add survey mapping. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Load all location data when dialog opens - no dependent loading needed
  // All data is fetched upfront for better user experience

  const handleClearSelection = () => {
    console.log('SurveySelectionPanel - Clear selection clicked');
    onClearSelection();
  };

  if (selectedSurveys.length === 0) {
    console.log('SurveySelectionPanel - No surveys selected, hiding panel');
    return null;
  }

  console.log('SurveySelectionPanel - Rendering with selected surveys:', selectedSurveys);

  return (
    <>
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.15)] rounded-lg z-50 flex h-[105px]">
      {/* Beige left strip - 44px wide */}
      <div className="w-[44px] bg-[#C4B59A] rounded-l-lg flex flex-col items-center justify-center">
        <div className="text-[#C72030] font-bold text-lg">
          {selectedSurveys.length}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex items-center justify-between gap-4 px-6 flex-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#1a1a1a]">Selection</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              {selectedSurveyObjects.slice(0, 2).map(survey => survey.name).join(', ')}
              {selectedSurveyObjects.length > 2 && ` +${selectedSurveyObjects.length - 2} more`}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* <Button
            onClick={handleView}
            disabled={isViewLoading || selectedSurveys.length > 1}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            {isViewLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <User className="w-6 h-6 text-black" />
            )}
            <span className="text-xs text-gray-600">View</span>
          </Button> */}
          
          {/* <Button
            onClick={handleEdit}
            disabled={isEditLoading || selectedSurveys.length > 1}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            {isEditLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <Edit className="w-6 h-6 text-black" />
            )}
            <span className="text-xs text-gray-600">Edit</span>
          </Button> */}
          
          {/* <Button
            onClick={handleDuplicate}
            disabled={isDuplicateLoading}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            {isDuplicateLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <Copy className="w-6 h-6 text-black" />
            )}
            <span className="text-xs text-gray-600">Duplicate</span>
          </Button> */}
          
          {/* <Button
            onClick={handleShare}
            disabled={isShareLoading}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            {isShareLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <Share2 className="w-6 h-6 text-black" />
            )}
            <span className="text-xs text-gray-600">Share</span>
          </Button> */}
          
          <Button
            onClick={handleAddMapping}
            disabled={isAddMappingLoading}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            {isAddMappingLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <Map className="w-6 h-6 text-black" />
            )}
            <span className="text-xs text-gray-600">Add Mapping</span>
          </Button>
          
          {/* <Button
            onClick={handleDelete}
            disabled={isDeleteLoading}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-red-50 transition-colors duration-200"
          >
            {isDeleteLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-red-600" />
            ) : (
              <Trash2 className="w-6 h-6 text-red-600" />
            )}
            <span className="text-xs text-red-600">Delete</span>
          </Button> */}
        </div>
      </div>
      
      {/* Cross button - 44px wide */}
      <div className="w-[44px] flex items-center justify-center border-l border-gray-200">
        <button
          onClick={handleClearSelection}
          className="w-full h-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
        >
          <X className="w-4 h-4 text-black" />
        </button>
      </div>
    </div>

    {/* Location Configuration Dialog */}
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Survey Location Mapping</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDialogOpen(false)}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Direct Dropdowns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buildings Dropdown */}
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
                    Array.isArray(buildings) && buildings.length > 0 ? buildings.map((building) => (
                      <SelectItem key={building.id} value={building.id.toString()}>
                        {building.name}
                      </SelectItem>
                    )) : (
                      <SelectItem value="no-data" disabled>No buildings available</SelectItem>
                    )
                  )}
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

            {/* Wings Dropdown */}
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
                    Array.isArray(wings) && wings.length > 0 ? wings.map((wing) => (
                      <SelectItem key={wing.id} value={wing.id.toString()}>
                        {wing.name}
                      </SelectItem>
                    )) : (
                      <SelectItem value="no-data" disabled>No wings available</SelectItem>
                    )
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

            {/* Floors Dropdown */}
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
                    Array.isArray(floors) && floors.length > 0 ? floors.map((floor) => (
                      <SelectItem key={floor.id} value={floor.id.toString()}>
                        {floor.name}
                      </SelectItem>
                    )) : (
                      <SelectItem value="no-data" disabled>No floors available</SelectItem>
                    )
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

            {/* Rooms Dropdown */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Rooms</h4>
              <Select onValueChange={(value) => {
                const selectedRoom = rooms.find(r => r.id.toString() === value);
                if (selectedRoom && !locationConfig.selectedRooms.includes(selectedRoom.name)) {
                  addSelectedItem('room', selectedRoom.name);
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
                    Array.isArray(rooms) && rooms.length > 0 ? rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id.toString()}>
                        {room.name}
                      </SelectItem>
                    )) : (
                      <SelectItem value="no-data" disabled>No rooms available</SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

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
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSubmitLocation} className="bg-red-600 hover:bg-red-700 text-white">
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </>
  );
};
