import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Filter, List, FileText, Search, ArrowLeft, Smile, X } from "lucide-react";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { getFullUrl, API_CONFIG } from "@/config/apiConfig";
import { apiClient } from '@/utils/apiClient';
import { toast } from "sonner";
import { EmojiEmotions } from "@mui/icons-material";

interface ResponseComplaint {
  complaint_id: number;
  ticket_number: string;
  icon_category?: string;
}

interface ResponseAnswer {
  answer_id: number;
  question_id: number;
  question_name: string;
  answer_type: string;
  option_name?: string;
  comments?: string;
  complaints: ResponseComplaint[];
}

interface ResponseLocation {
  site_name: string;
  building_name: string;
  wing_name: string;
  floor_name: string;
  area_name: string;
  room_name: string;
}

interface SurveyResponse {
  response_id: number;
  responded_time: string;
  mapping_id: number;
  survey_id: number;
  survey_name: string;
  questions_count: number;
  complaints_count: number;
  location: ResponseLocation;
  answers: ResponseAnswer[];
}

interface ResponseListData {
  responses: SurveyResponse[];
}

// Filter interface for responses
interface ResponseFilters {
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  siteId?: string;
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

const formatDateTime = (ts?: string) => {
  if (!ts) return "-";
  try {
    const d = new Date(ts);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day}/${month}/${year}, ${hours}:${minutes}${ampm}`;
  } catch {
    return ts;
  }
};

export interface TabularResponseDetailsProps {
  surveyIdProp?: string;
  responseIdProp?: string;
  inline?: boolean;
  onBack?: () => void;
}

export default function TabularResponseDetailsPage({
  surveyIdProp,
  responseIdProp,
  inline = false,
  onBack,
}: TabularResponseDetailsProps) {
  const routeParams = useParams();
  const surveyId = surveyIdProp ?? routeParams.surveyId;
  const responseId = responseIdProp ?? routeParams.responseId;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<SurveyResponse | null>(null);
  const [search, setSearch] = useState("");

  // Filter state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<ResponseFilters>({});
  const [formFilters, setFormFilters] = useState<ResponseFilters>({});

  // Location dropdown data and loading states
  const [sites, setSites] = useState<SiteItem[]>([]);
  const [buildings, setBuildings] = useState<BuildingItem[]>([]);
  const [wings, setWings] = useState<WingItem[]>([]);
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [floors, setFloors] = useState<FloorItem[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);

  const [loadingSites, setLoadingSites] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Local state for date inputs
  const [localFromDate, setLocalFromDate] = useState("");
  const [localToDate, setLocalToDate] = useState("");

  // API fetch functions for location dropdowns
  const fetchSites = useCallback(async () => {
    if (!showFilterModal) return;

    console.log('Fetching sites API call started...');
    setLoadingSites(true);
    try {
      const response = await apiClient.get('/pms/sites.json');
      console.log('Sites API response:', response.data);

      const sitesData = Array.isArray(response.data?.sites) ? response.data.sites : [];
      console.log('Setting sites data:', sitesData);
      setSites(sitesData);
    } catch (error) {
      console.error('Error fetching sites:', error);
      setSites([]);
      toast.error('Failed to load sites');
    } finally {
      setLoadingSites(false);
    }
  }, [showFilterModal]);

  const fetchBuildings = useCallback(async (siteId: string) => {
    if (!siteId) {
      setBuildings([]);
      return;
    }

    console.log('Fetching buildings for site:', siteId);
    setLoadingBuildings(true);
    try {
      const response = await apiClient.get(`/pms/sites/${siteId}/buildings.json`);
      console.log('Buildings API response:', response.data);

      // Extract buildings directly from the array
      const buildingsData = Array.isArray(response.data?.buildings)
        ? response.data.buildings
        : [];
      console.log('Setting buildings data:', buildingsData);
      setBuildings(buildingsData);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      setBuildings([]);
      toast.error('Failed to load buildings');
    } finally {
      setLoadingBuildings(false);
    }
  }, []);

  const fetchWings = useCallback(async (buildingId: string) => {
    if (!buildingId) {
      setWings([]);
      return;
    }

    console.log('Fetching wings for building:', buildingId);
    setLoadingWings(true);
    try {
      const response = await apiClient.get(`/pms/buildings/${buildingId}/wings.json`);
      console.log('Wings API response:', response.data);

      // Extract wings from nested structure: [].wings
      const wingsData = Array.isArray(response.data)
        ? response.data.map((item: { wings?: WingItem }) => item.wings).filter(Boolean) as WingItem[]
        : [];
      console.log('Setting wings data:', wingsData);
      setWings(wingsData);
    } catch (error) {
      console.error('Error fetching wings:', error);
      setWings([]);
      toast.error('Failed to load wings');
    } finally {
      setLoadingWings(false);
    }
  }, []);

  const fetchAreas = useCallback(async (wingId: string) => {
    if (!wingId) {
      setAreas([]);
      return;
    }

    console.log('Fetching areas for wing:', wingId);
    setLoadingAreas(true);
    try {
      const response = await apiClient.get(`/pms/wings/${wingId}/areas.json`);
      console.log('Areas API response:', response.data);

      const areasData = Array.isArray(response.data?.areas) ? response.data.areas : [];
      console.log('Setting areas data:', areasData);
      setAreas(areasData);
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
      toast.error('Failed to load areas');
    } finally {
      setLoadingAreas(false);
    }
  }, []);

  const fetchFloors = useCallback(async (areaId: string) => {
    if (!areaId) {
      setFloors([]);
      return;
    }

    console.log('Fetching floors for area:', areaId);
    setLoadingFloors(true);
    try {
      const response = await apiClient.get(`/pms/areas/${areaId}/floors.json`);
      console.log('Floors API response:', response.data);

      const floorsData = Array.isArray(response.data?.floors) ? response.data.floors : [];
      console.log('Setting floors data:', floorsData);
      setFloors(floorsData);
    } catch (error) {
      console.error('Error fetching floors:', error);
      setFloors([]);
      toast.error('Failed to load floors');
    } finally {
      setLoadingFloors(false);
    }
  }, []);

  const fetchRooms = useCallback(async (floorId: string) => {
    if (!floorId) {
      setRooms([]);
      return;
    }

    console.log('Fetching rooms for floor:', floorId);
    setLoadingRooms(true);
    try {
      const response = await apiClient.get(`/pms/floors/${floorId}/rooms.json`);
      console.log('Rooms API response:', response.data);

      // Extract rooms from nested structure: [].rooms
      const roomsData = Array.isArray(response.data)
        ? response.data.map((item: { rooms?: RoomItem }) => item.rooms).filter(Boolean) as RoomItem[]
        : [];
      console.log('Setting rooms data:', roomsData);
      setRooms(roomsData);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
      toast.error('Failed to load rooms');
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  // Load sites when opening the filter modal
  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  // Fetch buildings when site changes
  useEffect(() => {
    const fetchBuildingsEffect = async () => {
      if (!formFilters.siteId) {
        setBuildings([]);
        setFormFilters(prev => ({
          ...prev,
          buildingId: undefined,
          wingId: undefined,
          areaId: undefined,
          floorId: undefined,
          roomId: undefined,
        }));
        return;
      }

      await fetchBuildings(formFilters.siteId);
    };

    fetchBuildingsEffect();
  }, [formFilters.siteId, fetchBuildings]);

  // Fetch wings when building changes
  useEffect(() => {
    const fetchWingsEffect = async () => {
      if (!formFilters.buildingId) {
        setWings([]);
        setFormFilters(prev => ({
          ...prev,
          wingId: undefined,
          areaId: undefined,
          floorId: undefined,
          roomId: undefined,
        }));
        return;
      }

      await fetchWings(formFilters.buildingId);
    };

    fetchWingsEffect();
  }, [formFilters.buildingId, fetchWings]);

  // Fetch areas when wing changes
  useEffect(() => {
    const fetchAreasEffect = async () => {
      if (!formFilters.wingId) {
        setAreas([]);
        setFormFilters(prev => ({
          ...prev,
          areaId: undefined,
          floorId: undefined,
          roomId: undefined,
        }));
        return;
      }

      await fetchAreas(formFilters.wingId);
    };

    fetchAreasEffect();
  }, [formFilters.wingId, fetchAreas]);

  // Fetch floors when area changes
  useEffect(() => {
    const fetchFloorsEffect = async () => {
      if (!formFilters.areaId) {
        setFloors([]);
        setFormFilters(prev => ({
          ...prev,
          floorId: undefined,
          roomId: undefined,
        }));
        return;
      }

      await fetchFloors(formFilters.areaId);
    };

    fetchFloorsEffect();
  }, [formFilters.areaId, fetchFloors]);

  // Fetch rooms when floor changes
  useEffect(() => {
    const fetchRoomsEffect = async () => {
      if (!formFilters.floorId) {
        setRooms([]);
        return;
      }

      await fetchRooms(formFilters.floorId);
    };

    fetchRoomsEffect();
  }, [formFilters.floorId, fetchRooms]);

  // Field styles for MUI components
  const fieldStyles = useMemo(() => ({
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  }), []);

  const selectMenuProps = useMemo(() => ({
    PaperProps: {
      style: {
        maxHeight: 224,
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 9999,
      },
    },
    // Prevent focus conflicts with Dialog - same as AssetFilterDialog
    disablePortal: false,
    disableAutoFocus: true,
    disableEnforceFocus: true,
  }), []);

  useEffect(() => {
    const fetchSingleResponse = async () => {
      if (!surveyId || !responseId) return;
      try {
        setLoading(true);
        const baseUrl = getFullUrl(`/survey_mappings/response_list.json`);
        const url = new URL(baseUrl);
        url.searchParams.append("survey_id", String(surveyId));
        url.searchParams.append("token", API_CONFIG.TOKEN || "");

        const res = await fetch(url.toString(), { method: "GET" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ResponseListData = await res.json();
        const found = (data.responses || []).find(
          r => String(r.response_id) === String(responseId)
        );
        setResponse(found || null);
        if (!found) {
          toast.error("Response not found");
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to load response details");
      } finally {
        setLoading(false);
      }
    };
    fetchSingleResponse();
  }, [surveyId, responseId]);

  // Sync local date state with form filters when modal opens
  useEffect(() => {
    if (showFilterModal) {
      setLocalFromDate(
        formFilters.dateRange?.from
          ? formFilters.dateRange.from.toISOString().split("T")[0]
          : ""
      );
      setLocalToDate(
        formFilters.dateRange?.to
          ? formFilters.dateRange.to.toISOString().split("T")[0]
          : ""
      );
    }
  }, [showFilterModal, formFilters]);

  // Date handlers
  const handleFromDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalFromDate(value);
      
      setFormFilters(prev => ({
        ...prev,
        dateRange: {
          ...prev.dateRange,
          from: value ? new Date(value) : undefined
        }
      }));
    },
    []
  );

  const handleToDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalToDate(value);
      
      setFormFilters(prev => ({
        ...prev,
        dateRange: {
          ...prev.dateRange,
          to: value ? new Date(value) : undefined
        }
      }));
    },
    []
  );

  // Filter handlers
  const handleFilterClick = useCallback(() => {
    setFormFilters({ ...currentFilters });
    setShowFilterModal(true);
  }, [currentFilters]);

  const handleApplyFilters = useCallback(async () => {
    setCurrentFilters({ ...formFilters });
    setShowFilterModal(false);
    toast.success("Filters applied successfully");
  }, [formFilters]);

  const handleClearFilters = useCallback(async () => {
    // Clear all form fields
    const emptyFilters: ResponseFilters = {};
    setFormFilters(emptyFilters);
    setCurrentFilters(emptyFilters);
    setLocalFromDate("");
    setLocalToDate("");

    // Clear dependent data arrays
    setBuildings([]);
    setWings([]);
    setAreas([]);
    setFloors([]);
    setRooms([]);

    setShowFilterModal(false);
    toast.success("Filters cleared");
  }, []);

  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (currentFilters.dateRange?.from || currentFilters.dateRange?.to) count++;
    if (currentFilters.siteId) count++;
    if (currentFilters.buildingId) count++;
    if (currentFilters.wingId) count++;
    if (currentFilters.areaId) count++;
    if (currentFilters.floorId) count++;
    if (currentFilters.roomId) count++;
    return count;
  }, [currentFilters]);

  const hasActiveFilters = useCallback(
    () => getActiveFiltersCount() > 0,
    [getActiveFiltersCount]
  );

  // Memoized date values
  const minDateValue = useMemo(() => {
    return localFromDate || undefined;
  }, [localFromDate]);

  // Handle change functions similar to AssetFilterDialog
  const handleSiteChange = (value: string) => {
    setFormFilters(prev => ({
      ...prev,
      siteId: value || undefined,
      buildingId: undefined,
      wingId: undefined,
      areaId: undefined,
      floorId: undefined,
      roomId: undefined,
    }));
  };

  const handleBuildingChange = (value: string) => {
    setFormFilters(prev => ({
      ...prev,
      buildingId: value || undefined,
      wingId: undefined,
      areaId: undefined,
      floorId: undefined,
      roomId: undefined,
    }));
  };

  const handleWingChange = (value: string) => {
    setFormFilters(prev => ({
      ...prev,
      wingId: value || undefined,
      areaId: undefined,
      floorId: undefined,
      roomId: undefined,
    }));
  };

  const handleAreaChange = (value: string) => {
    setFormFilters(prev => ({
      ...prev,
      areaId: value || undefined,
      floorId: undefined,
      roomId: undefined,
    }));
  };

  const handleFloorChange = (value: string) => {
    setFormFilters(prev => ({
      ...prev,
      floorId: value || undefined,
      roomId: undefined,
    }));
  };

  const handleRoomChange = (value: string) => {
    setFormFilters(prev => ({
      ...prev,
      roomId: value || undefined,
    }));
  };

  const ticketsJoined = useMemo(() => {
    if (!response) return "-";
    const tks: string[] = [];
    response.answers?.forEach(a => {
      a.complaints?.forEach(c => {
        if (c.ticket_number) tks.push(c.ticket_number);
      });
    });
    const uniq = Array.from(new Set(tks));
    return uniq.length ? uniq.join(", ") : "-";
  }, [response]);

  const filteredAnswers = useMemo(() => {
    if (!response?.answers) return [];
    if (!search.trim()) return response.answers;
    const q = search.toLowerCase();
    return response.answers.filter(a =>
      a.question_name?.toLowerCase().includes(q) ||
      a.option_name?.toLowerCase().includes(q) ||
      a.comments?.toLowerCase().includes(q) ||
      (a.complaints || []).some(c => c.icon_category?.toLowerCase().includes(q) || c.ticket_number?.toLowerCase().includes(q))
    );
  }, [response, search]);

  return (
    <div className={`${inline ? "p-0" : "p-4 sm:p-6"} ${inline ? "" : "min-h-screen"}`}>
      {/* <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (onBack ? onBack() : navigate(-1))}
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">
            {response?.survey_name || "Survey Response"}
          </h1>
        </div>
      </div> */}

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-6">
        <Card className="bg-[#F6F4EE]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#C7203014] flex items-center justify-center rounded-full">
                <Smile className="w-5 h-5 text-[#C72030]" />
              </div>
              <div>
        <p className="text-xl font-semibold text-[#C72030]">
          {/* {surveyData.questions?.length || 0} */} 1
        </p>
        <p className="text-sm text-gray-600">Positive</p>
        {/* {Object.keys(summaryCurrentFilters).length > 0 && (
          <p className="text-xs text-gray-500">All questions shown</p>
        )} */}
      </div>
            </div>
          </CardContent>
        </Card>
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
          {/* {surveyData.questions?.length || 0} */} 1
        </p>
        <p className="text-sm text-gray-600">Negative</p>
        {/* {Object.keys(summaryCurrentFilters).length > 0 && (
          <p className="text-xs text-gray-500">All questions shown</p>
        )} */}
      </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          title="Filter"
          onClick={handleFilterClick}
          className={`relative ${hasActiveFilters() ? "border-[#C72030] text-[#C72030]" : ""}`}
        >
          <Filter className="w-4 h-4" />
          {hasActiveFilters() && (
            <div className="absolute -top-1 -right-1 bg-[#C72030] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getActiveFiltersCount()}
            </div>
          )}
        </Button>
        <Button variant="outline" size="icon" title="Export">
          <Download className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" title="View">
          <List className="w-4 h-4" />
        </Button>
      </div>

      {/* Survey Response Detail */}
      <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className="bg-[#F6F4EE] mb-2">
          <CardTitle className="text-lg flex items-center">
            <div className="w-8 h-8 bg-[#E5E0D3] text-white rounded-full flex items-center justify-center mr-3">
              <FileText className="h-4 w-4 text-[#C72030]" />
            </div>
            Survey Response Detail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-10">
            <div className="text-sm text-gray-600">
              <div>Response ID</div>
              <div className="font-semibold text-gray-900">{response?.response_id ?? "-"}</div>
            </div>
            <div className="text-sm text-gray-600">
              <div>Wing</div>
              <div className="font-semibold text-gray-900">{response?.location?.wing_name ?? "-"}</div>
            </div>
            <div className="text-sm text-gray-600">
              <div>Room</div>
              <div className="font-semibold text-gray-900">{response?.location?.room_name ?? "-"}</div>
            </div>

            <div className="text-sm text-gray-600">
              <div>Time</div>
              <div className="font-semibold text-gray-900">{formatDateTime(response?.responded_time)}</div>
            </div>
            <div className="text-sm text-gray-600">
              <div>Area</div>
              <div className="font-semibold text-gray-900">{response?.location?.area_name ?? "-"}</div>
            </div>
            <div className="text-sm text-gray-600">
              <div>Ticket Id</div>
              <div className="font-semibold text-gray-900 break-words">{ticketsJoined}</div>
            </div>

            <div className="text-sm text-gray-600">
              <div>Building</div>
              <div className="font-semibold text-gray-900">{response?.location?.building_name ?? "-"}</div>
            </div>
            <div className="text-sm text-gray-600">
              <div>Floor</div>
              <div className="font-semibold text-gray-900">{response?.location?.floor_name ?? "-"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers Table */}
      <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className="bg-[#F6F4EE] mb-2">
          <CardTitle className="text-lg flex items-center">
            <div className="w-8 h-8 bg-[#E5E0D3] text-white rounded-full flex items-center justify-center mr-3">
              <FileText className="h-4 w-4 text-[#C72030]" />
            </div>
            Survey Responses detail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Rate your experience</TableHead>
                  <TableHead>Issue Icon</TableHead>
                  <TableHead>Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">Loading...</TableCell>
                  </TableRow>
                ) : !response || !filteredAnswers.length ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-gray-500">No data</TableCell>
                  </TableRow>
                ) : (
                  filteredAnswers.map((ans) => (
                    <TableRow key={ans.answer_id}>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={ans.question_name}>{ans.question_name}</div>
                      </TableCell>
                      <TableCell>
                        {ans.option_name || "-"}
                      </TableCell>
                      <TableCell>
                        {ans.complaints && ans.complaints.length > 0
                          ? ans.complaints
                              .map((c) => c.icon_category)
                              .filter(Boolean)
                              .join(", ")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {ans.comments || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Filter Modal */}
      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal} modal={false}>
        <DialogContent
          className="max-w-4xl bg-white max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-900">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilterModal(false)}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>

          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Date Range Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#C72030]">Date Range</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <TextField
                  label="From Date"
                  type="date"
                  value={localFromDate}
                  onChange={handleFromDateChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
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
                />
              </div>
            </div>

            {/* Location Details Section */}
            <div>
              <h3 className="text-sm font-medium text-[#C72030] mb-4">Location Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Site</InputLabel>
                  <MuiSelect
                    label="Site"
                    value={formFilters.siteId ?? ""}
                    onChange={(e) => handleSiteChange(e.target.value)}
                    displayEmpty
                    disabled={loadingSites}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value=""><em>Select Site</em></MenuItem>
                    {sites.map((siteItem) => (
                      <MenuItem key={siteItem.id} value={siteItem.id?.toString() || ''}>
                        {siteItem.name || 'Unknown Site'}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Building</InputLabel>
                  <MuiSelect
                    label="Building"
                    value={formFilters.buildingId ?? ""}
                    onChange={(e) => handleBuildingChange(e.target.value)}
                    displayEmpty
                    disabled={loadingBuildings || !formFilters.siteId}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value=""><em>Select Building</em></MenuItem>
                    {buildings.map((buildingItem) => (
                      <MenuItem key={buildingItem.id} value={buildingItem.id?.toString() || ''}>
                        {buildingItem.name || 'Unknown Building'}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Wing</InputLabel>
                  <MuiSelect
                    label="Wing"
                    value={formFilters.wingId ?? ""}
                    onChange={(e) => handleWingChange(e.target.value)}
                    displayEmpty
                    disabled={loadingWings || !formFilters.buildingId}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value=""><em>Select Wing</em></MenuItem>
                    {wings.map((wingItem) => (
                      <MenuItem key={wingItem.id} value={wingItem.id?.toString() || ''}>
                        {wingItem.name || 'Unknown Wing'}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Area</InputLabel>
                  <MuiSelect
                    label="Area"
                    value={formFilters.areaId ?? ""}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    displayEmpty
                    disabled={loadingAreas || !formFilters.wingId}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value=""><em>Select Area</em></MenuItem>
                    {areas.map((areaItem) => (
                      <MenuItem key={areaItem.id} value={areaItem.id?.toString() || ''}>
                        {areaItem.name || 'Unknown Area'}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Floor</InputLabel>
                  <MuiSelect
                    label="Floor"
                    value={formFilters.floorId ?? ""}
                    onChange={(e) => handleFloorChange(e.target.value)}
                    displayEmpty
                    disabled={loadingFloors || !formFilters.areaId}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value=""><em>Select Floor</em></MenuItem>
                    {floors.map((floorItem) => (
                      <MenuItem key={floorItem.id} value={floorItem.id?.toString() || ''}>
                        {floorItem.name || 'Unknown Floor'}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Room</InputLabel>
                  <MuiSelect
                    label="Room"
                    value={formFilters.roomId ?? ""}
                    onChange={(e) => handleRoomChange(e.target.value)}
                    displayEmpty
                    disabled={loadingRooms || !formFilters.floorId}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value=""><em>Select Room</em></MenuItem>
                    {rooms.map((roomItem) => (
                      <MenuItem key={roomItem.id} value={roomItem.id?.toString() || ''}>
                        {roomItem.name || 'Unknown Room'}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
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
    </div>
  );
}
