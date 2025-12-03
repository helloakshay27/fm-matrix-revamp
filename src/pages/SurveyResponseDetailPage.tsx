import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  X,
  Calendar as CalendarIcon,
  List,
  BarChart3,
  Activity,
  Table,
  Ticket,
  Filter,
  Download,
  Eye,
  PieChart,
  Smile,
  ChevronRight,
  ChevronLeft,
  FileText,
  HelpCircle,
  Loader2,
  Settings,
} from "lucide-react";
import { OIG_LOGO_CODE } from "@/assets/pdf/oig-logo-code";
import { VI_LOGO_CODE } from "@/assets/vi-logo-code";
import { DEFAULT_LOGO_CODE } from "@/assets/default-logo-code";
import { renderToStaticMarkup } from "react-dom/server";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { surveyApi, SurveyResponseData } from "@/services/surveyApi";
import { SurveyAnalyticsCard } from "@/components/SurveyAnalyticsCard";
import { API_CONFIG, getFullUrl, getAuthHeader } from "@/config/apiConfig";
import { toast } from "sonner";
import { EscalationInfo } from "@/services/ticketManagementAPI";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import {
  EmojiEmotions,
  Pending,
  QuestionMark,
  QuestionMarkRounded,
} from "@mui/icons-material";
import TabularResponseDetailsPage from "./TabularResponseDetailsPage";
import { JobSheetPDFGenerator } from "@/components/JobSheetPDFGenerator";
// Recharts imported above
// import TabularResponseDetailsPage from "./TabularResponseDetailsPage";

// New interfaces for response list API
interface ResponseAnswer {
  answer_id: number;
  quest_map_id: number;
  question_id: number;
  question_name: string;
  answer_type: string;
  ans_descr?: string;
  option_id?: number;
  option_name?: string;
  responded_by: string;
  complaints: ResponseComplaint[];
  comments?: string; // Add comments field for question-specific comments
}

interface FinalComment {
  comment_id: number;
  body: string;
  created_at: string;
}

interface ResponseLocation {
  site_name: string;
  building_name: string;
  wing_name: string;
  floor_name: string;
  area_name: string;
  room_name: string;
  status: boolean;
}

interface ResponseComplaint {
  complaint_id: number;
  ticket_number: string;
  heading: string;
  icon_category?: string;
  assigned_to: number;
  category: string;
  assignee: string;
  relation_id: number;
  created_at: string;
  status?: string;
  updated_by?: string;
  sub_category_type?: string;
  priority?: string;
  site_name?: string;
  complaint_type?: string;
  complaint_mode?: string | null;
  service_or_asset?: string | null;
  asset_or_service_name?: string | null;
  task_id?: string | null;
  proactive_reactive?: string | null;
  review_tracking_date?: string | null;
  response_escalation?: string;
  response_tat?: number;
  response_time?: string | null;
  escalation_response_name?: string;
  resolution_escalation?: string;
  resolution_tat?: number | null;
  resolution_time?: string | null;
  escalation_resolution_name?: string;
  next_response_escalation?: EscalationInfo | null;
  next_resolution_escalation?: EscalationInfo | null;
  status_detail?: {
    name: string;
    color_code: string;
  };
}

interface SurveyResponse {
  response_id: number;
  responded_time: string;
  mapping_id: number;
  survey_id: number;
  survey_name: string;
  survey_status: number;
  answers_count: number;
  questions_count: number;
  complaints_count: number;
  location: ResponseLocation;
  answers: ResponseAnswer[];
  final_comments: FinalComment[];
}

