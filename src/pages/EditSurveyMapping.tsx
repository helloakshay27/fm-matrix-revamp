import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  List,
  MapPin,
  Loader2,
  ListChecks,
  Plus,
  X,
} from "lucide-react";
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
import { toast } from "sonner";
import { getFullUrl, getAuthHeader } from "@/config/apiConfig";
import { apiClient } from "@/utils/apiClient";
import { useLocationData } from "@/hooks/useLocationData";

interface SurveyMapping {
  id: number;
  survey_id: number;
  created_by_id: number;
  site_id: number;
  building_id: number;
  wing_id: number | null;
  floor_id: number | null;
  area_id: number | null;
  room_id: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  survey_title: string;
  site_name: string;
  building_name: string;
  wing_name: string | null;
  floor_name: string | null;
  area_name: string | null;
  room_name: string | null;
  qr_code_url: string;
  snag_checklist: {
    id: number;
    name: string;
    check_type: string;
    questions_count: number;
  };
}

interface Question {
  id: string;
  task: string;
  inputType: string;
  mandatory: boolean;
  options: string[];
  optionsText: string;
}

interface Survey {
  id: number;
  name: string;
  snag_audit_category: string | null;
  snag_audit_sub_category: string | null;
  questions_count: number;
  active: number;
  check_type: string;
  snag_questions?: any[];
}

interface LocationItem {
  id: number;
  name: string;
}

