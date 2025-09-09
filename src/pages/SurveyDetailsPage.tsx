import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, X, Plus, ChevronDown, CheckCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  fetchSnagChecklistById,
  fetchSnagChecklistCategories,
  SnagChecklist,
} from "@/services/snagChecklistAPI";
import { toast } from "sonner";
import { getFullUrl, getAuthHeader } from "@/config/apiConfig";
export const SurveyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for API data
  const [snagChecklist, setSnagChecklist] = useState<SnagChecklist | null>(
    null
  );
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buildings, setBuildings] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [wings, setWings] = useState<Array<{ id: number; name: string }>>([]);
  const [loadingWings, setLoadingWings] = useState(false);
  const [floors, setFloors] = useState<Array<{ id: number; name: string }>>([]);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [zones, setZones] = useState<Array<{ id: number; name: string }>>([]);
  const [loadingZones, setLoadingZones] = useState(false);
  const [rooms, setRooms] = useState<Array<{ id: number; name: string }>>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // State for location configuration
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [locationMappings, setLocationMappings] = useState([]);
  const [surveyMappings, setSurveyMappings] = useState<any[]>([]);
  const [loadingSurveyMappings, setLoadingSurveyMappings] = useState(false);
  const [locationConfig, setLocationConfig] = useState({
    selectedBuildings: [],
    selectedWings: [],
    selectedFloors: [],
    selectedZones: [],
    selectedRooms: [],
    selectedBuildingIds: [], // Add this to track building IDs
    selectedWingIds: [], // Add this to track wing IDs
    selectedFloorIds: [], // Add this to track floor IDs
    selectedRoomIds: [], // Add this to track room IDs
  });

  const removeSelectedItem = (type, item) => {
    const key = `selected${type.charAt(0).toUpperCase() + type.slice(1)}s`;
    setLocationConfig((prev) => ({
      ...prev,
      [key]: prev[key].filter((selected) => selected !== item),
    }));

    // Also remove from corresponding ID arrays
    if (type === "room") {
      const room = rooms.find((r) => r.name === item);
      if (room) {
        setLocationConfig((prev) => ({
          ...prev,
          selectedRoomIds: prev.selectedRoomIds.filter((id) => id !== room.id),
        }));
      }
    } else if (type === "building") {
      const building = buildings.find((b) => b.name === item);
      if (building) {
        setLocationConfig((prev) => ({
          ...prev,
          selectedBuildingIds: prev.selectedBuildingIds.filter(
            (id) => id !== building.id
          ),
        }));
      }
    } else if (type === "wing") {
      const wing = wings.find((w) => w.name === item);
      if (wing) {
        setLocationConfig((prev) => ({
          ...prev,
          selectedWingIds: prev.selectedWingIds.filter((id) => id !== wing.id),
        }));
      }
    } else if (type === "floor") {
      const floor = floors.find((f) => f.name === item);
      if (floor) {
        setLocationConfig((prev) => ({
          ...prev,
          selectedFloorIds: prev.selectedFloorIds.filter(
            (id) => id !== floor.id
          ),
        }));
      }
    }
  };

  const addSelectedItem = (type, item) => {
    const key = `selected${type.charAt(0).toUpperCase() + type.slice(1)}s`;
    setLocationConfig((prev) => ({
      ...prev,
      [key]: [...prev[key], item],
    }));
  };

  // Fetch buildings
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
    } finally {
      setLoadingBuildings(false);
    }
  };

  // Fetch wings
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
    } finally {
      setLoadingWings(false);
    }
  };

  // Fetch floors
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
    } finally {
      setLoadingFloors(false);
    }
  };

  // Fetch zones (disabled due to API endpoint not found)
  const fetchZones = async () => {
    try {
      setLoadingZones(true);
      // Note: /pms/zones.json endpoint returns 404, might need different endpoint
      // const response = await fetch(getFullUrl('/pms/zones.json'), {
      //   headers: {
      //     'Authorization': getAuthHeader(),
      //     'Content-Type': 'application/json'
      //   }
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to fetch zones');
      // }

      // const zonesData = await response.json();
      // setZones(zonesData.zones.map((zone: any) => ({
      //   id: zone.id,
      //   name: zone.name
      // })));

      // For now, set empty zones array since API endpoint not available
      setZones([]);
    } catch (error) {
      console.error("Error fetching zones:", error);
      setZones([]);
    } finally {
      setLoadingZones(false);
    }
  };

  // Fetch rooms
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
      // Note: Based on the JSON structure provided, it's a direct array, not wrapped in an object
      setRooms(
        roomsData.map((room: any) => ({
          id: room.id,
          name: room.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoadingRooms(false);
    }
  };

  // Fetch Question mappings
  const fetchSurveyMappings = async (mappingId?: string) => {
    if (!id) return;

    try {
      setLoadingSurveyMappings(true);

      // Build API URL based on parameters
      let apiUrl;
      if (mappingId) {
        // Fetch by specific mapping ID and Question ID
        apiUrl = `/survey_mappings.json?q[id_eq]=${mappingId}&q[survey_id_eq]=${id}`;
      } else {
        // Fetch all mappings for the Question ID
        apiUrl = `/survey_mappings.json?q[survey_id_eq]=${id}`;
      }

      console.log("Fetching Question mappings from:", getFullUrl(apiUrl));

      const response = await fetch(getFullUrl(apiUrl), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch Question mappings: ${response.status}`
        );
      }

      const mappingsData = await response.json();
      console.log("Question mappings response:", mappingsData);

      // Handle the response structure - extract survey_mappings array
      const surveyMappingsArray =
        mappingsData.survey_mappings || mappingsData || [];
      setSurveyMappings(surveyMappingsArray);
    } catch (error) {
      console.error("Error fetching Question mappings:", error);
      toast.error("Failed to Load Question Mappings", {
        description: "Unable to fetch Question mapping data",
        duration: 4000,
      });
    } finally {
      setLoadingSurveyMappings(false);
    }
  };

  // Fetch Question mapping by specific mapping ID
  const fetchSurveyMappingById = async (mappingId: string) => {
    if (!id) return null;

    try {
      const apiUrl = `/survey_mappings.json?q[id_eq]=${mappingId}&q[survey_id_eq]=${id}`;
      console.log(
        "Fetching specific Question mapping from:",
        getFullUrl(apiUrl)
      );

      const response = await fetch(getFullUrl(apiUrl), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Question mapping: ${response.status}`);
      }

      const mappingData = await response.json();
      console.log("Question mapping response:", mappingData);

      // Handle the response structure - extract survey_mappings array
      const surveyMappingsArray =
        mappingData.survey_mappings || mappingData || [];
      return surveyMappingsArray.length > 0 ? surveyMappingsArray[0] : null;
    } catch (error) {
      console.error("Error fetching Question mapping by ID:", error);
      toast.error("Failed to Load Question Mapping", {
        description: "Unable to fetch specific Question mapping data",
        duration: 4000,
      });
      return null;
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
          fetchSnagChecklistCategories(),
        ]);

        setSnagChecklist(checklistData);
        setCategories(categoriesData);
      } catch (error) {
        toast.error("Failed to Load Question Data", {
          description: "Unable to fetch Question details",
          duration: 4000,
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
  }, [id]);

  // Get category name by ID
  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "Unknown Category";
  };

  const handleBack = () => {
    navigate("/maintenance/survey/list");
  };

  const handleSubmitLocation = async () => {
    try {
      // Validate that we have some location selected
      const hasSelection =
        locationConfig.selectedBuildingIds.length > 0 ||
        locationConfig.selectedWingIds.length > 0 ||
        locationConfig.selectedFloorIds.length > 0 ||
        locationConfig.selectedRoomIds.length > 0;

      if (!hasSelection) {
        toast.error("Validation Error", {
          description:
            "Please select at least one location (building, wing, floor, or room)",
          duration: 4000,
        });
        return;
      }

      // Prepare the API request
      const requestData = {
        survey_id: parseInt(id!), // Convert to number as required by API
        building_ids: locationConfig.selectedBuildingIds,
        wing_ids: locationConfig.selectedWingIds,
        floor_ids: locationConfig.selectedFloorIds,
        room_ids: locationConfig.selectedRoomIds,
      };

      console.log("Submitting Question mapping:", requestData);

      // Make the POST API call
      const response = await fetch(getFullUrl("/survey_mappings.json"), {
        method: "POST",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to create Question mapping");
      }

      const result = await response.json();
      console.log("Question mapping created successfully:", result);

      // Show success toast
      toast.success("Question Mapping Created Successfully!", {
        description: "The location mapping has been added to the survey.",
        icon: <CheckCircle className="w-4 h-4" />,
        duration: 4000,
      });

      // Immediately refresh Question mappings data to show the new entry
      await fetchSurveyMappings();

      // Close the dialog
      setIsDialogOpen(false);

      // Reset form
      setLocationConfig({
        selectedBuildings: [],
        selectedWings: [],
        selectedFloors: [],
        selectedZones: [],
        selectedRooms: [],
        selectedBuildingIds: [],
        selectedWingIds: [],
        selectedFloorIds: [],
        selectedRoomIds: [],
      });
    } catch (error) {
      console.error("Error creating Question mapping:", error);
      toast.error("Failed to Create Question Mapping", {
        description:
          error.message || "An error occurred while creating the mapping",
        duration: 5000,
      });
    }
  };
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
          Back to Question List
        </Button>
      </div>

      {/* Main Question Content Card */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Question Information
            </CardTitle>
            <div className="flex items-center gap-2">
              {!loading && snagChecklist && (
                <>
                  {snagChecklist.check_type && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {snagChecklist.check_type.charAt(0).toUpperCase() +
                        snagChecklist.check_type.slice(1)}
                    </span>
                  )}
                  {snagChecklist.active !== undefined && (
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        snagChecklist.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {snagChecklist.active ? "Active" : "Inactive"}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading Question data...</div>
            </div>
          ) : !snagChecklist ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Question not found</div>
            </div>
          ) : (
            <>
              {/* Question Basic Information */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Title
                    </label>
                    <div className="text-base font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
                      {snagChecklist.name || "Untitled Survey"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Questions
                    </label>
                    <div className="text-base font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
                      {snagChecklist?.questions_count || 0} Questions
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Ticket Configuration Section - Shared for all questions */}
          {!loading &&
            snagChecklist &&
            snagChecklist.snag_questions &&
            snagChecklist.snag_questions.length > 0 &&
            (snagChecklist.snag_questions[0] as any)?.ticket_configs && (
              <div className="mb-6">
                <Card className="border border-gray-200 bg-gray-50">
                  <CardHeader className="px-6 py-4 border-b border-gray-200">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      Ticket Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ticket Category
                        </label>
                        <div className="text-base font-medium text-gray-900 bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
                          {(snagChecklist.snag_questions[0] as any)
                            ?.ticket_configs?.category ||
                            "No Category Assigned"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assigned To
                        </label>
                        <div className="text-base font-medium text-gray-900 bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
                          {(snagChecklist.snag_questions[0] as any)
                            ?.ticket_configs?.assigned_to || "Not Assigned"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

          {/* Questions Section */}
          {!loading && snagChecklist && (
            <div>
              <div className="mb-4 pb-2 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {snagChecklist.check_type.charAt(0).toUpperCase() +
                    snagChecklist.check_type.slice(1)}{" "}
                  Questions
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {snagChecklist.snag_questions?.length || 0} question(s)
                  configured for this{" "}
                  {snagChecklist.check_type.charAt(0).toUpperCase() +
                    snagChecklist.check_type.slice(1)}{" "}
                </p>
              </div>
              <div className="space-y-6">
                {snagChecklist.snag_questions?.map((question: any, index) => (
                  <Card
                    key={question.id}
                    className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-600">
                            {index + 1}
                          </span>
                        </div>
                        <CardTitle className="text-base font-medium text-gray-900">
                          Question {index + 1}
                        </CardTitle>
                        {/* Question Type Badge */}
                        <span
                          className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${
                          question.qtype === "multiple"
                            ? "bg-blue-100 text-blue-800"
                            : question.qtype === "input"
                            ? "bg-green-100 text-green-800"
                            : question.qtype === "rating"
                            ? "bg-yellow-100 text-yellow-800"
                            : question.qtype === "emoji"
                            ? "bg-purple-100 text-purple-800"
                            : question.qtype === "description"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      `}
                        >
                          {question.qtype === "multiple"
                            ? "Multi Choice"
                            : question.qtype === "input"
                            ? "Input"
                            : question.qtype === "rating"
                            ? "Rating"
                            : question.qtype === "emoji"
                            ? "Emoji"
                            : question.qtype === "description"
                            ? "Description"
                            : question.qtype || "Unknown"}
                        </span>
                        {question.quest_mandatory && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            Required
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Text
                          </label>
                          <input
                            type="text"
                            className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                            placeholder="Enter your Question"
                            value={question.descr || ""}
                            disabled
                            readOnly
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Answer Type
                          </label>
                          <Select
                            value={
                              question.qtype === "multiple"
                                ? "Multiple Choice"
                                : question.qtype === "input"
                                ? "Input Box"
                                : question.qtype === "rating"
                                ? "Rating"
                                : question.qtype === "emoji"
                                ? "Emojis"
                                : question.qtype === "description"
                                ? "Description Box"
                                : "Unknown Type"
                            }
                            disabled
                          >
                            <SelectTrigger className="w-full h-10 bg-gray-50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Multiple Choice">
                                Multiple Choice
                              </SelectItem>
                              <SelectItem value="Input Box">
                                Input Box
                              </SelectItem>
                              <SelectItem value="Description Box">
                                Description Box
                              </SelectItem>
                              <SelectItem value="Rating">Rating</SelectItem>
                              <SelectItem value="Emojis">Emojis</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Answer Options for Multiple Choice */}
                      {question.snag_quest_options &&
                        question.snag_quest_options.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Answer Options
                            </label>
                            <div className="space-y-3">
                              {question.snag_quest_options.map(
                                (option: any) => (
                                  <div
                                    key={option.id}
                                    className="flex items-center gap-3"
                                  >
                                    <input
                                      type="text"
                                      placeholder="Answer Option"
                                      className="flex-1 h-10 px-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                                      value={option.qname || ""}
                                      disabled
                                      readOnly
                                    />
                                    <Select
                                      value={
                                        option.option_type
                                          ? option.option_type.toUpperCase()
                                          : "P"
                                      }
                                      disabled
                                    >
                                      <SelectTrigger className="w-16 h-10 bg-gray-50">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="P">P</SelectItem>
                                        <SelectItem value="N">N</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Additional Fields (Generic Tags with Files) */}
                      {question.generic_tags &&
                        question.generic_tags.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Additional Fields for Negative Selection
                            </label>
                            <div className="space-y-4">
                              {question.generic_tags.map(
                                (tag: any, tagIndex: number) => (
                                  <div
                                    key={tag.id}
                                    className="border border-gray-200 rounded-lg p-4 bg-white"
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                          Title
                                        </label>
                                        <input
                                          type="text"
                                          className="w-full h-9 px-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                                          value={tag.category_name}
                                          disabled
                                          readOnly
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                          Files Uploaded
                                        </label>
                                        <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md border">
                                          {tag.icons && tag.icons.length > 0
                                            ? `${tag.icons.length} file(s) uploaded`
                                            : "No files"}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Display uploaded files */}
                                    {tag.icons && tag.icons.length > 0 && (
                                      <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                          Uploaded Files
                                        </label>
                                        <div className="space-y-2">
                                          {tag.icons.map((icon: any) => (
                                            <div
                                              key={icon.id}
                                              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                                            >
                                              <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                                  <svg
                                                    className="w-4 h-4 text-blue-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                  </svg>
                                                </div>
                                                <div>
                                                  <div className="text-sm font-medium text-gray-900">
                                                    {icon.file_name}
                                                  </div>
                                                  <div className="text-xs text-gray-500">
                                                    {(
                                                      icon.file_size / 1024
                                                    ).toFixed(2)}{" "}
                                                    KB
                                                  </div>
                                                </div>
                                              </div>
                                              {icon.url && (
                                                <a
                                                  href={icon.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                  View
                                                </a>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Question Meta Information */}
                      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`mandatory-${question.id}`}
                            checked={question.quest_mandatory || false}
                            disabled
                            className="data-[state=checked]:bg-gray-400"
                          />
                          <label
                            htmlFor={`mandatory-${question.id}`}
                            className="text-sm text-gray-700"
                          >
                            Mandatory
                          </label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`img-mandatory-${question.id}`}
                            checked={question.img_mandatory || false}
                            disabled
                            className="data-[state=checked]:bg-gray-400"
                          />
                          <label
                            htmlFor={`img-mandatory-${question.id}`}
                            className="text-sm text-gray-700"
                          >
                            Image Mandatory
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) || []}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* <Card className="border border-gray-200 bg-gray-50">
        <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-gray-900">Question Mapping List</h3>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader className="flex flex-row items-center justify-between">
                <DialogTitle>Location Configuration</DialogTitle>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Buildings</h4>
                     <Select onValueChange={(value) => {
                       const selectedBuilding = buildings.find(b => b.id.toString() === value)
                       if (selectedBuilding && !locationConfig.selectedBuildings.includes(selectedBuilding.name)) {
                         addSelectedItem('building', selectedBuilding.name);
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

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Wings</h4>
                     <Select onValueChange={(value) => {
                       const selectedWing = wings.find(w => w.id.toString() === value);
                       if (selectedWing && !locationConfig.selectedWings.includes(selectedWing.name)) {
                         addSelectedItem('wing', selectedWing.name);
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

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Floors</h4>
                      <Select onValueChange={(value) => {
                        const selectedFloor = floors.find(f => f.id.toString() === value);
                        if (selectedFloor && !locationConfig.selectedFloors.includes(selectedFloor.name)) {
                          addSelectedItem('floor', selectedFloor.name);
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
                           rooms.map((room) => (
                             <SelectItem key={room.id} value={room.id.toString()}>
                               {room.name}
                             </SelectItem>
                           ))
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
        </div>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="grid grid-cols-6 bg-gray-50">
            <div className="p-4 font-medium text-gray-700 border-r border-gray-200 text-sm">
              Building
            </div>
            <div className="p-4 font-medium text-gray-700 border-r border-gray-200 text-sm">
              Wing
            </div>
            <div className="p-4 font-medium text-gray-700 border-r border-gray-200 text-sm">
              Floor
            </div>
            <div className="p-4 font-medium text-gray-700 border-r border-gray-200 text-sm">
              Room
            </div>
            <div className="p-4 font-medium text-gray-700 border-r border-gray-200 text-sm">
              QR Code
            </div>
            <div className="p-4 font-medium text-gray-700 text-sm">
              Actions
            </div>
          </div>
          
          {loadingSurveyMappings ? (
            <div className="p-8 text-center text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                <span>Loading Question mappings...</span>
              </div>
            </div>
          ) : surveyMappings.length > 0 ? (
            surveyMappings.map((mapping, index) => (
                <div key={mapping.id || index} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                  <div className="p-4 text-gray-700 border-r border-gray-200 text-sm">
                    {mapping.building_name || buildings.find(b => b.id === mapping.building_id)?.name || mapping.building_id || '-'}
                  </div>
                  <div className="p-4 text-gray-700 border-r border-gray-200 text-sm">
                    {mapping.wing_name || wings.find(w => w.id === mapping.wing_id)?.name || mapping.wing_id || '-'}
                  </div>
                  <div className="p-4 text-gray-700 border-r border-gray-200 text-sm">
                    {mapping.floor_name || floors.find(f => f.id === mapping.floor_id)?.name || mapping.floor_id || '-'}
                  </div>
                  <div className="p-4 text-gray-700 border-r border-gray-200 text-sm">
                    {mapping.room_name || rooms.find(r => r.id === mapping.room_id)?.name || mapping.room_id || '-'}
                  </div>
                  <div className="p-4 text-gray-700 border-r border-gray-200 text-sm">
                    {mapping.qr_code ? (
                      typeof mapping.qr_code === 'object' ? (
                        mapping.qr_code.document_file_name ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="text-green-700 font-medium">Available</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-green-700 font-medium">Available</span>
                        </div>
                      )
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span className="text-gray-500">Not Available</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-gray-700 text-sm">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        onClick={() => {
                          console.log('View mapping:', mapping);
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Button>
                      {mapping.qr_code && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-green-600 hover:text-green-800 hover:bg-green-50"
                          onClick={() => {
                            const qrUrl = typeof mapping.qr_code === 'object' ? mapping.qr_code.url : mapping.qr_code;
                            if (qrUrl) {
                              window.open(qrUrl, '_blank');
                            }
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">No Question mappings found</p>
                  <p className="text-sm text-gray-400 mt-1">Click "Add" to create a new mapping</p>
                </div>
              </div>
            </div>
           )}
         </div>
        </CardContent>
      </Card> */}
    </div>
  );
};