interface ResponseListData {
  summary: {
    total_surveys: number;
    active_surveys: number;
    inactive_surveys: number;
    total_responses: number;
  };
  responses: SurveyResponse[];
  pagination: {
    current_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

// TypeScript interfaces for the new survey details API response
interface SurveyOption {
  option_id: number;
  option: string;
  response_count: number;
  type?: string; // Add optional type field for rating/emoji
  rating?: number; // Add optional rating field
}

interface SurveyQuestion {
  question_id: number;
  question: string;
  options: SurveyOption[];
  question_type?: string; // Add optional question type field
  qtype?: string; // Add qtype field from API response
  total_responses?: number; // Add total_responses field from API response
}

interface SurveyDetail {
  survey_id: number;
  survey_name: string;
  questions: SurveyQuestion[];
  positive_responses?: number;
  negative_responses?: number;
  csat?: number;
}

interface SurveyDetailsResponse {
  survey_details: {
    surveys: SurveyDetail[]; // Updated to match actual API response
  };
}

// Customer Satisfaction Score API interfaces
interface CSATBucket {
  start: string;
  end: string;
  label: string;
  csat: number | null;
  change_pct: number;
  positive_count: number;
  negative_count: number;
  positive_pct: number;
  negative_pct: number;
  total: number;
}

// Heat Map API interfaces
interface HeatMapColumn {
  date: string;
  label: string;
}

interface HeatMapRow {
  hour: number;
  label: string;
}

interface HeatMapResponse {
  meta: {
    survey_id: number;
    question_id: number;
    timezone: string;
    start_date: string;
    end_date: string;
    column_unit: string;
  };
  totals: {
    responses: number;
    skipped: number;
  };
  columns: HeatMapColumn[];
  rows: HeatMapRow[];
  matrix: number[][];
  scale: {
    breaks: number[];
    classes: string[];
  };
}

interface CSATResponse {
  meta: {
    survey_id: number;
    question_id: number | null;
    timezone: string;
    bucket: string;
    range: {
      start: string;
      end: string;
    };
    thresholds: {
      positive_min: number;
      negative_max: number;
    };
  };
  summary: {
    date_range_label: string;
    responses: number;
    positive: number;
    negative: number;
    neutral: number;
    csat_avg: number | null;
    suggested_y_max: number;
  };
  buckets: CSATBucket[];
}

// Location filters interface
interface LocationFilters {
  buildingIds?: string[];
  wingIds?: string[];
  floorIds?: string[];
  roomIds?: string[];
}

// Chart data interfaces
interface ChartDataItem {
  name: string;
  value: number;
  color?: string;
}

interface ProcessedQuestion {
  question: string;
  type: string;
  totalResponses: number;
  responseRate: string;
  responses: string[];
}

// Enhanced Table interfaces for tabular data
interface TabularResponseData {
  id: string;
  response_id: string;
  date_time: string;
  building: string;
  wing: string;
  area: string;
  floor: string;
  room: string;
  question_type: string;
  question_name: string;
  answer: string;
  final_comment: string;
  ticket_id: string;
  // Legacy fields for backward compatibility
  icon_category: string;
  rating: string;
  category: string;
  [key: string]: string | number | undefined; // For dynamic question columns
}

interface TicketData {
  id: string;
  complaint_id: number;
  ticket_number: string;
  heading: string;
  category: string;
  assignee: string;
  status: string;
  updated_by: string;
  created_by: string;
  created_at: string;
  location: string;
  sub_category_type?: string;
  priority?: string;
  site_name?: string;
  complaint_type?: string;
  complaint_mode?: string | null;
  asset_or_service_name?: string | null;
  task_id?: string | null;
  proactive_reactive?: string | null;
  review_tracking_date?: string | null;
  response_escalation?: string;
  response_tat?: number;
  response_time?: string | null;
  escalation_response_name?: string;
  resolution_escalation?: string;
  resolution_tat?: number | null;
  resolution_time?: string | null;
  escalation_resolution_name?: string;
  next_response_escalation?: EscalationInfo | null;
  next_resolution_escalation?: EscalationInfo | null;
  icon_category?: string;
  status_detail?: {
    name: string;
    color_code: string;
  };
}

// Filter interface for survey responses
interface SurveyResponseFilters {
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  // Selected mapping (location) to filter summary analytics by mapping_id
  locationMappingId?: string;
  buildingId?: string;
  wingId?: string;
  areaId?: string;
  floorId?: string;
  roomId?: string;
  building?: string;
  wing?: string;
  area?: string;
  floor?: string;
  room?: string;
  iconCategory?: string;
  rating?: string;
  category?: string;
  hasTickets?: boolean;
  assignee?: string;
}

// Location interfaces for dropdowns
interface SiteItem {
  id: number;
  name: string;
}

interface BuildingItem {
  id: number;
  name: string;
}

interface WingItem {
  id: number;
  name: string;
}

interface AreaItem {
  id: number;
  name: string;
}

interface FloorItem {
  id: number;
  name: string;
}

interface RoomItem {
  id: number;
  name: string;
}

export const SurveyResponseDetailPage = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("summary");
  const [surveyData, setSurveyData] = useState<SurveyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [surveyDetailsData, setSurveyDetailsData] =
    useState<SurveyDetailsResponse | null>(null);
  const [responseListData, setResponseListData] =
    useState<ResponseListData | null>(null);

  // Store original unfiltered data for summary tab reset functionality
  const [originalSurveyData, setOriginalSurveyData] =
    useState<SurveyDetail | null>(null);
  const [originalSurveyDetailsData, setOriginalSurveyDetailsData] =
    useState<SurveyDetailsResponse | null>(null);

  // Customer Satisfaction Score data
  const [csatData, setCsatData] = useState<CSATResponse | null>(null);
  const [loadingCSAT, setLoadingCSAT] = useState(false);

  // Heat Map data
  const [heatMapData, setHeatMapData] = useState<HeatMapResponse | null>(null);
  const [loadingHeatMap, setLoadingHeatMap] = useState(false);

  // Filter states - separate for each tab
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<"summary" | "tabular">(
    "summary"
  );

  // Summary tab filters
  const [summaryCurrentFilters, setSummaryCurrentFilters] =
    useState<SurveyResponseFilters>({});
  const [summaryFormFilters, setSummaryFormFilters] =
    useState<SurveyResponseFilters>({});

  // Tabular tab filters
  const [tabularCurrentFilters, setTabularCurrentFilters] =
    useState<SurveyResponseFilters>({});
  const [tabularFormFilters, setTabularFormFilters] =
    useState<SurveyResponseFilters>({});

  // Summary filter: Location dropdown options (mapping list)
  type LocationMapping = { mapping_id: number; location_path: string };
  const [locationOptions, setLocationOptions] = useState<LocationMapping[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Tabular filter: Location dropdown data and loading states
  const [buildings, setBuildings] = useState<BuildingItem[]>([]);
  const [wings, setWings] = useState<WingItem[]>([]);
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [floors, setFloors] = useState<FloorItem[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);

  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const fetchLocationOptions = useCallback(async () => {
    if (!surveyId) return;
    try {
      setLoadingLocations(true);
      const baseUrl = getFullUrl(
        "/pms/admin/snag_checklists/mapping_dropdown.json"
      );
      const url = new URL(baseUrl);
      url.searchParams.append("survey_id", surveyId);
      // Use token from API_CONFIG
      if (API_CONFIG.TOKEN) {
        url.searchParams.append("token", API_CONFIG.TOKEN);
      }

      const res = await fetch(url.toString(), { method: "GET" });
      if (!res.ok) throw new Error(`Failed to fetch locations: ${res.status}`);
      const data = await res.json();
      const mappings: LocationMapping[] = Array.isArray(data?.mappings)
        ? data.mappings
        : [];
      setLocationOptions(mappings);
    } catch (e) {
      console.error("Error fetching location options:", e);
      toast.error("Failed to load locations");
    } finally {
      setLoadingLocations(false);
    }
  }, [surveyId]);

  // Load locations when opening the filter modal on the Summary tab
  useEffect(() => {
    if (showFilterModal && activeFilterTab === "summary") {
      fetchLocationOptions();
    }
  }, [showFilterModal, activeFilterTab, fetchLocationOptions]);

  // Tabular filter: API fetch functions

  const fetchBuildingsForTabular = useCallback(async () => {
    if (!surveyId) {
      setBuildings([]);
      return;
    }

    try {
      setLoadingBuildings(true);
      const baseUrl = getFullUrl("/survey_mappings/survey_buildings.json");
      const url = new URL(baseUrl);
      url.searchParams.append("survey_id", surveyId);
      if (API_CONFIG.TOKEN) {
        url.searchParams.append("token", API_CONFIG.TOKEN);
      }

      const response = await fetch(url.toString(), { method: "GET" });
      if (!response.ok)
        throw new Error(`Failed to fetch buildings: ${response.status}`);
      const data = await response.json();
      // Adjust based on actual API response structure
      const buildingsData = Array.isArray(data?.buildings)
        ? data.buildings
        : Array.isArray(data)
          ? data
          : [];
      setBuildings(buildingsData);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      toast.error("Failed to load buildings");
    } finally {
      setLoadingBuildings(false);
    }
  }, [surveyId]);

  const fetchWingsForTabular = useCallback(async (buildingId: string) => {
    if (!buildingId) {
      setWings([]);
      return;
    }

    try {
      setLoadingWings(true);
      const baseUrl = getFullUrl(`/pms/buildings/${buildingId}/wings.json`);
      const url = new URL(baseUrl);
      if (API_CONFIG.TOKEN) {
        url.searchParams.append("token", API_CONFIG.TOKEN);
      }

      const response = await fetch(url.toString(), { method: "GET" });
      if (!response.ok)
        throw new Error(`Failed to fetch wings: ${response.status}`);
      const data = await response.json();
      const wingsData = Array.isArray(data)
        ? data.map((item: any) => item.wings).filter(Boolean)
        : [];
      setWings(wingsData);
    } catch (error) {
      console.error("Error fetching wings:", error);
      toast.error("Failed to load wings");
    } finally {
      setLoadingWings(false);
    }
  }, []);

  const fetchAreasForTabular = useCallback(async (wingId: string) => {
    if (!wingId) {
      setAreas([]);
      return;
    }

    try {
      setLoadingAreas(true);
      const baseUrl = getFullUrl(`/pms/wings/${wingId}/areas.json`);
      const url = new URL(baseUrl);
      if (API_CONFIG.TOKEN) {
        url.searchParams.append("token", API_CONFIG.TOKEN);
      }

      const response = await fetch(url.toString(), { method: "GET" });
      if (!response.ok)
        throw new Error(`Failed to fetch areas: ${response.status}`);
      const data = await response.json();
      const areasData = Array.isArray(data?.areas) ? data.areas : [];
      setAreas(areasData);
    } catch (error) {
      console.error("Error fetching areas:", error);
      toast.error("Failed to load areas");
    } finally {
      setLoadingAreas(false);
    }
  }, []);

  const fetchFloorsForTabular = useCallback(async (areaId: string) => {
    if (!areaId) {
      setFloors([]);
      return;
    }

    try {
      setLoadingFloors(true);
      const baseUrl = getFullUrl(`/pms/areas/${areaId}/floors.json`);
      const url = new URL(baseUrl);
      if (API_CONFIG.TOKEN) {
        url.searchParams.append("token", API_CONFIG.TOKEN);
      }

      const response = await fetch(url.toString(), { method: "GET" });
      if (!response.ok)
        throw new Error(`Failed to fetch floors: ${response.status}`);
      const data = await response.json();
      const floorsData = Array.isArray(data?.floors) ? data.floors : [];
      setFloors(floorsData);
    } catch (error) {
      console.error("Error fetching floors:", error);
      toast.error("Failed to load floors");
    } finally {
      setLoadingFloors(false);
    }
  }, []);

  const fetchRoomsForTabular = useCallback(async (floorId: string) => {
    if (!floorId) {
      setRooms([]);
      return;
    }

    try {
      setLoadingRooms(true);
      const baseUrl = getFullUrl(`/pms/floors/${floorId}/rooms.json`);
      const url = new URL(baseUrl);
      if (API_CONFIG.TOKEN) {
        url.searchParams.append("token", API_CONFIG.TOKEN);
      }

      const response = await fetch(url.toString(), { method: "GET" });
      if (!response.ok)
        throw new Error(`Failed to fetch rooms: ${response.status}`);
      const data = await response.json();
      const roomsData = Array.isArray(data)
        ? data.map((item: any) => item.rooms).filter(Boolean)
        : [];
      setRooms(roomsData);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to load rooms");
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  // Fetch Customer Satisfaction Score data
  const fetchCSATData = useCallback(
    async (
      fromDate?: Date,
      toDate?: Date,
      locationFilters?: LocationFilters
    ) => {
      if (!surveyId) return;

      try {
        setLoadingCSAT(true);
        const baseUrl = getFullUrl(
          "/pms/admin/snag_checklists/customer_satisfaction_score"
        );
        const url = new URL(baseUrl);
        url.searchParams.append("survey_id", surveyId);

        // Add date filters if provided
        if (fromDate) {
          const fromDateStr = fromDate.toISOString().split("T")[0];
          url.searchParams.append("from_date", fromDateStr);
        }

        if (toDate) {
          const toDateStr = toDate.toISOString().split("T")[0];
          url.searchParams.append("to_date", toDateStr);
        }

        // Add location filters if provided
        if (
          locationFilters?.buildingIds &&
          locationFilters.buildingIds.length > 0
        ) {
          locationFilters.buildingIds.forEach((buildingId) => {
            url.searchParams.append(
              "q[survey_mapping_building_id_in][]",
              buildingId
            );
          });
        }

        if (locationFilters?.wingIds && locationFilters.wingIds.length > 0) {
          locationFilters.wingIds.forEach((wingId) => {
            url.searchParams.append("q[survey_mapping_wing_id_in][]", wingId);
          });
        }

        if (locationFilters?.floorIds && locationFilters.floorIds.length > 0) {
          locationFilters.floorIds.forEach((floorId) => {
            url.searchParams.append("q[survey_mapping_floor_id_in][]", floorId);
          });
        }

        if (locationFilters?.roomIds && locationFilters.roomIds.length > 0) {
          locationFilters.roomIds.forEach((roomId) => {
            url.searchParams.append("q[survey_mapping_room_id_in][]", roomId);
          });
        }

        if (API_CONFIG.TOKEN) {
          url.searchParams.append("access_token", API_CONFIG.TOKEN);
        }

        console.log("Fetching CSAT data from:", url.toString());

        const response = await fetch(url.toString(), { method: "GET" });
        if (!response.ok) {
          throw new Error(
            `Failed to fetch CSAT data: ${response.status} ${response.statusText}`
          );
        }

        const data: CSATResponse = await response.json();
        console.log("CSAT data received:", data);
        setCsatData(data);
      } catch (error) {
        console.error("Error fetching CSAT data:", error);

        // Use sample data for testing
        const testData: CSATResponse = {
          meta: {
            survey_id: 12581,
            question_id: null,
            timezone: "Asia/Kolkata",
            bucket: "week",
            range: {
              start: "2025-10-01",
              end: "2025-10-05",
            },
            thresholds: {
              positive_min: 4,
              negative_max: 2,
            },
          },
          summary: {
            date_range_label: "Oct 1, 2025 - Oct 5, 2025",
            responses: 6,
            positive: 3,
            negative: 3,
            neutral: 0,
            csat_avg: 2.5,
            suggested_y_max: 6,
          },
          buckets: [
            {
              start: "2025-09-28",
              end: "2025-10-04",
              label: "Oct 4, 2025",
              csat: 2.5,
              change_pct: 0,
              positive_count: 3,
              negative_count: 3,
              positive_pct: 50.0,
              negative_pct: 50.0,
              total: 6,
            },
          ],
        };

        console.log("Using test CSAT data:", testData);
        setCsatData(testData);
      } finally {
        setLoadingCSAT(false);
      }
    },
    [surveyId]
  );

  // Fetch Heat Map data
  const fetchHeatMapData = useCallback(
    async (
      fromDate?: Date,
      toDate?: Date,
      locationFilters?: LocationFilters
    ) => {
      if (!surveyId) return;

      try {
        setLoadingHeatMap(true);
        const baseUrl = getFullUrl("/pms/admin/snag_checklists/heat_map");
        const url = new URL(baseUrl);
        url.searchParams.append("survey_id", surveyId);

        // Only add date range parameters when provided (from filters)
        if (fromDate) {
          url.searchParams.append(
            "from_date",
            fromDate.toISOString().split("T")[0]
          );
        }

        if (toDate) {
          url.searchParams.append(
            "to_date",
            toDate.toISOString().split("T")[0]
          );
        }

        // Add location filters if provided
        if (
          locationFilters?.buildingIds &&
          locationFilters.buildingIds.length > 0
        ) {
          locationFilters.buildingIds.forEach((buildingId) => {
            url.searchParams.append(
              "q[survey_mapping_building_id_in][]",
              buildingId
            );
          });
        }

        if (locationFilters?.wingIds && locationFilters.wingIds.length > 0) {
          locationFilters.wingIds.forEach((wingId) => {
            url.searchParams.append("q[survey_mapping_wing_id_in][]", wingId);
          });
        }

        if (locationFilters?.floorIds && locationFilters.floorIds.length > 0) {
          locationFilters.floorIds.forEach((floorId) => {
            url.searchParams.append("q[survey_mapping_floor_id_in][]", floorId);
          });
        }

        if (locationFilters?.roomIds && locationFilters.roomIds.length > 0) {
          locationFilters.roomIds.forEach((roomId) => {
            url.searchParams.append("q[survey_mapping_room_id_in][]", roomId);
          });
        }

        if (API_CONFIG.TOKEN) {
          url.searchParams.append("access_token", API_CONFIG.TOKEN);
        }

        console.log("Fetching Heat Map data from:", url.toString());

        const response = await fetch(url.toString(), { method: "GET" });
        if (!response.ok) {
          throw new Error(
            `Failed to fetch Heat Map data: ${response.status} ${response.statusText}`
          );
        }

        const data: HeatMapResponse = await response.json();
        console.log("Heat Map data received:", data);
        setHeatMapData(data);
      } catch (error) {
        console.error("Error fetching Heat Map data:", error);

        // Use sample data for testing
        const testData: HeatMapResponse = {
          meta: {
            survey_id: 12583,
            question_id: 0,
            timezone: "Asia/Kolkata",
            start_date: "2025-10-01",
            end_date: "2025-10-05",
            column_unit: "day",
          },
          totals: {
            responses: 13,
            skipped: 11,
          },
          columns: [
            { date: "2025-10-01", label: "01/10/2025" },
            { date: "2025-10-02", label: "02/10/2025" },
            { date: "2025-10-03", label: "03/10/2025" },
            { date: "2025-10-04", label: "04/10/2025" },
            { date: "2025-10-05", label: "05/10/2025" },
          ],
          rows: Array.from({ length: 24 }, (_, hour) => ({
            hour,
            label:
              hour === 0
                ? "12 AM"
                : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                    ? "12 PM"
                    : `${hour - 12} PM`,
          })),
          matrix: [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [10, 0, 0, 0, 0],
            [1, 0, 0, 0, 0],
            [2, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
          ],
          scale: {
            breaks: [0, 1, 3, 5],
            classes: ["none", "light", "dark"],
          },
        };

        console.log("Using test Heat Map data:", testData);
        setHeatMapData(testData);
      } finally {
        setLoadingHeatMap(false);
      }
    },
    [surveyId]
  );

  // Load buildings when opening the filter modal on both Summary and Tabular tabs
  useEffect(() => {
    if (
      showFilterModal &&
      (activeFilterTab === "tabular" || activeFilterTab === "summary")
    ) {
      fetchBuildingsForTabular();
    }
  }, [showFilterModal, activeFilterTab, fetchBuildingsForTabular]);

  // Handle location dependencies for tabular filter

  useEffect(() => {
    if (tabularFormFilters.buildingId) {
      fetchWingsForTabular(tabularFormFilters.buildingId);
    } else {
      setWings([]);
      setTabularFormFilters((prev) => ({
        ...prev,
        wingId: undefined,
        areaId: undefined,
        floorId: undefined,
        roomId: undefined,
      }));
    }
  }, [tabularFormFilters.buildingId, fetchWingsForTabular]);

  useEffect(() => {
    if (tabularFormFilters.wingId) {
      fetchAreasForTabular(tabularFormFilters.wingId);
    } else {
      setAreas([]);
      setTabularFormFilters((prev) => ({
        ...prev,
        areaId: undefined,
        floorId: undefined,
        roomId: undefined,
      }));
    }
  }, [tabularFormFilters.wingId, fetchAreasForTabular]);

  useEffect(() => {
    if (tabularFormFilters.areaId) {
      fetchFloorsForTabular(tabularFormFilters.areaId);
    } else {
      setFloors([]);
      setTabularFormFilters((prev) => ({
        ...prev,
        floorId: undefined,
        roomId: undefined,
      }));
    }
  }, [tabularFormFilters.areaId, fetchFloorsForTabular]);

  useEffect(() => {
    if (tabularFormFilters.floorId) {
      fetchRoomsForTabular(tabularFormFilters.floorId);
    } else {
      setRooms([]);
      setTabularFormFilters((prev) => ({
        ...prev,
        roomId: undefined,
      }));
    }
  }, [tabularFormFilters.floorId, fetchRoomsForTabular]);

  // Handle location dependencies for summary filter

  useEffect(() => {
    if (summaryFormFilters.buildingId) {
      fetchWingsForTabular(summaryFormFilters.buildingId);
    } else {
      setWings([]);
      setSummaryFormFilters((prev) => ({
        ...prev,
        wingId: undefined,
        areaId: undefined,
        floorId: undefined,
        roomId: undefined,
      }));
    }
  }, [summaryFormFilters.buildingId, fetchWingsForTabular]);

  useEffect(() => {
    if (summaryFormFilters.wingId) {
      fetchAreasForTabular(summaryFormFilters.wingId);
    } else {
      setAreas([]);
      setSummaryFormFilters((prev) => ({
        ...prev,
        areaId: undefined,
        floorId: undefined,
        roomId: undefined,
      }));
    }
  }, [summaryFormFilters.wingId, fetchAreasForTabular]);

  useEffect(() => {
    if (summaryFormFilters.areaId) {
      fetchFloorsForTabular(summaryFormFilters.areaId);
    } else {
      setFloors([]);
      setSummaryFormFilters((prev) => ({
        ...prev,
        floorId: undefined,
        roomId: undefined,
      }));
    }
  }, [summaryFormFilters.areaId, fetchFloorsForTabular]);

  useEffect(() => {
    if (summaryFormFilters.floorId) {
      fetchRoomsForTabular(summaryFormFilters.floorId);
    } else {
      setRooms([]);
      setSummaryFormFilters((prev) => ({
        ...prev,
        roomId: undefined,
      }));
    }
  }, [summaryFormFilters.floorId, fetchRoomsForTabular]);

  // Field styles for MUI components (memoized to prevent re-renders)
  const fieldStyles = useMemo(
    () => ({
      height: { xs: 28, sm: 36, md: 45 },
      "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
      },
    }),
    []
  );

  const selectMenuProps = useMemo(
    () => ({
      PaperProps: {
        style: {
          maxHeight: 224,
          backgroundColor: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          zIndex: 9999,
        },
      },
      disablePortal: false,
      disableAutoFocus: true,
      disableEnforceFocus: true,
    }),
    []
  );

  const [filteredTabularData, setFilteredTabularData] = useState<
    TabularResponseData[]
  >([]);
  const [filteredTicketData, setFilteredTicketData] = useState<TicketData[]>(
    []
  );

  // Export modal states
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFromDate, setExportFromDate] = useState("");
  const [exportToDate, setExportToDate] = useState("");

  // Inline Tabular details state
  const [selectedTabularResponseId, setSelectedTabularResponseId] = useState<
    string | null
  >(null);
  const tabularDetailsRef = useRef<HTMLDivElement | null>(null);

  // Helper component for truncated text with tooltip
  const TruncatedText = ({
    text,
    maxLength = 20,
    className = "",
  }: {
    text: string;
    maxLength?: number;
    className?: string;
  }) => {
    const shouldTruncate = text && text.length > maxLength;
    const displayText = shouldTruncate
      ? `${text.substring(0, maxLength)}...`
      : text;

    if (shouldTruncate) {
      return (
        <span className={className} title={text}>
          {displayText}
        </span>
      );
    }
    return <span className={className}>{text}</span>;
  };

  // Helper functions for escalation data formatting
  const formatEscalationData = (escalation: EscalationInfo | null | undefined) => {
    if (!escalation) return null;
    
    const { minutes, is_overdue, users, escalation_name, escalation_time } = escalation;
    
    return {
      minutes: minutes || 0,
      isOverdue: is_overdue || false,
      users: users || [],
      escalationName: escalation_name || '--',
      escalationTime: escalation_time || '--'
    };
  };

  // Helper function to format escalation minutes
  const formatEscalationMinutes = (escalation: EscalationInfo | null | undefined) => {
    if (!escalation) return '--';
    const formatted = formatEscalationData(escalation);
    return formatted?.minutes.toString() || '--';
  };

  // Helper function to format escalation time in D:H:M format
  const formatEscalationTime = (escalation: EscalationInfo | null | undefined) => {
    if (!escalation || !escalation.minutes) return '--';
    
    const totalMinutes = escalation.minutes;
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    
    return `${days}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Helper function to format escalation level
  const formatEscalationLevel = (escalation: EscalationInfo | null | undefined) => {
    if (!escalation) return '--';
    const formatted = formatEscalationData(escalation);
    return formatted?.escalationName || '--';
  };

  // Fetch response list data from new API with optional filters
  const fetchResponseListData = useCallback(
    async (filters?: SurveyResponseFilters) => {
      try {
        const baseUrl = getFullUrl(`/survey_mappings/response_list.json`);
        const url = new URL(baseUrl);

        // Add the required query parameter with dynamic survey ID
        if (surveyId) {
          url.searchParams.append("survey_id", surveyId);
        }

        // Add token parameter instead of Authorization header
        if (API_CONFIG.TOKEN) {
          url.searchParams.append("token", API_CONFIG.TOKEN);
        }

        // Add filter parameters if provided
        if (filters) {
          // Building filters - support multiple buildings
          if (filters.buildingId) {
            url.searchParams.append(
              "q[survey_mappings_building_id_in][]",
              filters.buildingId
            );
          }

          // Wing filters - support multiple wings
          if (filters.wingId) {
            url.searchParams.append(
              "q[survey_mappings_wing_id_in][]",
              filters.wingId
            );
          }

          // Area filters
          if (filters.areaId) {
            url.searchParams.append(
              "q[survey_mappings_area_id_in]",
              filters.areaId
            );
          }

          // Floor filters - support multiple floors
          if (filters.floorId) {
            url.searchParams.append(
              "q[survey_mappings_floor_id_in][]",
              filters.floorId
            );
          }

          // Room filters - support multiple rooms
          if (filters.roomId) {
            url.searchParams.append(
              "q[survey_mappings_room_id_in][]",
              filters.roomId
            );
          }

          // Date filters
          if (filters.dateRange?.from) {
            const fromDate = new Date(filters.dateRange.from);
            url.searchParams.append(
              "from_date",
              fromDate.toISOString().split("T")[0]
            );
          }

          if (filters.dateRange?.to) {
            const toDate = new Date(filters.dateRange.to);
            url.searchParams.append(
              "to_date",
              toDate.toISOString().split("T")[0]
            );
          }
        }

        console.log("🚀 Fetching response list from:", url.toString());

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Response list data received:", data);
        console.log("✅ Number of responses:", data?.responses?.length || 0);
        console.log("✅ Filter parameters used:", filters);
        console.log("✅ API URL called:", url.toString());
        setResponseListData(data);
      } catch (error) {
        console.error("Error fetching response list data:", error);
        toast.error("Failed to fetch response list data");
      }
    },
    [surveyId]
  );

  // API function to fetch survey details using the new endpoint
  const fetchSurveyDetails = useCallback(
    async (
      surveyId: string,
      fromDate?: Date,
      toDate?: Date,
      mappingId?: string,
      locationFilters?: LocationFilters
    ) => {
      try {
        // Validate survey ID
        if (!surveyId || surveyId.trim() === "") {
          throw new Error("Invalid survey ID provided");
        }

        // Build the URL with proper parameters
        const baseUrl = getFullUrl(
          "/pms/admin/snag_checklists/survey_details.json"
        );
        const urlWithParams = new URL(baseUrl);

        // Add survey_id parameter
        urlWithParams.searchParams.append("survey_id", surveyId.trim());

        // Add date filters if provided
        if (fromDate) {
          const fromDateStr = fromDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
          urlWithParams.searchParams.append("from_date", fromDateStr);
        }

        if (toDate) {
          const toDateStr = toDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
          urlWithParams.searchParams.append("to_date", toDateStr);
        }

        // Add mapping filter if provided
        if (mappingId && mappingId.trim() !== "") {
          urlWithParams.searchParams.append("mapping_id", mappingId.trim());
        }

        // Add location filters if provided
        if (
          locationFilters?.buildingIds &&
          locationFilters.buildingIds.length > 0
        ) {
          locationFilters.buildingIds.forEach((buildingId) => {
            urlWithParams.searchParams.append(
              "q[building_id_in][]",
              buildingId
            );
          });
        }

        if (locationFilters?.wingIds && locationFilters.wingIds.length > 0) {
          locationFilters.wingIds.forEach((wingId) => {
            urlWithParams.searchParams.append("q[wing_id_in][]", wingId);
          });
        }

        if (locationFilters?.floorIds && locationFilters.floorIds.length > 0) {
          locationFilters.floorIds.forEach((floorId) => {
            urlWithParams.searchParams.append("q[floor_id_in][]", floorId);
          });
        }

        if (locationFilters?.roomIds && locationFilters.roomIds.length > 0) {
          locationFilters.roomIds.forEach((roomId) => {
            urlWithParams.searchParams.append("q[room_id_in][]", roomId);
          });
        }

        // Add access_token from API_CONFIG if available
        if (API_CONFIG.TOKEN) {
          urlWithParams.searchParams.append("access_token", API_CONFIG.TOKEN);
        }

        // console.log("🚀 Fetching survey details from:", urlWithParams.toString());
        // console.log("🔍 Survey ID being requested:", surveyId);

        const response = await fetch(urlWithParams.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Survey Details API Error Response:", errorText);

          if (response.status === 404) {
            throw new Error(`Survey with ID ${surveyId} not found`);
          } else if (response.status === 401) {
            throw new Error("Authentication failed. Please login again.");
          } else if (response.status === 403) {
            throw new Error(
              "You do not have permission to access this survey."
            );
          } else {
            throw new Error(
              `Failed to fetch survey details: ${response.status} ${response.statusText}`
            );
          }
        }

        const data = await response.json();
        // console.log("✅ Survey details response received:", data);
        // console.log(
        //   "🔍 Survey array length:",
        //   data?.survey_details?.surveys?.length || 0
        // );

        return data;
      } catch (error) {
        console.error("❌ Error fetching survey details:", error);
        throw error;
      }
    },
    []
  ); // Empty dependency array since it only uses external utilities

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!surveyId) {
        console.error("No survey ID provided");
        navigate("/maintenance/survey/response");
        return;
      }

      setIsLoading(true);
      let surveyDetailsResponse = null;

      try {
        // console.log("Fetching survey details for survey ID:", surveyId);

        // Fetch survey details using the new API endpoint
        surveyDetailsResponse = await fetchSurveyDetails(surveyId);
        // console.log("Fetched survey details:", surveyDetailsResponse);
        setSurveyDetailsData(surveyDetailsResponse);
        // Store original data for reset functionality
        setOriginalSurveyDetailsData(surveyDetailsResponse);

        // Extract survey data from the new API response
        if (surveyDetailsResponse?.survey_details?.surveys?.length > 0) {
          const surveyDetail = surveyDetailsResponse.survey_details.surveys[0];

          // Set the survey data directly from the API response
          setSurveyData(surveyDetail);
          // Store original data for reset functionality
          setOriginalSurveyData(surveyDetail);
          // console.log("Survey data set:", surveyDetail);
        } else {
          console.error("No survey data found for survey ID:", surveyId);
          console.error("API Response:", surveyDetailsResponse);
          console.error(
            "Available surveys in response:",
            surveyDetailsResponse?.survey_details?.surveys
          );

          // Check if the response structure is valid but empty
          if (
            surveyDetailsResponse?.survey_details?.surveys &&
            Array.isArray(surveyDetailsResponse.survey_details.surveys)
          ) {
            const surveyCount =
              surveyDetailsResponse.survey_details.surveys.length;
            toast.error(
              `No survey found with ID: ${surveyId}. Found ${surveyCount} surveys in response.`
            );
          } else {
            toast.error("Invalid response format from survey details API");
          }

          // Navigate back to the survey response list
          navigate("/maintenance/survey/response");
          return;
        }
      } catch (error) {
        console.error("Error fetching survey data:", error);

        // Provide more specific error messages
        if (error instanceof Error) {
          if (error.message.includes("Failed to fetch survey details")) {
            toast.error(
              "Unable to connect to survey service. Please try again later."
            );
          } else {
            toast.error(error.message);
          }
        } else {
          toast.error(
            "An unexpected error occurred while fetching survey details"
          );
        }

        // Only navigate away if there's a real error, not just empty data
        if (!surveyDetailsResponse) {
          navigate("/maintenance/survey/response");
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch both survey details and response list data
    const fetchAllData = async () => {
      await Promise.all([
        fetchSurveyData(),
        fetchResponseListData(),
        fetchCSATData(),
        fetchHeatMapData(),
      ]);
    };

    fetchAllData();
  }, [
    surveyId,
    navigate,
    fetchResponseListData,
    fetchSurveyDetails,
    fetchCSATData,
    fetchHeatMapData,
  ]);

  const handleCopyQuestion = async (questionId: number) => {
    const question = surveyData?.questions.find(
      (q: SurveyQuestion) => q.question_id === questionId
    );
    if (question) {
      const responses =
        question.options
          ?.filter((option) => option.response_count > 0)
          .map(
            (option) => `${option.option} (${option.response_count} responses)`
          ) || [];
      const textToCopy = `${question.question}\n${responses.join("\n")}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        // console.log("Question responses copied to clipboard");
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
      }
    }
  };

  const handleDownloadQuestion = (questionId: number) => {
    const question = surveyData?.questions.find(
      (q: SurveyQuestion) => q.question_id === questionId
    );
    if (question) {
      const responses =
        question.options
          ?.filter((option) => option.response_count > 0)
          .map(
            (option) => `${option.option} (${option.response_count} responses)`
          ) || [];
      const content = `${question.question}\n${responses.join("\n")}`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `question_${questionId}_responses.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Helper function to filter responses by date range for summary analytics
  const getSummaryFilteredResponseData = useCallback(() => {
    if (!responseListData?.responses) return [];

    return responseListData.responses.filter((response: SurveyResponse) => {
      // Apply location hierarchy filters
      if (summaryCurrentFilters.buildingId) {
        const selectedBuilding = buildings.find(
          (b) => b.id?.toString() === summaryCurrentFilters.buildingId
        );
        if (
          !selectedBuilding ||
          response.location?.building_name !== selectedBuilding.name
        ) {
          return false;
        }
      }

      if (summaryCurrentFilters.wingId) {
        const selectedWing = wings.find(
          (w) => w.id?.toString() === summaryCurrentFilters.wingId
        );
        if (
          !selectedWing ||
          response.location?.wing_name !== selectedWing.name
        ) {
          return false;
        }
      }

      if (summaryCurrentFilters.areaId) {
        const selectedArea = areas.find(
          (a) => a.id?.toString() === summaryCurrentFilters.areaId
        );
        if (
          !selectedArea ||
          response.location?.area_name !== selectedArea.name
        ) {
          return false;
        }
      }

      if (summaryCurrentFilters.floorId) {
        const selectedFloor = floors.find(
          (f) => f.id?.toString() === summaryCurrentFilters.floorId
        );
        if (
          !selectedFloor ||
          response.location?.floor_name !== selectedFloor.name
        ) {
          return false;
        }
      }

      if (summaryCurrentFilters.roomId) {
        const selectedRoom = rooms.find(
          (r) => r.id?.toString() === summaryCurrentFilters.roomId
        );
        if (
          !selectedRoom ||
          response.location?.room_name !== selectedRoom.name
        ) {
          return false;
        }
      }

      // Check if this response falls within the date range using response timestamp
      if (
        summaryCurrentFilters.dateRange?.from ||
        summaryCurrentFilters.dateRange?.to
      ) {
        const responseDate = new Date(response.responded_time);

        if (summaryCurrentFilters.dateRange?.from) {
          const fromDate = new Date(summaryCurrentFilters.dateRange.from);
          fromDate.setHours(0, 0, 0, 0);
          if (responseDate < fromDate) return false;
        }

        if (summaryCurrentFilters.dateRange?.to) {
          const toDate = new Date(summaryCurrentFilters.dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          if (responseDate > toDate) return false;
        }
      }

      return true;
    });
  }, [
    responseListData,
    summaryCurrentFilters.dateRange,
    summaryCurrentFilters.buildingId,
    summaryCurrentFilters.wingId,
    summaryCurrentFilters.areaId,
    summaryCurrentFilters.floorId,
    summaryCurrentFilters.roomId,
    buildings,
    wings,
    areas,
    floors,
    rooms,
  ]);

  // Helper function to filter responses by date range for tabular data
  const getTabularFilteredResponseData = useCallback(() => {
    if (!responseListData?.responses) return [];

    // If no date filters are applied, return all responses
    if (
      !tabularCurrentFilters.dateRange?.from &&
      !tabularCurrentFilters.dateRange?.to
    ) {
      return responseListData.responses;
    }

    return responseListData.responses.filter((response: SurveyResponse) => {
      // Check if this response falls within the date range using response timestamp
      if (
        tabularCurrentFilters.dateRange?.from ||
        tabularCurrentFilters.dateRange?.to
      ) {
        const responseDate = new Date(response.responded_time);

        if (tabularCurrentFilters.dateRange?.from) {
          const fromDate = new Date(tabularCurrentFilters.dateRange.from);
          fromDate.setHours(0, 0, 0, 0);
          if (responseDate < fromDate) return false;
        }

        if (tabularCurrentFilters.dateRange?.to) {
          const toDate = new Date(tabularCurrentFilters.dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          if (responseDate > toDate) return false;
        }
      }

      return true;
    });
  }, [responseListData, tabularCurrentFilters.dateRange]);

  // Prepare pie chart data for response distribution across all questions
  const getResponseDistributionData = () => {
    // console.log("🔍 Getting response distribution data for all questions");
    // console.log("🔍 Survey details data:", surveyDetailsData);
    // console.log("🔍 Survey data:", surveyData);

    // Get filtered response data based on summary filters
    const filteredResponses = getSummaryFilteredResponseData();
    // console.log("🔍 Filtered responses count:", filteredResponses.length);

    // Use the survey details data which has the most accurate and complete information
    if (surveyDetailsData?.survey_details?.surveys?.[0]?.questions) {
      const questions = surveyDetailsData.survey_details.surveys[0].questions;
      // console.log("🔍 Found questions in survey details:", questions.length);

      const responseDistribution = questions.map(
        (question: SurveyQuestion, index: number) => {
          // Calculate total responses for this question from filtered data
          let totalResponses = 0;

          if (
            filteredResponses.length > 0 &&
            (summaryCurrentFilters.dateRange?.from ||
              summaryCurrentFilters.dateRange?.to)
          ) {
            // Count responses from filtered data
            filteredResponses.forEach((response: SurveyResponse) => {
              response.answers?.forEach((answer: ResponseAnswer) => {
                if (answer.question_id === question.question_id) {
                  totalResponses += 1;
                }
              });
            });
          } else {
            // Fallback to original data if no filters applied
            totalResponses =
              question.options && question.options.length > 0
                ? question.options.reduce(
                  (sum, opt) => sum + (opt.response_count || 0),
                  0
                )
                : 0;
          }

          // Use the full question name without truncation
          const questionName = question.question;

          // console.log(
          //   `🔍 Question ${index + 1}: "${
          //     question.question
          //   }" - ${totalResponses} total responses (filtered)`
          // );

          return {
            name: questionName,
            value: totalResponses,
            color: [
              "#C4B99D",
              "#DAD6CA",
              "#C4B99D",
              "#DAD6CA",
              "#C4B99D",
              "#DAD6CA",
              "#C4B99D",
              "#DAD6CA",
            ][index % 8],
          };
        }
      );

      // Filter out questions with zero responses for cleaner visualization
      const filteredDistribution = responseDistribution.filter(
        (item) => item.value > 0
      );

      // console.log(
      //   "🔍 All questions with response counts:",
      //   responseDistribution
      // );
      // console.log(
      //   "🔍 Filtered questions (only with responses):",
      //   filteredDistribution
      // );
      // console.log(
      //   "🔍 Number of questions with responses:",
      //   filteredDistribution.length
      // );

      // If no questions have responses, show a placeholder
      if (filteredDistribution.length === 0) {
        // console.log("⚠️ No questions have responses, showing placeholder");
        return [
          {
            name: "No responses yet",
            value: 1,
            color: "#E5E5E5",
          },
        ];
      }

      // console.log(
      //   "✅ Returning filtered distribution with",
      //   filteredDistribution.length,
      //   "questions"
      // );
      return filteredDistribution;
    }

    // Fallback to original survey data if survey details not available
    if (surveyData?.questions && surveyData.questions.length > 0) {
      const responseDistribution = surveyData.questions.map(
        (question: SurveyQuestion, index: number) => {
          const totalResponses =
            question.options && question.options.length > 0
              ? question.options.reduce(
                (sum, opt) => sum + (opt.response_count || 0),
                0
              )
              : 0;

          const questionName = question.question;

          return {
            name: questionName,
            value: totalResponses,
            color: [
              "#C4B99D",
              "#DAD6CA",
              "#C4B99D",
              "#DAD6CA",
              "#C4B99D",
              "#DAD6CA",
              "#C4B99D",
              "#DAD6CA",
            ][index % 8],
          };
        }
      );

      const filteredDistribution = responseDistribution.filter(
        (item) => item.value > 0
      );

      // console.log(
      //   "🔍 Fallback - All questions with response counts:",
      //   responseDistribution
      // );
      // console.log(
      //   "🔍 Fallback - Filtered questions (only with responses):",
      //   filteredDistribution
      // );

      if (filteredDistribution.length === 0) {
        return [
          {
            name: "No responses yet",
            value: 1,
            color: "#E5E5E5",
          },
        ];
      }

      return filteredDistribution;
    }

    // Ultimate fallback
    const fallbackData = [
      {
        name: "No data available",
        value: 1,
        color: "#C72030",
      },
    ];

    // console.log("🔍 Using ultimate fallback:", fallbackData);
    return fallbackData;
  };