interface SurveyMappingForm {
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
const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
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

export const EditSurveyMapping = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Edit Survey Mapping";
  }, []);

  // Location data hook
  const {
    sites,
    buildings,
    wings,
    areas,
    floors,
    rooms,
    loading,
    fetchBuildings,
    fetchWings,
    fetchAreas,
    fetchFloors,
    fetchRooms,
  } = useLocationData();

  // Loading states
  const [pageLoading, setPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Original mapping data
  const [originalMapping, setOriginalMapping] = useState<SurveyMapping | null>(
    null
  );

  // Form state - updated to match AddSurveyMapping pattern
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  const [surveyMappings, setSurveyMappings] = useState<SurveyMappingForm[]>([
    {
      id: `sm-${Date.now()}`,
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
      roomIds: [],
    },
  ]);

  // Survey data
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loadingSurveys, setLoadingSurveys] = useState(false);
  
  // Selected survey questions
  const [selectedSurveyQuestions, setSelectedSurveyQuestions] = useState<Question[]>([]);

  // Fetch original mapping data and surveys on component mount
  useEffect(() => {
    fetchSurveyMappingData();
    fetchSurveys();
  }, [id]);

  const fetchSurveyMappingData = async () => {
    if (!id) return;

    try {
      setPageLoading(true);
      const response = await apiClient.get(
        `/survey_mappings.json?q[id_eq]=${id}`
      );
      console.log("Survey mapping details response:", response.data);

      // The API returns an array, so we need to get the first item
      const mappingArray = response.data || [];
      if (mappingArray.length > 0) {
        const mapping = mappingArray[0];
        setOriginalMapping(mapping);

        // Pre-populate form with existing data - convert to new structure
        setSelectedSurveyId(mapping.survey_id);
        setSurveyMappings([
          {
            id: `sm-${mapping.id}`,
            selectedLocation: {
              site: mapping.site_id ? mapping.site_id.toString() : "",
              building: mapping.building_id ? mapping.building_id.toString() : "",
              wing: mapping.wing_id ? mapping.wing_id.toString() : "",
              area: mapping.area_id ? mapping.area_id.toString() : "",
              floor: mapping.floor_id ? mapping.floor_id.toString() : "",
              room: mapping.room_id ? mapping.room_id.toString() : "",
            },
            siteIds: mapping.site_id ? [mapping.site_id] : [],
            buildingIds: mapping.building_id ? [mapping.building_id] : [],
            wingIds: mapping.wing_id ? [mapping.wing_id] : [],
            floorIds: mapping.floor_id ? [mapping.floor_id] : [],
            areaIds: mapping.area_id ? [mapping.area_id] : [],
            roomIds: mapping.room_id ? [mapping.room_id] : [],
          },
        ]);

        // Fetch dependent location data if selections exist
        if (mapping.site_id && mapping.building_id) {
          fetchBuildings(mapping.site_id);
        }
        if (mapping.building_id && mapping.wing_id) {
          fetchWings(mapping.building_id);
        }
        if (mapping.wing_id && mapping.area_id) {
          fetchAreas(mapping.wing_id);
        }
        if (mapping.area_id && mapping.floor_id) {
          fetchFloors(mapping.area_id);
        }
        if (mapping.floor_id && mapping.room_id) {
          fetchRooms(mapping.floor_id);
        }
      } else {
        toast.error("Survey mapping not found");
        navigate("/maintenance/survey/mapping");
      }
    } catch (error: any) {
      console.error("Error fetching survey mapping:", error);
      toast.error("Failed to load survey mapping data");
      navigate("/maintenance/survey/mapping");
    } finally {
      setPageLoading(false);
    }
  };

  const fetchSurveys = async () => {
    try {
      setLoadingSurveys(true);
      const siteId = localStorage.getItem("site_id") || "2189";
      const url = `/pms/admin/snag_checklists.json?site_id=${siteId}&q[name_cont]=&q[check_type_eq]=Survey&q[snag_audit_sub_category_id_eq]=&q[snag_audit_category_id_eq]=`;

      const response = await fetch(getFullUrl(url), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch surveys");
      }

      const surveyData = await response.json();
      console.log("Surveys data response:", surveyData);

      // Filter only active surveys
      const activeSurveys = (surveyData || []).filter(
        (survey: Survey) => survey.active === 1
      );
      setSurveys(activeSurveys);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      toast.error("Failed to fetch surveys");
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

  // Handle location changes with cascading behavior
  const handleLocationChange = async (
    mappingIndex: number,
    field: 'site' | 'building' | 'wing' | 'area' | 'floor' | 'room',
    value: string
  ) => {
    console.log(`Location change: ${field} = ${value} for mapping ${mappingIndex}`);
    
    setSurveyMappings(prev => prev.map((mapping, i) => {
      if (i !== mappingIndex) return mapping;

      const newSelectedLocation = { ...mapping.selectedLocation };
      
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
            fetchBuildings(parseInt(value));
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
            fetchWings(parseInt(value));
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
            fetchAreas(parseInt(value));
          }
          break;
        case 'area':
          newSelectedLocation.area = value;
          newSelectedLocation.floor = "";
          newSelectedLocation.room = "";
          // Fetch floors for selected area
          if (value) {
            console.log('Fetching floors for area:', value);
            fetchFloors(parseInt(value));
          }
          break;
        case 'floor':
          newSelectedLocation.floor = value;
          newSelectedLocation.room = "";
          // Fetch rooms for selected floor
          if (value) {
            console.log('Fetching rooms for floor:', value);
            fetchRooms(parseInt(value));
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

  // Add/Remove survey mapping functions
  const addSurveyMapping = () => {
    setSurveyMappings(prev => [...prev, {
      id: `sm-${Date.now()}`,
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
  };

  const removeSurveyMapping = (idx: number) => {
    setSurveyMappings(prev => prev.filter((_, i) => i !== idx));
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
      const mappedQuestions = selectedSurvey.snag_questions.map((q: any) => {
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
          options: q.snag_quest_options ? q.snag_quest_options.map((opt: any) => opt.qname) : [],
          optionsText: q.snag_quest_options ? q.snag_quest_options.map((opt: any) => opt.qname).join(', ') : ''
        };
      });
      setSelectedSurveyQuestions(mappedQuestions);
    } else {
      setSelectedSurveyQuestions([]);
    }
  };

  const handleSurveySelect = (mappingIndex: number, surveyId: number) => {
    setSurveyMappings((prev) =>
      prev.map((mapping, index) => {
        if (index === mappingIndex) {
          // For edit page, only allow single survey selection
          return { ...mapping, surveyId, surveyIds: [surveyId] };
        }
        return mapping;
      })
    );
    
    // Find the selected survey and map its questions
    const selectedSurvey = surveys.find(survey => survey.id === surveyId);
    if (selectedSurvey && selectedSurvey.snag_questions) {
      const mappedQuestions = selectedSurvey.snag_questions.map((q: any) => {
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
          options: q.snag_quest_options ? q.snag_quest_options.map((opt: any) => opt.qname) : [],
          optionsText: q.snag_quest_options ? q.snag_quest_options.map((opt: any) => opt.qname).join(', ') : ''
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
      const hasLocation = mapping.selectedLocation.site || 
                         mapping.selectedLocation.building || 
                         mapping.selectedLocation.wing || 
                         mapping.selectedLocation.area || 
                         mapping.selectedLocation.floor || 
                         mapping.selectedLocation.room;
      
      if (!hasLocation) {
        invalidMappings.push(`Location Configuration ${index + 1}: Please select at least one location`);
      } else {
        validMappings.push(mapping);
      }
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

    try {
      // For edit, we take the first valid mapping for now
      const mapping = validMappings[0];

      // Convert selectedLocation to API format
      const payload = {
        survey_id: selectedSurveyId,
        site_id: parseInt(localStorage.getItem("site_id") || "2189"),
        ...(mapping.selectedLocation.building && {
          building_id: parseInt(mapping.selectedLocation.building),
        }),
        ...(mapping.selectedLocation.wing && { 
          wing_id: parseInt(mapping.selectedLocation.wing) 
        }),
        ...(mapping.selectedLocation.area && { 
          area_id: parseInt(mapping.selectedLocation.area) 
        }),
        ...(mapping.selectedLocation.floor && { 
          floor_id: parseInt(mapping.selectedLocation.floor) 
        }),
        ...(mapping.selectedLocation.room && { 
          room_id: parseInt(mapping.selectedLocation.room) 
        }),
      };

      console.log("Updating survey mapping with payload:", payload);

      const response = await fetch(getFullUrl(`/survey_mappings/${id}.json`), {
        method: "PUT",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Survey mapping updated successfully");
        toast.success("Survey mapping updated successfully!");
        navigate("/maintenance/survey/mapping");
      } else {
        console.error("Request failed:", response);
        throw new Error("Failed to update survey mapping");
      }
    } catch (error: any) {
      console.error("Error updating survey mapping:", error);
      toast.error(
        `Failed to update survey mapping: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Effect to show questions for the selected survey when data is loaded
  useEffect(() => {
    if (originalMapping && surveys.length > 0) {
      // Set the survey ID from original mapping
      setSelectedSurveyId(originalMapping.survey_id);
      // Update questions using the new function
      updateSurveyQuestions(originalMapping.survey_id);
    }
  }, [originalMapping, surveys]);

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
        <span className="ml-2">Loading survey mapping...</span>
      </div>
    );
  }

  if (!originalMapping) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">
            Survey Mapping not found
          </h2>
          <p className="text-gray-600 mt-2">
            The requested survey mapping could not be found.
          </p>
          <Button
            onClick={() => navigate("/maintenance/survey/mapping")}
            className="mt-4"
          >
            Back to Survey Mapping List
          </Button>
        </div>
      </div>
    );
  }

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
            onClick={() => navigate("/maintenance/survey/mapping")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Survey Mapping
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          {surveyMappings.length === 1 
            ? '1 Location Configuration' 
            : `${surveyMappings.length} Location Configurations`
          }
        </div>
      </header>

      <Section title="Survey Selection" icon={<List className="w-3.5 h-3.5" />}>
        <div className="space-y-6">
          <div className="rounded-md border border-dashed bg-muted/30 p-4">
            <p className="mb-3 text-sm font-medium text-muted-foreground">Select Survey for All Location Configurations</p>
            
            <div className="space-y-4">
              {/* Single Survey Selection */}
              <div className="grid grid-cols-1 gap-6">
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel shrink>Select Survey</InputLabel>
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
                        <em style={{ color: '#999', fontStyle: 'italic' }}>Select a survey...</em>
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
                            <div className="text-xs text-gray-500">
                              Questions: {survey.questions_count} | Type: {survey.check_type}
                            </div>
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

      <Section
        title="Location Configuration"
        icon={<MapPin className="w-3.5 h-3.5" />}
      >
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
                  <InputLabel shrink>Site</InputLabel>
                  <Select
                    value={mapping.selectedLocation.site}
                    onChange={(e) => handleLocationChange(mappingIdx, 'site', e.target.value as string)}
                    input={<OutlinedInput label="Site" />}
                    disabled={loading.sites}
                    displayEmpty
                    notched
                  >
                    <MenuItem value="">
                      <em>Select Site</em>
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
                          <MenuItem key={site.id} value={site.id.toString()}>
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
                  <InputLabel shrink>Building</InputLabel>
                  <Select
                    value={mapping.selectedLocation.building}
                    onChange={(e) => handleLocationChange(mappingIdx, 'building', e.target.value as string)}
                    input={<OutlinedInput label="Building" />}
                    disabled={!mapping.selectedLocation.site || loading.buildings}
                    displayEmpty
                    notched
                  >
                    <MenuItem value="">
                      <em>
                        {!mapping.selectedLocation.site 
                          ? "Select Site first" 
                          : "Select Building"
                        }
                      </em>
                    </MenuItem>
                    {loading.buildings ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading buildings...
                      </MenuItem>
                    ) : (
                      buildings
                        .filter(building => building?.id && building?.name)
                        .map((building) => (
                          <MenuItem key={building.id} value={building.id.toString()}>
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
                    disabled={!mapping.selectedLocation.building || loading.wings}
                    displayEmpty
                    notched
                  >
                    <MenuItem value="">
                      <em>
                        {!mapping.selectedLocation.building 
                          ? "Select Building first" 
                          : "Select Wing"
                        }
                      </em>
                    </MenuItem>
                    {loading.wings ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading wings...
                      </MenuItem>
                    ) : (
                      wings
                        .filter(wing => wing?.id && wing?.name)
                        .map((wing) => (
                          <MenuItem key={wing.id} value={wing.id.toString()}>
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
                    disabled={!mapping.selectedLocation.wing || loading.areas}
                    displayEmpty
                    notched
                  >
                    <MenuItem value="">
                      <em>
                        {!mapping.selectedLocation.wing 
                          ? "Select Wing first" 
                          : "Select Area"
                        }
                      </em>
                    </MenuItem>
                    {loading.areas ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading areas...
                      </MenuItem>
                    ) : (
                      areas
                        .filter(area => area?.id && area?.name)
                        .map((area) => (
                          <MenuItem key={area.id} value={area.id.toString()}>
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
                    disabled={!mapping.selectedLocation.area || loading.floors}
                    displayEmpty
                    notched
                  >
                    <MenuItem value="">
                      <em>
                        {!mapping.selectedLocation.area 
                          ? "Select Area first" 
                          : "Select Floor"
                        }
                      </em>
                    </MenuItem>
                    {loading.floors ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading floors...
                      </MenuItem>
                    ) : (
                      floors
                        .filter(floor => floor?.id && floor?.name)
                        .map((floor) => (
                          <MenuItem key={floor.id} value={floor.id.toString()}>
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
                    disabled={!mapping.selectedLocation.floor || loading.rooms}
                    displayEmpty
                    notched
                  >
                    <MenuItem value="">
                      <em>
                        {!mapping.selectedLocation.floor 
                          ? "Select Floor first" 
                          : "Select Room"
                        }
                      </em>
                    </MenuItem>
                    {loading.rooms ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading rooms...
                      </MenuItem>
                    ) : (
                      rooms
                        .filter(room => room?.id && room?.name)
                        .map((room) => (
                          <MenuItem key={room.id} value={room.id.toString()}>
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
              Add Location Configuration
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
              Updating...
            </>
          ) : (
            "Update Survey Mapping"
          )}
        </Button>
        <Button
          variant="outline"
          className="px-8"
          onClick={() => navigate("/maintenance/survey/mapping")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
