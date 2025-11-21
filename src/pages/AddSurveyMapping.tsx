import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Plus, MapPin, List, Loader2, ArrowLeft, ListChecks } from 'lucide-react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip, 
  Box,
  OutlinedInput,
  SelectChangeEvent,
  CircularProgress 
} from '@mui/material';
import { toast } from 'sonner';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';

interface Question {
  id: string;
  task: string;
  inputType: string;
  mandatory: boolean;
  options: string[];
  optionsText: string;
}

interface QuestionOption {
  qname: string;
}

interface SnagQuestion {
  id: number;
  descr: string;
  qtype: string;
  quest_mandatory: boolean;
  snag_quest_options?: QuestionOption[];
}

interface Survey {
  id: number;
  name: string;
  snag_audit_category: string | null;
  snag_audit_sub_category: string | null;
  questions_count: number;
  active: number;
  check_type: string;
  snag_questions?: SnagQuestion[];
}

interface LocationItem {
  id: number;
  name: string;
}

interface SurveyMapping {
  id: string;
  selectedLocation: {
    site: string;
    building: string;
    wing: string;
    area: string;
    floor: string;
    room: string;
  };
  // Keep the old array format for backward compatibility with submission
  siteIds: number[];
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

  // Location data states - now component specific to prevent conflicts between multiple mappings
  const [sites, setSites] = useState<LocationItem[]>([]);
  const [locationData, setLocationData] = useState<{
    [key: string]: {
      buildings: LocationItem[];
      wings: LocationItem[];
      areas: LocationItem[];
      floors: LocationItem[];
      rooms: LocationItem[];
    };
  }>({});
  const [loading, setLoading] = useState({
    sites: false,
    buildings: {},
    wings: {},
    areas: {},
    floors: {},
    rooms: {},
  });

  // Track which configuration is currently loading data for each parent
  const [loadingByConfig, setLoadingByConfig] = useState<{
    [configId: string]: {
      buildings: string;
      wings: string;
      areas: string;
      floors: string;
      rooms: string;
    };
  }>({});

  // Form state
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  const initialMappingId = `sm-${Date.now()}`;
  const [surveyMappings, setSurveyMappings] = useState<SurveyMapping[]>([{
    id: initialMappingId,
    selectedLocation: {
      site: "",
      building: "",
      wing: "",
      area: "",
      floor: "",
      room: "",
    },
    siteIds: [],
    buildingIds: [],
    wingIds: [],
    floorIds: [],
    areaIds: [],
    roomIds: []
  }]);