  // Prepare pie chart data for overall Yes/No response distribution
  const getOverallResponseDistribution = () => {
    // Get filtered response data based on summary filters
    const filteredResponses = getSummaryFilteredResponseData();

    let yesCount = 0;
    let noCount = 0;

    // Count Yes/No responses from all questions
    filteredResponses.forEach((response: SurveyResponse) => {
      response.answers?.forEach((answer: ResponseAnswer) => {
        if (answer.option_name) {
          const optionName = answer.option_name.toLowerCase();
          if (optionName === "yes") {
            yesCount++;
          } else if (optionName === "no") {
            noCount++;
          }
        }
      });
    });

    // If no Yes/No responses found, fallback to survey details data
    if (
      yesCount === 0 &&
      noCount === 0 &&
      surveyDetailsData?.survey_details?.surveys?.[0]?.questions
    ) {
      const questions = surveyDetailsData.survey_details.surveys[0].questions;

      questions.forEach((question: SurveyQuestion) => {
        question.options?.forEach((option: SurveyOption) => {
          const optionName = option.option.toLowerCase();
          if (optionName === "yes") {
            yesCount += option.response_count || 0;
          } else if (optionName === "no") {
            noCount += option.response_count || 0;
          }
        });
      });
    }

    // Create the distribution data with specified colors
    const distributionData = [];

    if (yesCount > 0) {
      distributionData.push({
        name: "Yes",
        value: yesCount,
        color: "#C4B99D",
      });
    }

    if (noCount > 0) {
      distributionData.push({
        name: "No",
        value: noCount,
        color: "#DAD6CA",
      });
    }

    // If no data found, return placeholder
    if (distributionData.length === 0) {
      return [
        {
          name: "No data available",
          value: 1,
          color: "#E5E5E5",
        },
      ];
    }

    return distributionData;
  };

