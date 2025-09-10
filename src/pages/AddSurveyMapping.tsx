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

interface SurveyMapping {
  id: string;
  surveyId: number | null;
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
    surveyId: null,
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

  // Field styles for Material-UI components
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
      padding: { xs: "8px", sm: "10px", md: "12px" },
    },
  };

  // Update functions
  const updateSurveyMapping = (index: number, field: keyof SurveyMapping, value: any) => {
    setSurveyMappings(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addSurveyMapping = () => setSurveyMappings(prev => [...prev, {
    id: `sm-${Date.now()}`,
    surveyId: null,
    buildingIds: [],
    wingIds: [],
    floorIds: [],
    areaIds: [],
    roomIds: []
  }]);

  const removeSurveyMapping = (idx: number) => setSurveyMappings(prev => prev.filter((_, i) => i !== idx));

  const handleSurveyChange = (mappingIndex: number, event: SelectChangeEvent<number>) => {
    const value = event.target.value as number;
    updateSurveyMapping(mappingIndex, 'surveyId', value);
    
    // Find the selected survey and map its questions
    const selectedSurvey = surveys.find(survey => survey.id === value);
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

  const handleLocationChange = (
    mappingIndex: number,
    locationType: 'buildingIds' | 'wingIds' | 'floorIds' | 'areaIds' | 'roomIds',
    event: SelectChangeEvent<number[]>
  ) => {
    const value = event.target.value as number[];
    updateSurveyMapping(mappingIndex, locationType, value);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Validation
    const validMappings = surveyMappings.filter(mapping => 
      mapping.surveyId !== null && 
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
        const requestData = {
          survey_id: mapping.surveyId,
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

      console.log('Survey mappings created successfully:', results);

      const totalMappings = validMappings.length;
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
                  <FormControl 
                    fullWidth 
                    variant="outlined" 
                    sx={{ "& .MuiInputBase-root": fieldStyles }}
                  >
                    <InputLabel>Select Survey</InputLabel>
                    <Select
                      value={mapping.surveyId || ''}
                      onChange={(e) => handleSurveyChange(idx, e as SelectChangeEvent<number>)}
                      label="Select Survey"
                      disabled={loadingSurveys}
                    >
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
                {mapping.surveyId && (
                  <span className="ml-2 text-blue-600">
                    ({surveys.find(s => s.id === mapping.surveyId)?.name || 'Survey'} selected)
                  </span>
                )}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Buildings */}
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel>Buildings</InputLabel>
                  <Select
                    multiple
                    value={mapping.buildingIds}
                    onChange={(e) => handleLocationChange(mappingIdx, 'buildingIds', e)}
                    input={<OutlinedInput label="Buildings" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const building = buildings.find(b => b.id === value);
                          return building ? (
                            <Chip key={value} label={building.name} size="small" />
                          ) : null;
                        })}
                      </Box>
                    )}
                    disabled={loadingBuildings}
                  >
                    {loadingBuildings ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading buildings...
                      </MenuItem>
                    ) : (
                      buildings.map((building) => (
                        <MenuItem key={building.id} value={building.id}>
                          {building.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                {/* Wings */}
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel>Wings</InputLabel>
                  <Select
                    multiple
                    value={mapping.wingIds}
                    onChange={(e) => handleLocationChange(mappingIdx, 'wingIds', e)}
                    input={<OutlinedInput label="Wings" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const wing = wings.find(w => w.id === value);
                          return wing ? (
                            <Chip key={value} label={wing.name} size="small" />
                          ) : null;
                        })}
                      </Box>
                    )}
                    disabled={loadingWings}
                  >
                    {loadingWings ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading wings...
                      </MenuItem>
                    ) : (
                      wings.map((wing) => (
                        <MenuItem key={wing.id} value={wing.id}>
                          {wing.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                {/* Floors */}
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel>Floors</InputLabel>
                  <Select
                    multiple
                    value={mapping.floorIds}
                    onChange={(e) => handleLocationChange(mappingIdx, 'floorIds', e)}
                    input={<OutlinedInput label="Floors" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const floor = floors.find(f => f.id === value);
                          return floor ? (
                            <Chip key={value} label={floor.name} size="small" />
                          ) : null;
                        })}
                      </Box>
                    )}
                    disabled={loadingFloors}
                  >
                    {loadingFloors ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading floors...
                      </MenuItem>
                    ) : (
                      floors.map((floor) => (
                        <MenuItem key={floor.id} value={floor.id}>
                          {floor.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                {/* Areas */}
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel>Areas</InputLabel>
                  <Select
                    multiple
                    value={mapping.areaIds}
                    onChange={(e) => handleLocationChange(mappingIdx, 'areaIds', e)}
                    input={<OutlinedInput label="Areas" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const area = areas.find(a => a.id === value);
                          return area ? (
                            <Chip key={value} label={area.name} size="small" />
                          ) : null;
                        })}
                      </Box>
                    )}
                    disabled={loadingAreas}
                  >
                    {loadingAreas ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading areas...
                      </MenuItem>
                    ) : (
                      areas.map((area) => (
                        <MenuItem key={area.id} value={area.id}>
                          {area.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                {/* Rooms */}
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel>Rooms</InputLabel>
                  <Select
                    multiple
                    value={mapping.roomIds}
                    onChange={(e) => handleLocationChange(mappingIdx, 'roomIds', e)}
                    input={<OutlinedInput label="Rooms" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const room = rooms.find(r => r.id === value);
                          return room ? (
                            <Chip key={value} label={room.name} size="small" />
                          ) : null;
                        })}
                      </Box>
                    )}
                    disabled={loadingRooms}
                  >
                    {loadingRooms ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading rooms...
                      </MenuItem>
                    ) : (
                      rooms.map((room) => (
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
        </div>
      </Section>

      {/* Survey Questions Section */}
      {selectedSurveyQuestions.length > 0 && (
        <Section title="Survey Questions" icon={<ListChecks className="w-3.5 h-3.5" />}>
          <div className="space-y-4">
            <div className="mb-4 text-sm text-gray-600">
              Displaying questions for the selected survey. These questions will be used during survey mapping.
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