  // Survey data
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loadingSurveys, setLoadingSurveys] = useState(false);
  
  // Selected survey questions
  const [selectedSurveyQuestions, setSelectedSurveyQuestions] = useState<Question[]>([]);

  // Remove old location data states as they're now handled by useLocationData hook
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize loading state for the first configuration
  useEffect(() => {
    setLoadingByConfig(prev => ({
      ...prev,
      [initialMappingId]: {
        buildings: '',
        wings: '',
        areas: '',
        floors: '',
        rooms: ''
      }
    }));
  }, [initialMappingId]);

  // Fetch sites on component mount
  useEffect(() => {
    fetchSites();
  }, []);

  // Fetch sites
  const fetchSites = async () => {
    setLoading(prev => ({ ...prev, sites: true }));
    try {
      const response = await fetch(getFullUrl('/pms/sites.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Sites response data:', data);
      setSites(data.sites || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
      setSites([]);
    } finally {
      setLoading(prev => ({ ...prev, sites: false }));
    }
  };

  // Get location data for a specific location type and parent ID
  const getLocationData = (type: 'buildings' | 'wings' | 'areas' | 'floors' | 'rooms', parentId: string) => {
    const key = `${type}_${parentId}`;
    return locationData[key]?.[type] || [];
  };

  // Check if location data is loading for a specific type and parent ID for a specific configuration
  const isLocationLoading = (type: 'buildings' | 'wings' | 'areas' | 'floors' | 'rooms', parentId: string, configId: string) => {
    if (!parentId) return false;
    const configLoadingState = loadingByConfig[configId];
    return configLoadingState && configLoadingState[type] === parentId;
  };

  // Fetch buildings for a specific site
  const fetchBuildings = async (siteId: number, configId?: string) => {
    if (!siteId) return;
    
    const key = `buildings_${siteId}`;
    setLoading(prev => ({ ...prev, buildings: { ...prev.buildings, [key]: true } }));
    
    // Set loading state for specific config if provided
    if (configId) {
      setLoadingByConfig(prev => ({
        ...prev,
        [configId]: {
          ...prev[configId],
          buildings: siteId.toString()
        }
      }));
    }
    
    try {
      const url = `/pms/sites/${siteId}/buildings.json`;
      const response = await fetch(getFullUrl(url), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setLocationData(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          buildings: data.buildings || []
        }
      }));
    } catch (error) {
      console.error('Error fetching buildings:', error);
    } finally {
      setLoading(prev => ({ ...prev, buildings: { ...prev.buildings, [key]: false } }));
      
      // Clear loading state for specific config if provided
      if (configId) {
        setLoadingByConfig(prev => ({
          ...prev,
          [configId]: {
            ...prev[configId],
            buildings: ''
          }
        }));
      }
    }
  };

  // Fetch wings for a specific building
  const fetchWings = async (buildingId: number, configId?: string) => {
    if (!buildingId) return;
    
    const key = `wings_${buildingId}`;
    setLoading(prev => ({ ...prev, wings: { ...prev.wings, [key]: true } }));
    
    // Set loading state for specific config if provided
    if (configId) {
      setLoadingByConfig(prev => ({
        ...prev,
        [configId]: {
          ...prev[configId],
          wings: buildingId.toString()
        }
      }));
    }
    
    try {
      const url = `/pms/wings.json?building_id=${buildingId}`;
      const response = await fetch(getFullUrl(url), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setLocationData(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          wings: data.wings || []
        }
      }));
    } catch (error) {
      console.error('Error fetching wings:', error);
    } finally {
      setLoading(prev => ({ ...prev, wings: { ...prev.wings, [key]: false } }));
      
      // Clear loading state for specific config if provided
      if (configId) {
        setLoadingByConfig(prev => ({
          ...prev,
          [configId]: {
            ...prev[configId],
            wings: ''
          }
        }));
      }
    }
  };

  // Fetch areas for a specific wing
  const fetchAreas = async (wingId: number, configId?: string) => {
    if (!wingId) return;
    
    const key = `areas_${wingId}`;
    setLoading(prev => ({ ...prev, areas: { ...prev.areas, [key]: true } }));
    
    // Set loading state for specific config if provided
    if (configId) {
      setLoadingByConfig(prev => ({
        ...prev,
        [configId]: {
          ...prev[configId],
          areas: wingId.toString()
        }
      }));
    }
    
    try {
      const url = `/pms/areas.json?wing_id=${wingId}`;
      const response = await fetch(getFullUrl(url), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setLocationData(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          areas: data.areas || []
        }
      }));
    } catch (error) {
      console.error('Error fetching areas:', error);
    } finally {
      setLoading(prev => ({ ...prev, areas: { ...prev.areas, [key]: false } }));
      
      // Clear loading state for specific config if provided
      if (configId) {
        setLoadingByConfig(prev => ({
          ...prev,
          [configId]: {
            ...prev[configId],
            areas: ''
          }
        }));
      }
    }
  };

  // Fetch floors for a specific area
  const fetchFloors = async (areaId: number, configId?: string) => {
    if (!areaId) return;
    
    const key = `floors_${areaId}`;
    setLoading(prev => ({ ...prev, floors: { ...prev.floors, [key]: true } }));
    
    // Set loading state for specific config if provided
    if (configId) {
      setLoadingByConfig(prev => ({
        ...prev,
        [configId]: {
          ...prev[configId],
          floors: areaId.toString()
        }
      }));
    }
    
    try {
      const url = `/pms/floors.json?area_id=${areaId}`;
      const response = await fetch(getFullUrl(url), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setLocationData(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          floors: data.floors || []
        }
      }));
    } catch (error) {
      console.error('Error fetching floors:', error);
    } finally {
      setLoading(prev => ({ ...prev, floors: { ...prev.floors, [key]: false } }));
      
      // Clear loading state for specific config if provided
      if (configId) {
        setLoadingByConfig(prev => ({
          ...prev,
          [configId]: {
            ...prev[configId],
            floors: ''
          }
        }));
      }
    }
  };

  // Fetch rooms for a specific floor
  const fetchRooms = async (floorId: number, configId?: string) => {
    if (!floorId) return;
    
    const key = `rooms_${floorId}`;
    setLoading(prev => ({ ...prev, rooms: { ...prev.rooms, [key]: true } }));
    
    // Set loading state for specific config if provided
    if (configId) {
      setLoadingByConfig(prev => ({
        ...prev,
        [configId]: {
          ...prev[configId],
          rooms: floorId.toString()
        }
      }));
    }
    
    try {
      const url = `/pms/rooms.json?floor_id=${floorId}`;
      const response = await fetch(getFullUrl(url), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      const rooms = Array.isArray(data) ? data : (data.rooms || []);
      
      setLocationData(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          rooms: rooms
        }
      }));
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(prev => ({ ...prev, rooms: { ...prev.rooms, [key]: false } }));
      
      // Clear loading state for specific config if provided
      if (configId) {
        setLoadingByConfig(prev => ({
          ...prev,
          [configId]: {
            ...prev[configId],
            rooms: ''
          }
        }));
      }
    }
  };

  // Fetch surveys and locations on component mount
  useEffect(() => {
    fetchSurveys();
  }, []);

  // Debug effect to log location data
  useEffect(() => {
    console.log('Sites:', sites);
    console.log('Location data:', locationData);
    console.log('Loading states:', loading);
  }, [sites, locationData, loading]);

  // Handle location changes with cascading behavior
  const handleLocationChange = async (
    index: number,
    field: 'site' | 'building' | 'wing' | 'area' | 'floor' | 'room',
    value: string
  ) => {
    console.log(`Location change: ${field} = ${value} for mapping ${index}`);
    
    setSurveyMappings(prev => prev.map((mapping, i) => {
      if (i !== index) return mapping;

      const newSelectedLocation = { ...mapping.selectedLocation };
      const configId = mapping.id;
      
      // Reset dependent fields when parent changes
      switch (field) {
        case 'site':
          newSelectedLocation.site = value;
          newSelectedLocation.building = "";
          newSelectedLocation.wing = "";
          newSelectedLocation.area = "";
          newSelectedLocation.floor = "";
          newSelectedLocation.room = "";
          // Fetch buildings for selected site
          if (value) {
            console.log('Fetching buildings for site:', value);
            fetchBuildings(parseInt(value), configId);
          }
          break;
        case 'building':
          newSelectedLocation.building = value;
          newSelectedLocation.wing = "";
          newSelectedLocation.area = "";
          newSelectedLocation.floor = "";
          newSelectedLocation.room = "";
          // Fetch wings for selected building
          if (value) {
            console.log('Fetching wings for building:', value);
            fetchWings(parseInt(value), configId);
          }
          break;
        case 'wing':
          newSelectedLocation.wing = value;
          newSelectedLocation.area = "";
          newSelectedLocation.floor = "";
          newSelectedLocation.room = "";
          // Fetch areas for selected wing
          if (value) {
            console.log('Fetching areas for wing:', value);
            fetchAreas(parseInt(value), configId);
          }
          break;
        case 'area':
          newSelectedLocation.area = value;
          newSelectedLocation.floor = "";
          newSelectedLocation.room = "";
          // Fetch floors for selected area
          if (value) {
            console.log('Fetching floors for area:', value);
            fetchFloors(parseInt(value), configId);
          }
          break;
        case 'floor':
          newSelectedLocation.floor = value;
          newSelectedLocation.room = "";
          // Fetch rooms for selected floor
          if (value) {
            console.log('Fetching rooms for floor:', value);
            fetchRooms(parseInt(value), configId);
          }
          break;
        case 'room':
          newSelectedLocation.room = value;
          break;
      }

      return {
        ...mapping,
        selectedLocation: newSelectedLocation
      };
    }));
  };

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

  // Field styles for Material-UI components
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
      padding: { xs: "8px", sm: "10px", md: "12px" },
    },
  };

  // Update functions
  const updateSurveyMapping = (index: number, field: keyof SurveyMapping, value: unknown) => {
    setSurveyMappings(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addSurveyMapping = () => {
    const newMappingId = `sm-${Date.now()}`;
    setSurveyMappings(prev => [...prev, {
      id: newMappingId,
      selectedLocation: {
        site: "",
        building: "",
        wing: "",
        area: "",
        floor: "",
        room: "",
      },
      siteIds: [],
      buildingIds: [],
      wingIds: [],
      floorIds: [],
      areaIds: [],
      roomIds: []
    }]);
    
    // Initialize loading state for the new configuration
    setLoadingByConfig(prev => ({
      ...prev,
      [newMappingId]: {
        buildings: '',
        wings: '',
        areas: '',
        floors: '',
        rooms: ''
      }
    }));
  };

  const removeSurveyMapping = (idx: number) => {
    const mappingToRemove = surveyMappings[idx];
    setSurveyMappings(prev => prev.filter((_, i) => i !== idx));
    
    // Clean up loading state for the removed configuration
    setLoadingByConfig(prev => {
      const newState = { ...prev };
      delete newState[mappingToRemove.id];
      return newState;
    });
  };

  const handleSurveyChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number;
    setSelectedSurveyId(value);
    
    // Update survey questions based on selected survey
    updateSurveyQuestions(value);
  };

  // Function to update survey questions based on selected survey
  const updateSurveyQuestions = (surveyId?: number) => {
    const targetSurveyId = surveyId || selectedSurveyId;
    
    if (!targetSurveyId) {
      setSelectedSurveyQuestions([]);
      return;
    }

    const selectedSurvey = surveys.find(survey => survey.id === targetSurveyId);
    if (selectedSurvey && selectedSurvey.snag_questions) {
      const mappedQuestions = selectedSurvey.snag_questions.map((q: SnagQuestion) => {
        // Map API question types to UI input types
        let inputType = '';
        switch (q.qtype) {
          case 'multiple':
            inputType = 'multiple_choice';
            break;
          case 'yesno':
            inputType = 'yes_no';
            break;
          case 'rating':
            inputType = 'rating';
            break;
          case 'input':
            inputType = 'text_input';
            break;
          case 'description':
            inputType = 'description';
            break;
          case 'emoji':
            inputType = 'emoji';
            break;
          default:
            inputType = '';
        }

        return {
          id: q.id.toString(),
          task: q.descr,
          inputType,
          mandatory: !!q.quest_mandatory,
          options: q.snag_quest_options ? q.snag_quest_options.map((opt: QuestionOption) => opt.qname) : [],
          optionsText: q.snag_quest_options ? q.snag_quest_options.map((opt: QuestionOption) => opt.qname).join(', ') : ''
        };
      });
      setSelectedSurveyQuestions(mappedQuestions);
    } else {
      setSelectedSurveyQuestions([]);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Validation - check survey selection and each mapping individually
    const invalidMappings = [];
    const validMappings = [];
    
    if (!selectedSurveyId) {
      toast.error('Please select a survey first', {
        duration: 5000,
      });
      setIsSubmitting(false);
      return;
    }
    
    surveyMappings.forEach((mapping, index) => {
      // Check if site is selected (mandatory)
      if (!mapping.selectedLocation.site) {
        invalidMappings.push(`Location Configuration ${index + 1}: Site selection is required`);
        return; // Skip further validation for this mapping
      }
      
      // Check if building is selected (mandatory)
      if (!mapping.selectedLocation.building) {
        invalidMappings.push(`Location Configuration ${index + 1}: Building selection is required`);
        return; // Skip further validation for this mapping
      }
      
      // If both site and building are selected, the mapping is valid
      validMappings.push(mapping);
    });

    if (invalidMappings.length > 0) {
      toast.error(invalidMappings.join('\n'), {
        duration: 7000,
      });
      setIsSubmitting(false);
      return;
    }

    if (validMappings.length === 0) {
      toast.error('Please add at least one valid survey mapping with selected locations', {
        duration: 5000,
      });
      setIsSubmitting(false);
      return;
    }

    // Check for duplicate locations
    const locationCombinations = validMappings.map(mapping => mapping.selectedLocation);
    const uniqueLocations = new Set();
    const duplicateFound = locationCombinations.some(location => {
      const locationKey = `${location.site}-${location.building}-${location.wing || ''}-${location.area || ''}-${location.floor || ''}-${location.room || ''}`;
      if (uniqueLocations.has(locationKey)) {
        return true;
      }
      uniqueLocations.add(locationKey);
      return false;
    });

    if (duplicateFound) {
      toast.error('Please enter different location', {
        description: 'You have selected the same location multiple times. Please select different locations for each configuration.',
        duration: 5000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Build survey_mappings array in the new format
      const surveyMappingsPayload = validMappings.map(mapping => {
        const mappingData: {
          survey_id: number;
          site_id?: number;
          building_id?: number;
          wing_id?: number;
          area_id?: number;
          floor_id?: number;
          room_id?: number;
          active: boolean;
        } = {
          survey_id: selectedSurveyId, // Use the same survey for all mappings
          active: true
        };

        // Add location IDs if they exist
        if (mapping.selectedLocation.site) {
          mappingData.site_id = parseInt(mapping.selectedLocation.site);
        }
        if (mapping.selectedLocation.building) {
          mappingData.building_id = parseInt(mapping.selectedLocation.building);
        }
        if (mapping.selectedLocation.wing) {
          mappingData.wing_id = parseInt(mapping.selectedLocation.wing);
        }
        if (mapping.selectedLocation.area) {
          mappingData.area_id = parseInt(mapping.selectedLocation.area);
        }
        if (mapping.selectedLocation.floor) {
          mappingData.floor_id = parseInt(mapping.selectedLocation.floor);
        }
        if (mapping.selectedLocation.room) {
          mappingData.room_id = parseInt(mapping.selectedLocation.room);
        }

        return mappingData;
      });

      const requestData = {
        survey_mappings: surveyMappingsPayload
      };

      console.log('Submitting survey mappings:', requestData);

      const response = await fetch(getFullUrl('/survey_mappings/create_survey_mappings.json'), {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Failed to create survey mappings');
      }

      const result = await response.json();
      console.log('Survey mappings created successfully:', result);

      const totalMappings = validMappings.length;
      const successMessage = totalMappings === 1 
        ? 'Survey mapping created successfully!' 
        : `${totalMappings} location configurations created successfully!`;
        
      toast.success(successMessage, {
        duration: 3000,
      });

      setTimeout(() => {
        navigate('/maintenance/survey/mapping');
      }, 1000);

    } catch (error: unknown) {
      console.error('Error creating survey mappings:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to create survey mappings: ${errorMessage}`, {
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
        {/* <div className="text-sm text-gray-600">
          {surveyMappings.length === 1 
            ? '1 Location Configured' 
            : `${surveyMappings.length} Location Configurations`
          }
        </div> */}
      </header>

      <Section title="Survey Selection" icon={<List className="w-3.5 h-3.5" />}>
        <div className="space-y-6">
          <div className="rounded-md border border-dashed bg-muted/30 p-4">
            {/* <p className="mb-3 text-sm font-medium text-muted-foreground">Select Survey for All Location Configurations</p> */}
            
            <div className="space-y-4">
              {/* Single Survey Selection */}
              <div className="grid grid-cols-1 gap-6">
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel shrink>Select Survey <span className='text-red-500'>*</span></InputLabel>
                  <Select
                    value={selectedSurveyId || ''}
                    onChange={handleSurveyChange}
                    label="Select Survey"
                    notched
                    displayEmpty
                    disabled={loadingSurveys}
                  >
                    {selectedSurveyId === null && (
                      <MenuItem disabled value="">
                        <em style={{ color: '#999', fontStyle: 'italic' }}>Select a survey</em>
                      </MenuItem>
                    )}
                    {loadingSurveys ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading surveys...
                      </MenuItem>
                    ) : (
                      surveys.map((survey) => (
                        <MenuItem key={survey.id} value={survey.id}>
                          <Box>
                            <div className="font-medium">{survey.name}</div>
                            {/* <div className="text-xs text-gray-500">
                              Questions: {survey.questions_count} | Type: {survey.check_type}
                            </div> */}
                          </Box>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </div>
              
              {selectedSurveyId && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✅ Survey selected: <span className="font-medium">{surveys.find(s => s.id === selectedSurveyId)?.name}</span>
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    This survey will be applied to all location configurations below.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Location Configuration" icon={<MapPin className="w-3.5 h-3.5" />}>
        <div className="space-y-6">
          {surveyMappings.map((mapping, mappingIdx) => (
            <div key={mapping.id} className="relative rounded-md border border-dashed bg-muted/30 p-4">
              {surveyMappings.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSurveyMapping(mappingIdx)}
                  className="absolute -right-2 -top-2 rounded-full p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-gray-200 shadow-sm"
                  aria-label="Remove location configuration"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              )}
              
              <p className="mb-4 text-sm font-medium text-muted-foreground">
                Location Configuration {mappingIdx + 1}
                {selectedSurveyId && (
                  <span className="ml-2 text-blue-600">
                    ({surveys.find(s => s.id === selectedSurveyId)?.name || 'Survey'} will be applied)
                  </span>
                )}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Site */}
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel shrink>Site <span className='text-red-500'>*</span></InputLabel>
                  <Select
                    value={mapping.selectedLocation.site}
                    onChange={(e) => handleLocationChange(mappingIdx, 'site', e.target.value as string)}
                    input={<OutlinedInput label="Site" />}
                    disabled={loading.sites}
                    displayEmpty
                    notched
                  >
                    <MenuItem value="">
                      <em>Select a site</em>
                    </MenuItem>
                    {loading.sites ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading sites...
                      </MenuItem>
                    ) : (
                      sites
                        .filter(site => site?.id && site?.name)
                        .map((site) => (
                          <MenuItem key={site.id} value={site.id}>
                            {site.name}
                          </MenuItem>
                        ))
                    )}
                  </Select>
                </FormControl>

                {/* Building */}
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel shrink>Building <span className='text-red-500'>*</span></InputLabel>
                  <Select
                    value={mapping.selectedLocation.building}
                    onChange={(e) => handleLocationChange(mappingIdx, 'building', e.target.value as string)}
                    input={<OutlinedInput label="Building" />}
                    disabled={!mapping.selectedLocation.site || isLocationLoading('buildings', mapping.selectedLocation.site, mapping.id)}
                    displayEmpty
                    notched
                  >
                    <MenuItem value="">
                      <em>
                        {!mapping.selectedLocation.site 
                          ? "Select a site first" 
                          : "Select a building"
                        }
                      </em>
                    </MenuItem>
                    {isLocationLoading('buildings', mapping.selectedLocation.site, mapping.id) ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading buildings...
                      </MenuItem>
                    ) : (
                      getLocationData('buildings', mapping.selectedLocation.site)
                        .filter(building => building?.id && building?.name)
                        .map((building) => (
                          <MenuItem key={building.id} value={building.id}>
                            {building.name}
                          </MenuItem>
                        ))
                    )}
                  </Select>
                </FormControl>

                {/* Wing */}
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel shrink>Wing</InputLabel>
                  <Select
                    value={mapping.selectedLocation.wing}
                    onChange={(e) => handleLocationChange(mappingIdx, 'wing', e.target.value as string)}
                    input={<OutlinedInput label="Wing" />}
                    disabled={!mapping.selectedLocation.building || isLocationLoading('wings', mapping.selectedLocation.building, mapping.id)}
                    displayEmpty
                    notched
                  >
                    <MenuItem value="">
                      <em>
                        {!mapping.selectedLocation.building 
                          ? "Select a building first" 
                          : "Select a wing"
                        }
                      </em>
                    </MenuItem>
                    {isLocationLoading('wings', mapping.selectedLocation.building, mapping.id) ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading wings...
                      </MenuItem>
                    ) : (
                      getLocationData('wings', mapping.selectedLocation.building)
                        .filter(wing => wing?.id && wing?.name)
                        .map((wing) => (
                          <MenuItem key={wing.id} value={wing.id}>
                            {wing.name}
                          </MenuItem>
                        ))
                    )}
                  </Select>
                </FormControl>

                {/* Area */}
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel shrink>Area</InputLabel>
                  <Select
                    value={mapping.selectedLocation.area}
                    onChange={(e) => handleLocationChange(mappingIdx, 'area', e.target.value as string)}
                    input={<OutlinedInput label="Area" />}
                    disabled={!mapping.selectedLocation.wing || isLocationLoading('areas', mapping.selectedLocation.wing, mapping.id)}
                    displayEmpty
                    notched
                  >
                    <MenuItem value="">
                      <em>
                        {!mapping.selectedLocation.wing 
                          ? "Select a wing first" 
                          : "Select an area"
                        }
                      </em>
                    </MenuItem>
                    {isLocationLoading('areas', mapping.selectedLocation.wing, mapping.id) ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading areas...
                      </MenuItem>
                    ) : (
                      getLocationData('areas', mapping.selectedLocation.wing)
                        .filter(area => area?.id && area?.name)
                        .map((area) => (
                          <MenuItem key={area.id} value={area.id}>
                            {area.name}
                          </MenuItem>
                        ))
                    )}
                  </Select>
                </FormControl>

                {/* Floor */}
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel shrink>Floor</InputLabel>
                  <Select
                    value={mapping.selectedLocation.floor}
                    onChange={(e) => handleLocationChange(mappingIdx, 'floor', e.target.value as string)}
                    input={<OutlinedInput label="Floor" />}
                    disabled={!mapping.selectedLocation.area || isLocationLoading('floors', mapping.selectedLocation.area, mapping.id)}
                    displayEmpty
                    notched
                  >
                    <MenuItem value="">
                      <em>
                        {!mapping.selectedLocation.area 
                          ? "Select an area first" 
                          : "Select a floor"
                        }
                      </em>
                    </MenuItem>
                    {isLocationLoading('floors', mapping.selectedLocation.area, mapping.id) ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading floors...
                      </MenuItem>
                    ) : (
                      getLocationData('floors', mapping.selectedLocation.area)
                        .filter(floor => floor?.id && floor?.name)
                        .map((floor) => (
                          <MenuItem key={floor.id} value={floor.id}>
                            {floor.name}
                          </MenuItem>
                        ))
                    )}
                  </Select>
                </FormControl>

                {/* Room */}
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel shrink>Room</InputLabel>
                  <Select
                    value={mapping.selectedLocation.room}
                    onChange={(e) => handleLocationChange(mappingIdx, 'room', e.target.value as string)}
                    input={<OutlinedInput label="Room" />}
                    disabled={!mapping.selectedLocation.floor || isLocationLoading('rooms', mapping.selectedLocation.floor, mapping.id)}
                    displayEmpty
                    notched
                  >
                    <MenuItem value="">
                      <em>
                        {!mapping.selectedLocation.floor 
                          ? "Select a floor first" 
                          : "Select a room"
                        }
                      </em>
                    </MenuItem>
                    {isLocationLoading('rooms', mapping.selectedLocation.floor, mapping.id) ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading rooms...
                      </MenuItem>
                    ) : (
                      getLocationData('rooms', mapping.selectedLocation.floor)
                        .filter(room => room?.id && room?.name)
                        .map((room) => (
                          <MenuItem key={room.id} value={room.id}>
                            {room.name}
                          </MenuItem>
                        ))
                    )}
                  </Select>
                </FormControl>
              </div>

            
            </div>
          ))}
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={addSurveyMapping} 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> 
              Add Location
            </Button>
          </div>
        </div>
      </Section>

      {/* Survey Questions Section */}
      {selectedSurveyQuestions.length > 0 && (
        <Section title="Survey Questions" icon={<ListChecks className="w-3.5 h-3.5" />}>
          <div className="space-y-4">
            <div className="mb-4 text-sm text-gray-600">
              Displaying questions from the selected survey. These questions will be applied to all location configurations.
            </div>
            {selectedSurveyQuestions.map((q, idx) => (
              <div key={q.id} className="relative rounded-md border border-dashed bg-muted/30 p-4">
                {/* First Row - Mandatory Checkbox */}
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`mandatory-${idx}`}
                      checked={q.mandatory}
                      className="w-4 h-4 text-[#C72030] bg-white border-gray-300 rounded focus:ring-[#C72030] focus:ring-2 accent-[#C72030]"
                      disabled
                    />
                    <label 
                      htmlFor={`mandatory-${idx}`}
                      className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                    >
                      Mandatory
                    </label>
                  </div>
                </div>

                {/* Second Row - Task and Input Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                      <InputLabel shrink>Question</InputLabel>
                      <Select
                        value={q.task}
                        label="Question"
                        notched
                        disabled
                        renderValue={() => q.task}
                      >
                        <MenuItem value={q.task}>{q.task}</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                      <InputLabel shrink>Input Type</InputLabel>
                      <Select
                        value={q.inputType}
                        label="Input Type"
                        notched
                        disabled
                      >
                        <MenuItem value="yes_no">Yes/No</MenuItem>
                        <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                        <MenuItem value="rating">Rating</MenuItem>
                        <MenuItem value="text_input">Text Input</MenuItem>
                        <MenuItem value="description">Description</MenuItem>
                        <MenuItem value="emoji">Emoji</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>

                {/* Options for multiple choice */}
                {q.inputType === 'multiple_choice' && (
                  <div className="mt-4">
                    <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                      <InputLabel shrink>Options</InputLabel>
                      <Select
                        value={q.optionsText || ''}
                        label="Options"
                        notched
                        disabled
                        renderValue={() => q.optionsText || 'No options'}
                      >
                        <MenuItem value={q.optionsText || ''}>{q.optionsText || 'No options'}</MenuItem>
                      </Select>
                    </FormControl>

                    {/* Show parsed options preview */}
                    {q.options && q.options.length > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-xs">
                        <p className="font-medium text-gray-800 mb-1">
                          ✅ Multi-Options ({q.options.length}):
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {q.options.map((option, optIdx) => (
                            <span
                              key={optIdx}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

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