  // Get emoji response data for all questions that have emoji-type responses
  const getEmojiResponseData = () => {
    // Get filtered response data based on summary filters
    const filteredResponses = getSummaryFilteredResponseData();

    const emojiData: Array<{
      emoji: string;
      name: string;
      count: number;
      percentage: number;
    }> = [];

    // Define emoji mapping
    const emojiMap: { [key: string]: string } = {
      very_satisfied: "😀",
      satisfied: "😊",
      neutral: "😐",
      dissatisfied: "😞",
      very_dissatisfied: "😢",
      very_happy: "😀",
      happy: "😊",
      okay: "😐",
      sad: "😞",
      very_sad: "😢",
      excellent: "😀",
      good: "😊",
      average: "😐",
      poor: "😞",
      terrible: "😢",
      amazing: "😀",
      awesome: "😀",
      fantastic: "😀",
      bad: "😞",
      awful: "😢",
      horrible: "😢",
    };

    const responseCounts: { [key: string]: number } = {};

    // Count responses from filtered data
    filteredResponses.forEach((response: SurveyResponse) => {
      response.answers?.forEach((answer: ResponseAnswer) => {
        if (answer.option_name) {
          const optionKey = answer.option_name
            .toLowerCase()
            .replace(/\s+/g, "_");
          responseCounts[optionKey] = (responseCounts[optionKey] || 0) + 1;
        }
      });
    });

    // If no responses found in filtered data, fallback to survey details data
    if (
      Object.keys(responseCounts).length === 0 &&
      surveyDetailsData?.survey_details?.surveys?.[0]?.questions
    ) {
      const questions = surveyDetailsData.survey_details.surveys[0].questions;

      questions.forEach((question: SurveyQuestion) => {
        question.options?.forEach((option: SurveyOption) => {
          const optionKey = option.option.toLowerCase().replace(/\s+/g, "_");
          if (emojiMap[optionKey]) {
            responseCounts[optionKey] =
              (responseCounts[optionKey] || 0) + (option.response_count || 0);
          }
        });
      });
    }

    // Convert to emoji data format
    const totalResponses = Object.values(responseCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    Object.entries(responseCounts).forEach(([optionKey, count]) => {
      let emoji = emojiMap[optionKey];

      // Try partial matching if exact match not found
      if (!emoji) {
        for (const [key, value] of Object.entries(emojiMap)) {
          if (optionKey.includes(key) || key.includes(optionKey)) {
            emoji = value;
            break;
          }
        }
      }

      if (emoji && count > 0) {
        // Convert option key back to readable name
        const name = optionKey
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        const percentage =
          totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;

        emojiData.push({
          emoji,
          name,
          count,
          percentage,
        });
      }
    });

    // Sort by count (descending)
    emojiData.sort((a, b) => b.count - a.count);

    return emojiData;
  };

  // Helper function to get standardized emoji options
  const getStandardizedEmojiOptions = (actualOptions: SurveyOption[]) => {
    const standardOptions = [
      { name: "Amazing", value: 0, color: "#C4AE9D" },
      { name: "Good", value: 0, color: "#C4AE9D" },
      { name: "Okay", value: 0, color: "#C4AE9D" },
      { name: "Bad", value: 0, color: "#C4AE9D" },
      { name: "Terrible", value: 0, color: "#C4AE9D" },
    ];

    // Map actual responses to standard options
    actualOptions.forEach((option) => {
      const optionText = option.option?.toLowerCase() || "";
      const responseCount = Math.floor(option.response_count || 0); // Ensure integer values

      if (optionText.includes("amazing") || optionText.includes("excellent")) {
        standardOptions[0].value += responseCount;
      } else if (
        optionText.includes("good") ||
        optionText.includes("satisfied")
      ) {
        standardOptions[1].value += responseCount;
      } else if (
        optionText.includes("okay") ||
        optionText.includes("neutral") ||
        optionText.includes("average")
      ) {
        standardOptions[2].value += responseCount;
      } else if (
        optionText.includes("bad") ||
        optionText.includes("dissatisfied")
      ) {
        standardOptions[3].value += responseCount;
      } else if (
        optionText.includes("terrible") ||
        optionText.includes("awful") ||
        optionText.includes("poor")
      ) {
        standardOptions[4].value += responseCount;
      }
    });

    return standardOptions;
  };

  // Helper function to get actual option text for rating questions (when qtype='rating')
  const getActualRatingOptions = (actualOptions: SurveyOption[]) => {
    // Return options in their original order with actual text
    return actualOptions.map((option, index) => ({
      name: option.option || `Option ${index + 1}`,
      value: Math.floor(option.response_count || 0), // Ensure integer values
      color: "#C4AE9D",
    }));
  };

  // Helper function to get standardized rating options
  const getStandardizedRatingOptions = (actualOptions: SurveyOption[]) => {
    const standardOptions = [
      { name: "5 stars", value: 0, color: "#C4AE9D" },
      { name: "4 stars", value: 0, color: "#C4AE9D" },
      { name: "3 stars", value: 0, color: "#C4AE9D" },
      { name: "2 stars", value: 0, color: "#C4AE9D" },
      { name: "1 stars", value: 0, color: "#C4AE9D" },
    ];

    // Map actual responses to standard options
    actualOptions.forEach((option) => {
      const optionText = option.option?.toLowerCase() || "";
      const responseCount = Math.floor(option.response_count || 0); // Ensure integer values

      if (optionText.includes("5 star") || option.rating === 5) {
        standardOptions[0].value += responseCount;
      } else if (optionText.includes("4 star") || option.rating === 4) {
        standardOptions[1].value += responseCount;
      } else if (optionText.includes("3 star") || option.rating === 3) {
        standardOptions[2].value += responseCount;
      } else if (optionText.includes("2 star") || option.rating === 2) {
        standardOptions[3].value += responseCount;
      } else if (optionText.includes("1 star") || option.rating === 1) {
        standardOptions[4].value += responseCount;
      }
    });

    return standardOptions;
  };

  // Helper function to determine question type from options
  const getQuestionType = (
    options: SurveyOption[]
  ): "rating" | "emoji" | "regular" => {
    // Check if any option has a type property
    const hasRatingType = options.some((option) => option.type === "rating");
    const hasEmojiType = options.some((option) => option.type === "emoji");

    if (hasRatingType) return "rating";
    if (hasEmojiType) return "emoji";

    // Fallback detection based on option text
    const hasStarsText = options.some((option) =>
      option.option?.toLowerCase().includes("star")
    );
    const hasEmojiText = options.some((option) => {
      const text = option.option?.toLowerCase() || "";
      return (
        text.includes("amazing") ||
        text.includes("good") ||
        text.includes("okay") ||
        text.includes("bad") ||
        text.includes("terrible")
      );
    });

    if (hasStarsText) return "rating";
    if (hasEmojiText) return "emoji";

    // If no type field exists and no special text patterns, treat as regular multiple choice
    // This includes questions like "How was the security Management" with options like "Perfect", "Good", "Poor"
    // and "Fire safety equipments placed?" with options like "Yes", "No"
    console.log(
      `🔍 Question determined as regular multiple choice. Options: ${options
        .map((o) => o.option)
        .join(", ")}`
    );
    return "regular";
  };

  // Prepare pie chart data for individual question showing option distribution
  const getQuestionOptionsData = (questionId: number) => {
    // console.log(
    //   "🔍 Getting question options data for question ID:",
    //   questionId
    // // );
    // console.log("🔍 Survey details data:", surveyDetailsData);
    // console.log("🔍 Survey data questions:", surveyData?.questions);

    // Get filtered response data for summary
    const filteredResponses = getSummaryFilteredResponseData();
    // console.log("🔍 Using filtered responses:", filteredResponses.length);

    // Check if this is a rating/emoji question to determine color scheme
    const isRatingQuestion = shouldUseBarChart(questionId);

    // Get question from survey details API response
    if (surveyDetailsData?.survey_details?.surveys?.[0]) {
      const surveyDetail = surveyDetailsData.survey_details.surveys[0];
      const question = surveyDetail.questions?.find(
        (q) => q.question_id === questionId
      );

      // console.log("🔍 Found question from survey details:", question);

      // Handle questions with options (could be empty array)
      if (question?.options && Array.isArray(question.options)) {
        // If options array is empty, show "No options configured"
        if (question.options.length === 0) {
          return [
            {
              name: "No options configured",
              value: 1,
              color: "#E5E5E5",
            },
          ];
        }

        // If we have filtered data, calculate response counts from filtered responses
        if (
          filteredResponses.length > 0 &&
          (summaryCurrentFilters.dateRange?.from ||
            summaryCurrentFilters.dateRange?.to)
        ) {
          const optionCounts = new Map<number, number>();

          // Initialize all options with 0 counts
          question.options.forEach((option: SurveyOption) => {
            optionCounts.set(option.option_id, 0);
          });

          // Count responses from filtered data
          filteredResponses.forEach((response: SurveyResponse) => {
            response.answers?.forEach((answer: ResponseAnswer) => {
              if (answer.question_id === questionId && answer.option_id) {
                const currentCount = optionCounts.get(answer.option_id) || 0;
                optionCounts.set(answer.option_id, currentCount + 1);
              }
            });
          });

          // Create filtered options data
          const filteredOptionsData = question.options.map(
            (option: SurveyOption, index: number) => {
              const responseCount = optionCounts.get(option.option_id) || 0;

              let color: string;
              if (responseCount > 0) {
                color = [
                  "#D5DBDB",
                  "#c6b692",
                  "#d8dcdd",
                  "#c6b692",
                  "#c6b692",
                  "#D5DBDB",
                  "#c6b692",
                  "#D5DBDB",
                ][index % 8];
              } else {
                color = "#E5E5E5";
              }

              return {
                name: option.option || `Option ${index + 1}`,
                value: responseCount,
                color: color,
              };
            }
          );

          // Determine question type and return standardized data if needed
          // First check if qtype is available from API
          if (question.qtype) {
            if (question.qtype === "rating") {
              console.log(
                `🎯 Using actual option text for filtered rating question ${questionId} (qtype='rating')`
              );
              // For filtered data, use the filtered options with their actual text
              return filteredOptionsData;
            } else if (question.qtype === "emoji") {
              console.log(
                `🎯 Using standardized emoji options for filtered question ${questionId} (qtype='emoji')`
              );
              return getStandardizedEmojiOptions(
                filteredOptionsData.map((item) => ({
                  option_id: 0,
                  option: item.name,
                  response_count: item.value,
                  type: "emoji",
                }))
              );
            }
          } else {
            // Fallback to original logic when qtype is not available
            const questionType = getQuestionType(question.options);

            if (questionType === "rating") {
              // console.log(`🎯 Using standardized rating options for filtered question ${questionId} (fallback)`);
              return getStandardizedRatingOptions(
                filteredOptionsData.map((item) => ({
                  option_id: 0,
                  option: item.name,
                  response_count: item.value,
                  type: "rating",
                }))
              );
            } else if (questionType === "emoji") {
              // console.log(`🎯 Using standardized emoji options for filtered question ${questionId} (fallback)`);
              return getStandardizedEmojiOptions(
                filteredOptionsData.map((item) => ({
                  option_id: 0,
                  option: item.name,
                  response_count: item.value,
                  type: "emoji",
                }))
              );
            }
          }

          return filteredOptionsData;
        }

        // Use original data if no filters applied
        // Only use standardized data for questions that actually use bar charts
        const useBarChart = shouldUseBarChart(questionId);

        if (useBarChart) {
          // First check if qtype is available from API
          if (question.qtype) {
            if (question.qtype === "rating") {
              console.log(
                `🎯 Using actual option text for rating question ${questionId} (qtype='rating')`
              );
              return getActualRatingOptions(question.options);
            } else if (question.qtype === "emoji") {
              console.log(
                `🎯 Using standardized emoji options for question ${questionId} (qtype='emoji')`
              );
              return getStandardizedEmojiOptions(question.options);
            }
          } else {
            // Fallback to original logic when qtype is not available
            const questionType = getQuestionType(question.options);

            if (questionType === "rating") {
              console.log(
                `🎯 Using standardized rating options for question ${questionId} (fallback)`
              );
              return getStandardizedRatingOptions(question.options);
            } else if (questionType === "emoji") {
              console.log(
                `🎯 Using standardized emoji options for question ${questionId} (fallback)`
              );
              return getStandardizedEmojiOptions(question.options);
            }
          }
        }

        // For regular questions, use the original logic
        const optionsData = question.options.map(
          (option: SurveyOption, index: number) => {
            let color: string;
            if (option.response_count > 0) {
              // Use varied colors for regular questions
              color = [
                "#D5DBDB",
                "#c6b692",
                "#d8dcdd",
                "#c6b692",
                "#c6b692",
                "#D5DBDB",
                "#c6b692",
                "#D5DBDB",
              ][index % 8];
            } else {
              color = "#E5E5E5";
            }

            return {
              name: option.option || `Option ${index + 1}`,
              value: Math.floor(option.response_count || 0), // Ensure integer values
              color: color,
            };
          }
        );

        // console.log("🔍 Options data from survey details:", optionsData);
        // console.log(`🔍 Question ${questionId} type: ${questionType}`);

        // For regular multiple choice questions, show all options in pie chart
        // This ensures pie chart displays all available options, even those with 0 responses
        return optionsData;
      }
    }

    // Fallback: Show no data message
    // console.log("🔍 No data found, returning empty array");
    return [
      {
        name: "No responses yet",
        value: 1,
        color: "#E5E5E5",
      },
    ];
  };

  // Helper function to get axis labels based on question type
  const getAxisLabels = (questionId: number) => {
    // First check survey details data for qtype (primary source)
    if (surveyDetailsData?.survey_details?.surveys?.[0]) {
      const surveyDetail = surveyDetailsData.survey_details.surveys[0];
      const question = surveyDetail.questions?.find(
        (q) => q.question_id === questionId
      );

      if (question && question.qtype) {
        const qtype = question.qtype;
        if (qtype === "emoji") {
          return {
            xAxisLabel: "Response Type",
            yAxisLabel: "Number of Responses",
          };
        } else if (qtype === "rating") {
          return {
            xAxisLabel: "Options", // Use "Options" for actual option text
            yAxisLabel: "Number of Responses",
          };
        }
      }
    }

    // Fallback: check the actual response data for answer_type
    const filteredResponses = getSummaryFilteredResponseData();
    const responseAnswer = filteredResponses
      .flatMap((response) => response.answers || [])
      .find((answer) => answer.question_id === questionId);

    if (responseAnswer?.answer_type) {
      if (responseAnswer.answer_type === "emoji") {
        return {
          xAxisLabel: "Response Type",
          yAxisLabel: "Number of Responses",
        };
      } else if (responseAnswer.answer_type === "rating") {
        return {
          xAxisLabel: "Star Rating", // Fallback uses star rating
          yAxisLabel: "Number of Responses",
        };
      }
    }

    // Final fallback to survey details data
    if (surveyDetailsData?.survey_details?.surveys?.[0]) {
      const surveyDetail = surveyDetailsData.survey_details.surveys[0];
      const question = surveyDetail.questions?.find(
        (q) => q.question_id === questionId
      );

      if (question?.options) {
        const questionType = getQuestionType(question.options);
        if (questionType === "emoji") {
          return {
            xAxisLabel: "Response Type",
            yAxisLabel: "Number of Responses",
          };
        } else if (questionType === "rating") {
          return {
            xAxisLabel: "Star Rating", // Fallback uses star rating
            yAxisLabel: "Number of Responses",
          };
        }
      }
    }

    // Default labels for non-bar chart questions
    return {
      xAxisLabel: undefined,
      yAxisLabel: undefined,
    };
  };

  // Helper function to determine if question should use bar chart or pie chart
  const shouldUseBarChart = (questionId: number): boolean => {
    // First check survey details data for qtype (primary source)
    if (surveyDetailsData?.survey_details?.surveys?.[0]) {
      const surveyDetail = surveyDetailsData.survey_details.surveys[0];
      const question = surveyDetail.questions?.find(
        (q) => q.question_id === questionId
      );

      if (question && question.qtype) {
        const qtype = question.qtype;
        console.log(`🔍 Question ${questionId} qtype: ${qtype}`);

        // Use bar chart for rating and emoji types only
        const useBarChart = qtype === "rating" || qtype === "emoji";

        if (useBarChart) {
          console.log(
            `🎯 Found ${qtype} question ${questionId}: "${question.question}"`
          );
        } else {
          console.log(
            `🚫 Using pie chart for ${qtype} question ${questionId}: "${question.question}"`
          );
        }

        return useBarChart;
      }
    }

    // Fallback: check the actual response data for answer_type
    const filteredResponses = getSummaryFilteredResponseData();
    const responseAnswer = filteredResponses
      .flatMap((response) => response.answers || [])
      .find((answer) => answer.question_id === questionId);

    if (responseAnswer?.answer_type) {
      // Only use bar chart for emoji and rating questions, exclude multiple choice
      const useBarChart =
        responseAnswer.answer_type === "emoji" ||
        responseAnswer.answer_type === "rating";

      if (useBarChart) {
        console.log(
          `🎯 Found ${responseAnswer.answer_type} question ${questionId}: "${responseAnswer.question_name}"`
        );
      } else {
        console.log(
          `🚫 Excluding ${responseAnswer.answer_type} question ${questionId} from bar chart: "${responseAnswer.question_name}"`
        );
      }

      return useBarChart;
    }

    // Final fallback to survey details data
    if (surveyDetailsData?.survey_details?.surveys?.[0]) {
      const surveyDetail = surveyDetailsData.survey_details.surveys[0];
      const question = surveyDetail.questions?.find(
        (q) => q.question_id === questionId
      );

      if (question?.options) {
        const questionType = getQuestionType(question.options);
        const useBarChart =
          questionType === "rating" || questionType === "emoji";

        console.log(
          `🔍 Question ${questionId} ("${question.question}") type: ${questionType}, useBarChart: ${useBarChart}`
        );

        if (useBarChart) {
          console.log(
            `🎯 Found ${questionType} question ${questionId}: "${question.question}"`
          );
        } else {
          console.log(
            `🚫 Excluding ${questionType} question ${questionId} from bar chart: "${question.question}"`
          );
        }

        return useBarChart;
      }
    }
    return false;
  };

  // Helper function to get chart type based on question
  const getChartType = (
    questionId: number
  ): "statusDistribution" | "surveyDistributions" => {
    const useBarChart = shouldUseBarChart(questionId);
    const chartType = useBarChart
      ? "surveyDistributions"
      : "statusDistribution";

    // Find question text for debugging
    const question = surveyData?.questions.find(
      (q) => q.question_id === questionId
    );
    const questionText = question?.question || "Unknown";

    // console.log(
    //   `🔍 Chart type for question ${questionId} ("${questionText.substring(
    //     0,
    //   50
    //   )}..."): ${chartType} (useBarChart: ${useBarChart})`
    // );

    return chartType;
  };

  // Prepare pie chart data for survey summary statistics
  const getSurveyTypeDistributionData = () => {
    // console.log("🔍 Getting survey type distribution data");
    // console.log("🔍 Survey data for type distribution:", surveyData);
    // console.log("🔍 Survey details data:", surveyDetailsData);

    if (!surveyData) {
      return [
        {
          name: "No Data",
          value: 1,
          color: "#C72030",
        },
      ];
    }

    const typeDistribution = [];

    // Calculate total responses across all questions (only for questions with options)
    const totalResponses =
      surveyData.questions?.reduce((sum, question) => {
        if (question.options && question.options.length > 0) {
          return (
            sum +
            (question.options.reduce(
              (optSum, opt) => optSum + opt.response_count,
              0
            ) || 0)
          );
        }
        return sum;
      }, 0) || 0;

    // Add total responses across all questions
    if (totalResponses > 0) {
      typeDistribution.push({
        name: "Total Responses",
        value: totalResponses,
        color: "#C72030",
      });
    }

    // Add question count
    if (surveyData.questions?.length > 0) {
      typeDistribution.push({
        name: "Total Questions",
        value: surveyData.questions.length,
        color: "#c6b692",
      });
    }

    // Count questions with options vs questions without options
    const questionsWithOptions =
      surveyData.questions?.filter((q) => q.options && q.options.length > 0)
        .length || 0;
    const questionsWithoutOptions =
      (surveyData.questions?.length || 0) - questionsWithOptions;

    if (questionsWithOptions > 0) {
      typeDistribution.push({
        name: "Questions with Options",
        value: questionsWithOptions,
        color: "#10B981",
      });
    }

    if (questionsWithoutOptions > 0) {
      typeDistribution.push({
        name: "Questions without Options",
        value: questionsWithoutOptions,
        color: "#F59E0B",
      });
    }

    // Add option-specific data from survey details
    if (surveyDetailsData?.survey_details?.surveys?.[0]) {
      const surveyDetail = surveyDetailsData.survey_details.surveys[0];

      if (surveyDetail.questions) {
        // Add total options count across all questions (only for questions that have options)
        const totalOptions = surveyDetail.questions.reduce(
          (sum: number, q: SurveyQuestion) => sum + (q.options?.length || 0),
          0
        );

        if (totalOptions > 0) {
          typeDistribution.push({
            name: "Total Options",
            value: totalOptions,
            color: "#d8dcdd",
          });
        }

        // Add total answered options count
        const totalAnsweredOptions = surveyDetail.questions.reduce(
          (sum: number, q: SurveyQuestion) =>
            sum +
            (q.options?.filter((o: SurveyOption) => (o.response_count || 0) > 0)
              .length || 0),
          0
        );

        if (totalAnsweredOptions > 0) {
          typeDistribution.push({
            name: "Answered Options",
            value: totalAnsweredOptions,
            color: "#8B5CF6",
          });
        }
      }
    }

    // Fallback if no data
    if (typeDistribution.length === 0) {
      typeDistribution.push({
        name: "Survey Data",
        value: 1,
        color: "#C72030",
      });
    }

    // console.log("🔍 Generated type distribution:", typeDistribution);
    return typeDistribution;
  };

  const handleDownloadResponseChart = () => {
    // console.log("Download response distribution chart");
    toast.success("Chart download initiated");
  };

  const handleDownloadTypeChart = () => {
    // console.log("Download survey type distribution chart");
    toast.success("Survey type chart download initiated");
  };

  // Helper to build summary bar chart data
  const getSummaryBarChartData = () => {
    if (!responseListData?.summary) return [];
    return [
      { name: "Total Surveys", value: responseListData.summary.total_surveys },
      {
        name: "Active Surveys",
        value: responseListData.summary.active_surveys,
      },
      {
        name: "Inactive Surveys",
        value: responseListData.summary.inactive_surveys,
      },
      {
        name: "Total Responses",
        value: responseListData.summary.total_responses,
      },
    ];
  };

  // Helper to build question-wise response bar chart data
  const getQuestionWiseBarChartData = () => {
    if (!surveyData?.questions) return [];
    return surveyData.questions.map((q) => ({
      name: q.question.substring(0, 30) + (q.question.length > 30 ? "..." : ""),
      responses:
        q.options?.reduce((sum, opt) => sum + opt.response_count, 0) || 0,
    }));
  };

  // Memoized data functions
  const getTabularData = useCallback((): TabularResponseData[] => {
    console.log("🔍 getTabularData called");
    console.log("🔍 responseListData:", responseListData);

    if (!responseListData?.responses) {
      console.log(
        "🚫 No response data available - responseListData:",
        responseListData
      );
      return [];
    }

    console.log("🔍 Found responses:", responseListData.responses.length);
    console.log("🔍 First response:", responseListData.responses[0]);

    const transformedData: TabularResponseData[] = [];

    responseListData.responses.forEach((response: SurveyResponse) => {
      console.log("🔍 Processing response:", response.response_id);
      console.log("🔍 Response answers:", response.answers);

      // Create one row per response (not per answer)
      const responseId = response.response_id ?? "";
      const rowData: TabularResponseData = {
        id: responseId.toString(),
        response_id: responseId.toString(),
        date_time: response.responded_time
          ? new Date(response.responded_time).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
          : "",
        building: response.location?.building_name || "",
        wing: response.location?.wing_name || "",
        area: response.location?.area_name || "",
        floor: response.location?.floor_name || "",
        room: response.location?.room_name || "",
        question_type: "",
        question_name: "",
        answer: "",
        final_comment: "",
        ticket_id: "",
        // Legacy fields for backward compatibility
        icon_category: "",
        rating: "",
        category: "",
      };

      // Create a map to organize answers by question_id for easier lookup
      const answersByQuestionId = new Map<number, ResponseAnswer>();
      if (response.answers && response.answers.length > 0) {
        response.answers.forEach((answer: ResponseAnswer) => {
          answersByQuestionId.set(answer.question_id, answer);
        });
      }

      // Populate dynamic question columns with detailed structure
      if (surveyData?.questions && surveyData.questions.length > 0) {
        surveyData.questions.forEach(
          (question: SurveyQuestion, index: number) => {
            const questionNumber = index + 1;
            const answer = answersByQuestionId.get(question.question_id);

            // Initialize all columns for this question
            const typeKey = `q${questionNumber}_type`;
            const answerKey = `q${questionNumber}_answer`;
            const questionNameKey = `q${questionNumber}_question_name`;
            const iconKey = `q${questionNumber}_icon`;
            const commentKey = `q${questionNumber}_comment`;

            if (answer) {
              // Question Type - use answer.answer_type with first letter capitalized
              const questionType = answer.answer_type || "-";
              rowData[typeKey] =
                questionType === "-"
                  ? "-"
                  : questionType.charAt(0).toUpperCase() +
                  questionType.slice(1);

              // Question Dynamic - use ans_descr for emoji/smiley/rating, option_name for multiple
              let answerValue = "-";
              if (
                answer.answer_type === "rating" ||
                answer.answer_type === "emoji" ||
                answer.answer_type === "smiley"
              ) {
                answerValue = answer.ans_descr || "-";
              } else if (answer.answer_type === "multiple") {
                answerValue = answer.option_name || "-";
              } else {
                answerValue = answer.ans_descr || answer.option_name || "-";
              }
              rowData[answerKey] = answerValue;

              // Question Name - use answer.question_name
              rowData[questionNameKey] =
                answer.question_name || question.question || "-";

              // Issue Icon - complaints icon_category (comma-separated if multiple)
              if (answer.complaints && answer.complaints.length > 0) {
                const iconCategories = answer.complaints
                  .map((complaint) => complaint.icon_category)
                  .filter(Boolean);
                rowData[iconKey] =
                  iconCategories.length > 0 ? iconCategories.join(", ") : "-";
              } else {
                rowData[iconKey] = "-";
              }

              // Comment - answers.comments
              rowData[commentKey] = answer.comments || "-";
            } else {
              // No answer for this question
              rowData[typeKey] = "-";
              rowData[answerKey] = "-";
              rowData[questionNameKey] = question.question || "-";
              rowData[iconKey] = "-";
              rowData[commentKey] = "-";
            }
          }
        );
      }

      // Add final comments from the response
      if (response.final_comments && response.final_comments.length > 0) {
        rowData.final_comment = response.final_comments
          .map((comment) => comment.body)
          .join("; ");
      } else {
        rowData.final_comment = "-";
      }

      // Handle complaints/tickets - collect ticket numbers from all answers
      const allTicketNumbers: string[] = [];
      const categories: string[] = [];

      if (response.answers && response.answers.length > 0) {
        response.answers.forEach((answer: ResponseAnswer) => {
          if (answer.complaints && answer.complaints.length > 0) {
            const ticketNumbers = answer.complaints
              .map((complaint) => complaint.ticket_number)
              .filter(Boolean);
            allTicketNumbers.push(...ticketNumbers);

            const answerCategories = answer.complaints
              .map((complaint) => complaint.category)
              .filter(Boolean);
            categories.push(...answerCategories);
          }
        });
      }

      const ticketIdValue =
        allTicketNumbers.length > 0 ? allTicketNumbers.join(", ") : "-";
      rowData.ticket_id = ticketIdValue;
      rowData.category = categories.join(", ");

      console.log(
        "🎯 Ticket IDs for response",
        response.response_id,
        ":",
        ticketIdValue
      );
      console.log("🔍 Created row data:", rowData);
      transformedData.push(rowData);
    });

    // Sort by response_id (most recent first)
    transformedData.sort(
      (a, b) => parseInt(b.response_id) - parseInt(a.response_id)
    );

    console.log("🎯 Final transformed data for table:", transformedData);
    console.log("🎯 Number of rows:", transformedData.length);
    console.log(
      "🎯 Response data source:",
      responseListData?.responses?.length || 0
    );
    return transformedData;
  }, [responseListData, surveyData]);

  // Transform ticket data for tickets EnhancedTable
  const getTicketData = useCallback((): TicketData[] => {
    if (!responseListData?.responses) return [];

    const ticketData: TicketData[] = [];

    responseListData.responses.forEach((response: SurveyResponse) => {
      // Check complaints within individual answers
      if (response.answers && response.answers.length > 0) {
        response.answers.forEach((answer: ResponseAnswer) => {
          if (answer.complaints && answer.complaints.length > 0) {
            answer.complaints.forEach((complaint: ResponseComplaint) => {
              // Only add if we have the required complaint data
              if (complaint.complaint_id && complaint.ticket_number) {
                ticketData.push({
                  id: `ticket-${response.mapping_id}-${complaint.complaint_id}`,
                  complaint_id: complaint.complaint_id,
                  ticket_number: complaint.ticket_number,
                  heading: complaint.heading || "Survey Response Issue",
                  category: complaint.category || "-",
                  assigned_to: complaint.assigned_to || "-",
                  status: complaint.status || "Pending",
                  updated_by: "-",
                  created_by: "-",
                  created_at: new Date(complaint.created_at).toLocaleString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }
                  ),
                  location: `${response.location?.building_name || ""}, ${response.location?.wing_name || ""
                    }`,
                  sub_category_type: complaint.sub_category_type || "-",
                  icon_category: complaint.icon_category || "-",
                  priority: complaint.priority || "-",
                  site_name: complaint.site_name || "-",
                  complaint_type: complaint.complaint_type || "-",
                  complaint_mode: complaint.complaint_mode || "-",
                  asset_or_service_name: complaint.asset_or_service_name || "-",
                  task_id: complaint.task_id || "-",
                  proactive_reactive: complaint.proactive_reactive || "-",
                  review_tracking_date: complaint.review_tracking_date || "-",
                  response_escalation: complaint.response_escalation || "-",
                  response_tat: complaint.response_tat || 0,
                  response_time: complaint.response_time || "-",
                  escalation_response_name:
                    complaint.escalation_response_name || "-",
                  resolution_escalation: complaint.resolution_escalation || "-",
                  resolution_tat: complaint.resolution_tat || 0,
                  resolution_time: complaint.resolution_time || "-",
                  escalation_resolution_name:
                    complaint.escalation_resolution_name || "-",
                  next_response_escalation: complaint.next_response_escalation || null,
                  next_resolution_escalation: complaint.next_resolution_escalation || null,
                  status_detail: complaint.status_detail || {
                    name: complaint.status || "-",
                    color_code: "#60A8C0",
                  },
                });
              }
            });
          }
        });
      }
    });

    return ticketData;
  }, [responseListData]);

  // Get dynamic columns for tabular data
  const getTabularColumns = () => {
    const baseColumns = [
      {
        key: "action",
        label: "Action",
        defaultVisible: true,
        sortable: true,
      },
      {
        key: "response_id",
        label: "Response Id",
        defaultVisible: true,
        sortable: true,
      },
      {
        key: "date_time",
        label: "Time",
        defaultVisible: true,
        sortable: true,
      },
      {
        key: "building",
        label: "Building",
        defaultVisible: true,
        sortable: true,
      },
      { key: "wing", label: "Wing", defaultVisible: true, sortable: true },
      { key: "area", label: "Area", defaultVisible: true, sortable: true },
      { key: "floor", label: "Floor", defaultVisible: true, sortable: true },
      { key: "room", label: "Room", defaultVisible: true, sortable: true },
    ];

    // Add dynamic question columns with detailed structure
    const questionColumns: Array<{
      key: string;
      label: string;
      defaultVisible: boolean;
      sortable: boolean;
    }> = [];
    if (surveyData?.questions && surveyData.questions.length > 0) {
      surveyData.questions.forEach(
        (question: SurveyQuestion, index: number) => {
          // For each question, add 4 columns: Question Type, Question Dynamic, Issue Icon, Comment
          const questionNumber = index + 1;

          // Question Type column
          questionColumns.push({
            key: `q${questionNumber}_type`,
            label: `Question Type`,
            defaultVisible: true,
            sortable: true,
          });

          // Question Dynamic column (shows the actual answer)
          questionColumns.push({
            key: `q${questionNumber}_answer`,
            label:
              question.question.length > 50
                ? `${question.question.substring(0, 50)}...`
                : question.question,
            defaultVisible: true,
            sortable: true,
          });

          // Issue Icon column (complaints icon_category)
          questionColumns.push({
            key: `q${questionNumber}_icon`,
            // label: `Q${questionNumber} Issue Icon`,
            label: `Issue Icon`,

            defaultVisible: true,
            sortable: true,
          });

          // Comment column (answers.comments)
          questionColumns.push({
            key: `q${questionNumber}_comment`,
            // label: `Q${questionNumber} Comment`,
            label: `Comment`,
            defaultVisible: true,
            sortable: true,
          });
        }
      );
    }

    const endColumns = [
      {
        key: "final_comment",
        label: "Final Comments",
        defaultVisible: true,
        sortable: true,
        width: 200, // Set width for final comments
        minWidth: 150,
      },
      {
        key: "ticket_id",
        label: "Ticket Id",
        defaultVisible: true,
        sortable: true,
        width: 200, // Set specific width to accommodate full ticket numbers
        minWidth: 150, // Minimum width to prevent over-compression
      },
    ];

    return [...baseColumns, ...questionColumns, ...endColumns];
  };

  // Static columns for ticket data
  const getTicketColumns = () => [
    {
      key: "ticket_number",
      label: "Ticket ID",
      defaultVisible: true,
      sortable: true,
    },
    { key: "heading", label: "Heading", defaultVisible: true, sortable: true },
    // { key: "icon_category", label: "Icon Category", defaultVisible: true, sortable: true },
    {
      key: "category",
      label: "Category",
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "sub_category_type",
      label: "Sub Category",
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "created_by",
      label: "Created By",
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "assigned_to",
      label: "Assigned To",
      defaultVisible: true,
      sortable: true,
    },
    { key: "status", label: "Status", defaultVisible: true, sortable: true },

    {
      key: "priority",
      label: "Priority",
      defaultVisible: true,
      sortable: true,
    },
    { key: "site_name", label: "Site", defaultVisible: true, sortable: true },
    {
      key: "created_at",
      label: "Created At",
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "complaint_type",
      label: "Ticket Type",
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "complaint_mode",
      label: "Complaint Mode",
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "asset_or_service_name",
      label: "Asset/Service Name",
      defaultVisible: true,
      sortable: true,
    },
    { key: "task_id", label: "Task ID", defaultVisible: true, sortable: true },
    {
      key: "proactive_reactive",
      label: "Proactive/Reactive",
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "review_tracking_date",
      label: "Review Date",
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "response_escalation",
      label: "Response Escalation",
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "response_tat",
      label: "Response TAT (Min)",
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "response_time",
      label: "Response Time (D:H:M)",
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "escalation_response_name",
      label: "Response Escalation Level",
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "resolution_escalation",
      label: "Resolution Escalation",
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "resolution_tat",
      label: "Resolution TAT (Min)",
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "resolution_time",
      label: "Resolution Time (D:H:M)",
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "escalation_resolution_name",
      label: "Resolution Escalation Level",
      defaultVisible: true,
      sortable: true,
    },
  ];

  // Filter functions
  const applyFiltersToTabularData = (
    data: TabularResponseData[],
    filters: SurveyResponseFilters
  ): TabularResponseData[] => {
    return data.filter((item) => {
      // Date range filter
      if (filters.dateRange?.from || filters.dateRange?.to) {
        // Parse the date_time string which is in format like "22/09/2025, 15:04"
        const dateTimeParts = item.date_time.split(", ");
        const datePart = dateTimeParts[0]; // "22/09/2025"
        const [day, month, year] = datePart.split("/").map(Number);
        const itemDate = new Date(year, month - 1, day); // month is 0-indexed in JS Date

        if (filters.dateRange.from) {
          const fromDate = new Date(filters.dateRange.from);
          fromDate.setHours(0, 0, 0, 0); // Start of day
          if (itemDate < fromDate) return false;
        }

        if (filters.dateRange.to) {
          const toDate = new Date(filters.dateRange.to);
          toDate.setHours(23, 59, 59, 999); // End of day
          if (itemDate > toDate) return false;
        }
      }

      // Location filters
      if (
        filters.building &&
        !(item.building || "")
          .toLowerCase()
          .includes(filters.building.toLowerCase())
      )
        return false;
      if (
        filters.wing &&
        !(item.wing || "").toLowerCase().includes(filters.wing.toLowerCase())
      )
        return false;
      if (
        filters.area &&
        !(item.area || "").toLowerCase().includes(filters.area.toLowerCase())
      )
        return false;
      if (
        filters.floor &&
        !(item.floor || "").toLowerCase().includes(filters.floor.toLowerCase())
      )
        return false;
      if (
        filters.room &&
        !(item.room || "").toLowerCase().includes(filters.room.toLowerCase())
      )
        return false;

      // Icon Category filter
      if (
        filters.iconCategory &&
        !(item.icon_category || "")
          .toLowerCase()
          .includes(filters.iconCategory.toLowerCase())
      )
        return false;

      // Rating filter
      if (filters.rating && !(item.rating || "").includes(filters.rating))
        return false;

      // Category filter
      if (filters.category && item.category !== filters.category) return false;

      // Has tickets filter
      if (filters.hasTickets && !item.ticket_id) return false;

      return true;
    });
  };

  const applyFiltersToTicketData = (
    data: TicketData[],
    filters: SurveyResponseFilters
  ): TicketData[] => {
    return data.filter((item) => {
      // Date range filter
      if (filters.dateRange?.from || filters.dateRange?.to) {
        // Parse the created_at string which is in format like "22/09/2025"
        const [day, month, year] = item.created_at.split("/").map(Number);
        const itemDate = new Date(year, month - 1, day); // month is 0-indexed in JS Date

        if (filters.dateRange.from) {
          const fromDate = new Date(filters.dateRange.from);
          fromDate.setHours(0, 0, 0, 0); // Start of day
          if (itemDate < fromDate) return false;
        }

        if (filters.dateRange.to) {
          const toDate = new Date(filters.dateRange.to);
          toDate.setHours(23, 59, 59, 999); // End of day
          if (itemDate > toDate) return false;
        }
      }

      // Assignee filter
      if (
        filters.assignee &&
        !(item.assignee || "")
          .toLowerCase()
          .includes(filters.assignee.toLowerCase())
      )
        return false;

      // Category filter
      if (
        filters.category &&
        !(item.category || "")
          .toLowerCase()
          .includes(filters.category.toLowerCase())
      )
        return false;

      return true;
    });
  };

  // Local state for date inputs to prevent blinking
  const [localFromDate, setLocalFromDate] = useState("");
  const [localToDate, setLocalToDate] = useState("");

  // Sync local date state with form filters when modal opens
  useEffect(() => {
    if (showFilterModal) {
      const activeFormFilters =
        activeFilterTab === "summary" ? summaryFormFilters : tabularFormFilters;
      setLocalFromDate(
        activeFormFilters.dateRange?.from
          ? new Date(activeFormFilters.dateRange.from)
            .toISOString()
            .split("T")[0]
          : ""
      );
      setLocalToDate(
        activeFormFilters.dateRange?.to
          ? new Date(activeFormFilters.dateRange.to).toISOString().split("T")[0]
          : ""
      );
    }
  }, [
    showFilterModal,
    summaryFormFilters,
    tabularFormFilters,
    activeFilterTab,
  ]);

  // Optimized date handlers using useCallback to prevent unnecessary re-renders
  // Use local state for immediate UI feedback and batch update to form state
  const handleFromDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const dateValue = e.target.value;
      setLocalFromDate(dateValue);

      const date = dateValue ? new Date(dateValue) : undefined;

      if (activeFilterTab === "summary") {
        setSummaryFormFilters((prev) => ({
          ...prev,
          dateRange: {
            ...prev.dateRange,
            from: date,
          },
        }));
      } else {
        setTabularFormFilters((prev) => ({
          ...prev,
          dateRange: {
            ...prev.dateRange,
            from: date,
          },
        }));
      }
    },
    [activeFilterTab]
  );

  const handleToDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const dateValue = e.target.value;
      setLocalToDate(dateValue);

      const date = dateValue ? new Date(dateValue) : undefined;

      if (activeFilterTab === "summary") {
        setSummaryFormFilters((prev) => ({
          ...prev,
          dateRange: {
            ...prev.dateRange,
            to: date,
          },
        }));
      } else {
        setTabularFormFilters((prev) => ({
          ...prev,
          dateRange: {
            ...prev.dateRange,
            to: date,
          },
        }));
      }
    },
    [activeFilterTab]
  );

  // Filter handlers
  const handleSummaryFilterClick = useCallback(() => {
    setActiveFilterTab("summary");
    setSummaryFormFilters(summaryCurrentFilters); // Initialize form with current applied filters
    setShowFilterModal(true);
  }, [summaryCurrentFilters]);

  const handleTabularFilterClick = useCallback(() => {
    setActiveFilterTab("tabular");
    setTabularFormFilters(tabularCurrentFilters); // Initialize form with current applied filters
    setShowFilterModal(true);
  }, [tabularCurrentFilters]);

  // Legacy filter click handler for backwards compatibility
  const handleFilterClick = useCallback(() => {
    setActiveFilterTab("tabular");
    setTabularFormFilters(tabularCurrentFilters); // Initialize form with current applied filters
    setShowFilterModal(true);
  }, [tabularCurrentFilters]);

  // Function to refetch survey details with current summary filters
  const refetchSurveyDetailsWithFilters = useCallback(
    async (filters: SurveyResponseFilters) => {
      if (!surveyId) return;

      try {
        setIsLoading(true);
        // console.log("🔄 Refetching survey details with filters:", filters);

        const fromDate = filters.dateRange?.from;
        const toDate = filters.dateRange?.to;

        // Build location filters object
        const locationFilters: LocationFilters = {};

        if (filters.buildingId) {
          locationFilters.buildingIds = [filters.buildingId];
        }

        if (filters.wingId) {
          locationFilters.wingIds = [filters.wingId];
        }

        if (filters.floorId) {
          locationFilters.floorIds = [filters.floorId];
        }

        if (filters.roomId) {
          locationFilters.roomIds = [filters.roomId];
        }

        // Fetch survey details, heat map data and CSAT data with filters
        const [surveyDetailsResponse] = await Promise.all([
          fetchSurveyDetails(
            surveyId,
            fromDate,
            toDate,
            undefined,
            locationFilters
          ),
          fetchHeatMapData(fromDate, toDate, locationFilters),
          fetchCSATData(fromDate, toDate, locationFilters),
        ]);

        setSurveyDetailsData(surveyDetailsResponse);

        // Extract survey data from the filtered API response
        if (surveyDetailsResponse?.survey_details?.surveys?.length > 0) {
          const surveyDetail = surveyDetailsResponse.survey_details.surveys[0];
          setSurveyData(surveyDetail);
          // console.log("📊 Survey data updated with filters:", surveyDetail);
        } else {
          console.warn("⚠️ No survey data found for the applied filters");
          toast.info("No data found for the selected filters");
        }
      } catch (error) {
        console.error(
          "❌ Error refetching survey details with filters:",
          error
        );
        toast.error("Failed to apply filters to survey data");
      } finally {
        setIsLoading(false);
      }
    },
    [surveyId, fetchSurveyDetails, fetchHeatMapData, fetchCSATData]
  );

  console.log("surveyDetails", surveyDetailsData);

  // Export function for tabular data - opens modal
  const handleTabularExport = useCallback(() => {
    if (!surveyId) {
      toast.error("Survey ID is required for export");
      return;
    }

    // Initialize export dates with current tabular filters or empty
    setExportFromDate(
      tabularCurrentFilters.dateRange?.from
        ? new Date(tabularCurrentFilters.dateRange.from)
          .toISOString()
          .split("T")[0]
        : ""
    );
    setExportToDate(
      tabularCurrentFilters.dateRange?.to
        ? new Date(tabularCurrentFilters.dateRange.to)
          .toISOString()
          .split("T")[0]
        : ""
    );

    setShowExportModal(true);
  }, [surveyId, tabularCurrentFilters]);

  // Actual export function after date selection
  const handleConfirmExport = useCallback(async () => {
    if (!surveyId) {
      toast.error("Survey ID is required for export");
      return;
    }

    try {
      // Build the export URL with dynamic parameters
      const baseUrl = getFullUrl("/survey_mappings/response_list.xlsx");
      const exportUrl = new URL(baseUrl);

      // Add required parameters
      if (API_CONFIG.TOKEN) {
        exportUrl.searchParams.append("token", API_CONFIG.TOKEN);
      }
      exportUrl.searchParams.append("survey_id", surveyId);
      exportUrl.searchParams.append("export", "true");

      // Add current tabular filters to export
      if (tabularCurrentFilters.buildingId) {
        exportUrl.searchParams.append(
          "q[survey_mappings_building_id_in][]",
          tabularCurrentFilters.buildingId
        );
      }

      if (tabularCurrentFilters.wingId) {
        exportUrl.searchParams.append(
          "q[survey_mappings_wing_id_in][]",
          tabularCurrentFilters.wingId
        );
      }

      if (tabularCurrentFilters.areaId) {
        exportUrl.searchParams.append(
          "q[survey_mappings_area_id_in]",
          tabularCurrentFilters.areaId
        );
      }

      if (tabularCurrentFilters.floorId) {
        exportUrl.searchParams.append(
          "q[survey_mappings_floor_id_in][]",
          tabularCurrentFilters.floorId
        );
      }

      if (tabularCurrentFilters.roomId) {
        exportUrl.searchParams.append(
          "q[survey_mappings_room_id_in][]",
          tabularCurrentFilters.roomId
        );
      }

      // Add date filters if they are provided (from export modal or current filters)
      const fromDate =
        exportFromDate ||
        (tabularCurrentFilters.dateRange?.from
          ? new Date(tabularCurrentFilters.dateRange.from)
            .toISOString()
            .split("T")[0]
          : null);
      const toDate =
        exportToDate ||
        (tabularCurrentFilters.dateRange?.to
          ? new Date(tabularCurrentFilters.dateRange.to)
            .toISOString()
            .split("T")[0]
          : null);

      if (fromDate) {
        exportUrl.searchParams.append("from_date", fromDate);
      }

      if (toDate) {
        exportUrl.searchParams.append("to_date", toDate);
      }

      console.log("🚀 Exporting tabular data from:", exportUrl.toString());

      // Create a temporary link element and trigger download
      const link = document.createElement("a");
      link.href = exportUrl.toString();

      // Create a more descriptive filename with date range if filters are applied
      let filename = `survey_responses_${surveyId}`;
      if (exportFromDate || exportToDate) {
        const fromStr = exportFromDate
          ? new Date(exportFromDate)
            .toLocaleDateString("en-GB")
            .replace(/\//g, "-")
          : "start";
        const toStr = exportToDate
          ? new Date(exportToDate)
            .toLocaleDateString("en-GB")
            .replace(/\//g, "-")
          : "end";
        filename += `_${fromStr}_to_${toStr}`;
      } else {
        filename += "_all_data";
      }
      filename += ".xlsx";

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const dateRangeText =
        exportFromDate || exportToDate
          ? " for selected date range"
          : " (all data)";
      toast.success(`Export initiated successfully${dateRangeText}`);

      // Close the modal
      setShowExportModal(false);
    } catch (error) {
      console.error("❌ Error exporting tabular data:", error);
      toast.error("Failed to export survey data");
    }
  }, [surveyId, exportFromDate, exportToDate, tabularCurrentFilters]);

  const handleApplyFilters = useCallback(async () => {
    if (activeFilterTab === "summary") {
      setSummaryCurrentFilters(summaryFormFilters);

      // Refetch survey details with the new date filters for summary tab
      await refetchSurveyDetailsWithFilters(summaryFormFilters);

      // Show success toast for summary filters
      toast.success("Summary filters applied successfully");
    } else {
      setTabularCurrentFilters(tabularFormFilters);

      // Fetch filtered data from API for tabular tab
      try {
        await fetchResponseListData(tabularFormFilters);
        // Show success toast for tabular filters
        toast.success("Tabular filters applied successfully");
      } catch (error) {
        console.error("Error applying tabular filters:", error);
        toast.error("Failed to apply tabular filters");
      }
    }

    setShowFilterModal(false);
  }, [
    activeFilterTab,
    summaryFormFilters,
    tabularFormFilters,
    fetchResponseListData,
    refetchSurveyDetailsWithFilters,
  ]);

  const handleClearFilters = useCallback(async () => {
    if (activeFilterTab === "summary") {
      setSummaryCurrentFilters({});
      setSummaryFormFilters({});

      // Instead of refetching, restore original data to avoid page refresh
      if (originalSurveyData && originalSurveyDetailsData) {
        setSurveyData(originalSurveyData);
        setSurveyDetailsData(originalSurveyDetailsData);
      }

      // Refetch heat map and CSAT data without filters
      try {
        await Promise.all([fetchHeatMapData(), fetchCSATData()]);
      } catch (error) {
        console.error("Error refreshing chart data:", error);
      }

      // Show success toast for summary filter reset
      toast.success("Summary filters cleared successfully");
    } else {
      setTabularCurrentFilters({});
      setTabularFormFilters({});

      // Refetch data without filters for tabular tab
      try {
        await fetchResponseListData();
        // Show success toast for tabular filter reset
        toast.success("Tabular filters cleared successfully");
      } catch (error) {
        console.error("Error clearing tabular filters:", error);
        toast.error("Failed to clear tabular filters");
      }
    }
    // Keep modal open after clearing filters
  }, [
    activeFilterTab,
    originalSurveyData,
    originalSurveyDetailsData,
    fetchResponseListData,
    fetchHeatMapData,
    fetchCSATData,
  ]);

  const getActiveFiltersCount = useCallback(() => {
    const filters =
      activeFilterTab === "summary"
        ? summaryCurrentFilters
        : tabularCurrentFilters;
    let count = 0;
    if (filters.dateRange?.from || filters.dateRange?.to) count++;
    if (filters.buildingId) count++;
    if (filters.wingId) count++;
    if (filters.areaId) count++;
    if (filters.floorId) count++;
    if (filters.roomId) count++;
    if (filters.building) count++;
    if (filters.wing) count++;
    if (filters.area) count++;
    if (filters.floor) count++;
    if (filters.room) count++;
    if (filters.iconCategory) count++;
    if (filters.rating) count++;
    if (filters.category) count++;
    if (filters.assignee) count++;
    if (filters.hasTickets) count++;
    return count;
  }, [activeFilterTab, summaryCurrentFilters, tabularCurrentFilters]);

  const hasActiveFilters = useCallback(
    () => getActiveFiltersCount() > 0,
    [getActiveFiltersCount]
  );

  // Memoized date values to prevent unnecessary re-computation
  const minDateValue = useMemo(() => {
    return localFromDate || undefined;
  }, [localFromDate]);

  // Get data to display (filtered or original) - for tabular tab
  const getDisplayTabularData = useCallback(() => {
    console.log("🔍 getDisplayTabularData called");
    console.log("🔍 tabularCurrentFilters:", tabularCurrentFilters);
    console.log(
      "🔍 Object.keys(tabularCurrentFilters).length:",
      Object.keys(tabularCurrentFilters).length
    );

    // Always use the current responseListData which contains server-filtered data
    // Since we now fetch filtered data from the server, getTabularData() will always return the correct data
    const data = getTabularData();
    console.log("🔍 Using server-filtered data:", data.length);
    return data;
  }, [getTabularData, tabularCurrentFilters]);

  const getDisplayTicketData = useCallback(() => {
    // Always use the current server-filtered data from getTicketData()
    return getTicketData();
  }, [getTicketData]);

  // Helper functions to calculate ticket statistics
  const getTicketStatistics = useCallback(() => {
    const ticketData = getDisplayTicketData();
    const totalTickets = ticketData.length;
    const openTickets = ticketData.filter(
      (ticket) =>
        ticket.status &&
        ticket.status.toLowerCase() !== "closed" &&
        ticket.status.toLowerCase() !== "resolved"
    ).length;
    const closedTickets = ticketData.filter(
      (ticket) =>
        ticket.status &&
        (ticket.status.toLowerCase() === "closed" ||
          ticket.status.toLowerCase() === "resolved")
    ).length;

    // Calculate in-progress tickets (In Progress, In-Progress, Progress, etc.)
    const inProgressTickets = ticketData.filter(
      (ticket) =>
        ticket.status &&
        (ticket.status.toLowerCase().includes("progress") ||
          ticket.status.toLowerCase().includes("in-progress") ||
          ticket.status.toLowerCase() === "working" ||
          ticket.status.toLowerCase() === "ongoing")
    ).length;

    // Calculate pending tickets (Pending, Open, New, etc.)
    const pendingTickets = ticketData.filter(
      (ticket) =>
        ticket.status &&
        (ticket.status.toLowerCase() === "pending" ||
          ticket.status.toLowerCase() === "open" ||
          ticket.status.toLowerCase() === "new" ||
          ticket.status.toLowerCase() === "assigned")
    ).length;

    return {
      totalTickets,
      openTickets,
      closedTickets,
      inProgressTickets,
      pendingTickets,
    };
  }, [getDisplayTicketData]);

  const [isDownloadingSummary, setIsDownloadingSummary] = useState(false);
  const summaryContentRef = useRef<HTMLDivElement>(null);

  const handleDownloadSummaryPDF = async () => {
    if (!surveyData || !summaryContentRef.current) {
      toast.error("No summary data available to download");
      return;
    }

    setIsDownloadingSummary(true);
    try {
      const element = summaryContentRef.current;

      // Temporarily hide the toolbar (filter and download buttons) for PDF capture
      const toolbar = element.querySelector(
        ".flex.items-center.justify-between.mb-6.print\\:hidden"
      ) as HTMLElement;
      const originalDisplay = toolbar ? toolbar.style.display : "";
      if (toolbar) toolbar.style.display = "none";

      // Render the logo components as JSX elements
      const oigLogo = renderToStaticMarkup(<OIG_LOGO_CODE />);
      const viLogo = renderToStaticMarkup(<VI_LOGO_CODE />);
      const defaultLogo = renderToStaticMarkup(<DEFAULT_LOGO_CODE />);

      const headerHTML = `
      <div style="position: relative; width: 100%; height: 50px;">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
          background-color: #C4B89D59;
          height: 45px;
          width: 1000px;
          display: inline-block;
          padding: 8px 0 0 8px;
        ">${defaultLogo}</div>
      </div>
      <div style="text-align: center; padding: 0 0 15px 0;">
        <h1 style="font-size: 24px; font-weight: 600; color: #1f2937; margin: 0;">${surveyData.survey_name || 'Survey Report'}</h1>
      </div>
    `;

      const fullContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              ${JobSheetPDFGenerator}
              * { box-sizing: border-box; }
              .header { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #D9D9D9; background-color: #F6F4EE; }
              .logo { margin: 0 10px; }
              .header-text { margin: 0 0 18px 0 !important; }
              
              /* Force card header alignment */
              [class*="MuiCardHeader-root"] { display: flex !important; align-items: center !important; min-height: 60px !important; padding: 16px !important; }
              [class*="MuiCardHeader-content"] { flex: 1 !important; display: flex !important; align-items: center !important; gap: 12px !important; }
              [class*="MuiCardHeader-title"] { font-size: 18px !important; font-weight: 600 !important; color: #000 !important; margin: 0 !important; display: flex !important; align-items: center !important; gap: 12px !important; flex-wrap: wrap !important; }
              [class*="MuiCardHeader-title"] div[class*="rounded-full"] { margin-right: 0 !important; }
              
              /* Additional fallback selectors */
              .text-lg { font-size: 18px !important; }
              div[class*="flex items-center"] { align-items: center !important; }

              /* PDF Card styles with improved page break handling */
              .my-pdf-card {
                display: block !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                margin-bottom: 30px !important;
                background-color: #fff !important;
                box-shadow: none !important;
                padding-top: 0 !important;
              }

              /* Ensure proper spacing when card appears at top of new page */
              .my-pdf-card:first-child,
              .my-pdf-card {
                margin-top: 20px !important;
              }

              /* Force page break before certain cards if needed */
              .my-pdf-card + .my-pdf-card {
                page-break-before: auto !important;
                break-before: auto !important;
              }

              /* Fix alignment for Positive/Negative labels */
              .flex.items-center.gap-2.justify-between {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                width: 100% !important;
              }

              .flex.items-center.gap-2 {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
              }

              /* Ensure emoji container alignment */
              .flex.justify-center.items-center.gap-8 {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                gap: 32px !important;
                flex-wrap: wrap !important;
              }

              /* Page break rules */
              @media print {
                .my-pdf-card {
                  page-break-inside: avoid !important;
                  margin-top: 20px !important;
                }
              }
            </style>
          </head>
          <body>
            ${headerHTML}
            <div style="padding: 5px 30px 30px 30px;">${element.innerHTML}</div>
          </body>
        </html>
      `;

      const opt = {
        margin: 0,
        filename: `survey_summary_${surveyId}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, logging: true, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" as const },
      };

      await html2pdf().from(fullContent).set(opt).save();

      // Restore toolbar display
      if (toolbar) toolbar.style.display = originalDisplay;

      toast.success("Survey summary PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating summary PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloadingSummary(false);
    }
  };

  // Export Modal Component
  const ExportModal = useMemo(
    () => (
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800 flex items-center">
              {/* <Download className="w-5 h-5 mr-2 text-[#C72030]" /> */}
              Export Survey Data
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="text-sm text-gray-600 mb-4">
              <span className="text-red-700 text-xl">* </span>Select date to
              export range responses, or leave empty to export all data.
            </div>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="export-from-date"
                  className="text-sm font-medium text-gray-700"
                >
                  From Date
                </Label>
                <Input
                  id="export-from-date"
                  type="date"
                  value={exportFromDate}
                  onChange={(e) => setExportFromDate(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="export-to-date"
                  className="text-sm font-medium text-gray-700"
                >
                  To Date
                </Label>
                <Input
                  id="export-to-date"
                  type="date"
                  value={exportToDate}
                  onChange={(e) => setExportToDate(e.target.value)}
                  min={exportFromDate || undefined}
                  className="mt-1"
                />
              </div>
            </div>

            {(exportFromDate || exportToDate) && (
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <strong>Export range:</strong>{" "}
                {exportFromDate
                  ? new Date(exportFromDate).toLocaleDateString("en-GB")
                  : "Start"}{" "}
                to{" "}
                {exportToDate
                  ? new Date(exportToDate).toLocaleDateString("en-GB")
                  : "End"}
              </div>
            )}

            {/* {!exportFromDate && !exportToDate && (
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              <strong>All data will be exported</strong> - No date filters applied
            </div>
          )} */}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowExportModal(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmExport}
              className="px-6 bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    ),
    [showExportModal, exportFromDate, exportToDate, handleConfirmExport]
  );

  // Filter Modal Component - Enhanced with location details for tabular tab
  const FilterModal = useMemo(
    () => (
      <Dialog
        open={showFilterModal}
        onOpenChange={setShowFilterModal}
        modal={false}
      >
        <DialogContent
          className="max-w-4xl bg-white max-h-[90vh] overflow-y-auto"
          aria-describedby="survey-filter-dialog-description"
        >
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              FILTER BY
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilterModal(false)}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
            <div id="survey-filter-dialog-description" className="sr-only">
              Filter survey responses by date range and location details
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Date Range Section */}
            <div>
              <h3 className="text-sm font-medium text-[#C72030] mb-4">
                {activeFilterTab === "summary"
                  ? "Summary Filters"
                  : "Date Range"}
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <TextField
                  label="From Date"
                  type="date"
                  value={localFromDate}
                  onChange={handleFromDateChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
                <TextField
                  label="To Date"
                  type="date"
                  value={localToDate}
                  onChange={handleToDateChange}
                  inputProps={{ min: minDateValue }}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>
            </div>

            {/* Summary Location Details Section */}
            {activeFilterTab === "summary" && (
              <div>
                <h3 className="text-sm font-medium text-[#C72030] mb-4">
                  Location Details
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Building</InputLabel>
                    <MuiSelect
                      label="Building"
                      value={summaryFormFilters.buildingId ?? ""}
                      onChange={(e) =>
                        setSummaryFormFilters((prev) => ({
                          ...prev,
                          buildingId: e.target.value || undefined,
                          wingId: undefined,
                          areaId: undefined,
                          floorId: undefined,
                          roomId: undefined,
                        }))
                      }
                      displayEmpty
                      sx={fieldStyles}
                      disabled={loadingBuildings}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value="">
                        <em>Select Building</em>
                      </MenuItem>
                      {buildings.map((buildingItem) => (
                        <MenuItem
                          key={buildingItem.id}
                          value={buildingItem.id?.toString() || ""}
                        >
                          {buildingItem.name || "Unknown Building"}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Wing</InputLabel>
                    <MuiSelect
                      label="Wing"
                      value={summaryFormFilters.wingId ?? ""}
                      onChange={(e) =>
                        setSummaryFormFilters((prev) => ({
                          ...prev,
                          wingId: e.target.value || undefined,
                          areaId: undefined,
                          floorId: undefined,
                          roomId: undefined,
                        }))
                      }
                      displayEmpty
                      sx={fieldStyles}
                      disabled={loadingWings || !summaryFormFilters.buildingId}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value="">
                        <em>Select Wing</em>
                      </MenuItem>
                      {wings.map((wingItem) => (
                        <MenuItem
                          key={wingItem.id}
                          value={wingItem.id?.toString() || ""}
                        >
                          {wingItem.name || "Unknown Wing"}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Area</InputLabel>
                    <MuiSelect
                      label="Area"
                      value={summaryFormFilters.areaId ?? ""}
                      onChange={(e) =>
                        setSummaryFormFilters((prev) => ({
                          ...prev,
                          areaId: e.target.value || undefined,
                          floorId: undefined,
                          roomId: undefined,
                        }))
                      }
                      displayEmpty
                      sx={fieldStyles}
                      disabled={loadingAreas || !summaryFormFilters.wingId}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value="">
                        <em>Select Area</em>
                      </MenuItem>
                      {areas.map((areaItem) => (
                        <MenuItem
                          key={areaItem.id}
                          value={areaItem.id?.toString() || ""}
                        >
                          {areaItem.name || "Unknown Area"}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Floor</InputLabel>
                    <MuiSelect
                      label="Floor"
                      value={summaryFormFilters.floorId ?? ""}
                      onChange={(e) =>
                        setSummaryFormFilters((prev) => ({
                          ...prev,
                          floorId: e.target.value || undefined,
                          roomId: undefined,
                        }))
                      }
                      displayEmpty
                      sx={fieldStyles}
                      disabled={loadingFloors || !summaryFormFilters.areaId}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value="">
                        <em>Select Floor</em>
                      </MenuItem>
                      {floors.map((floorItem) => (
                        <MenuItem
                          key={floorItem.id}
                          value={floorItem.id?.toString() || ""}
                        >
                          {floorItem.name || "Unknown Floor"}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Room</InputLabel>
                    <MuiSelect
                      label="Room"
                      value={summaryFormFilters.roomId ?? ""}
                      onChange={(e) =>
                        setSummaryFormFilters((prev) => ({
                          ...prev,
                          roomId: e.target.value || undefined,
                        }))
                      }
                      displayEmpty
                      sx={fieldStyles}
                      disabled={loadingRooms || !summaryFormFilters.floorId}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value="">
                        <em>Select Room</em>
                      </MenuItem>
                      {rooms.map((roomItem) => (
                        <MenuItem
                          key={roomItem.id}
                          value={roomItem.id?.toString() || ""}
                        >
                          {roomItem.name || "Unknown Room"}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </div>
                {/* <div className="grid grid-cols-2 gap-6 mt-4">
                
                </div> */}
                {/* <div className="grid grid-cols-2 gap-6 mt-4">
                 
                </div> */}
              </div>
            )}

            {/* Tabular Location Details Section */}
            {activeFilterTab === "tabular" && (
              <div>
                <h3 className="text-sm font-medium text-[#C72030] mb-4">
                  Location Details
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="building-label" shrink>
                      Building
                    </InputLabel>
                    <MuiSelect
                      labelId="building-label"
                      label="Building"
                      value={tabularFormFilters.buildingId ?? ""}
                      onChange={(e) =>
                        setTabularFormFilters((prev) => ({
                          ...prev,
                          buildingId: e.target.value || undefined,
                          wingId: undefined,
                          areaId: undefined,
                          floorId: undefined,
                          roomId: undefined,
                        }))
                      }
                      displayEmpty
                      sx={fieldStyles}
                      disabled={loadingBuildings}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value="">
                        <em>Select Building</em>
                      </MenuItem>
                      {buildings.map((buildingItem) => (
                        <MenuItem
                          key={buildingItem.id}
                          value={buildingItem.id?.toString() || ""}
                        >
                          {buildingItem.name || "Unknown Building"}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="wing-label" shrink>
                      Wing
                    </InputLabel>
                    <MuiSelect
                      labelId="wing-label"
                      label="Wing"
                      value={tabularFormFilters.wingId ?? ""}
                      onChange={(e) =>
                        setTabularFormFilters((prev) => ({
                          ...prev,
                          wingId: e.target.value || undefined,
                          areaId: undefined,
                          floorId: undefined,
                          roomId: undefined,
                        }))
                      }
                      displayEmpty
                      sx={fieldStyles}
                      disabled={loadingWings || !tabularFormFilters.buildingId}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value="">
                        <em>Select Wing</em>
                      </MenuItem>
                      {wings.map((wingItem) => (
                        <MenuItem
                          key={wingItem.id}
                          value={wingItem.id?.toString() || ""}
                        >
                          {wingItem.name || "Unknown Wing"}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="area-label" shrink>
                      Area
                    </InputLabel>
                    <MuiSelect
                      labelId="area-label"
                      label="Area"
                      value={tabularFormFilters.areaId ?? ""}
                      onChange={(e) =>
                        setTabularFormFilters((prev) => ({
                          ...prev,
                          areaId: e.target.value || undefined,
                          floorId: undefined,
                          roomId: undefined,
                        }))
                      }
                      displayEmpty
                      sx={fieldStyles}
                      disabled={loadingAreas || !tabularFormFilters.wingId}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value="">
                        <em>Select Area</em>
                      </MenuItem>
                      {areas.map((areaItem) => (
                        <MenuItem
                          key={areaItem.id}
                          value={areaItem.id?.toString() || ""}
                        >
                          {areaItem.name || "Unknown Area"}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="floor-label" shrink>
                      Floor
                    </InputLabel>
                    <MuiSelect
                      labelId="floor-label"
                      label="Floor"
                      value={tabularFormFilters.floorId ?? ""}
                      onChange={(e) =>
                        setTabularFormFilters((prev) => ({
                          ...prev,
                          floorId: e.target.value || undefined,
                          roomId: undefined,
                        }))
                      }
                      displayEmpty
                      sx={fieldStyles}
                      disabled={loadingFloors || !tabularFormFilters.areaId}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value="">
                        <em>Select Floor</em>
                      </MenuItem>
                      {floors.map((floorItem) => (
                        <MenuItem
                          key={floorItem.id}
                          value={floorItem.id?.toString() || ""}
                        >
                          {floorItem.name || "Unknown Floor"}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="room-label" shrink>
                      Room
                    </InputLabel>
                    <MuiSelect
                      labelId="room-label"
                      label="Room"
                      value={tabularFormFilters.roomId ?? ""}
                      onChange={(e) =>
                        setTabularFormFilters((prev) => ({
                          ...prev,
                          roomId: e.target.value || undefined,
                        }))
                      }
                      displayEmpty
                      sx={fieldStyles}
                      disabled={loadingRooms || !tabularFormFilters.floorId}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value="">
                        <em>Select Room</em>
                      </MenuItem>
                      {rooms.map((roomItem) => (
                        <MenuItem
                          key={roomItem.id}
                          value={roomItem.id?.toString() || ""}
                        >
                          {roomItem.name || "Unknown Room"}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </div>
                {/* <div className="grid grid-cols-2 gap-6 mt-4">
                 
                </div> */}
                {/* <div className="grid grid-cols-2 gap-6 mt-4">
                 
                </div> */}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              variant="secondary"
              onClick={handleApplyFilters}
              className="flex-1 h-11"
            >
              Apply
            </Button>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex-1 h-11"
            >
              Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    ),
    [
      showFilterModal,
      minDateValue,
      handleFromDateChange,
      handleToDateChange,
      handleClearFilters,
      handleApplyFilters,
      localFromDate,
      localToDate,
      activeFilterTab,
      summaryFormFilters.buildingId,
      summaryFormFilters.wingId,
      summaryFormFilters.areaId,
      summaryFormFilters.floorId,
      summaryFormFilters.roomId,
      tabularFormFilters,
      setTabularFormFilters,
      buildings,
      wings,
      areas,
      floors,
      rooms,
      loadingBuildings,
      loadingWings,
      loadingAreas,
      loadingFloors,
      loadingRooms,
      fieldStyles,
      selectMenuProps,
    ]
  );

  if (isLoading) {
    return (
      <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            Loading survey details...
          </h1>
          <p className="text-gray-600">
            Please wait while we fetch the survey information.
          </p>
        </div>
      </div>
    );
  }

  if (!surveyData) {
    return (
      <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
        <div className="text-center py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/maintenance/survey/response")}
            className="mb-6 p-0 h-auto text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Response List
          </Button>
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">📋</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Survey not found
            </h1>
            <p className="text-gray-600 mb-4">
              The survey with ID "{surveyId}" could not be found or has no data
              available.
            </p>
            <Button
              onClick={() => navigate("/maintenance/survey/response")}
              className="bg-[#C72030] hover:bg-[#A01B2A] text-white"
            >
              Return to Survey List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => {
            // If we're viewing tabular details, go back to tabular list
            if (selectedTabularResponseId) {
              setSelectedTabularResponseId(null);
            } else {
              // Otherwise go back to main response list
              navigate("/maintenance/survey/response");
            }
          }}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {selectedTabularResponseId
            ? "Back to Tabular List"
            : "Back to Response List"}
        </Button>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            {surveyData.survey_name}
          </h1>
          {activeTab === "summary" && (
            <div className="flex items-center gap-2">
              {/* <Button variant="outline" size="icon" title="Export">
                <Download className="w-4 h-4" />
              </Button> */}
              {/* <Button
                  onClick={handleDownloadSummaryPDF}
                  className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
                  disabled={isDownloadingSummary || !surveyData}
                >
                  {isDownloadingSummary ? (
                    <span>Generating PDF...</span>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </Button> */}
              <Button
                variant="outline"
                size="icon"
                title="Export"
                onClick={handleDownloadSummaryPDF}
                disabled={isDownloadingSummary || !surveyData}
              >
                {isDownloadingSummary ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveFilterTab("summary");
                  setSummaryFormFilters(summaryCurrentFilters);
                  setShowFilterModal(true);
                }}
                className="flex items-center gap-1 relative"
              >
                <Filter className="w-4 h-4" />
                {Object.keys(summaryCurrentFilters).length > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-[#C72030] text-white rounded-full">
                    {(() => {
                      let count = 0;
                      if (
                        summaryCurrentFilters.dateRange?.from ||
                        summaryCurrentFilters.dateRange?.to
                      )
                        count++;
                      if (summaryCurrentFilters.buildingId) count++;
                      if (summaryCurrentFilters.wingId) count++;
                      if (summaryCurrentFilters.areaId) count++;
                      if (summaryCurrentFilters.floorId) count++;
                      if (summaryCurrentFilters.roomId) count++;
                      return count;
                    })()}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* <TabsList className="flex flex-nowrap justify-start overflow-x-auto no-scrollbar bg-gray-50 rounded-t-lg h-auto p-0 text-sm">
            {[
              { label: "Summary", value: "summary" },
              { label: "Tabular", value: "tabular" },
              { label: "Tickets", value: "tickets" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList> */}
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
            {[
              { label: "Survey Information", value: "summary" },
              { label: "Tabular", value: "tabular" },
              { label: "Tickets", value: "tickets" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="group flex items-center justify-center gap-2 border-none font-semibold data-[state=active]:bg-[#EDEAE3] data-[state=inactive]:bg-white data-[state=inactive]:text-black data-[state=active]:text-[#C72030]"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="summary" className="">
            {/* Summary Tab Header with Filter */}
            <div className="flex items-center justify-between mb-6 print:hidden">
              {/* <h2 className="text-lg font-semibold text-gray-800">
                Survey Analytics Summary
              </h2> */}
              <div className="flex items-center gap-3">
                {Object.keys(summaryCurrentFilters).length > 0 && (
                  <span className="text-sm text-gray-600">
                    {(() => {
                      let count = 0;
                      if (
                        summaryCurrentFilters.dateRange?.from ||
                        summaryCurrentFilters.dateRange?.to
                      )
                        count++;
                      if (summaryCurrentFilters.buildingId) count++;
                      if (summaryCurrentFilters.wingId) count++;
                      if (summaryCurrentFilters.areaId) count++;
                      if (summaryCurrentFilters.floorId) count++;
                      if (summaryCurrentFilters.roomId) count++;
                      return count;
                    })()}{" "}
                    filter
                    {(() => {
                      let count = 0;
                      if (
                        summaryCurrentFilters.dateRange?.from ||
                        summaryCurrentFilters.dateRange?.to
                      )
                        count++;
                      if (summaryCurrentFilters.buildingId) count++;
                      if (summaryCurrentFilters.wingId) count++;
                      if (summaryCurrentFilters.areaId) count++;
                      if (summaryCurrentFilters.floorId) count++;
                      if (summaryCurrentFilters.roomId) count++;
                      return count !== 1 ? "s" : "";
                    })()}{" "}
                    active
                  </span>
                )}
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveFilterTab("summary");
                    setSummaryFormFilters(summaryCurrentFilters);
                    setShowFilterModal(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                  {Object.keys(summaryCurrentFilters).length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#C72030] text-white rounded-full">
                      {(() => {
                        let count = 0;
                        if (
                          summaryCurrentFilters.dateRange?.from ||
                          summaryCurrentFilters.dateRange?.to
                        )
                          count++;
                        return count;
                      })()}
                    </span>
                  )}
                </Button> */}
              </div>
            </div>

            {/* Summary Content - Ref for PDF capture */}
            <div ref={summaryContentRef}>
              {/* Summary Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {/* Total Questions */}

                <Card className="bg-[#F6F4EE]">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#C7203014] flex items-center justify-center rounded-full">
                        <HelpCircle className="w-5 h-5 text-[#C72030]" />
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-[#C72030]">
                          {surveyData.csat
                            ? surveyData.csat.toFixed(2)
                            : "0.00"}
                        </p>
                        <p className="text-sm text-gray-600">CSAT</p>
                        {Object.keys(summaryCurrentFilters).length > 0 && (
                          <p className="text-xs text-gray-500">
                            Filtered data shown
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[#F6F4EE]">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#C7203014] flex items-center justify-center rounded-full">
                        <HelpCircle className="w-5 h-5 text-[#C72030]" />
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-[#C72030]">
                          {surveyData.questions?.length || 0}
                        </p>
                        <p className="text-sm text-gray-600">Total Questions</p>
                        {Object.keys(summaryCurrentFilters).length > 0 && (
                          <p className="text-xs text-gray-500">
                            Filtered data shown
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Positive */}
                <Card className="bg-[#F6F4EE]">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#C7203014] flex items-center justify-center rounded-full">
                        <Smile className="w-5 h-5 text-[#C72030]" />
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-[#C72030]">
                          {surveyData.positive_responses || 0}
                        </p>
                        <p className="text-sm text-gray-600">Positive</p>
                        {Object.keys(summaryCurrentFilters).length > 0 && (
                          <p className="text-xs text-gray-500">
                            Filtered data shown
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Negative */}
                <Card className="bg-[#F6F4EE]">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#C7203014] flex items-center justify-center rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                        >
                          <path
                            d="M7.625 13.625C7.32833 13.625 7.03832 13.537 6.79165 13.3722C6.54498 13.2074 6.35272 12.9731 6.23919 12.699C6.12565 12.4249 6.09595 12.1233 6.15383 11.8324C6.2117 11.5414 6.35457 11.2741 6.56434 11.0643C6.77412 10.8546 7.0414 10.7117 7.33237 10.6538C7.62334 10.5959 7.92494 10.6256 8.19903 10.7392C8.47312 10.8527 8.70739 11.045 8.87221 11.2916C9.03703 11.5383 9.125 11.8283 9.125 12.125C9.125 12.5228 8.96697 12.9044 8.68566 13.1857C8.40436 13.467 8.02283 13.625 7.625 13.625ZM14.375 10.625C14.0783 10.625 13.7883 10.713 13.5416 10.8778C13.295 11.0426 13.1027 11.2769 12.9892 11.551C12.8757 11.8251 12.8459 12.1267 12.9038 12.4176C12.9617 12.7086 13.1046 12.9759 13.3143 13.1857C13.5241 13.3954 13.7914 13.5383 14.0824 13.5962C14.3733 13.6541 14.6749 13.6244 14.949 13.5108C15.2231 13.3973 15.4574 13.205 15.6222 12.9584C15.787 12.7117 15.875 12.4217 15.875 12.125C15.875 11.7272 15.717 11.3456 15.4357 11.0643C15.1544 10.783 14.7728 10.625 14.375 10.625ZM21.125 11C21.125 13.0025 20.5312 14.9601 19.4186 16.6251C18.3061 18.2902 16.7248 19.5879 14.8747 20.3543C13.0246 21.1206 10.9888 21.3211 9.02471 20.9305C7.06066 20.5398 5.25656 19.5755 3.84055 18.1595C2.42454 16.7435 1.46023 14.9393 1.06955 12.9753C0.678878 11.0112 0.879387 8.97543 1.64572 7.12533C2.41206 5.27523 3.70981 3.69392 5.37486 2.58137C7.0399 1.46882 8.99747 0.875 11 0.875C13.6844 0.877978 16.258 1.94567 18.1562 3.84383C20.0543 5.74199 21.122 8.3156 21.125 11ZM18.875 11C18.875 9.44247 18.4131 7.91992 17.5478 6.62488C16.6825 5.32985 15.4526 4.32049 14.0136 3.72445C12.5747 3.12841 10.9913 2.97246 9.46367 3.27632C7.93607 3.58017 6.53288 4.3302 5.43154 5.43153C4.3302 6.53287 3.58018 7.93606 3.27632 9.46366C2.97246 10.9913 3.12841 12.5747 3.72445 14.0136C4.32049 15.4526 5.32985 16.6825 6.62489 17.5478C7.91993 18.4131 9.44248 18.875 11 18.875C13.0879 18.8728 15.0896 18.0424 16.566 16.566C18.0424 15.0896 18.8728 13.0879 18.875 11ZM7.00063 8.5625L10.3756 10.8125C10.5605 10.9358 10.7778 11.0017 11 11.0017C11.2222 11.0017 11.4395 10.9358 11.6244 10.8125L14.9994 8.5625C15.248 8.39691 15.4207 8.13932 15.4794 7.84641C15.5381 7.5535 15.4781 7.24927 15.3125 7.00062C15.1469 6.75198 14.8893 6.57931 14.5964 6.52059C14.3035 6.46187 13.9993 6.52191 13.7506 6.6875L11 8.52313L8.24938 6.6875C8.00074 6.52191 7.6965 6.46187 7.40359 6.52059C7.11068 6.57931 6.8531 6.75198 6.6875 7.00062C6.52191 7.24927 6.46187 7.5535 6.52059 7.84641C6.57931 8.13932 6.75199 8.39691 7.00063 8.5625ZM13.4375 14.6675C12.6993 14.2312 11.8575 14.001 11 14.001C10.1425 14.001 9.30071 14.2312 8.5625 14.6675C8.42806 14.7378 8.30923 14.8346 8.21317 14.9521C8.11711 15.0695 8.04579 15.2052 8.00352 15.3509C7.96124 15.4966 7.94888 15.6494 7.96718 15.8C7.98547 15.9506 8.03405 16.096 8.10998 16.2273C8.18591 16.3587 8.28763 16.4733 8.40902 16.5644C8.5304 16.6554 8.66895 16.7209 8.81632 16.757C8.96369 16.7931 9.11684 16.7991 9.26656 16.7744C9.41627 16.7498 9.55946 16.6951 9.6875 16.6138C10.0837 16.3751 10.5375 16.2489 11 16.2489C11.4625 16.2489 11.9163 16.3751 12.3125 16.6138C12.4405 16.6951 12.5837 16.7498 12.7335 16.7744C12.8832 16.7991 13.0363 16.7931 13.1837 16.757C13.3311 16.7209 13.4696 16.6554 13.591 16.5644C13.7124 16.4733 13.8141 16.3587 13.89 16.2273C13.966 16.096 14.0145 15.9506 14.0328 15.8C14.0511 15.6494 14.0388 15.4966 13.9965 15.3509C13.9542 15.2052 13.8829 15.0695 13.7868 14.9521C13.6908 14.8346 13.5719 14.7378 13.4375 14.6675Z"
                            fill="#C72030"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-[#C72030]">
                          {surveyData.negative_responses || 0}
                        </p>
                        <p className="text-sm text-gray-600">Negative</p>
                        {Object.keys(summaryCurrentFilters).length > 0 && (
                          <p className="text-xs text-gray-500">
                            Filtered data shown
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Placeholder for 4th card (optional) */}
              </div>

              {/* Overall Question Response Distribution - Hide if no data */}
              {(() => {
                const responseData =
                  typeof getResponseDistributionData === "function"
                    ? getResponseDistributionData()
                    : [];
                // Hide card if no meaningful data (only shows "No data available")
                if (
                  !responseData ||
                  responseData.length === 0 ||
                  (responseData.length === 1 &&
                    responseData[0].name === "No data available")
                ) {
                  return null;
                }

                return (
                  <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7] my-pdf-card">
                    <CardHeader className="bg-[#F6F4EE] mb-6">
                      <CardTitle className="text-lg flex items-center">
                        <div className="w-9 h-9 bg-[#C7203014] text-white rounded-full flex items-center justify-center mr-3">
                          <HelpCircle className="h-4 w-4 text-[#C72030]" />
                        </div>
                        <span className="header-text">Overall Question Response Distribution</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SurveyAnalyticsCard
                        title="Overall Question Response Distribution"
                        type="statusDistribution"
                        data={responseData}
                        dateRange={{
                          startDate: new Date(
                            Date.now() - 30 * 24 * 60 * 60 * 1000
                          ),
                          endDate: new Date(),
                        }}
                        onDownload={
                          typeof handleDownloadResponseChart === "function"
                            ? handleDownloadResponseChart
                            : undefined
                        }
                        customStyle={{
                          pieChart: {
                            outerRadius: 140,
                            innerRadius: 90,
                            height: 300,
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Overall Response Distribution */}
              {/* <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
                <CardHeader className="bg-[#F6F4EE] mb-6">
                  <CardTitle className="text-lg flex items-center">
                    <div className="w-9 h-9 bg-[#C7203014] text-white rounded-full flex items-center justify-center mr-3">
                      <HelpCircle className="h-4 w-4 text-[#C72030]" />
                    </div>
                    
                    Q2.
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SurveyAnalyticsCard
                    title="Rate Your Experience"
                    type="statusDistribution"
                    data={getResponseDistributionData()}
                    dateRange={{
                      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                      endDate: new Date(),
                    }}
                    onDownload={handleDownloadResponseChart}
                  />
                </CardContent>
              </Card> */}

              {/* Emoji Response Summary */}

              {/* Questions Response Details - Now individual cards are created for each question type below */}

              {(() => {
                // Get all questions from survey details in their original order
                const surveyDetails =
                  surveyDetailsData?.survey_details?.surveys?.[0];
                const allQuestions = surveyDetails?.questions || [];

                // Filter questions that have responses and should be displayed
                const questionsWithResponses = allQuestions.filter(
                  (question: SurveyQuestion) => {
                    const totalResponses =
                      question.options?.reduce(
                        (sum, option) => sum + option.response_count,
                        0
                      ) || 0;
                    return totalResponses > 0;
                  }
                );

                if (questionsWithResponses.length === 0) {
                  return null;
                }

                return questionsWithResponses
                  .map((question: SurveyQuestion, questionIndex: number) => {
                    const totalResponses =
                      question.options?.reduce(
                        (sum, option) => sum + option.response_count,
                        0
                      ) || 0;
                    const questionNumber = questionIndex + 1;

                    // Handle emoji questions
                    if (question.qtype === "emoji") {
                      const fixedEmojis = ["😁", "😊", "😐", "😟", "😞"];
                      const displayData =
                        question.options?.map((option, index) => {
                          const emoji = fixedEmojis[index] || "😐";
                          const percentage =
                            totalResponses > 0
                              ? Math.round(
                                (option.response_count / totalResponses) * 100
                              )
                              : 0;
                          return {
                            emoji: emoji,
                            name: option.option || "Unknown",
                            count: option.response_count || 0,
                            percentage: percentage,
                          };
                        }) || [];
                      // Get positive/negative percent from API if present
                      const positivePercent =
                        typeof question.positive_percent === "number"
                          ? question.positive_percent
                          : question.positive_responses ?? null;
                      const negativePercent =
                        typeof question.negative_percent === "number"
                          ? question.negative_percent
                          : question.negative_responses ?? null;
                      return (
                        <Card
                          key={question.question_id}
                          className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7] my-pdf-card"
                        >
                          <CardHeader className="bg-[#F6F4EE] mb-6">
                            <CardTitle className="text-lg flex items-center">
                              <div className="w-9 h-9 bg-[#C7203014] text-white rounded-full flex items-center justify-center mr-3">
                                <HelpCircle className="h-4 w-4 text-[#C72030]" />
                              </div>
                              <span className="text-black font-semibold mr-2 header-text">
                                Q{questionNumber}. 
                              </span>
                              <span className="header-text">{question.question}</span>
                              
                            </CardTitle>
                          </CardHeader>
                          {/* <div className="flex flex-row items-center justify-end gap-6 mb-4 mr-10">
                                  <div className="flex items-center gap-2">
                                    <span className="inline-block w-4 h-4 rounded-full bg-[#A9B7C5] mr-2"></span>
                                    <span className="text-gray-600 font-medium">
                                      Positive:{" "}
                                      {positivePercent != null
                                        ? positivePercent
                                        : 0}
                                      %
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="inline-block w-4 h-4 rounded-full bg-[#C4B99D] mr-2"></span>
                                    <span className="text-gray-600 font-medium">
                                      Negative:{" "}
                                      {negativePercent != null
                                        ? negativePercent
                                        : 0}
                                      %
                                    </span>
                                  </div>
                                </div> */}
                          <CardContent>
                            <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
                              <div className="relative text-center py-6">
                                <div className="absolute top-6 right-8 flex flex-col gap-3">
                                  <div className="flex items-center gap-3" style={{ minWidth: '150px' }}>
                                    <div className="flex items-center gap-2">
                                      <span className="inline-block w-4 h-4 rounded-full bg-[#A9B7C5]" style={{ flexShrink: 0 }}></span>
                                      <span className="text-gray-600 text-sm" style={{ whiteSpace: 'nowrap' }}>Positive:</span>
                                    </div>
                                    <span className="text-gray-600 text-sm font-medium" style={{ marginLeft: 'auto' }}>{positivePercent != null ? positivePercent : 0}%</span>
                                  </div>
                                  <div className="flex items-center gap-3" style={{ minWidth: '150px' }}>
                                    <div className="flex items-center gap-2">
                                      <span className="inline-block w-4 h-4 rounded-full bg-[#C4B99D]" style={{ flexShrink: 0 }}></span>
                                      <span className="text-gray-600 text-sm" style={{ whiteSpace: 'nowrap' }}>Negative:</span>
                                    </div>
                                    <span className="text-gray-600 text-sm font-medium" style={{ marginLeft: 'auto' }}>{negativePercent != null ? negativePercent : 0}%</span>
                                  </div>
                                </div>


                                {displayData.length > 0 ? (
                                  <div className="flex justify-center items-center gap-8 mb-4" style={{ marginTop: '60px', paddingTop: '20px' }}>
                                    {displayData.map((item, index) => (
                                      <div
                                        key={index}
                                        className="flex flex-col items-center"
                                      >
                                        <div className="text-3xl mb-2">
                                          {item.emoji}
                                        </div>
                                        <div className="text-sm font-medium text-gray-700 mb-1 capitalize">
                                          {item.name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {item.percentage}% ({item.count})
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-gray-500">
                                    No responses available for this question
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }

                    // Handle rating questions
                    if (question.qtype === "rating") {
                      const ratingData =
                        question.options?.map((option, index) => {
                          const percentage =
                            totalResponses > 0
                              ? Math.round(
                                (option.response_count / totalResponses) * 100
                              )
                              : 0;

                          return {
                            name: option.option || `Option ${index + 1}`,
                            count: option.response_count || 0,
                            percentage: percentage,
                          };
                        }) || [];

                      // Get positive/negative percent from API if present
                      const positivePercent =
                        typeof question.positive_percent === "number"
                          ? question.positive_percent
                          : question.positive_responses ?? null;
                      const negativePercent =
                        typeof question.negative_percent === "number"
                          ? question.negative_percent
                          : question.negative_responses ?? null;

                      return (
                        <Card
                          key={question.question_id}
                          className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7] my-pdf-card"
                        >
                          <CardHeader className="bg-[#F6F4EE] mb-6">
                            <CardTitle className="text-lg flex items-center">
                              <div className="w-9 h-9 bg-[#C7203014] text-white rounded-full flex items-center justify-center mr-3">
                                <HelpCircle className="h-4 w-4 text-[#C72030]" />
                              </div>
                              <span className="text-black font-semibold mr-2 header-text">
                                Q{questionNumber}.
                              </span>
                              <span className="header-text">
                              {question.question}
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {/* <div className="flex flex-row items-center justify-end gap-6 mb-4 mr-4">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-4 h-4 rounded-full bg-[#A9B7C5] mr-2"></span>
                                <span className="text-gray-600 font-medium">
                                  Positive:{" "}
                                  {positivePercent != null
                                    ? positivePercent
                                    : 0}
                                  %
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-4 h-4 rounded-full bg-[#C4B99D] mr-2"></span>
                                <span className="text-gray-600 font-medium">
                                  Negative:{" "}
                                  {negativePercent != null
                                    ? negativePercent
                                    : 0}
                                  %
                                </span>
                              </div>
                            </div> */}
                            <SurveyAnalyticsCard
                              title="Rating Response"
                              type="surveyDistributions"
                              data={ratingData.map((item) => ({
                                name: item.name,
                                value: item.count,
                                color: "#C4AE9D",
                              }))}
                              positivePercent={positivePercent}
                              negativePercent={negativePercent}
                              dateRange={{
                                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                                endDate: new Date(),
                              }}
                              xAxisLabel="Response Type"
                              yAxisLabel="No. of Responses"
                            />

                          </CardContent>
                        </Card>
                      );
                    }

                    // Handle multiple choice questions
                    if (
                      question.qtype === "multiple" ||
                      (!question.qtype &&
                        !shouldUseBarChart(question.question_id))
                    ) {
                      const multipleChoiceColors = [
                        "#D5DBDB",
                        "#C4B99D",
                        "#DAD6CA",
                      ];
                      const mcData =
                        question.options
                          ?.map((option, index) => {
                            const percentage =
                              totalResponses > 0
                                ? Math.round(
                                  (option.response_count / totalResponses) *
                                  100
                                )
                                : 0;

                            return {
                              name: option.option || `Option ${index + 1}`,
                              value: option.response_count || 0,
                              color:
                                multipleChoiceColors[
                                index % multipleChoiceColors.length
                                ],
                            };
                          })
                          .filter((item) => item.value > 0) || [];

                      return (
                        <Card
                          key={question.question_id}
                          className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7] my-pdf-card"
                        >
                          <CardHeader className="bg-[#F6F4EE] mb-6">
                            <CardTitle className="text-lg flex items-center">
                              <div className="w-9 h-9 bg-[#C7203014] text-white rounded-full flex items-center justify-center mr-3">
                                <HelpCircle className="h-4 w-4 text-[#C72030]" />
                              </div>
                              <span className="text-black font-semibold mr-2 header-text">
                                Q{questionNumber}.
                              </span>
                              <span className="header-text">{question.question}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <SurveyAnalyticsCard
                              title="Response Distribution"
                              type="statusDistribution"
                              data={mcData}
                              dateRange={{
                                startDate: new Date(
                                  Date.now() - 30 * 24 * 60 * 60 * 1000
                                ),
                                endDate: new Date(),
                              }}
                              onDownload={() => {
                                toast.success(
                                  `Chart for multiple choice question "${question.question}" download initiated`
                                );
                              }}
                            />
                          </CardContent>
                        </Card>
                      );
                    }

                    return null;
                  })
                  .filter(Boolean);
              })()}

              {/* Response Category - Hide if no data */}
              {(() => {
                // Get dynamic data from API response
                const surveyDetails =
                  surveyDetailsData?.survey_details?.surveys?.[0];
                const responseCategories =
                  surveyDetails?.response_categories || [];
                const totalComplaints = surveyDetails?.total_complaints || 0;
                const skipped = surveyDetails?.skipped || 0;

                // Calculate total responses from response categories
                const totalCategoryResponses = responseCategories.reduce(
                  (sum, category) => sum + category.responses_count,
                  0
                );

                // Hide card if no response categories
                if (responseCategories.length === 0) {
                  return null;
                }

                return (
                  <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7] my-pdf-card">
                    <CardHeader className="bg-[#F6F4EE] mb-6">
                      <CardTitle className="text-lg flex items-center">
                        <div className="w-9 h-9 bg-[#C7203014] text-white rounded-full flex items-center justify-center mr-3">
                          <HelpCircle className="h-4 w-4 text-[#C72030]" />
                        </div>
                        <span className="header-text">
                        Response by Category
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        return (
                          <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
                            <div className="px-6 py-4 text-sm text-gray-800 flex items-center gap-10">
                              <span>
                                <span className="font-medium">
                                  Total Response:
                                </span>{" "}
                                {totalCategoryResponses}
                              </span>
                              {/* <span>
                            <span className="font-medium">Skipped:</span> {skipped}
                          </span> */}
                              {/* <span>
                            <span className="font-medium">Total Complaints:</span> {totalComplaints}
                          </span> */}
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-t border-b border-gray-300">
                                    <th className="text-left font-semibold px-6 py-3 w-1/2">
                                      Response Category
                                    </th>
                                    <th className="text-left font-semibold px-6 py-3 w-1/4">
                                      Responses
                                    </th>
                                    {/* <th className="text-left font-semibold px-6 py-3 w-1/4">CSAT</th> */}
                                  </tr>
                                </thead>
                                <tbody>
                                  {responseCategories.length > 0 ? (
                                    responseCategories.map((category, idx) => (
                                      <tr
                                        key={category.heading}
                                        className={
                                          idx !== responseCategories.length - 1
                                            ? "border-b border-gray-300"
                                            : ""
                                        }
                                      >
                                        <td className="px-6 py-3 text-gray-800">
                                          {category.heading}
                                        </td>
                                        <td className="px-6 py-3 text-gray-800">
                                          {category.responses_percent.toFixed(
                                            1
                                          )}
                                          % ({category.responses_count})
                                        </td>
                                        {/* <td className="px-6 py-3 text-gray-800">
                                    {r.csat > 0 ? (
                                      <div className="flex items-center gap-3">
                                        <div className="w-20 h-3 bg-gray-200 rounded-sm overflow-hidden">
                                          <div
                                            className="h-3 bg-[#C72030]"
                                            style={{ width: `${(r.csat / maxCsat) * 100}%` }}
                                          />
                                        </div>
                                        <span className="text-gray-800 text-sm">{r.csat}</span>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </td> */}
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td
                                        colSpan={2}
                                        className="px-6 py-8 text-center text-gray-500"
                                      >
                                        No response categories available
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Customer Satisfaction Score - Hide if no data */}
              {(() => {
                // Use API data if available, otherwise hide card
                if (loadingCSAT || !csatData) {
                  return null; // Hide card if loading or no data
                }

                return (
                  <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7] my-pdf-card">
                    <CardHeader className="bg-[#F6F4EE] mb-6">
                      <CardTitle className="text-lg flex items-center">
                        <div className="w-9 h-9 bg-[#C7203014] text-white rounded-full flex items-center justify-center mr-3">
                          <HelpCircle className="h-4 w-4 text-[#C72030]" />
                        </div>
                        <span className="header-text">Customer Satisfaction Score.</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        // Transform API data into chart-ready format
                        const buckets = csatData.buckets || [];
                        const summary = csatData.summary;
                        const dateRangeText = summary.date_range_label;

                        console.log("Processing CSAT data:", {
                          buckets,
                          summary,
                          dateRangeText,
                        });

                        // Create rows for the table
                        type Row = {
                          dateLabel: string;
                          csat: number;
                          changePct: number;
                          negPct: number;
                          negCount: number;
                          posPct: number;
                          posCount: number;
                          total: number;
                          neutral: number;
                        };

                        const rows: Row[] = buckets.map((bucket, index) => {
                          console.log("Processing bucket:", bucket);
                          const total = bucket.total;
                          const prevBucket =
                            index > 0 ? buckets[index - 1] : null;
                          const changePct =
                            prevBucket &&
                              prevBucket.csat !== null &&
                              bucket.csat !== null
                              ? ((bucket.csat - prevBucket.csat) /
                                prevBucket.csat) *
                              100
                              : bucket.change_pct || 0;

                          // Use the percentage values directly from API
                          const negPct = Math.round(bucket.negative_pct || 0);
                          const posPct = Math.round(bucket.positive_pct || 0);

                          const row = {
                            dateLabel:
                              bucket.label ||
                              new Date(bucket.start).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              ),
                            csat: bucket.csat || 0,
                            changePct,
                            negPct,
                            negCount: bucket.negative_count || 0,
                            posPct,
                            posCount: bucket.positive_count || 0,
                            total: bucket.total || 0,
                            neutral: 0, // Not provided in new API, calculate if needed
                          };

                          console.log("Processed row:", row);
                          return row;
                        });

                        // If no buckets data, create a summary row
                        if (rows.length === 0 && summary.responses > 0) {
                          const total = summary.responses;
                          const negPct =
                            total > 0
                              ? Math.round((summary.negative / total) * 100)
                              : 0;
                          const posPct =
                            total > 0
                              ? Math.round((summary.positive / total) * 100)
                              : 0;

                          rows.push({
                            dateLabel: dateRangeText || "Summary",
                            csat: summary.csat_avg || 0,
                            changePct: 0,
                            negPct,
                            negCount: summary.negative,
                            posPct,
                            posCount: summary.positive,
                            total: summary.responses,
                            neutral: summary.neutral,
                          });
                        }

                        const maxTotal = Math.max(
                          1,
                          summary.suggested_y_max ||
                          Math.max(...rows.map((r) => r.total), 1)
                        );
                        const BAR_AREA_HEIGHT = 240;
                        const colorPositive = "#C4AE9D";
                        const colorNegative = "#C72030";

                        const ChangeTag = ({ value }: { value: number }) => {
                          if (value > 0) {
                            return (
                              <span
                                className="ml-2 text-xs px-1.5 py-0.5 rounded border"
                                style={{
                                  background: "#E6F4EA",
                                  color: "#1E7E34",
                                  borderColor: "#B5DFCB",
                                }}
                              >
                                +{value.toFixed(2)}%
                              </span>
                            );
                          }
                          if (value < 0) {
                            return (
                              <span
                                className="ml-2 text-xs px-1.5 py-0.5 rounded border"
                                style={{
                                  background: "#FCE8E6",
                                  color: "#C72030",
                                  borderColor: "#F5C2C7",
                                }}
                              >
                                {value.toFixed(2)}%
                              </span>
                            );
                          }
                          return (
                            <span
                              className="ml-2 text-xs px-1.5 py-0.5 rounded border text-gray-600"
                              style={{
                                background: "#F3F4F6",
                                borderColor: "#E5E7EB",
                              }}
                            >
                              0%
                            </span>
                          );
                        };

                        return (
                          <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
                            {/* Date range */}
                            <div className="px-6 pt-4 text-sm text-gray-700">
                              {dateRangeText}
                            </div>

                            {/* Chart area */}
                            <div className="px-6 pt-4 pb-6">
                              <div
                                className="bg-white"
                                style={{ height: BAR_AREA_HEIGHT + 60 }}
                              >
                                <ResponsiveContainer
                                  width="100%"
                                  height={BAR_AREA_HEIGHT + 40}
                                >
                                  <BarChart
                                    data={rows.map((r) => ({
                                      date: r.dateLabel,
                                      Positive: r.posCount,
                                      Negative: r.negCount,
                                    }))}
                                    margin={{
                                      top: 10,
                                      right: 20,
                                      left: 10,
                                      bottom: 20,
                                    }}
                                  >
                                    <CartesianGrid
                                      vertical={false}
                                      stroke="#E5E7EB"
                                    />
                                    <XAxis
                                      dataKey="date"
                                      tick={{ fontSize: 12, fill: "#6B7280" }}
                                      tickMargin={10}
                                      axisLine={{ stroke: "#9CA3AF" }}
                                    />
                                    <YAxis
                                      domain={[0, maxTotal]}
                                      tick={{ fontSize: 12, fill: "#6B7280" }}
                                      axisLine={{ stroke: "#9CA3AF" }}
                                    />
                                    <Tooltip
                                      formatter={(
                                        val: number,
                                        name: string
                                      ) => [val, name]}
                                    />
                                    <Bar
                                      dataKey="Negative"
                                      stackId="a"
                                      fill="#C72030"
                                      radius={[0, 0, 0, 0]}
                                      barSize={36}
                                    />
                                    <Bar
                                      dataKey="Positive"
                                      stackId="a"
                                      fill="#C4AE9D"
                                      radius={[0, 0, 0, 0]}
                                      barSize={36}
                                    />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            {/* Table */}
                            <div className="px-6 pb-6">
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border border-gray-300">
                                      <th className="text-left font-semibold px-6 py-3 w-1/4">
                                        &nbsp;
                                      </th>
                                      <th className="text-left font-semibold px-6 py-3 w-1/4">
                                        CSAT
                                      </th>
                                      <th className="text-left font-semibold px-6 py-3 w-1/4">
                                        Negative
                                      </th>
                                      <th className="text-left font-semibold px-6 py-3 w-1/4">
                                        Positive
                                      </th>
                                      <th className="text-left font-semibold px-6 py-3 w-[90px]">
                                        Total
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {rows.length > 0 ? (
                                      rows.map((r, idx) => (
                                        <tr
                                          key={idx}
                                          className="border-x border-b border-gray-300"
                                        >
                                          <td className="px-6 py-3 text-gray-800">
                                            {r.dateLabel}
                                          </td>
                                          <td className="px-6 py-3 text-gray-800">
                                            {r.csat.toFixed(2)}{" "}
                                            <ChangeTag value={r.changePct} />
                                          </td>
                                          <td className="px-6 py-3 text-gray-800">
                                            {r.negPct}% ({r.negCount})
                                          </td>
                                          <td className="px-6 py-3 text-gray-800">
                                            {r.posPct}% ({r.posCount})
                                          </td>
                                          <td className="px-6 py-3 text-gray-800">
                                            {r.total}
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr className="border-x border-b border-gray-300">
                                        <td
                                          colSpan={5}
                                          className="px-6 py-8 text-center text-gray-500"
                                        >
                                          No CSAT data available for the
                                          selected period
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                );
              })()}
              {/* Heat Map - Hide if no data */}
              {(() => {
                // Use API data if available, otherwise hide card
                if (loadingHeatMap || !heatMapData) {
                  return null; // Hide card if loading or no data
                }

                return (
                  <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7] my-pdf-card">
                    <CardHeader className="bg-[#F6F4EE] mb-6">
                      <CardTitle className="text-lg flex items-center">
                        <div className="w-9 h-9 bg-[#C7203014] text-white rounded-full flex items-center justify-center mr-3">
                          <HelpCircle className="h-4 w-4 text-[#C72030]" />
                        </div>
                        <span className="header-text">Heat Map</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        // Transform API data into display format
                        const { columns, rows, matrix, totals, scale } =
                          heatMapData;
                        const dates = columns.map((col) => col.label);
                        const hours = rows.map((row) => row.label);

                        console.log("Processing Heat Map data:", {
                          columns,
                          rows,
                          matrix,
                          totals,
                          scale,
                        });

                        // Function to get cell color based on value and scale
                        const getCellColor = (value: number) => {
                          if (value === 0) return "";

                          const { breaks, classes } = scale;
                          let classIndex = 0;

                          for (let i = 0; i < breaks.length - 1; i++) {
                            if (value >= breaks[i] && value < breaks[i + 1]) {
                              classIndex = i;
                              break;
                            }
                          }

                          // If value is >= the last break, use the last class
                          if (value >= breaks[breaks.length - 1]) {
                            classIndex = classes.length - 1;
                          }

                          const className = classes[classIndex];
                          switch (className) {
                            case "light":
                              return "bg-[#E4EAED]";
                            case "dark":
                              return "bg-[#BFCBD3]";
                            default:
                              return "";
                          }
                        };

                        return (
                          <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
                            <div className="px-6 py-4 text-sm text-gray-800 flex items-center gap-10">
                              <span>
                                <span className="font-medium">
                                  Total Response:
                                </span>{" "}
                                {totals.responses}
                              </span>
                              {/* <span>
                            <span className="font-medium">Skipped:</span> {totals.skipped}
                          </span> */}
                            </div>

                            {/* Grid + Time labels */}
                            <div className="relative px-6 pb-6">
                              <div className="flex items-start gap-2">
                                {/* Y-axis time labels */}
                                <div className="w-16 select-none">
                                  {/* Top spacer to align first grid row */}
                                  <div className="h-[36px]" />
                                  {hours.map((h, i) => (
                                    <div
                                      key={h + i}
                                      className="h-[36px] text-xs text-gray-600 flex items-center justify-end"
                                    >
                                      {h}
                                    </div>
                                  ))}
                                </div>

                                {/* Scrollable grid and date footer kept together so they stay in sync */}
                                <div
                                  id="heatmap-scroll"
                                  className="overflow-x-auto border-l border-gray-300"
                                >
                                  <div className="inline-block">
                                    {/* Grid */}
                                    <div
                                      className="grid border-t border-r border-gray-300"
                                      style={{
                                        gridTemplateColumns: `repeat(${dates.length}, 140px)`,
                                        gridTemplateRows: `repeat(${hours.length}, 36px)`,
                                        minWidth: `${dates.length * 140}px`,
                                      }}
                                    >
                                      {/* Column header spacer row */}
                                      {dates.map((_, ci) => (
                                        <div
                                          key={"hdr-" + ci}
                                          className="border-b border-gray-300"
                                        />
                                      ))}

                                      {/* Cells */}
                                      {hours.map((_, ri) =>
                                        dates.map((_, ci) => {
                                          const value = matrix[ri]
                                            ? matrix[ri][ci] || 0
                                            : 0;
                                          const cellColor = getCellColor(value);
                                          return (
                                            <div
                                              key={`c-${ri}-${ci}`}
                                              className={`border-b border-l border-gray-300 ${cellColor} flex items-center justify-center`}
                                              title={
                                                value > 0
                                                  ? `${value} responses at ${hours[ri]} on ${dates[ci]}`
                                                  : undefined
                                              }
                                            >
                                              {value > 0 && (
                                                <span className="text-xs text-gray-700 font-medium">
                                                  {value}
                                                </span>
                                              )}
                                            </div>
                                          );
                                        })
                                      )}
                                    </div>

                                    {/* Date labels row */}
                                    <div
                                      className="grid"
                                      style={{
                                        gridTemplateColumns: `repeat(${dates.length}, 140px)`,
                                      }}
                                    >
                                      {dates.map((d, ci) => (
                                        <div
                                          key={"dl-" + ci}
                                          className="text-xs text-gray-600 py-3 text-center"
                                        >
                                          {d}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right arrow overlay to scroll */}
                              <button
                                type="button"
                                aria-label="Scroll right"
                                onClick={() => {
                                  const el =
                                    document.getElementById("heatmap-scroll");
                                  if (el)
                                    el.scrollBy({
                                      left: 300,
                                      behavior: "smooth",
                                    });
                                }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 shadow rounded-full p-1 border border-gray-200"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          </TabsContent>

          <TabsContent value="tabular" className="">
            {!selectedTabularResponseId ? (
              <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7] mt-5">
                <CardHeader className="bg-[#F6F4EE] mb-6">
                  <CardTitle className="text-lg flex items-center">
                    <div className="w-9 h-9 bg-[#C7203014] text-white rounded-full flex items-center justify-center mr-3">
                      <FileText className="h-4 w-4 text-[#C72030]" />
                    </div>
                    SURVEY RESPONSES
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EnhancedTaskTable
                    data={getDisplayTabularData()}
                    columns={getTabularColumns()}
                    storageKey="survey-response-tabular-v2"
                    exportFileName="survey-responses-tabular"
                    enableSearch={true}
                    searchPlaceholder="Search responses..."
                    emptyMessage={
                      !responseListData
                        ? "Loading response data..."
                        : `No response data available (${getTabularData().length
                        } items processed)`
                    }
                    pagination={true}
                    pageSize={10}
                    className="border border-gray-200 rounded-lg"
                    loading={isLoading}
                    onFilterClick={handleFilterClick}
                    rightActions={
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTabularExport}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    }
                    getItemId={(item: TabularResponseData) => item.id}
                    renderCell={(
                      item: TabularResponseData,
                      columnKey: string
                    ) => {
                      const cellValue =
                        item[columnKey as keyof TabularResponseData];

                      if (columnKey === "action") {
                        return (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setActiveTab("tabular");
                              setSelectedTabularResponseId(
                                String(item.response_id)
                              );
                            }}
                          >
                            <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                          </Button>
                        );
                      }

                      if (columnKey === "category") {
                        const answerType = cellValue as string;
                        if (answerType === "multiple") return "Multiple";
                        if (answerType === "rating") return "Rating";
                        if (answerType === "emoji") return "Emoji";
                        return answerType || "-";
                      }

                      if (
                        columnKey === "icon_category" ||
                        columnKey.startsWith("icon_category_")
                      ) {
                        const iconCategoryValue = cellValue as string;
                        if (!iconCategoryValue || iconCategoryValue === "-") {
                          return <span className="text-gray-400">-</span>;
                        }
                        return (
                          <TruncatedText
                            text={iconCategoryValue}
                            maxLength={15}
                            className="text-gray-900 font-medium"
                          />
                        );
                      }

                      if (columnKey === "ticket_id") {
                        const ticketValue = cellValue as string;
                        if (!ticketValue || ticketValue === "-") {
                          return <span className="text-gray-400">-</span>;
                        }
                        return (
                          <div
                            className="text-black-600 font-medium break-words text-xs leading-tight overflow-hidden"
                            style={{
                              maxWidth: "180px",
                              minWidth: "140px",
                              wordBreak: "break-all",
                              whiteSpace: "normal",
                              lineHeight: "1.2",
                            }}
                          >
                            {ticketValue}
                          </div>
                        );
                      }

                      return cellValue || "-";
                    }}
                  />
                </CardContent>
              </Card>
            ) : (
              <TabularResponseDetailsPage
                inline
                surveyIdProp={String(surveyId)}
                responseIdProp={selectedTabularResponseId}
                onBack={() => setSelectedTabularResponseId(null)}
              />
            )}
          </TabsContent>

          <TabsContent value="tickets" className="mt-5">
            {/* Ticket Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
              {/* Total Tickets */}
              <Card className="bg-[#F6F4EE]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-[#C7203014] flex items-center justify-center rounded-full">
                      <Ticket className="w-5 h-5 text-[#C72030]" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-[#C72030]">
                        {getTicketStatistics().totalTickets}
                      </p>
                      <p className="text-sm text-gray-600">Total Tickets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Open Tickets */}
              <Card className="bg-[#F6F4EE]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-[#C7203014] flex items-center justify-center rounded-full">
                      <Activity className="w-5 h-5 text-[#C72030]" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-[#C72030]">
                        {getTicketStatistics().openTickets}
                      </p>
                      <p className="text-sm text-gray-600">Open Tickets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#F6F4EE]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-[#C7203014] flex items-center justify-center rounded-full">
                      <Settings className="w-5 h-5 text-[#C72030]" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-[#C72030]">
                        {getTicketStatistics().inProgressTickets}
                      </p>
                      <p className="text-sm text-gray-600">In Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#F6F4EE]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-[#C7203014] flex items-center justify-center rounded-full">
                      <Pending className="w-5 h-5 text-[#C72030]" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-[#C72030]">
                        {getTicketStatistics().pendingTickets}
                      </p>
                      <p className="text-sm text-gray-600">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Closed Tickets */}
              <Card className="bg-[#F6F4EE]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-[#C7203014] flex items-center justify-center rounded-full">
                      <FileText className="w-5 h-5 text-[#C72030]" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-[#C72030]">
                        {getTicketStatistics().closedTickets}
                      </p>
                      <p className="text-sm text-gray-600">Closed Tickets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-9 h-9 bg-[#C7203014] text-white rounded-full flex items-center justify-center mr-3">
                    <Ticket className="h-4 w-4 text-[#C72030]" />
                  </div>
                  SURVEY TICKETS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedTaskTable
                  data={getDisplayTicketData()}
                  columns={getTicketColumns()}
                  storageKey="survey-response-tickets"
                  exportFileName="survey-tickets"
                  enableSearch={true}
                  searchPlaceholder="Search tickets..."
                  emptyMessage={
                    !responseListData
                      ? "Loading ticket data..."
                      : "No tickets available"
                  }
                  pagination={true}
                  pageSize={10}
                  className="border border-gray-200 rounded-lg"
                  loading={isLoading}
                  // onFilterClick={handleFilterClick}
                  getItemId={(item: TicketData) => item.id}
                  renderCell={(item: TicketData, columnKey: string) => {
                    if (columnKey === "ticket_number") {
                      const ticketNumber = item.ticket_number || "-";
                      return (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <TruncatedText text={ticketNumber} maxLength={12} />
                        </span>
                      );
                    }
                    if (columnKey === "status") {
                      return (
                        <span
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor:
                              item.status_detail?.color_code || "#60A8C0",
                            color: "#ffffff",
                          }}
                        >
                          {item.status_detail?.name || item.status || "-"}
                        </span>
                      );
                    }
                    if (columnKey === "priority") {
                      const priority = item.priority || "-";
                      return (
                        <span className="px-2 py-1 rounded-full text-xs font-medium">
                          <TruncatedText text={priority} maxLength={15} />
                        </span>
                      );
                    }
                    if (columnKey === "heading") {
                      // For the title/heading column, apply truncation with hover
                      const heading = item.heading || "-";
                      return (
                        <TruncatedText
                          text={heading}
                          maxLength={20}
                          className="text-gray-900 font-medium"
                        />
                      );
                    }
                    if (columnKey === "assignee") {
                      const assignee = item.assignee || "-";
                      return (
                        <span className="px-2 py-1 rounded-full text-xs font-medium">
                          <TruncatedText text={assignee} maxLength={15} />
                        </span>
                      );
                    }
                    // Handle escalation columns using the helper functions
                    if (columnKey === 'response_tat') {
                      return formatEscalationMinutes(item.next_response_escalation);
                    }
                    if (columnKey === 'response_time') {
                      return formatEscalationTime(item.next_response_escalation);
                    }
                    if (columnKey === 'escalation_response_name') {
                      return formatEscalationLevel(item.next_response_escalation);
                    }
                    if (columnKey === 'resolution_tat') {
                      return formatEscalationMinutes(item.next_resolution_escalation);
                    }
                    if (columnKey === 'resolution_time') {
                      return formatEscalationTime(item.next_resolution_escalation);
                    }
                    if (columnKey === 'escalation_resolution_name') {
                      return formatEscalationLevel(item.next_resolution_escalation);
                    }
                    // Handle null/undefined values for new columns
                    const value = item[columnKey as keyof TicketData];
                    return value !== null && value !== undefined
                      ? String(value)
                      : "-";
                  }}
                />
              </CardContent>
            </Card>

            {/* Heat Map (Static) */}
          </TabsContent>
        </Tabs>
      </div>

      {/* Export Modal */}
      {ExportModal}

      {/* Filter Modal */}
      {FilterModal}
    </div>
  );
};
