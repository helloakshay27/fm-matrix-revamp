import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, X, Plus, ChevronDown, CheckCircle, Edit } from "lucide-react";
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
// Removed unused imports related to location data to fix linter errors

const EMOJIS = ["😞", "😟", "😐", "😊", "😁"];
const RATINGS = ["1", "2", "3", "4", "5"];
const RATING_STARS = ["1-star", "2-star", "3-star", "4-star", "5-star"];

// Local types to avoid 'any' and capture extra fields returned by API
type QuestOption = { id: number; qname: string; option_type: string };
type GenericIcon = { id: number; file_name: string; file_size: number; url?: string };
type GenericTag = { id: number; category_name: string; icons?: GenericIcon[] };
type ExtendedQuestion = {
  id: number;
  qtype: string;
  descr: string;
  img_mandatory?: boolean;
  quest_mandatory?: boolean;
  snag_quest_options?: QuestOption[];
  generic_tags?: GenericTag[];
};

export const SurveyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State declarations (renamed to avoid conflicts)
  const [snagChecklist, setSnagChecklist] = useState<SnagChecklist | null>(null);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [buildings, setBuildings] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const [wings, setWings] = useState<Array<{ id: number; name: string }>>([]);
  const [isLoadingWings, setIsLoadingWings] = useState(false); // Renamed
  const [floors, setFloors] = useState<Array<{ id: number; name: string }>>([]);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [zones, setZones] = useState<Array<{ id: number; name: string }>>([]);
  const [loadingZones, setLoadingZones] = useState(false);
  const [rooms, setRooms] = useState<Array<{ id: number; name: string }>>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [locationMappings, setLocationMappings] = useState([]);
  const [surveyMappings, setSurveyMappings] = useState<unknown[]>([]);
  const [loadingSurveyMappings, setLoadingSurveyMappings] = useState(false);
  const [locationConfig, setLocationConfig] = useState({
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

  // Fetch wings (updated to use renamed state)
  const fetchWings = async () => {
    try {
      setIsLoadingWings(true); // Updated
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
      type WingApi = { id: number; name: string };
      setWings(
        (wingsData.wings as WingApi[]).map((wing) => ({
          id: wing.id,
          name: wing.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching wings:", error);
    } finally {
      setIsLoadingWings(false); // Updated
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
  }, [id]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/maintenance/survey/list")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Question List
        </Button>
        {!loading && snagChecklist && (
          <Button
            onClick={() => navigate(`/maintenance/survey/edit/${id}`)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit className="w-4 h-4" />
            Edit Survey
          </Button>
        )}
      </div>

      {/* Main Question Content Card */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Question Details
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
                        snagChecklist.check_type.slice(1)}
                    </p>
                  </div>
                  <div className="space-y-6">
                    {snagChecklist.snag_questions?.map((question: ExtendedQuestion, index) => (
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
                                  <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                                  <SelectItem value="Input Box">Input Box</SelectItem>
                                  <SelectItem value="Description Box">Description Box</SelectItem>
                                  <SelectItem value="Rating">Rating</SelectItem>
                                  <SelectItem value="Emojis">Emojis</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          {/* Answer Options */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Answer Options
                            </label>
                            <div className="space-y-3">
                              {question.snag_quest_options && question.snag_quest_options.length > 0 && (
                                <>
                                  {question.snag_quest_options.map((option: QuestOption, optIdx: number) => (
                                    <div key={option.id} className="flex items-center gap-3">
                                      {/* Visual indicator aligned with Edit page */}
                                      {question.qtype === "emoji" ? (
                                        <div className="flex items-center justify-center w-12 h-12">
                                          <span className="text-3xl">{EMOJIS[optIdx]}</span>
                                        </div>
                                      ) : question.qtype === "rating" ? (
                                        <div className="flex items-center justify-center w-28 h-12">
                                          <span className="text-base">{RATING_STARS[optIdx]}</span>
                                        </div>
                                      ) : (
                                        <div className="w-12 h-12 flex items-center justify-center text-gray-400">
                                          {optIdx + 1}
                                        </div>
                                      )}

                                      <input
                                        type="text"
                                        placeholder={
                                          question.qtype === "rating"
                                            ? "Enter rating description"
                                            : question.qtype === "emoji"
                                            ? `Enter description for ${EMOJIS[optIdx]}`
                                            : "Answer Option"
                                        }
                                        className="flex-1 h-10 px-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                                        value={option.qname || ""}
                                        disabled
                                        readOnly
                                      />

                                      <Select
                                        value={option.option_type ? option.option_type.toUpperCase() : "P"}
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
                                  ))}
                                </>
                              )}
                            </div>
                          </div>
                          {/* Additional Fields (Generic Tags with Files) */}
                          {question.generic_tags &&
                            question.generic_tags.length > 0 && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                  Additional Fields for Negative Selection
                                </label>
                                <div className="space-y-4">
                                  {question.generic_tags.map((tag: GenericTag, tagIndex: number) => (
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
                                      {tag.icons && tag.icons.length > 0 && (
                                        <div className="mt-4">
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Uploaded Files
                                          </label>
                                          <div className="space-y-2">
                                            {tag.icons.map((icon: GenericIcon) => (
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
                                                      {(icon.file_size / 1024).toFixed(2)} KB
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
                                  ))}
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
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};