import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus, Type, MapPin, List, Loader2, Search, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import { toast } from 'sonner';
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

interface SurveyMapping {
  id: string;
  surveyIds: number[];
  buildingIds: number[];
  wingIds: number[];
  floorIds: number[];
  areaIds: number[];
  roomIds: number[];
}

// Section component matching PatrollingCreatePage
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <section className="bg-card rounded-lg border border-border shadow-sm">
    <div className="px-6 py-4 border-b border-border flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-sm font-semibold tracking-wide uppercase">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </section>
);

export const AddSurveyMapping = () => {
  const navigate = useNavigate();
  useEffect(() => { document.title = 'Create Survey Mapping'; }, []);

  // Form state
  const [surveyMappings, setSurveyMappings] = useState<SurveyMapping[]>([{
    id: `sm-${Date.now()}`,
    surveyIds: [],
    buildingIds: [],
    wingIds: [],
    floorIds: [],
    areaIds: [],
    roomIds: []
  }]);

  // Survey data
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loadingSurveys, setLoadingSurveys] = useState(false);

  // Location data
  const [buildings, setBuildings] = useState<LocationItem[]>([]);
  const [wings, setWings] = useState<LocationItem[]>([]);
  const [floors, setFloors] = useState<LocationItem[]>([]);
  const [areas, setAreas] = useState<LocationItem[]>([]);
  const [rooms, setRooms] = useState<LocationItem[]>([]);

  // Loading states
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown state for each mapping and location type
  const [dropdownStates, setDropdownStates] = useState<Record<string, Record<string, boolean>>>({});

  // Fetch surveys and locations on component mount
  useEffect(() => {
    fetchSurveys();
    fetchBuildings();
    fetchWings();
    fetchFloors();
    fetchAreas();
    fetchRooms();
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
      toast.error('Failed to fetch surveys', { duration: 5000 });
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

  const fetchAreas = async () => {
    try {
      setLoadingAreas(true);
      const response = await fetch(getFullUrl('/pms/areas.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch areas');
      }
      
      const areasData = await response.json();
      setAreas(areasData.areas ? areasData.areas.map((area: any) => ({
        id: area.id,
        name: area.name
      })) : []);
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
    } finally {
      setLoadingAreas(false);
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

  // Update functions
  const updateSurveyMapping = (index: number, field: keyof SurveyMapping, value: any) => {
    setSurveyMappings(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addSurveyMapping = () => setSurveyMappings(prev => [...prev, {
    id: `sm-${Date.now()}`,
    surveyIds: [],
    buildingIds: [],
    wingIds: [],
    floorIds: [],
    areaIds: [],
    roomIds: []
  }]);

  const removeSurveyMapping = (idx: number) => setSurveyMappings(prev => prev.filter((_, i) => i !== idx));

  const toggleDropdown = (mappingId: string, locationType: string) => {
    setDropdownStates(prev => ({
      ...prev,
      [mappingId]: {
        ...prev[mappingId],
        [locationType]: !prev[mappingId]?.[locationType]
      }
    }));
  };

  const isDropdownOpen = (mappingId: string, locationType: string) => {
    return dropdownStates[mappingId]?.[locationType] || false;
  };

  const handleSurveyToggle = (mappingIndex: number, surveyId: number) => {
    setSurveyMappings(prev => prev.map((mapping, index) => {
      if (index === mappingIndex) {
        const currentIds = mapping.surveyIds;
        const updatedIds = currentIds.includes(surveyId)
          ? currentIds.filter(id => id !== surveyId)
          : [...currentIds, surveyId];
        return { ...mapping, surveyIds: updatedIds };
      }
      return mapping;
    }));
  };

  const handleLocationToggle = (mappingIndex: number, locationType: 'buildingIds' | 'wingIds' | 'floorIds' | 'areaIds' | 'roomIds', locationId: number) => {
    setSurveyMappings(prev => prev.map((mapping, index) => {
      if (index === mappingIndex) {
        const currentIds = mapping[locationType];
        const updatedIds = currentIds.includes(locationId)
          ? currentIds.filter(id => id !== locationId)
          : [...currentIds, locationId];
        return { ...mapping, [locationType]: updatedIds };
      }
      return mapping;
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Validation
    const validMappings = surveyMappings.filter(mapping => 
      mapping.surveyIds.length > 0 && 
      (mapping.buildingIds.length > 0 || mapping.wingIds.length > 0 || 
       mapping.floorIds.length > 0 || mapping.areaIds.length > 0 || 
       mapping.roomIds.length > 0)
    );

    if (validMappings.length === 0) {
      toast.error('Please add at least one survey mapping with selected locations', {
        duration: 5000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Create mappings one by one
      const results = [];
      
      for (const mapping of validMappings) {
        // Create a separate mapping for each selected survey
        for (const surveyId of mapping.surveyIds) {
          const requestData = {
            survey_id: surveyId,
            building_ids: mapping.buildingIds,
            wing_ids: mapping.wingIds,
            floor_ids: mapping.floorIds,
            area_ids: mapping.areaIds,
            room_ids: mapping.roomIds
          };

          console.log('Submitting survey mapping:', requestData);

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
          results.push(result);
        }
      }

      console.log('Survey mappings created successfully:', results);

      const totalMappings = validMappings.reduce((sum, mapping) => sum + mapping.surveyIds.length, 0);
      toast.success(`${totalMappings} survey mapping(s) created successfully!`, {
        duration: 3000,
      });

      setTimeout(() => {
        navigate('/maintenance/survey/mapping');
      }, 1000);

    } catch (error: any) {
      console.error('Error creating survey mappings:', error);
      toast.error(`Failed to create survey mappings: ${error.message || 'Unknown error'}`, {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
        </div>
      )}
      
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="h-8 w-8 p-0 hover:bg-gray-100"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold tracking-wide uppercase">Survey Mapping</h1>
        </div>
      </header>

      <Section title="Survey Selection" icon={<List className="w-3.5 h-3.5" />}>
        <div className="space-y-6">
          {surveyMappings.map((mapping, idx) => (
            <div key={mapping.id} className="relative rounded-md border border-dashed bg-muted/30 p-4">
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => removeSurveyMapping(idx)}
                  className="absolute -right-2 -top-2 rounded-full p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Remove survey mapping"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              <p className="mb-3 text-sm font-medium text-muted-foreground">Survey Mapping {idx + 1}</p>
              
              <div className="space-y-4">
                {/* Survey Selection */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <div 
                      className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleDropdown(mapping.id, 'surveys')}
                    >
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm font-medium cursor-pointer">Surveys<span className="text-red-500">*</span></Label>
                        <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                          {mapping.surveyIds.length} selected
                        </span>
                      </div>
                      {isDropdownOpen(mapping.id, 'surveys') ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    
                    {isDropdownOpen(mapping.id, 'surveys') && (
                      <div className="mt-2 max-h-64 overflow-y-auto border rounded-lg p-3 bg-white shadow-sm">
                        {loadingSurveys ? (
                          <div className="flex items-center justify-center p-6">
                            <CircularProgress size={20} />
                            <span className="ml-2 text-sm text-gray-600">Loading surveys...</span>
                          </div>
                        ) : surveys.length === 0 ? (
                          <div className="text-center p-6">
                            <p className="text-sm text-gray-500">No surveys available</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {surveys.map((survey) => (
                              <div 
                                key={survey.id} 
                                className={`flex items-start space-x-3 p-3 rounded-md border transition-all duration-200 hover:bg-gray-50 ${
                                  mapping.surveyIds.includes(survey.id) 
                                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  id={`survey-${idx}-${survey.id}`}
                                  checked={mapping.surveyIds.includes(survey.id)}
                                  onChange={() => handleSurveyToggle(idx, survey.id)}
                                  className="w-4 h-4 mt-0.5 text-[#C72030] bg-white border-gray-300 rounded focus:ring-[#C72030] focus:ring-2 cursor-pointer"
                                  disabled={isSubmitting}
                                />
                                <div className="flex-1 min-w-0">
                                  <label 
                                    htmlFor={`survey-${idx}-${survey.id}`}
                                    className="block text-sm font-medium text-gray-900 cursor-pointer leading-tight"
                                  >
                                    {survey.name}
                                  </label>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className="text-xs text-gray-500">
                                      {survey.questions_count} questions
                                    </span>
                                    {survey.snag_audit_category && (
                                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                                        {survey.snag_audit_category}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {mapping.surveyIds.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <button
                              type="button"
                              onClick={() => updateSurveyMapping(idx, 'surveyIds', [])}
                              className="text-xs text-red-600 hover:text-red-800 underline"
                              disabled={isSubmitting}
                            >
                              Clear all selections
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={addSurveyMapping} disabled={isSubmitting}>
              <Plus className="w-4 h-4 mr-2" /> Add Survey Mapping
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Location Configuration" icon={<MapPin className="w-3.5 h-3.5" />}>
        <div className="space-y-6">
          {surveyMappings.map((mapping, mappingIdx) => (
            <div key={mapping.id} className="relative rounded-md border border-dashed bg-muted/30 p-4">
              <p className="mb-4 text-sm font-medium text-muted-foreground">
                Locations for Survey Mapping {mappingIdx + 1}
                {mapping.surveyIds.length > 0 && (
                  <span className="ml-2 text-blue-600">
                    ({mapping.surveyIds.length} survey{mapping.surveyIds.length > 1 ? 's' : ''} selected)
                  </span>
                )}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Buildings */}
                <div>
                  <div 
                    className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleDropdown(mapping.id, 'buildings')}
                  >
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm font-medium cursor-pointer">Buildings</Label>
                      <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                        {mapping.buildingIds.length} selected
                      </span>
                    </div>
                    {isDropdownOpen(mapping.id, 'buildings') ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  
                  {isDropdownOpen(mapping.id, 'buildings') && (
                    <div className="mt-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-white shadow-sm">
                      {loadingBuildings ? (
                        <div className="flex items-center justify-center p-4">
                          <CircularProgress size={20} />
                          <span className="ml-2 text-sm text-gray-600">Loading...</span>
                        </div>
                      ) : buildings.length === 0 ? (
                        <div className="text-center p-4">
                          <p className="text-sm text-gray-500">No buildings available</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {buildings.map((building) => (
                            <div 
                              key={building.id} 
                              className={`flex items-center space-x-3 p-2 rounded-md border transition-all duration-200 hover:bg-gray-50 ${
                                mapping.buildingIds.includes(building.id) 
                                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                id={`building-${mappingIdx}-${building.id}`}
                                checked={mapping.buildingIds.includes(building.id)}
                                onChange={() => handleLocationToggle(mappingIdx, 'buildingIds', building.id)}
                                className="w-4 h-4 text-[#C72030] bg-white border-gray-300 rounded focus:ring-[#C72030] focus:ring-2 cursor-pointer"
                                disabled={isSubmitting}
                              />
                              <label 
                                htmlFor={`building-${mappingIdx}-${building.id}`}
                                className="text-sm text-gray-700 cursor-pointer select-none flex-1 font-medium"
                              >
                                {building.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      {mapping.buildingIds.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <button
                            type="button"
                            onClick={() => updateSurveyMapping(mappingIdx, 'buildingIds', [])}
                            className="text-xs text-red-600 hover:text-red-800 underline"
                            disabled={isSubmitting}
                          >
                            Clear selections
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Wings */}
                <div>
                  <div 
                    className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleDropdown(mapping.id, 'wings')}
                  >
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm font-medium cursor-pointer">Wings</Label>
                      <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                        {mapping.wingIds.length} selected
                      </span>
                    </div>
                    {isDropdownOpen(mapping.id, 'wings') ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  
                  {isDropdownOpen(mapping.id, 'wings') && (
                    <div className="mt-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-white shadow-sm">
                      {loadingWings ? (
                        <div className="flex items-center justify-center p-4">
                          <CircularProgress size={20} />
                          <span className="ml-2 text-sm text-gray-600">Loading...</span>
                        </div>
                      ) : wings.length === 0 ? (
                        <div className="text-center p-4">
                          <p className="text-sm text-gray-500">No wings available</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {wings.map((wing) => (
                            <div 
                              key={wing.id} 
                              className={`flex items-center space-x-3 p-2 rounded-md border transition-all duration-200 hover:bg-gray-50 ${
                                mapping.wingIds.includes(wing.id) 
                                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                id={`wing-${mappingIdx}-${wing.id}`}
                                checked={mapping.wingIds.includes(wing.id)}
                                onChange={() => handleLocationToggle(mappingIdx, 'wingIds', wing.id)}
                                className="w-4 h-4 text-[#C72030] bg-white border-gray-300 rounded focus:ring-[#C72030] focus:ring-2 cursor-pointer"
                                disabled={isSubmitting}
                              />
                              <label 
                                htmlFor={`wing-${mappingIdx}-${wing.id}`}
                                className="text-sm text-gray-700 cursor-pointer select-none flex-1 font-medium"
                              >
                                {wing.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      {mapping.wingIds.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <button
                            type="button"
                            onClick={() => updateSurveyMapping(mappingIdx, 'wingIds', [])}
                            className="text-xs text-red-600 hover:text-red-800 underline"
                            disabled={isSubmitting}
                          >
                            Clear selections
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Floors */}
                <div>
                  <div 
                    className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleDropdown(mapping.id, 'floors')}
                  >
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm font-medium cursor-pointer">Floors</Label>
                      <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                        {mapping.floorIds.length} selected
                      </span>
                    </div>
                    {isDropdownOpen(mapping.id, 'floors') ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  
                  {isDropdownOpen(mapping.id, 'floors') && (
                    <div className="mt-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-white shadow-sm">
                      {loadingFloors ? (
                        <div className="flex items-center justify-center p-4">
                          <CircularProgress size={20} />
                          <span className="ml-2 text-sm text-gray-600">Loading...</span>
                        </div>
                      ) : floors.length === 0 ? (
                        <div className="text-center p-4">
                          <p className="text-sm text-gray-500">No floors available</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {floors.map((floor) => (
                            <div 
                              key={floor.id} 
                              className={`flex items-center space-x-3 p-2 rounded-md border transition-all duration-200 hover:bg-gray-50 ${
                                mapping.floorIds.includes(floor.id) 
                                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                id={`floor-${mappingIdx}-${floor.id}`}
                                checked={mapping.floorIds.includes(floor.id)}
                                onChange={() => handleLocationToggle(mappingIdx, 'floorIds', floor.id)}
                                className="w-4 h-4 text-[#C72030] bg-white border-gray-300 rounded focus:ring-[#C72030] focus:ring-2 cursor-pointer"
                                disabled={isSubmitting}
                              />
                              <label 
                                htmlFor={`floor-${mappingIdx}-${floor.id}`}
                                className="text-sm text-gray-700 cursor-pointer select-none flex-1 font-medium"
                              >
                                {floor.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      {mapping.floorIds.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <button
                            type="button"
                            onClick={() => updateSurveyMapping(mappingIdx, 'floorIds', [])}
                            className="text-xs text-red-600 hover:text-red-800 underline"
                            disabled={isSubmitting}
                          >
                            Clear selections
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Areas */}
                <div>
                  <div 
                    className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleDropdown(mapping.id, 'areas')}
                  >
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm font-medium cursor-pointer">Areas</Label>
                      <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                        {mapping.areaIds.length} selected
                      </span>
                    </div>
                    {isDropdownOpen(mapping.id, 'areas') ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  
                  {isDropdownOpen(mapping.id, 'areas') && (
                    <div className="mt-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-white shadow-sm">
                      {loadingAreas ? (
                        <div className="flex items-center justify-center p-4">
                          <CircularProgress size={20} />
                          <span className="ml-2 text-sm text-gray-600">Loading...</span>
                        </div>
                      ) : areas.length === 0 ? (
                        <div className="text-center p-4">
                          <p className="text-sm text-gray-500">No areas available</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {areas.map((area) => (
                            <div 
                              key={area.id} 
                              className={`flex items-center space-x-3 p-2 rounded-md border transition-all duration-200 hover:bg-gray-50 ${
                                mapping.areaIds.includes(area.id) 
                                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                id={`area-${mappingIdx}-${area.id}`}
                                checked={mapping.areaIds.includes(area.id)}
                                onChange={() => handleLocationToggle(mappingIdx, 'areaIds', area.id)}
                                className="w-4 h-4 text-[#C72030] bg-white border-gray-300 rounded focus:ring-[#C72030] focus:ring-2 cursor-pointer"
                                disabled={isSubmitting}
                              />
                              <label 
                                htmlFor={`area-${mappingIdx}-${area.id}`}
                                className="text-sm text-gray-700 cursor-pointer select-none flex-1 font-medium"
                              >
                                {area.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      {mapping.areaIds.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <button
                            type="button"
                            onClick={() => updateSurveyMapping(mappingIdx, 'areaIds', [])}
                            className="text-xs text-red-600 hover:text-red-800 underline"
                            disabled={isSubmitting}
                          >
                            Clear selections
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Rooms */}
                <div>
                  <div 
                    className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleDropdown(mapping.id, 'rooms')}
                  >
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm font-medium cursor-pointer">Rooms</Label>
                      <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                        {mapping.roomIds.length} selected
                      </span>
                    </div>
                    {isDropdownOpen(mapping.id, 'rooms') ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  
                  {isDropdownOpen(mapping.id, 'rooms') && (
                    <div className="mt-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-white shadow-sm">
                      {loadingRooms ? (
                        <div className="flex items-center justify-center p-4">
                          <CircularProgress size={20} />
                          <span className="ml-2 text-sm text-gray-600">Loading...</span>
                        </div>
                      ) : rooms.length === 0 ? (
                        <div className="text-center p-4">
                          <p className="text-sm text-gray-500">No rooms available</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {rooms.map((room) => (
                            <div 
                              key={room.id} 
                              className={`flex items-center space-x-3 p-2 rounded-md border transition-all duration-200 hover:bg-gray-50 ${
                                mapping.roomIds.includes(room.id) 
                                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                id={`room-${mappingIdx}-${room.id}`}
                                checked={mapping.roomIds.includes(room.id)}
                                onChange={() => handleLocationToggle(mappingIdx, 'roomIds', room.id)}
                                className="w-4 h-4 text-[#C72030] bg-white border-gray-300 rounded focus:ring-[#C72030] focus:ring-2 cursor-pointer"
                                disabled={isSubmitting}
                              />
                              <label 
                                htmlFor={`room-${mappingIdx}-${room.id}`}
                                className="text-sm text-gray-700 cursor-pointer select-none flex-1 font-medium"
                              >
                                {room.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      {mapping.roomIds.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <button
                            type="button"
                            onClick={() => updateSurveyMapping(mappingIdx, 'roomIds', [])}
                            className="text-xs text-red-600 hover:text-red-800 underline"
                            disabled={isSubmitting}
                          >
                            Clear selections
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Location Summary */}
           
            </div>
          ))}
        </div>
      </Section>

      <div className="flex items-center gap-3 justify-center pt-2">
        <Button
          variant="destructive"
          className="px-8"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Submit'
          )}
        </Button>
        <Button
          variant="outline"
          className="px-8"
          onClick={() => navigate('/maintenance/survey/mapping')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
