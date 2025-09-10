import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  List,
  MapPin,
  Loader2,
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

interface SurveyMappingForm {
  id: string;
  surveyIds: number[];
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

  // Loading states
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Original mapping data
  const [originalMapping, setOriginalMapping] = useState<SurveyMapping | null>(
    null
  );

  // Form state - simplified to match the actual API structure
  const [surveyMappings, setSurveyMappings] = useState<SurveyMappingForm[]>([
    {
      id: `sm-${Date.now()}`,
      surveyIds: [],
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

  // Location data
  const [buildings, setBuildings] = useState<LocationItem[]>([]);
  const [wings, setWings] = useState<LocationItem[]>([]);
  const [floors, setFloors] = useState<LocationItem[]>([]);
  const [areas, setAreas] = useState<LocationItem[]>([]);
  const [rooms, setRooms] = useState<LocationItem[]>([]);

  // Loading states for locations
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Fetch original mapping data and all required dropdown data
  useEffect(() => {
    fetchSurveyMappingData();
    fetchSurveys();
    fetchBuildings();
    fetchWings();
    fetchFloors();
    fetchAreas();
    fetchRooms();
  }, [id]);

  const fetchSurveyMappingData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await apiClient.get(
        `/survey_mappings.json?q[id_eq]=${id}`
      );
      console.log("Survey mapping details response:", response.data);

      // The API returns an array, so we need to get the first item
      const mappingArray = response.data || [];
      if (mappingArray.length > 0) {
        const mapping = mappingArray[0];
        setOriginalMapping(mapping);

        // Pre-populate form with existing data
        setSurveyMappings([
          {
            id: `sm-${mapping.id}`,
            surveyIds: [mapping.survey_id],
            buildingIds: mapping.building_id ? [mapping.building_id] : [],
            wingIds: mapping.wing_id ? [mapping.wing_id] : [],
            floorIds: mapping.floor_id ? [mapping.floor_id] : [],
            areaIds: mapping.area_id ? [mapping.area_id] : [],
            roomIds: mapping.room_id ? [mapping.room_id] : [],
          },
        ]);
      } else {
        toast.error("Survey mapping not found");
        navigate("/maintenance/survey/mapping");
      }
    } catch (error: any) {
      console.error("Error fetching survey mapping:", error);
      toast.error("Failed to load survey mapping data");
      navigate("/maintenance/survey/mapping");
    } finally {
      setLoading(false);
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

  const fetchBuildings = async () => {
    try {
      setLoadingBuildings(true);
      const response = await fetch(getFullUrl("/buildings.json"), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch buildings");
      }

      const buildingsData = await response.json();
      setBuildings(
        buildingsData.map((building: any) => ({
          id: building.id,
          name: building.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching buildings:", error);
      setBuildings([]);
    } finally {
      setLoadingBuildings(false);
    }
  };

  const fetchWings = async () => {
    try {
      setLoadingWings(true);
      const response = await fetch(getFullUrl("/pms/wings.json"), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wings");
      }

      const wingsData = await response.json();
      setWings(
        wingsData.wings.map((wing: any) => ({
          id: wing.id,
          name: wing.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching wings:", error);
      setWings([]);
    } finally {
      setLoadingWings(false);
    }
  };

  const fetchFloors = async () => {
    try {
      setLoadingFloors(true);
      const response = await fetch(getFullUrl("/pms/floors.json"), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch floors");
      }

      const floorsData = await response.json();
      setFloors(
        floorsData.floors.map((floor: any) => ({
          id: floor.id,
          name: floor.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching floors:", error);
      setFloors([]);
    } finally {
      setLoadingFloors(false);
    }
  };

  const fetchAreas = async () => {
    try {
      setLoadingAreas(true);
      const response = await fetch(getFullUrl("/pms/areas.json"), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch areas");
      }

      const areasData = await response.json();
      setAreas(
        areasData.areas
          ? areasData.areas.map((area: any) => ({
              id: area.id,
              name: area.name,
            }))
          : []
      );
    } catch (error) {
      console.error("Error fetching areas:", error);
      setAreas([]);
    } finally {
      setLoadingAreas(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoadingRooms(true);
      const response = await fetch(getFullUrl("/pms/rooms.json"), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const roomsData = await response.json();
      setRooms(
        roomsData.map((room: any) => ({
          id: room.id,
          name: room.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching rooms:", error);
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

  const handleSurveySelect = (mappingIndex: number, surveyId: number) => {
    setSurveyMappings((prev) =>
      prev.map((mapping, index) => {
        if (index === mappingIndex) {
          // For edit page, only allow single survey selection
          return { ...mapping, surveyIds: [surveyId] };
        }
        return mapping;
      })
    );
  };

  const handleLocationChange = (
    mappingIndex: number,
    locationType: 'buildingIds' | 'wingIds' | 'floorIds' | 'areaIds' | 'roomIds',
    event: SelectChangeEvent<number[]>
  ) => {
    const value = event.target.value as number[];
    setSurveyMappings(prev => prev.map((mapping, index) => {
      if (index === mappingIndex) {
        return { ...mapping, [locationType]: value };
      }
      return mapping;
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Validation
    const validMappings = surveyMappings.filter(
      (mapping) =>
        mapping.surveyIds.length > 0 &&
        (mapping.buildingIds.length > 0 ||
          mapping.wingIds.length > 0 ||
          mapping.floorIds.length > 0 ||
          mapping.areaIds.length > 0 ||
          mapping.roomIds.length > 0)
    );

    if (validMappings.length === 0) {
      toast.error("Please select at least one survey and one location");
      setIsSubmitting(false);
      return;
    }

    try {
      // For edit mode, we support multiple survey selections but update the primary mapping
      const mapping = validMappings[0];

      // Create multiple payloads if multiple surveys are selected
      const updatePromises = mapping.surveyIds.map((surveyId) => {
        const payload = {
          survey_id: surveyId,
          site_id: parseInt(localStorage.getItem("site_id") || "2189"),
          ...(mapping.buildingIds.length > 0 && {
            building_ids: mapping.buildingIds,
          }),
          ...(mapping.wingIds.length > 0 && { wing_ids: mapping.wingIds }),
          ...(mapping.floorIds.length > 0 && { floor_ids: mapping.floorIds }),
          ...(mapping.areaIds.length > 0 && { area_ids: mapping.areaIds }),
          ...(mapping.roomIds.length > 0 && { room_ids: mapping.roomIds }),
        };

        console.log("Updating survey mapping with payload:", payload);

        // For the first survey, update the existing mapping; for others, create new ones
        if (surveyId === mapping.surveyIds[0]) {
          return fetch(getFullUrl(`/survey_mappings/${id}.json`), {
            method: "PUT",
            headers: {
              Authorization: getAuthHeader(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
        } else {
          // Create additional mappings for other surveys
          return fetch(getFullUrl("/survey_mappings.json"), {
            method: "POST",
            headers: {
              Authorization: getAuthHeader(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
        }
      });

      const responses = await Promise.all(updatePromises);

      // Check if all requests were successful
      const allSuccessful = responses.every((response) => response.ok);

      if (allSuccessful) {
        console.log("Survey mapping(s) updated successfully");
        toast.success(
          mapping.surveyIds.length === 1
            ? "Survey mapping updated successfully!"
            : `${mapping.surveyIds.length} survey mappings updated successfully!`
        );
        navigate("/maintenance/survey/mapping");
      } else {
        const failedResponses = responses.filter((response) => !response.ok);
        console.error("Some requests failed:", failedResponses);
        throw new Error(
          `Failed to update ${failedResponses.length} survey mapping(s)`
        );
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

  if (loading) {
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
      </header>

      <Section title="Survey Selection" icon={<List className="w-3.5 h-3.5" />}>
        <div className="space-y-6">
          {surveyMappings.map((mapping, mappingIndex) => (
            <div
              key={mapping.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="mb-4">
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel>Select Survey</InputLabel>
                  <Select
                    value={mapping.surveyIds[0] || ''}
                    onChange={(e) => handleSurveySelect(mappingIndex, e.target.value as number)}
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
          ))}
        </div>
      </Section>

      <Section
        title="Location Configuration"
        icon={<MapPin className="w-3.5 h-3.5" />}
      >
        <div className="space-y-6">
          {surveyMappings.map((mapping, mappingIndex) => (
            <div
              key={mapping.id}
              className="border border-gray-200 rounded-lg p-4"
            >
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
                    onChange={(e) => handleLocationChange(mappingIndex, 'buildingIds', e)}
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
                    onChange={(e) => handleLocationChange(mappingIndex, 'wingIds', e)}
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
                    onChange={(e) => handleLocationChange(mappingIndex, 'floorIds', e)}
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
                    onChange={(e) => handleLocationChange(mappingIndex, 'areaIds', e)}
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
                    onChange={(e) => handleLocationChange(mappingIndex, 'roomIds', e)}
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
