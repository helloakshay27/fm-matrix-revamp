import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, X, Download, User, Ticket, Settings, FileText, Users, AlertTriangle, Building, DollarSign, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/utils/apiClient";
import { getToken, getUser } from "@/utils/auth";
import { API_CONFIG, getFullUrl, getAuthHeader } from "@/config/apiConfig";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHelpdeskCategories } from "@/store/slices/helpdeskCategoriesSlice";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

interface SelectedTicket {
  id: number;
  ticket_number: string;
  heading: string;
  category_type: string;
  sub_category_type: string;
  site_name: string;
  posted_by: string;
  assigned_to: string | null;
  issue_status: string;
  priority: string;
  created_at: string;
  issue_type: string;
  complaint_mode: string;
  service_or_asset: string | null;
  asset_task_occurrence_id: string | null;
  proactive_reactive: string | null;
  review_tracking_date: string | null;
}

interface ComplaintStatus {
  id: number;
  society_id: number;
  name: string;
  color_code: string;
  fixed_state: string;
  active: number;
  created_at: string;
  updated_at: string;
  position: number;
  of_phase: string;
  of_atype: string;
  email: boolean;
}

interface FMUser {
  id: number;
  full_name: string;
}

interface SubCategory {
  id: number;
  name: string;
}

interface ComplaintMode {
  id: number;
  name: string;
}

interface AssetOption {
  id: number;
  name: string;
}

interface ServiceOption {
  id: number;
  service_name: string;
}

// Add location interfaces
interface AreaResponse {
  id: number;
  name: string;
  wing_id: string;
  building_id: string;
  wing?: {
    id: number;
    name: string;
  };
  building?: {
    id: number;
    name: string;
  };
}

interface BuildingResponse {
  id: number;
  name: string;
  site_id: string;
  wings?: Array<{
    id: number;
    name: string;
  }>;
  areas?: Array<{
    id: number;
    name: string;
    wing_id: string;
  }>;
}

interface WingResponse {
  id: number;
  name: string;
  building_id: string;
  building?: {
    id: number;
    name: string;
  };
}

interface FloorResponse {
  id: number;
  name: string;
  wing_id: number;
  area_id: number;
  building_id: string;
  wing?: {
    id: number;
    name: string;
  };
  area?: {
    id: number;
    name: string;
  };
}

interface RoomResponse {
  id: number;
  name: string;
  floor_id: number;
  wing_id: number;
  area_id: string;
  building_id: string;
}

const UpdateTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { data: helpdeskData, loading: helpdeskLoading } = useAppSelector(
    (state) => state.helpdeskCategories
  );

  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    responsiblePerson: "",
    proactiveReactive: "",
    adminPriority: "",
    severity: "",
    softClose: "",
    refNumber: "",
    issueRelatedTo: "",
    associatedTo: { asset: false, service: false },
    comments: "",
    cost: "",
    description: "",
    preventiveAction: "",
    reviewTracking: "",
    categoryType: "",
    complaintType: "",
    subCategoryType: "",
    externalPriority: "",
    impact: "",
    correctiveAction: "",
    assignTo: "",
    mode: "",
    serviceType: "",
    costInvolved: false,
    selectedStatus: "",
    rootCause: "",
    rootCauseTemplateIds: [] as number[], // Store template IDs for API submission
    preventiveActionTemplateIds: [] as number[], // Store preventive action template IDs
    correctiveActionTemplateIds: [] as number[], // Store corrective action template IDs
    shortTermImpactTemplateIds: [] as number[], // Store short-term impact template IDs
    longTermImpactTemplateIds: [] as number[], // Store long-term impact template IDs
    correction: "",
    selectedAsset: "",
    selectedService: "",
    shortTermImpact: "",
    longTermImpact: "",
    // Add location fields
    area: '',
    building: '',
    wing: '',
    floor: '',
    room: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [complaintStatuses, setComplaintStatuses] = useState<ComplaintStatus[]>(
    []
  );
  const [fmUsers, setFmUsers] = useState<FMUser[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const [complaintModes, setComplaintModes] = useState<ComplaintMode[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showCostPopup, setShowCostPopup] = useState(false);
  const [costPopupData, setCostPopupData] = useState({
    cost: "",
    description: "",
    attachments: [] as File[],
  });
  const [assetOptions, setAssetOptions] = useState<AssetOption[]>([]);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [reviewDate, setReviewDate] = useState<string>(""); // Changed to string for date input
  const [ticketApiData, setTicketApiData] = useState<any>(null); // Store original API data
  const [communicationTemplates, setCommunicationTemplates] = useState<Array<{
    id: number;
    identifier: string;
    identifier_action: string;
    body: string;
    active?: boolean;
  }>>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [costApprovalRequests, setCostApprovalRequests] = useState<
    Array<{
      id: string;
      amount: string;
      comments: string;
      createdOn: string;
      createdBy: string;
      attachments: File[] | any[];
      approvals?: {
        L1: string;
        L2: string;
        L3: string;
        L4: string;
        L5: string;
      };
      masterStatus?: string;
      cancelledBy?: string;
      action?: any;
      isFromAPI?: boolean; // Add flag to distinguish API data from new requests
    }>
  >([]);
  const [areas, setAreas] = useState<AreaResponse[]>([]);
  const [buildings, setBuildings] = useState<BuildingResponse[]>([]);
  const [wings, setWings] = useState<WingResponse[]>([]);
  const [floors, setFloors] = useState<FloorResponse[]>([]);
  const [rooms, setRooms] = useState<RoomResponse[]>([]);

  // Loading state for locations
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Filtered location state
  const [filteredBuildings, setFilteredBuildings] = useState<BuildingResponse[]>([]);
  const [filteredWings, setFilteredWings] = useState<WingResponse[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<AreaResponse[]>([]);
  const [filteredFloors, setFilteredFloors] = useState<FloorResponse[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomResponse[]>([]);

  // Field styles for Material-UI components
  const fieldStyles = {
    height: '45px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    '& .MuiOutlinedInput-root': {
      height: '45px',
      '& fieldset': {
        borderColor: '#ddd',
      },
      '&:hover fieldset': {
        borderColor: '#C72030',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#C72030',
      },
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': {
        color: '#C72030',
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statusResponse, usersResponse, complaintModesResponse, templatesResponse] =
          await Promise.all([
            apiClient.get("/pms/admin/complaint_statuses.json"),
            apiClient.get("/pms/users/get_escalate_to_users.json"),
            apiClient.get("/pms/admin/complaint_modes.json"),
            apiClient.get(API_CONFIG.ENDPOINTS.COMMUNICATION_TEMPLATES),
          ]);

        setComplaintStatuses(statusResponse.data || []);
        setFmUsers(usersResponse.data.users || []);
        setComplaintModes(complaintModesResponse.data || []);
        setCommunicationTemplates(Array.isArray(templatesResponse.data) ? templatesResponse.data : []);
        console.log("📋 Communication templates loaded:", templatesResponse.data);

        // Load location data
        await loadLocationData();
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load form data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    dispatch(fetchHelpdeskCategories());
  }, [toast, dispatch]);

  // Add location data loading functions
  const loadLocationData = async () => {
    await Promise.all([
      loadAreas(),
      loadBuildings(),
      loadWings(),
      loadFloors(),
      loadRooms()
    ]);
  };

  const loadAreas = async () => {
    setLoadingAreas(true);
    try {
      const url = getFullUrl('/pms/areas.json');
      const options = {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      };
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Failed to fetch areas');
      const data = await response.json();
      setAreas(data.areas || []);
    } catch (error) {
      console.error('Error loading areas:', error);
      toast({
        title: "Error",
        description: "Failed to load areas",
        variant: "destructive"
      });
    } finally {
      setLoadingAreas(false);
    }
  };

  const loadBuildings = async (siteId?: string) => {
    setLoadingBuildings(true);
    try {
      // Use site_id in API call if provided, otherwise load all buildings
      const url = siteId
        ? getFullUrl(`/pms/sites/${siteId}/buildings.json`)
        : getFullUrl('/pms/buildings.json');

      const options = {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      };
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Failed to fetch buildings');
      const data = await response.json();
      setBuildings(data.pms_buildings || data || []);
    } catch (error) {
      console.error('Error loading buildings:', error);
      toast({
        title: "Error",
        description: "Failed to load buildings",
        variant: "destructive"
      });
    } finally {
      setLoadingBuildings(false);
    }
  };

  const loadWings = async (buildingId?: string) => {
    setLoadingWings(true);
    try {
      // Add building_id as query parameter if provided
      const url = buildingId
        ? getFullUrl(`/pms/wings.json?building_id=${buildingId}`)
        : getFullUrl('/pms/wings.json');

      const options = {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      };
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Failed to fetch wings');
      const data = await response.json();
      setWings(data.wings || []);
    } catch (error) {
      console.error('Error loading wings:', error);
      toast({
        title: "Error",
        description: "Failed to load wings",
        variant: "destructive"
      });
    } finally {
      setLoadingWings(false);
    }
  };

  const loadFloors = async (wingId?: string) => {
    setLoadingFloors(true);
    try {
      // Add wing_id as query parameter if provided
      const url = wingId
        ? getFullUrl(`/pms/floors.json?wing_id=${wingId}`)
        : getFullUrl('/pms/floors.json');

      const options = {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      };
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Failed to fetch floors');
      const data = await response.json();
      setFloors(data.floors || []);
    } catch (error) {
      console.error('Error loading floors:', error);
      toast({
        title: "Error",
        description: "Failed to load floors",
        variant: "destructive"
      });
    } finally {
      setLoadingFloors(false);
    }
  };

  const loadRooms = async (floorId?: string) => {
    setLoadingRooms(true);
    try {
      // Add floor_id as query parameter if provided
      const url = floorId
        ? getFullUrl(`/pms/rooms.json?floor_id=${floorId}`)
        : getFullUrl('/pms/rooms.json');

      const options = {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      };
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Failed to fetch rooms');
      const data = await response.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading rooms:', error);
      toast({
        title: "Error",
        description: "Failed to load rooms",
        variant: "destructive"
      });
    } finally {
      setLoadingRooms(false);
    }
  };

  // Handle location changes with cascading API calls
  const handleAreaChange = async (areaId: string) => {
    setFormData(prev => ({
      ...prev,
      area: areaId,
      floor: '',
      room: ''
    }));

    // Clear dependent dropdowns
    setFilteredFloors([]);
    setFilteredRooms([]);

    if (areaId) {
      // Call floors API with area_id parameter
      try {
        setLoadingFloors(true);
        const url = getFullUrl(`/pms/floors.json?area_id=${areaId}`);
        const options = {
          method: 'GET',
          headers: {
            Authorization: getAuthHeader(),
          },
        };
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          setFilteredFloors(data.floors || []);
        }
      } catch (error) {
        console.error('Error loading floors for area:', error);
      } finally {
        setLoadingFloors(false);
      }
    }
  };

  const handleBuildingChange = async (buildingId: string) => {
    setFormData(prev => ({
      ...prev,
      building: buildingId,
      wing: '',
      area: '',
      floor: '',
      room: ''
    }));

    // Clear dependent dropdowns
    setFilteredWings([]);
    setFilteredAreas([]);
    setFilteredFloors([]);
    setFilteredRooms([]);

    if (buildingId) {
      // Call wings API with building_id parameter
      try {
        setLoadingWings(true);
        const url = getFullUrl(`/pms/wings.json?building_id=${buildingId}`);
        const options = {
          method: 'GET',
          headers: {
            Authorization: getAuthHeader(),
          },
        };
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          setFilteredWings(data.wings || []);
        }
      } catch (error) {
        console.error('Error loading wings for building:', error);
      } finally {
        setLoadingWings(false);
      }
    }
  };

  const handleWingChange = async (wingId: string) => {
    setFormData(prev => ({
      ...prev,
      wing: wingId,
      area: '',
      floor: '',
      room: ''
    }));

    // Clear dependent dropdowns
    setFilteredAreas([]);
    setFilteredFloors([]);
    setFilteredRooms([]);

    if (wingId) {
      // Call areas API with wing_id parameter
      try {
        setLoadingAreas(true);
        const url = getFullUrl(`/pms/areas.json?wing_id=${wingId}`);
        const options = {
          method: 'GET',
          headers: {
            Authorization: getAuthHeader(),
          },
        };
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          setFilteredAreas(data.areas || []);
        }
      } catch (error) {
        console.error('Error loading areas for wing:', error);
      } finally {
        setLoadingAreas(false);
      }
    }
  };

  const handleFloorChange = async (floorId: string) => {
    setFormData(prev => ({
      ...prev,
      floor: floorId,
      room: ''
    }));

    // Clear dependent dropdown
    setFilteredRooms([]);

    if (floorId) {
      // Call rooms API with floor_id parameter
      try {
        setLoadingRooms(true);
        const url = getFullUrl(`/pms/rooms.json?floor_id=${floorId}`);
        const options = {
          method: 'GET',
          headers: {
            Authorization: getAuthHeader(),
          },
        };
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          setFilteredRooms(Array.isArray(data) ? data : (data.rooms || []));
        }
      } catch (error) {
        console.error('Error loading rooms for floor:', error);
      } finally {
        setLoadingRooms(false);
      }
    }
  };

  // Fetch ticket data for editing
  const fetchTicketData = async (ticketId: string) => {
    try {
      console.log("🎯 Fetching ticket data for ID:", ticketId);
      const response = await apiClient.get(
        `/pms/admin/complaints/${ticketId}.json`
      );
      const ticketData = response.data;

      console.log("📥 Received ticket data:", ticketData);

      // Store original API data for later use FIRST
      setTicketApiData(ticketData);

      // Match category, mode, status, and users
      const matchedCategory = helpdeskData?.helpdesk_categories.find(
        (cat) => cat.name === ticketData.category_type
      );
      const matchedMode = complaintModes.find((mode) => mode.name === ticketData.complaint_mode);
      const matchedStatus = complaintStatuses.find(
        (status) => status.id === ticketData.complaint_status_id
      );

      // Match assigned user by name (API returns name, not ID)
      const assignedUser = fmUsers.find((user) => user.full_name === ticketData.assigned_to);

      // Match responsible person by name if available
      const responsiblePersonUser = ticketData.responsible_person
        ? fmUsers.find((user) => user.full_name === ticketData.responsible_person)
        : null;

      console.log("👤 Matching assigned user:", {
        apiAssignedTo: ticketData.assigned_to,
        matchedUser: assignedUser,
        responsiblePerson: ticketData.responsible_person,
        matchedResponsiblePerson: responsiblePersonUser,
      });

      // Find location IDs by matching names from API response
      let buildingId = "";
      let wingId = "";
      let areaId = "";
      let floorId = ticketData.floor_id?.toString() || "";
      let roomId = ticketData.room_id?.toString() || "";

      // Match building by name
      if (ticketData.building_name) {
        const matchedBuilding = buildings.find(b => b.name === ticketData.building_name);
        if (matchedBuilding) {
          buildingId = matchedBuilding.id.toString();
        }
      }

      // Populate form with API data including ALL fields from the response
      console.log("📋 Setting form data with values:", {
        adminPriority: ticketData.priority,
        severity: ticketData.severity,
        issueRelatedTo: ticketData.issue_related_to,
        refNumber: ticketData.reference_number,
        externalPriority: ticketData.external_priority,
        assignTo: ticketData.assigned_to,
        responsiblePerson: ticketData.responsible_person,
        correctiveAction: ticketData.corrective_action,
        preventiveAction: ticketData.preventive_action,
        shortTermImpact: ticketData.short_term_impact,
        longTermImpact: ticketData.impact,
        issueType: ticketData.issue_type,
      });

      console.log("📋 Available templates:", {
        preventiveTemplates: communicationTemplates.filter(t => t.identifier === "Preventive Action"),
        correctiveTemplates: communicationTemplates.filter(t => t.identifier === "Corrective Action"),
        shortTermTemplates: communicationTemplates.filter(t => t.identifier === "Short-term Impact"),
        longTermTemplates: communicationTemplates.filter(t => t.identifier === "Long-term Impact"),
      });

      setFormData((prev) => ({
        ...prev,
        title: ticketData.heading || "",
        categoryType: matchedCategory ? matchedCategory.id.toString() : "",
        subCategoryType: ticketData.sub_category_type || "",
        proactiveReactive: ticketData.proactive_reactive || "",
        assignTo: assignedUser ? assignedUser.id.toString() : "", // Use matched user ID
        mode: matchedMode ? matchedMode.id.toString() : "",
        serviceType: ticketData.service_or_asset || "",
        selectedStatus: matchedStatus ? matchedStatus.id.toString() : "",
        comments: ticketData.comment || "",
        // Responsible Person
        responsiblePerson: responsiblePersonUser ? responsiblePersonUser.id.toString() : "",
        // Complaint Type (from issue_type)
        complaintType: ticketData.issue_type || "",
        // Admin Priority
        adminPriority: ticketData.priority || "",
        // Severity
        severity: ticketData.severity || "",
        // Issue Related To
        issueRelatedTo: ticketData.issue_related_to || "",
        // Reference Number
        refNumber: ticketData.reference_number || "",
        // External Priority
        externalPriority: ticketData.external_priority || "",
        // Corrective Action - directly use the value from API
        correctiveAction: ticketData.corrective_action || "",
        // Preventive Action - directly use the value from API
        preventiveAction: ticketData.preventive_action || "",
        // Impact (Short Term Impact) - directly use the value from API
        impact: ticketData.short_term_impact || "",
        // Long Term Impact - directly use the value from API
        longTermImpact: ticketData.impact || "",
        // Correction
        correction: ticketData.correction || "",
        // Root Cause
        rootCause: ticketData.root_cause || "",
        // Service Type - bind from API
        serviceType: ticketData.service_type || "",
        // Associated To (Asset or Service) - using asset_service field
        associatedTo: {
          asset: ticketData.asset_service === "Asset",
          service: ticketData.asset_service === "Service"
        },
        // Location fields from API (using IDs from response)
        building: buildingId,
        wing: wingId,
        area: areaId,
        floor: floorId,
        room: roomId,
      }));

      console.log("✅ Form data updated successfully");

      // Trigger cascading API calls for location if data exists
      if (buildingId) {
        // Call wings API with building_id parameter
        try {
          const url = getFullUrl(`/pms/wings.json?building_id=${buildingId}`);
          const options = {
            method: 'GET',
            headers: {
              Authorization: getAuthHeader(),
            },
          };
          const response = await fetch(url, options);
          if (response.ok) {
            const data = await response.json();
            const wingsData = data.wings || [];
            setFilteredWings(wingsData);

            // Match wing by name after fetching wings
            if (ticketData.wing_name) {
              const matchedWing = wingsData.find((w: any) => w.name === ticketData.wing_name);
              if (matchedWing) {
                wingId = matchedWing.id.toString();
                setFormData(prev => ({ ...prev, wing: wingId }));

                // Call areas API with wing_id parameter
                const areasUrl = getFullUrl(`/pms/areas.json?wing_id=${wingId}`);
                const areasResponse = await fetch(areasUrl, options);
                if (areasResponse.ok) {
                  const areasData = await areasResponse.json();
                  const areas = areasData.areas || [];
                  setFilteredAreas(areas);

                  // Match area by name after fetching areas
                  if (ticketData.area_name) {
                    const matchedArea = areas.find((a: any) => a.name === ticketData.area_name);
                    if (matchedArea) {
                      areaId = matchedArea.id.toString();
                      setFormData(prev => ({ ...prev, area: areaId }));

                      // Call floors API with area_id parameter
                      const floorsUrl = getFullUrl(`/pms/floors.json?area_id=${areaId}`);
                      const floorsResponse = await fetch(floorsUrl, options);
                      if (floorsResponse.ok) {
                        const floorsData = await floorsResponse.json();
                        const floors = floorsData.floors || [];
                        setFilteredFloors(floors);

                        // If we have floor_id, fetch rooms
                        if (floorId) {
                          const roomsUrl = getFullUrl(`/pms/rooms.json?floor_id=${floorId}`);
                          const roomsResponse = await fetch(roomsUrl, options);
                          if (roomsResponse.ok) {
                            const roomsData = await roomsResponse.json();
                            setFilteredRooms(Array.isArray(roomsData) ? roomsData : (roomsData.rooms || []));
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error loading location cascade for ticket:', error);
        }
      }

      // Fetch assets and services based on ticket data
      if (ticketData.asset_service === "Asset" && ticketData.asset_or_service_id) {
        setFormData(prev => ({
          ...prev,
          associatedTo: { asset: true, service: false },
          selectedAsset: ticketData.asset_or_service_id.toString(),
          selectedService: "",
        }));
        fetchAssets(false); // Don't auto-select during manual changes
      } else if (ticketData.asset_service === "Service" && ticketData.asset_or_service_id) {
        setFormData(prev => ({
          ...prev,
          associatedTo: { asset: false, service: true },
          selectedAsset: "",
          selectedService: ticketData.asset_or_service_id.toString(),
        }));
        fetchServices(false); // Don't auto-select during manual changes
      }

      // Set review tracking date if available
      if (ticketData.review_tracking) {
        // Convert review_tracking date from DD/MM/YYYY to YYYY-MM-DD format
        const dateStr = ticketData.review_tracking;
        if (dateStr.includes('/')) {
          // Format is DD/MM/YYYY, convert to YYYY-MM-DD
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            const [day, month, year] = parts;
            const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            setReviewDate(formattedDate);
            console.log('📅 Review date converted from', dateStr, 'to', formattedDate);
          }
        } else if (dateStr.includes('T')) {
          // Format is ISO timestamp, extract date part
          const reviewDateStr = dateStr.split('T')[0];
          setReviewDate(reviewDateStr);
          console.log('📅 Review date extracted from ISO:', reviewDateStr);
        } else {
          // Assume already in correct format
          setReviewDate(dateStr);
        }
      }

      // Set cost involved flag
      if (ticketData.cost_involved !== undefined) {
        setFormData(prev => ({
          ...prev,
          costInvolved: ticketData.cost_involved
        }));
      }

      // Load cost approval requests if cost is involved
      if (ticketData.cost_involved) {
        const costRequests = ticketData.cost_approval_requests_attributes || [];
        const mappedRequests = costRequests.map((req: any) => ({
          id: req.id,
          amount: req.cost,
          comments: req.comment,
          createdOn: new Date(req.created_at).toLocaleString(),
          createdBy: req.created_by_name || "Unknown",
          approvals: req.approvals || {},
          masterStatus: req.master_status,
          cancelledBy: req.cancelled_by_name || null,
          attachments: req.attachments_attributes ? req.attachments_attributes.map((att: any) => att.document) : [],
          isFromAPI: true, // Mark as API data
        }));
        setCostApprovalRequests(mappedRequests);
      } else {
        setCostApprovalRequests([]);
      }

      // Fetch sub-categories based on category selection
      if (matchedCategory && matchedCategory.id) {
        fetchSubCategories(matchedCategory.id.toString(), ticketData.sub_category_type);
      } else {
        setSubCategories([]);
        setFormData(prev => ({ ...prev, subCategoryType: "" }));
      }
    } catch (error) {
      console.error("Error fetching ticket data:", error);
      toast({
        title: "Error",
        description: "Failed to load ticket data.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // If we have an ID from the URL, fetch the ticket data
    // Wait for all required data including buildings and templates to be loaded
    if (id &&
      helpdeskData?.helpdesk_categories &&
      complaintModes.length > 0 &&
      fmUsers.length > 0 &&
      complaintStatuses.length > 0 &&
      buildings.length > 0 &&
      communicationTemplates.length > 0) { // Add templates check
      console.log("✅ All data loaded, fetching ticket data for ID:", id);
      fetchTicketData(id);
    }
    // If we have selected tickets from navigation state, use the first one
    else if (location.state?.selectedTickets) {
      setSelectedTickets(location.state.selectedTickets);
      const firstTicket = location.state.selectedTickets[0];
      if (firstTicket) {
        setFormData((prev) => ({
          ...prev,
          title: firstTicket.heading || "",
          categoryType: firstTicket.category_type || "",
          subCategoryType: firstTicket.sub_category_type || "",
          proactiveReactive: firstTicket.proactive_reactive || "",
          assignTo: firstTicket.assigned_to || "",
          mode: firstTicket.complaint_mode || "",
          serviceType: firstTicket.service_or_asset || "",
        }));
      }
    }
  }, [
    id,
    location.state,
    helpdeskData,
    complaintModes,
    fmUsers,
    complaintStatuses,
    buildings, // Add buildings dependency
    communicationTemplates, // Add templates dependency
  ]);


  // Define fetchAssets and fetchServices before useEffect hooks to avoid hoisting issues
  const fetchAssets = useCallback(async (shouldSetSelectedValue = true) => {
    if (isLoadingAssets) return;

    setIsLoadingAssets(true);
    try {
      console.log("🔄 Fetching assets from API...");
      const response = await apiClient.get("/pms/assets/get_assets.json");
      const assets = response.data || [];
      console.log("📦 Assets received:", assets.length, "items");
      console.log(
        "📦 Sample assets:",
        assets.slice(0, 3).map((a) => ({ id: a.id, name: a.name }))
      );

      setAssetOptions(assets);

      // Only set the selected value if we should (during initial load) and we have ticket data
      if (
        shouldSetSelectedValue &&
        ticketApiData?.asset_service === "Asset" &&
        ticketApiData?.asset_or_service_id
      ) {
        console.log(
          "🔍 Looking for asset with ID:",
          ticketApiData.asset_or_service_id
        );
        console.log("🔍 Asset type:", typeof ticketApiData.asset_or_service_id);

        const targetId = ticketApiData.asset_or_service_id.toString();
        const matchingAsset = assets.find((asset) => {
          const assetId = asset.id.toString();
          console.log(
            "🔍 Comparing asset ID:",
            assetId,
            "with target:",
            targetId
          );
          return assetId === targetId;
        });

        console.log("✅ Found matching asset:", matchingAsset);

        if (matchingAsset) {
          console.log(
            "📦 Setting selectedAsset to ID:",
            matchingAsset.id,
            "Name:",
            matchingAsset.name
          );
          setFormData((prev) => ({
            ...prev,
            selectedAsset: matchingAsset.id.toString(),
          }));
        } else {
          console.log("❌ No matching asset found for ID:", targetId);
          console.log(
            "📋 Available asset IDs:",
            assets.map((a) => a.id.toString())
          );
        }
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast({
        title: "Error",
        description: "Failed to fetch assets",
        variant: "destructive",
      });
      setAssetOptions([]);
    } finally {
      setIsLoadingAssets(false);
    }
  }, [isLoadingAssets, ticketApiData, toast]);

  const fetchServices = useCallback(async (shouldSetSelectedValue = true) => {
    if (isLoadingServices) return;

    setIsLoadingServices(true);
    try {
      console.log("🔄 Fetching services from API...");
      const response = await apiClient.get("/pms/services/get_services.json");
      const services = response.data || [];
      console.log("📦 Services received:", services.length, "items");
      console.log(
        "📦 Sample services:",
        services.slice(0, 3).map((s) => ({ id: s.id, name: s.service_name || s.name }))
      );

      setServiceOptions(services);

      // Only set the selected value if we should (during initial load) and we have ticket data
      if (
        shouldSetSelectedValue &&
        ticketApiData?.asset_service === "Service" &&
        ticketApiData?.asset_or_service_id
      ) {
        console.log(
          "🔍 Looking for service with ID:",
          ticketApiData.asset_or_service_id
        );
        console.log(
          "🔍 Service type:",
          typeof ticketApiData.asset_or_service_id
        );

        const targetId = ticketApiData.asset_or_service_id.toString();
        const matchingService = services.find((service) => {
          const serviceId = service.id.toString();
          console.log(
            "🔍 Comparing service ID:",
            serviceId,
            "with target:",
            targetId
          );
          return serviceId === targetId;
        });

        console.log("✅ Found matching service:", matchingService);

        if (matchingService) {
          console.log(
            "📦 Setting selectedService to ID:",
            matchingService.id,
            "Name:",
            matchingService.service_name || matchingService.name
          );
          setFormData((prev) => ({
            ...prev,
            selectedService: matchingService.id.toString(),
          }));
        } else {
          console.log("❌ No matching service found for ID:", targetId);
          console.log(
            "📋 Available service IDs:",
            services.map((s) => s.id.toString())
          );
        }
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
      setServiceOptions([]);
    } finally {
      setIsLoadingServices(false);
    }
  }, [isLoadingServices, ticketApiData, toast]);

  // Handle asset/service loading when associatedTo changes
  useEffect(() => {
    console.log("🔄 AssociatedTo change detected:", formData.associatedTo);

    // Fetch assets when asset checkbox is checked and we don't have asset options yet
    if (formData.associatedTo.asset && assetOptions.length === 0 && !isLoadingAssets) {
      console.log("🔄 Fetching assets due to checkbox change");
      fetchAssets(false); // Don't auto-select during manual changes
    }

    // Fetch services when service checkbox is checked and we don't have service options yet
    if (formData.associatedTo.service && serviceOptions.length === 0 && !isLoadingServices) {
      console.log("🔄 Fetching services due to checkbox change");
      fetchServices(false); // Don't auto-select during manual changes
    }
  }, [
    formData.associatedTo,
    assetOptions.length,
    serviceOptions.length,
    isLoadingAssets,
    isLoadingServices,
    fetchAssets,
    fetchServices
  ]);

  // Synchronize asset/service selection when options become available
  useEffect(() => {
    console.log("🔄 Asset/Service options synchronization check");
    console.log("🔄 ticketApiData available:", !!ticketApiData);
    console.log("🔄 Asset service type:", ticketApiData?.asset_service);
    console.log("🔄 Asset options length:", assetOptions.length);
    console.log("🔄 Service options length:", serviceOptions.length);
    console.log("🔄 Current form selections:", {
      selectedAsset: formData.selectedAsset,
      selectedService: formData.selectedService,
      associatedTo: formData.associatedTo
    });

    // If we have ticket data with asset/service info but haven't set the selection yet
    if (ticketApiData && ticketApiData.asset_or_service_id) {
      const targetId = ticketApiData.asset_or_service_id.toString();

      // Handle asset synchronization
      if (ticketApiData.asset_service === "Asset" &&
        assetOptions.length > 0 &&
        (!formData.selectedAsset || !formData.associatedTo.asset)) {

        console.log("🔄 Attempting asset synchronization with ID:", targetId);
        const matchingAsset = assetOptions.find(asset =>
          asset.id.toString() === targetId
        );

        if (matchingAsset) {
          console.log("✅ Synchronizing asset selection:", matchingAsset.name);
          setFormData(prev => ({
            ...prev,
            selectedAsset: matchingAsset.id.toString(),
            associatedTo: {
              ...prev.associatedTo,
              asset: true,
              service: false
            }
          }));
        } else {
          console.log("❌ Asset not found in options for ID:", targetId);
        }
      }

      // Handle service synchronization
      if (ticketApiData.asset_service === "Service" &&
        serviceOptions.length > 0 &&
        (!formData.selectedService || !formData.associatedTo.service)) {

        console.log("🔄 Attempting service synchronization with ID:", targetId);
        const matchingService = serviceOptions.find(service =>
          service.id.toString() === targetId
        );

        if (matchingService) {
          console.log("✅ Synchronizing service selection:", matchingService.service_name);
          setFormData(prev => ({
            ...prev,
            selectedService: matchingService.id.toString(),
            associatedTo: {
              ...prev.associatedTo,
              asset: false,
              service: true
            }
          }));
        } else {
          console.log("❌ Service not found in options for ID:", targetId);
        }
      }
    }
  }, [ticketApiData, assetOptions, serviceOptions, formData.selectedAsset, formData.selectedService, formData.associatedTo]);

  // Debug useEffect to monitor asset/service state
  useEffect(() => {
    console.log("🔍 Debug - Current form state:", {
      associatedTo: formData.associatedTo,
      selectedAsset: formData.selectedAsset,
      selectedService: formData.selectedService,
      assetOptionsLength: assetOptions.length,
      serviceOptionsLength: serviceOptions.length,
    });

    // Check if selected asset exists in options
    if (formData.associatedTo.asset && formData.selectedAsset) {
      const assetExists = assetOptions.some(
        (asset) => asset.id.toString() === formData.selectedAsset
      );
      console.log("🔍 Selected asset exists in options:", assetExists);
      if (!assetExists && assetOptions.length > 0) {
        console.log("❌ Selected asset not found in options:", {
          selectedAsset: formData.selectedAsset,
          availableAssets: assetOptions.map((a) => ({ id: a.id, name: a.name })),
        });
      }
    }

    // Check if selected service exists in options
    if (formData.associatedTo.service && formData.selectedService) {
      const serviceExists = serviceOptions.some(
        (service) => service.id.toString() === formData.selectedService
      );
      console.log("🔍 Selected service exists in options:", serviceExists);
      if (!serviceExists && serviceOptions.length > 0) {
        console.log("❌ Selected service not found in options:", {
          selectedService: formData.selectedService,
          availableServices: serviceOptions.map((s) => ({ id: s.id, name: s.service_name })),
        });
      }
    }
  }, [formData.associatedTo, formData.selectedAsset, formData.selectedService, assetOptions, serviceOptions]);

  // Load communication templates on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoadingTemplates(true);
      try {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.COMMUNICATION_TEMPLATES);
        const templates = response.data || [];
        setCommunicationTemplates(templates);
      } catch (error) {
        console.error("Error loading communication templates:", error);
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  // Handle form field changes
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Fetch sub-categories when category changes
    if (field === "categoryType" && value) {
      fetchSubCategories(value); // No target subcategory for manual changes
    } else if (field === "categoryType" && !value) {
      setSubCategories([]);
      setFormData((prev) => ({ ...prev, subCategoryType: "" }));
    }
  };

  // Fetch sub-categories based on category selection
  const fetchSubCategories = async (
    categoryId: string,
    targetSubCategoryName?: string
  ) => {
    try {
      setSubCategoriesLoading(true);
      console.log("🔍 Fetching subcategories for category ID:", categoryId);
      console.log("🎯 Target subcategory to match:", targetSubCategoryName);

      const response = await apiClient.get(
        `/pms/admin/get_sub_categories.json?category_type_id=${categoryId}`
      );
      console.log("📋 Sub-categories API response:", response.data);

      // Handle different possible response structures
      let categories = [];
      if (Array.isArray(response.data)) {
        categories = response.data;
      } else if (response.data && Array.isArray(response.data.sub_categories)) {
        categories = response.data.sub_categories;
      } else if (response.data && Array.isArray(response.data.subcategories)) {
        categories = response.data.subcategories;
      }

      console.log("📝 Processed subcategories:", categories);
      setSubCategories(categories);

      // Use the passed targetSubCategoryName or fall back to ticketApiData
      const subCategoryToMatch =
        targetSubCategoryName || ticketApiData?.sub_category_type;

      // If we have a subcategory name to match and categories are available
      if (subCategoryToMatch && categories.length > 0) {
        console.log("🔎 Looking for subcategory match:", subCategoryToMatch);
        console.log(
          "🔎 Available subcategories:",
          categories.map((c) => ({ id: c.id, name: c.name }))
        );

        const matchingSubCategory = categories.find((subCat) => {
          const subCatName = subCat.name?.trim().toLowerCase();
          const targetName = subCategoryToMatch?.trim().toLowerCase();
          console.log("🔍 Comparing:", subCatName, "vs", targetName);
          return subCatName === targetName;
        });

        console.log("✅ Found matching subcategory:", matchingSubCategory);

        if (matchingSubCategory) {
          console.log("📌 Setting subcategory ID:", matchingSubCategory.id);
          setFormData((prev) => ({
            ...prev,
            subCategoryType: matchingSubCategory.id.toString(),
          }));
        } else {
          console.log(
            "❌ No matching subcategory found for:",
            subCategoryToMatch
          );
          console.log(
            "📋 Available names:",
            categories.map((c) => c.name)
          );
        }
      } else {
        console.log("⚠️ No subcategory to match or no categories available");
        console.log("⚠️ subCategoryToMatch:", subCategoryToMatch);
        console.log("⚠️ categories.length:", categories.length);
      }
    } catch (error) {
      console.error("Error fetching sub-categories:", error);
      setSubCategories([]);
      toast({
        title: "Error",
        description: "Failed to load sub-categories.",
        variant: "destructive",
      });
    } finally {
      setSubCategoriesLoading(false);
    }
  };

  const handleCheckboxChange = (
    group: string,
    field: string,
    checked: boolean
  ) => {
    console.log("📋 Checkbox change:", { group, field, checked });

    setFormData((prev) => ({
      ...prev,
      [group]: {
        ...(prev[group as keyof typeof prev] as Record<string, any>),
        [field]: checked,
      },
    }));

    // Handle asset/service loading immediately when checkbox changes
    if (group === 'associatedTo') {
      if (field === 'asset' && checked) {
        console.log("🔄 Asset checkbox checked - fetching assets immediately");
        // Clear service selection when asset is selected
        setFormData(prev => ({ ...prev, selectedService: "", associatedTo: { ...prev.associatedTo, service: false } }));
        // Fetch assets if we don't have them yet
        if (assetOptions.length === 0) {
          fetchAssets(false);
        }
      } else if (field === 'service' && checked) {
        console.log("🔄 Service checkbox checked - fetching services immediately");
        // Clear asset selection when service is selected
        setFormData(prev => ({ ...prev, selectedAsset: "", associatedTo: { ...prev.associatedTo, asset: false } }));
        // Fetch services if we don't have them yet
        if (serviceOptions.length === 0) {
          fetchServices(false);
        }
      } else if (!checked) {
        // Clear selections when unchecked
        if (field === 'asset') {
          setFormData(prev => ({ ...prev, selectedAsset: "" }));
        } else if (field === 'service') {
          setFormData(prev => ({ ...prev, selectedService: "" }));
        }
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(event.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCostInvolvedChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, costInvolved: checked }));
    if (checked) {
      setShowCostPopup(true);
    } else {
      // Only clear new requests, keep API requests
      setCostApprovalRequests((prev) => prev.filter((req) => !req.isFromAPI));
      setCostPopupData({ cost: "", description: "", attachments: [] });
    }
  };

  // Helper function to get Root Cause Analysis values from ticket data
  const getRootCauseAnalysisValues = () => {
    // First priority: Use formData.rootCauseTemplateIds (user's current selections)
    if (formData.rootCauseTemplateIds && formData.rootCauseTemplateIds.length > 0) {
      console.log('🔍 Root Cause Analysis Template IDs from formData:', formData.rootCauseTemplateIds);
      return formData.rootCauseTemplateIds;
    }
    
    // Second priority: Use template IDs from API if available (initial load)
    if (ticketApiData?.rca_template_ids && Array.isArray(ticketApiData.rca_template_ids)) {
      // Filter out duplicate IDs using Set
      const uniqueIds = [...new Set(ticketApiData.rca_template_ids)];
      
      console.log('🔍 Root Cause Analysis Template IDs from API:', uniqueIds);
      
      // Find templates by IDs
      const matchedTemplates = communicationTemplates.filter(
        (t) =>
          uniqueIds.includes(t.id) &&
          t.identifier === "Root Cause Analysis"
      );
      
      console.log('🔍 Root Cause Analysis Matched Templates:', matchedTemplates.map(t => ({ id: t.id, action: t.identifier_action })));
      
      // Return array of IDs for Material-UI Select
      return matchedTemplates.map((t) => t.id);
    }
    
    // Fallback: Use text matching if no template IDs
    if (!formData.rootCause && !ticketApiData?.root_cause) return [];
    
    const rootCauseString = formData.rootCause || ticketApiData?.root_cause || '';
    
    if (!rootCauseString) return [];

    const rootCauseValues = rootCauseString.split(",").map((s) => s.trim());
    const matchedTemplates = communicationTemplates.filter(
      (t) =>
        t.identifier === "Root Cause Analysis" &&
        rootCauseValues.includes(t.identifier_action)
    );

    return matchedTemplates.map((t) => t.id);
  };

  // Handle Root Cause multi-select change with auto-save
  // Handle Root Cause multi-select change (only updates state, API call happens on Save)
  const handleRootCauseChange = (selectedValues: string | string[] | number | number[]) => {
    // Convert to array of numbers (template IDs)
    let templateIds: number[] = [];
    if (Array.isArray(selectedValues)) {
      templateIds = selectedValues.map(v => typeof v === 'number' ? v : parseInt(String(v)));
    } else {
      templateIds = [typeof selectedValues === 'number' ? selectedValues : parseInt(String(selectedValues))];
    }

    // Filter out any NaN values
    templateIds = templateIds.filter(id => !isNaN(id));

    // Update local state with the selected template text for display
    const selectedTemplates = communicationTemplates.filter(t => templateIds.includes(t.id));
    const rootCauseString = selectedTemplates.map(t => t.identifier_action).join(', ');

    // Store both the display string and the template IDs
    setFormData((prev) => ({
      ...prev,
      rootCause: rootCauseString,
      rootCauseTemplateIds: templateIds // Store IDs for submission
    }));

    console.log('✅ Root cause selected:', { templateIds, rootCauseString });
  };

  const handleCostPopupFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setCostPopupData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(event.target.files!)],
      }));
    }
  };

  const removeCostPopupAttachment = (index: number) => {
    setCostPopupData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleCostPopupSubmit = () => {
    console.log("💰 Cost popup submit - data:", costPopupData);

    // Get current user information
    const currentUser = getUser();
    const currentUserName = currentUser
      ? currentUser.full_name
      : "Current User";
    console.log("👤 Current user for cost approval:", currentUserName);

    // Create new cost approval request
    const newRequest = {
      id: Date.now().toString(),
      amount: costPopupData.cost,
      comments: costPopupData.description,
      createdOn: new Date().toLocaleDateString(),
      createdBy: currentUserName,
      attachments: costPopupData.attachments,
      approvals: {
        L1: "Na",
        L2: "Na",
        L3: "Na",
        L4: "Na",
        L5: "Na",
      },
      masterStatus: "Pending",
      cancelledBy: "NA",
      action: null,
      isFromAPI: false, // Mark as user-created
    };

    console.log("💰 Creating new cost approval request:", newRequest);

    // Add to cost approval requests
    setCostApprovalRequests((prev) => {
      const updated = [...prev, newRequest];
      console.log("💰 Updated cost approval requests:", updated);
      return updated;
    });

    // Update main form data with popup data
    setFormData((prev) => ({
      ...prev,
      cost: costPopupData.cost,
      description: costPopupData.description,
    }));

    // Don't add to main attachments array to avoid conflicts
    // setAttachments(prev => [...prev, ...costPopupData.attachments]);

    console.log("✅ Cost popup submitted successfully");

    // Close popup and reset data
    setShowCostPopup(false);
    setCostPopupData({ cost: "", description: "", attachments: [] });
  };

  const handleCostPopupClose = () => {
    setShowCostPopup(false);
    setFormData((prev) => ({ ...prev, costInvolved: false }));
    setCostPopupData({ cost: "", description: "", attachments: [] });
  };

  const handleDownloadAttachment = (attachment: any, fileName?: string) => {
    console.log("📥 Downloading attachment:", attachment);

    try {
      if (typeof attachment === "string") {
        // If attachment is a URL string, download directly
        const link = document.createElement("a");
        link.href = attachment;
        link.download = fileName || "attachment";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (attachment.url) {
        // If attachment is an object with URL property
        const link = document.createElement("a");
        link.href = attachment.url;
        link.download = fileName || attachment.name || "attachment";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (attachment instanceof File) {
        // If attachment is a File object (for new uploads)
        const url = URL.createObjectURL(attachment);
        const link = document.createElement("a");
        link.href = url;
        link.download = attachment.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        console.error("Unknown attachment format:", attachment);
        toast({
          title: "Error",
          description: "Unable to download attachment - unknown format",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error downloading attachment:", error);
      toast({
        title: "Error",
        description: "Failed to download attachment",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    console.log("=== HANDLE SUBMIT STARTED ===");
    console.log("handleSubmit called");
    console.log("Current selectedTickets:", selectedTickets);
    console.log("URL ID parameter:", id);
    console.log("Form data state:", formData);

    setIsSubmitting(true);

    try {
      // Use the URL ID parameter if selectedTickets is empty
      let ticketId: number;

      if (selectedTickets.length > 0) {
        ticketId = selectedTickets[0].id;
        console.log("Using ticketId from selectedTickets:", ticketId);
      } else if (id) {
        ticketId = parseInt(id);
        console.log("Using ticketId from URL parameter:", ticketId);
      } else {
        console.error(
          "No ticket ID available - selectedTickets empty and no URL id"
        );
        toast({
          title: "Error",
          description: "No ticket ID found for update.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      console.log("Final ticket ID to use:", ticketId);

      // Get the first selected ticket for the complaint ID
      console.log("Form Data before API call:", formData);
      console.log("Review Date before API call:", reviewDate);

      // Prepare form data for API
      const formDataToSend = new FormData();

      // Complaint Log data
      formDataToSend.append("complaint_log[complaint_id]", ticketId.toString());
      formDataToSend.append("complaint_log[society_staff_type]", "User");
      formDataToSend.append("complaint_log[status_reason]", "");
      formDataToSend.append("complaint_log[expected_date]", "");
      formDataToSend.append(
        "complaint_log[complaint_status_id]",
        formData.selectedStatus || ""
      );
      formDataToSend.append(
        "complaint_log[assigned_to]",
        formData.assignTo || ""
      );
      formDataToSend.append(
        "complaint_log[priority]",
        formData.adminPriority || ""
      );
      formDataToSend.append("complaint_log[comment]", formData.comments || "");
      formDataToSend.append("save_and_show_detail", "true");
      formDataToSend.append(
        "custom_redirect",
        `/pms/admin/complaints/${ticketId}`
      );

      // Complaint data
      formDataToSend.append("complaint[complaint_type]", formData.complaintType || "");
      formDataToSend.append(
        "complaint[preventive_action]",
        formData.preventiveAction || ""
      );
      formDataToSend.append(
        "complaint[person_id]",
        formData.responsiblePerson || ""
      );

      // Format review tracking date properly
      if (reviewDate) {
        // reviewDate is already in YYYY-MM-DD format from the date input
        formDataToSend.append("complaint[review_tracking_date]", reviewDate);
        console.log("Review date formatted:", reviewDate);
      } else {
        formDataToSend.append("complaint[review_tracking_date]", "");
      }

      formDataToSend.append(
        "complaint[category_type_id]",
        formData.categoryType || ""
      );
      formDataToSend.append(
        "complaint[proactive_reactive]",
        formData.proactiveReactive || ""
      );
      formDataToSend.append(
        "complaint[sub_category_id]",
        formData.subCategoryType || ""
      );
      formDataToSend.append(
        "complaint[external_priority]",
        formData.externalPriority || ""
      );
      formDataToSend.append(
        "complaint[complaint_mode_id]",
        formData.mode || ""
      );

      // Add severity
      formDataToSend.append(
        "complaint[severity]",
        formData.severity || ""
      );

      // Add root cause template IDs with array notation
      if (formData.rootCauseTemplateIds && formData.rootCauseTemplateIds.length > 0) {
        formData.rootCauseTemplateIds.forEach(templateId => {
          formDataToSend.append('root_cause[template_ids][]', String(templateId));
        });
        console.log('📝 Adding root cause template IDs:', formData.rootCauseTemplateIds);
      } else {
        console.log('⚠️ No root cause template IDs to submit');
      }

      // Add preventive action template IDs with array notation
      if (formData.preventiveActionTemplateIds && formData.preventiveActionTemplateIds.length > 0) {
        formData.preventiveActionTemplateIds.forEach(templateId => {
          formDataToSend.append('preventive_action[template_ids][]', String(templateId));
        });
        console.log('📝 Adding preventive action template IDs:', formData.preventiveActionTemplateIds);
      } else {
        console.log('⚠️ No preventive action template IDs to submit');
      }

      // Add corrective action template IDs with array notation
      if (formData.correctiveActionTemplateIds && formData.correctiveActionTemplateIds.length > 0) {
        formData.correctiveActionTemplateIds.forEach(templateId => {
          formDataToSend.append('corrective_action[template_ids][]', String(templateId));
        });
        console.log('📝 Adding corrective action template IDs:', formData.correctiveActionTemplateIds);
      } else {
        console.log('⚠️ No corrective action template IDs to submit');
      }

      // Add short-term impact template IDs with array notation
      if (formData.shortTermImpactTemplateIds && formData.shortTermImpactTemplateIds.length > 0) {
        formData.shortTermImpactTemplateIds.forEach(templateId => {
          formDataToSend.append('short_term_impact[template_ids][]', String(templateId));
        });
        console.log('📝 Adding short-term impact template IDs:', formData.shortTermImpactTemplateIds);
      } else {
        console.log('⚠️ No short-term impact template IDs to submit');
      }

      // Add long-term impact template IDs with array notation
      if (formData.longTermImpactTemplateIds && formData.longTermImpactTemplateIds.length > 0) {
        formData.longTermImpactTemplateIds.forEach(templateId => {
          formDataToSend.append('long_term_impact[template_ids][]', String(templateId));
        });
        console.log('📝 Adding long-term impact template IDs:', formData.longTermImpactTemplateIds);
      } else {
        console.log('⚠️ No long-term impact template IDs to submit');
      }

      formDataToSend.append("complaint[short_term_impact]", formData.impact || "");
      formDataToSend.append("complaint[correction]", formData.correction || "");
      formDataToSend.append("complaint[impact]", formData.longTermImpact || "");
      formDataToSend.append(
        "complaint[reference_number]",
        formData.refNumber || ""
      );
      formDataToSend.append(
        "complaint[corrective_action]",
        formData.correctiveAction || ""
      );
      formDataToSend.append(
        "complaint[service_type]",
        formData.serviceType || ""
      );
      formDataToSend.append(
        "complaint[issue_related_to]",
        formData.issueRelatedTo || ""
      );
      formDataToSend.append(
        "complaint[cost_involved]",
        formData.costInvolved ? "true" : "false"
      );

      // Add location parameters to formData with correct keys
      if (formData.area) {
        formDataToSend.append("complaint[area_id]", formData.area);
      }
      if (formData.building) {
        formDataToSend.append("complaint[tower_id]", formData.building);
      }
      if (formData.wing) {
        formDataToSend.append("complaint[wing_id]", formData.wing);
      }
      if (formData.floor) {
        formDataToSend.append("complaint[floor_id]", formData.floor);
      }
      if (formData.room) {
        formDataToSend.append("complaint[room_id]", formData.room);
      }

      // Add cost approval data if cost is involved
      console.log("💰 Cost involved:", formData.costInvolved);
      console.log("💰 All cost approval requests:", costApprovalRequests);

      // Filter only new requests (not from API) for submission
      const newCostApprovalRequests = costApprovalRequests.filter(
        (request) => !request.isFromAPI
      );
      console.log(
        "💰 New cost approval requests to submit:",
        newCostApprovalRequests
      );

      if (formData.costInvolved && newCostApprovalRequests.length > 0) {
        // Get current user ID from localStorage
        const currentUser = getUser();
        const currentUserId = currentUser?.id?.toString() || "12437"; // Fallback to default if user not found
        console.log("👤 Current user ID for cost approval:", currentUserId);

        // Process each NEW cost approval request (not the ones from API)
        newCostApprovalRequests.forEach((request) => {
          const timestamp = request.id; // Use the request ID as timestamp
          console.log("💰 Adding NEW cost approval request:", request);

          // Add cost approval request attributes
          formDataToSend.append(
            `complaint[cost_approval_requests_attributes][${timestamp}][created_by_id]`,
            currentUserId
          );
          formDataToSend.append(
            `complaint[cost_approval_requests_attributes][${timestamp}][cost]`,
            request.amount
          );
          formDataToSend.append(
            `complaint[cost_approval_requests_attributes][${timestamp}][comment]`,
            request.comments || ""
          );
          formDataToSend.append(
            `complaint[cost_approval_requests_attributes][${timestamp}][_destroy]`,
            "false"
          );

          // Add attachments for this cost approval request with correct parameter format
          if (request.attachments && Array.isArray(request.attachments)) {
            request.attachments.forEach((file, index) => {
              if (file && file.name) {
                // Only add if it's a proper File object
                const attachmentTimestamp = Date.now() + index; // Unique timestamp for each attachment
                console.log(
                  "📎 Adding cost approval attachment:",
                  file.name,
                  "with timestamp:",
                  attachmentTimestamp
                );
                formDataToSend.append(
                  `complaint[cost_approval_requests_attributes][${timestamp}][attachments_attributes][${attachmentTimestamp}][document]`,
                  file
                );
              }
            });
          }
        });
      }

      // Handle asset/service selection properly
      console.log("🏢 Asset/Service selection debug:", {
        associatedTo: formData.associatedTo,
        selectedAsset: formData.selectedAsset,
        selectedService: formData.selectedService,
      });

      if (formData.associatedTo.asset) {
        console.log("📦 Setting Asset parameters");
        formDataToSend.append("checklist_type", "Asset");
        formDataToSend.append("asset_id", formData.selectedAsset || "");
        formDataToSend.append("service_id", "");
        // Add default complaint_comment[] parameter for asset
        formDataToSend.append("complaint_comment", "");
      } else if (formData.associatedTo.service) {
        console.log("🔧 Setting Service parameters");
        formDataToSend.append("checklist_type", "Service");
        formDataToSend.append("asset_id", "");
        formDataToSend.append("service_id", formData.selectedService || "");
        // Add default complaint_comment[] parameter for service
        formDataToSend.append("complaint_comment", "");
      } else {
        console.log("❌ No asset/service selected");
        // Default case when neither is selected
        formDataToSend.append("checklist_type", "");
        formDataToSend.append("asset_id", "");
        formDataToSend.append("service_id", "");
      }

      // Add file attachments if any
      attachments.forEach((file) => {
        formDataToSend.append("attachments[]", file);
      });

      // Log FormData contents for debugging
      console.log("FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      // Get authentication token with fallback
      const authToken = API_CONFIG.TOKEN || getToken();
      console.log("Using TOKEN from API config:", API_CONFIG.TOKEN ? 'Token present' : 'Token missing');
      console.log("Using fallback getToken():", getToken() ? 'Token present' : 'Token missing');
      console.log("Final authToken:", authToken ? 'Token present' : 'Token missing');
      console.log("Using BASE_URL from API config:", API_CONFIG.BASE_URL);

      if (!authToken) {
        console.error("No authentication token found in API config or auth utils");
        throw new Error("No authentication token found. Please login again.");
      }

      const apiUrl = getFullUrl(API_CONFIG.ENDPOINTS.UPDATE_TICKET);
      console.log("Making API call to:", apiUrl);

      // Make API call using API_CONFIG for baseURL and token
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: getAuthHeader(),
          // Note: Don't set Content-Type for FormData - browser sets it automatically with boundary
        },
        body: formDataToSend,
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);

        if (response.status === 401) {
          console.error("401 Authentication failed - invalid or expired token");
          throw new Error("Authentication failed. Please login again.");
        }
      }

      const result = await response.json();
      console.log("API Response:", result);

      // Extract ticket number from response or use the one from original ticket data
      const ticketNumber = result?.ticket_number || result?.complaint?.ticket_number || ticketApiData?.ticket_number || `#${ticketId}`;

      toast({
        title: "Success",
        description: `Successfully updated ticket ${ticketNumber}.`,
      });

      // Redirect to ticket details page
      navigate(`/maintenance/ticket/details/${ticketId}`);
    } catch (error) {
      console.error("Error updating tickets:", error);

      // Handle authentication errors specifically
      if (error instanceof Error && error.message.includes("Authentication failed")) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        });
        // Optionally redirect to login page
        // navigate("/login");
        return;
      }

      toast({
        title: "Error",
        description: `Failed to update tickets: ${error instanceof Error ? error.message : "Unknown error"
          }`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToList = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full p-6">
        {/* Header */}
        <button
          onClick={handleBackToList}
          className="flex items-center gap-1 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Ticket List
        </button>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">UPDATE TICKET</h1>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="">
            <div className="flex flex-col items-center justify-center h-20 space-y-4">
              <div className="text-lg text-gray-600">Loading ticket....</div>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            {/* Section 1: Ticket Information */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                    <Ticket size={16} color="#C72030" />
                  </span>
                  Ticket Information
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Title */}
                  <div className="space-y-1">
                    <TextField
                      label="Title"
                      placeholder="Enter title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      disabled
                      fullWidth
                      variant="outlined"
                      // multiline
                      // rows={2}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      InputProps={{
                        sx: {
                          ...fieldStyles,
                          backgroundColor: '#f9fafb',
                        },
                      }}
                    />
                  </div>

                  {/* Preventive Action */}
                  <div className="space-y-1">
                    <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                      <InputLabel shrink>Preventive Action</InputLabel>
                      <MuiSelect
                        value={formData.preventiveAction}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          handleInputChange("preventiveAction", selectedValue);

                          // Find the template and store its ID
                          const selectedTemplate = communicationTemplates.find(
                            t => t.identifier === "Preventive Action" && t.identifier_action === selectedValue
                          );
                          if (selectedTemplate) {
                            setFormData(prev => ({
                              ...prev,
                              preventiveActionTemplateIds: [selectedTemplate.id]
                            }));
                            console.log('📝 Preventive Action Template ID stored:', selectedTemplate.id);
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              preventiveActionTemplateIds: []
                            }));
                          }
                        }}
                        label="Preventive Action"
                        notched
                        displayEmpty
                        disabled={loadingTemplates}
                      >
                        <MenuItem value="">
                          <span className="text-gray-500">
                            {loadingTemplates ? 'Loading templates...' : 'Select preventive action'}
                          </span>
                        </MenuItem>
                        {communicationTemplates
                          .filter(template => template.identifier === "Preventive Action" && template?.active === true)
                          .map((template) => (
                            <MenuItem key={template.id} value={template.identifier_action}>
                              {template.identifier_action}
                            </MenuItem>
                          ))}
                      </MuiSelect>
                    </FormControl>
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{ '& .MuiInputBase-root': fieldStyles }}
                    >
                      <InputLabel shrink>Status</InputLabel>
                      <MuiSelect
                        value={formData.selectedStatus}
                        onChange={(e) => handleInputChange("selectedStatus", e.target.value)}
                        label="Status"
                        notched
                        displayEmpty
                      >
                        <MenuItem value="">
                          <span className="text-gray-500">Select status</span>
                        </MenuItem>
                        {complaintStatuses.map((status) => (
                          <MenuItem key={status.id} value={status.id.toString()}>
                            {status.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Assignment Details */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                    <Users size={16} color="#C72030" />
                  </span>
                  Assignment Details
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Responsible Person */}
                  <div className="space-y-1">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{ '& .MuiInputBase-root': fieldStyles }}
                    >
                      <InputLabel shrink>Responsible Person</InputLabel>
                      <MuiSelect
                        value={formData.responsiblePerson}
                        onChange={(e) => handleInputChange("responsiblePerson", e.target.value)}
                        label="Responsible Person"
                        notched
                        displayEmpty
                      >
                        <MenuItem value="">
                          <span className="text-gray-500">Select responsible person</span>
                        </MenuItem>
                        {fmUsers.map((user) => (
                          <MenuItem key={user.id} value={user.id.toString()}>
                            {user.full_name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>

                  {/* Review (Tracking) */}
                  <div className="space-y-1">
                    <TextField
                      label="Review (Tracking)"
                      type="date"
                      value={reviewDate}
                      onChange={(e) => setReviewDate(e.target.value)}
                      fullWidth
                      variant="outlined"
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      InputProps={{
                        sx: fieldStyles,
                      }}
                    />
                  </div>

                  {/* Category Type */}
                  <div className="space-y-1">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      required
                      disabled={helpdeskLoading}
                      sx={{ '& .MuiInputBase-root': fieldStyles }}
                    >
                      <InputLabel shrink>Category Type</InputLabel>
                      <MuiSelect
                        value={formData.categoryType}
                        onChange={(e) => handleInputChange("categoryType", e.target.value)}
                        label="Category Type"
                        notched
                        displayEmpty
                      >
                        <MenuItem value="">
                          <span className="text-gray-500">Select category</span>
                        </MenuItem>
                        {helpdeskData?.helpdesk_categories?.map((category) => (
                          <MenuItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Priority & Classification */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                    <AlertTriangle size={16} color="#C72030" />
                  </span>
                  Priority & Classification
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Proactive/Reactive */}
                  <div className="space-y-1">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{ '& .MuiInputBase-root': fieldStyles }}
                    >
                      <InputLabel shrink>Proactive/Reactive</InputLabel>
                      <MuiSelect
                        value={formData.proactiveReactive}
                        onChange={(e) => handleInputChange("proactiveReactive", e.target.value)}
                        label="Proactive/Reactive"
                        notched
                        displayEmpty
                      >
                        <MenuItem value="">
                          <span className="text-gray-500">Select proactive/reactive</span>
                        </MenuItem>
                        <MenuItem value="Proactive">Proactive</MenuItem>
                        <MenuItem value="Reactive">Reactive</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>

                  {/* Sub Category Type */}
                  <div className="space-y-1">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      disabled={subCategoriesLoading || !formData.categoryType}
                      sx={{ '& .MuiInputBase-root': fieldStyles }}
                    >
                      <InputLabel shrink>Sub Category Type</InputLabel>
                      <MuiSelect
                        value={formData.subCategoryType}
                        onChange={(e) => handleInputChange("subCategoryType", e.target.value)}
                        label="Sub Category Type"
                        notched
                        displayEmpty
                      >
                        <MenuItem value="">
                          <span className="text-gray-500">Select Category First</span>
                        </MenuItem>
                        {Array.isArray(subCategories) &&
                          subCategories.map((subCategory) => (
                            <MenuItem key={subCategory.id} value={subCategory.id.toString()}>
                              {subCategory.name}
                            </MenuItem>
                          ))}
                      </MuiSelect>
                    </FormControl>
                  </div>

                  {/* Assign To */}
                  <div className="space-y-1">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{ '& .MuiInputBase-root': fieldStyles }}
                    >
                      <InputLabel shrink>Assigned To</InputLabel>
                      <MuiSelect
                        value={formData.assignTo}
                        onChange={(e) => handleInputChange("assignTo", e.target.value)}
                        label="Assigned To"
                        notched
                        displayEmpty
                      >
                        <MenuItem value="">
                          <span className="text-gray-500">Select engineer</span>
                        </MenuItem>
                        {fmUsers.map((user) => (
                          <MenuItem key={user.id} value={user.id.toString()}>
                            {user.full_name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Additional Details */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                    <Settings size={16} color="#C72030" />
                  </span>
                  Additional Details
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Admin Priority */}
                  <div className="space-y-1">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{ '& .MuiInputBase-root': fieldStyles }}
                    >
                      <InputLabel shrink>Admin Priority</InputLabel>
                      <MuiSelect
                        value={formData.adminPriority}
                        onChange={(e) => handleInputChange("adminPriority", e.target.value)}
                        label="Admin Priority"
                        notched
                        displayEmpty
                      >
                        <MenuItem value="">
                          <span className="text-gray-500">Select admin priority</span>
                        </MenuItem>
                        <MenuItem value="P1">P1 - Critical</MenuItem>
                        <MenuItem value="P2">P2 - Very High</MenuItem>
                        <MenuItem value="P3">P3 - High</MenuItem>
                        <MenuItem value="P4">P4 - Medium</MenuItem>
                        <MenuItem value="P5">P5 - Low</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>

                  {/* Severity */}
                  <div className="space-y-1">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{ '& .MuiInputBase-root': fieldStyles }}
                    >
                      <InputLabel shrink>Severity</InputLabel>
                      <MuiSelect
                        value={formData.severity}
                        onChange={(e) => handleInputChange("severity", e.target.value)}
                        label="Severity"
                        notched
                        displayEmpty
                      >
                        <MenuItem value="">
                          <span className="text-gray-500">Select severity</span>
                        </MenuItem>
                        <MenuItem value="Major">Major</MenuItem>
                        <MenuItem value="Minor">Minor</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>

                  {/* External Priority */}
                  <div className="space-y-1">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{ '& .MuiInputBase-root': fieldStyles }}
                    >
                      <InputLabel shrink>External Priority</InputLabel>
                      <MuiSelect
                        value={formData.externalPriority}
                        onChange={(e) => handleInputChange("externalPriority", e.target.value)}
                        label="External Priority"
                        notched
                        displayEmpty
                      >
                        <MenuItem value="">
                          <span className="text-gray-500">Select external priority</span>
                        </MenuItem>
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>

                  {/* Mode */}
                  <div className="space-y-1">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{ '& .MuiInputBase-root': fieldStyles }}
                    >
                      <InputLabel shrink>Mode</InputLabel>
                      <MuiSelect
                        value={formData.mode}
                        onChange={(e) => handleInputChange("mode", e.target.value)}
                        label="Mode"
                        notched
                        displayEmpty
                      >
                        <MenuItem value="">
                          <span className="text-gray-500">Select mode</span>
                        </MenuItem>
                        {complaintModes.map((mode) => (
                          <MenuItem key={mode.id} value={mode.id.toString()}>
                            {mode.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>

                  {/* Root Cause */}
                  <div className="flex flex-col">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{ '& .MuiInputBase-root': fieldStyles }}
                    >
                      <InputLabel shrink>Root Cause Analysis</InputLabel>
                      <MuiSelect
                        multiple
                        label="Root Cause Analysis"
                        notched
                        displayEmpty
                        value={getRootCauseAnalysisValues()}
                        onChange={(e) => handleRootCauseChange(e.target.value)}
                        renderValue={(selected) => {
                          if (!selected || (Array.isArray(selected) && selected.length === 0)) {
                            return <span style={{ color: '#aaa' }}>Select Root Cause Analysis</span>;
                          }

                          // Convert selected IDs back to display text
                          const selectedIds = Array.isArray(selected) ? selected : [selected];
                          const selectedTemplates = communicationTemplates.filter(
                            t => selectedIds.includes(t.id)
                          );

                          return selectedTemplates.map(t => t.identifier_action).join(', ');
                        }}
                        disabled={loadingTemplates}
                      >
                        <MenuItem value="" disabled>
                          <span className="text-gray-500">
                            {loadingTemplates ? 'Loading templates...' : 'Select Root Cause Analysis'}
                          </span>
                        </MenuItem>
                        {communicationTemplates
                          .filter(template => template.identifier === "Root Cause Analysis" && template?.active === true)
                          .map((template) => (
                            <MenuItem key={template.id} value={template.id}>
                              {template.identifier_action}
                            </MenuItem>
                          ))}
                      </MuiSelect>
                    </FormControl>
                  </div>

                  {/* Short-term Impact */}
                  <div className="space-y-1">
                    <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                      <InputLabel shrink>Short-term Impact</InputLabel>
                      <MuiSelect
                        value={formData.impact}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          handleInputChange("impact", selectedValue);

                          // Find the template and store its ID
                          const selectedTemplate = communicationTemplates.find(
                            t => t.identifier === "Short-term Impact" && t.identifier_action === selectedValue
                          );
                          if (selectedTemplate) {
                            setFormData(prev => ({
                              ...prev,
                              shortTermImpactTemplateIds: [selectedTemplate.id]
                            }));
                            console.log('📝 Short-term Impact Template ID stored:', selectedTemplate.id);
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              shortTermImpactTemplateIds: []
                            }));
                          }
                        }}
                        label="Short-term Impact"
                        notched
                        displayEmpty
                        disabled={loadingTemplates}
                      >
                        <MenuItem value="">
                          <span className="text-gray-500">
                            {loadingTemplates ? 'Loading templates...' : 'Select short-term impact'}
                          </span>
                        </MenuItem>
                        {communicationTemplates
                          .filter(template => template.identifier === "Short-term Impact" && template?.active === true)
                          .map((template) => (
                            <MenuItem key={template.id} value={template.identifier_action}>
                              {template.identifier_action}
                            </MenuItem>
                          ))}
                      </MuiSelect>
                    </FormControl>
                  </div>

                  {/* Correction */}
                  <div className="space-y-1">
                    <TextField
                      label="Correction"
                      placeholder="Enter correction"
                      value={formData.correction}
                      onChange={(e) => handleInputChange("correction", e.target.value)}
                      fullWidth
                      variant="outlined"
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      InputProps={{
                        sx: fieldStyles,
                      }}
                    />
                  </div>

                  {/* Long-term Impact */}
                  <div className="space-y-1">
                    <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                      <InputLabel shrink>Long-term Impact</InputLabel>
                      <MuiSelect
                        value={formData.longTermImpact}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          handleInputChange("longTermImpact", selectedValue);

                          // Find the template and store its ID
                          const selectedTemplate = communicationTemplates.find(
                            t => t.identifier === "Long-term Impact" && t.identifier_action === selectedValue
                          );
                          if (selectedTemplate) {
                            setFormData(prev => ({
                              ...prev,
                              longTermImpactTemplateIds: [selectedTemplate.id]
                            }));
                            console.log('📝 Long-term Impact Template ID stored:', selectedTemplate.id);
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              longTermImpactTemplateIds: []
                            }));
                          }
                        }}
                        label="Long-term Impact"
                        notched
                        displayEmpty
                        disabled={loadingTemplates}
                      >
                        <MenuItem value="">
                          <span className="text-gray-500">
                            {loadingTemplates ? 'Loading templates...' : 'Select long-term impact'}
                          </span>
                        </MenuItem>
                        {communicationTemplates
                          .filter(template => template.identifier === "Long-term Impact" && template?.active === true)
                          .map((template) => (
                            <MenuItem key={template.id} value={template.identifier_action}>
                              {template.identifier_action}
                            </MenuItem>
                          ))}
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <div className="space-y-1">
                    <TextField
                      label="Reference Number"
                      placeholder="Enter reference number"
                      value={formData.refNumber}
                      onChange={(e) => handleInputChange("refNumber", e.target.value)}
                      fullWidth
                      variant="outlined"
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      InputProps={{
                        sx: fieldStyles,
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                      <InputLabel shrink>Corrective Action</InputLabel>
                      <MuiSelect
                        value={formData.correctiveAction}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          handleInputChange("correctiveAction", selectedValue);

                          // Find the template and store its ID
                          const selectedTemplate = communicationTemplates.find(
                            t => t.identifier === "Corrective Action" && t.identifier_action === selectedValue
                          );
                          if (selectedTemplate) {
                            setFormData(prev => ({
                              ...prev,
                              correctiveActionTemplateIds: [selectedTemplate.id]
                            }));
                            console.log('📝 Corrective Action Template ID stored:', selectedTemplate.id);
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              correctiveActionTemplateIds: []
                            }));
                          }
                        }}
                        label="Corrective Action"
                        notched
                        displayEmpty
                        disabled={loadingTemplates}
                      >
                        <MenuItem value="">
                          <span className="text-gray-500">
                            {loadingTemplates ? 'Loading templates...' : 'Select corrective action'}
                          </span>
                        </MenuItem>
                        {communicationTemplates
                          .filter(template => template.identifier === "Corrective Action" && template?.active === true)
                          .map((template) => (
                            <MenuItem key={template.id} value={template.identifier_action}>
                              {template.identifier_action}
                            </MenuItem>
                          ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div className="space-y-1">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{ '& .MuiInputBase-root': fieldStyles }}
                    >
                      <InputLabel shrink>Service Type</InputLabel>
                      <MuiSelect
                        value={formData.serviceType}
                        onChange={(e) => handleInputChange("serviceType", e.target.value)}
                        label="Service Type"
                        notched
                        displayEmpty
                      >
                        <MenuItem value="">
                          <span className="text-gray-500">Select service type</span>
                        </MenuItem>
                        {[
                          { id: 'product', name: 'Product' },
                          { id: 'service', name: 'Service' }
                        ].map((type) => (
                          <MenuItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Location Details */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                    <MapPin size={16} color="#C72030" />
                  </span>
                  Location Details
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Building */}
                  <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{ '& .MuiInputBase-root': fieldStyles }}
                  >
                    <InputLabel shrink>Building</InputLabel>
                    <MuiSelect
                      value={formData.building}
                      onChange={(e) => handleBuildingChange(e.target.value)}
                      label="Building"
                      notched
                      displayEmpty
                      disabled={loadingBuildings}
                    >
                      <MenuItem value="">
                        {loadingBuildings ? "Loading..." : "Select Building"}
                      </MenuItem>
                      {buildings.map((building) => (
                        <MenuItem key={building.id} value={building.id.toString()}>
                          {building.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  {/* Wing */}
                  <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{ '& .MuiInputBase-root': fieldStyles }}
                  >
                    <InputLabel shrink>Wing</InputLabel>
                    <MuiSelect
                      value={formData.wing}
                      onChange={(e) => handleWingChange(e.target.value)}
                      label="Wing"
                      notched
                      displayEmpty
                      disabled={loadingWings || !formData.building}
                    >
                      <MenuItem value="">
                        {loadingWings ? "Loading..." :
                          !formData.building ? "Select Building First" : "Select Wing"}
                      </MenuItem>
                      {filteredWings.map((wing) => (
                        <MenuItem key={wing.id} value={wing.id.toString()}>
                          {wing.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  {/* Area */}
                  <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{ '& .MuiInputBase-root': fieldStyles }}
                  >
                    <InputLabel shrink>Area</InputLabel>
                    <MuiSelect
                      value={formData.area}
                      onChange={(e) => handleAreaChange(e.target.value)}
                      label="Area"
                      notched
                      displayEmpty
                      disabled={loadingAreas || !formData.wing}
                    >
                      <MenuItem value="">
                        {loadingAreas ? "Loading..." :
                          !formData.wing ? "Select Wing First" : "Select Area"}
                      </MenuItem>
                      {filteredAreas.map((area) => (
                        <MenuItem key={area.id} value={area.id.toString()}>
                          {area.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  {/* Floor */}
                  <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{ '& .MuiInputBase-root': fieldStyles }}
                  >
                    <InputLabel shrink>Floor</InputLabel>
                    <MuiSelect
                      value={formData.floor}
                      onChange={(e) => handleFloorChange(e.target.value)}
                      label="Floor"
                      notched
                      displayEmpty
                      disabled={loadingFloors || !formData.area}
                    >
                      <MenuItem value="">
                        {loadingFloors ? "Loading..." :
                          !formData.area ? "Select Area First" : "Select Floor"}
                      </MenuItem>
                      {filteredFloors.map((floor) => (
                        <MenuItem key={floor.id} value={floor.id.toString()}>
                          {floor.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  {/* Room */}
                  <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{ '& .MuiInputBase-root': fieldStyles }}
                  >
                    <InputLabel shrink>Room</InputLabel>
                    <MuiSelect
                      value={formData.room}
                      onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                      label="Room"
                      notched
                      displayEmpty
                      disabled={loadingRooms || !formData.floor}
                    >
                      <MenuItem value="">
                        {loadingRooms ? "Loading..." :
                          !formData.floor ? "Select Floor First" : "Select Room"}
                      </MenuItem>
                      {filteredRooms.map((room) => (
                        <MenuItem key={room.id} value={room.id.toString()}>
                          {room.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </div>
              </div>
            </div>

            {/* Section 6: Issue Related To */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                    <Building size={16} color="#C72030" />
                  </span>
                  Issue Related To
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Issue Related To */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Related To
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="issueRelatedTo"
                          value="Projects"
                          checked={formData.issueRelatedTo === "Projects"}
                          onChange={(e) => handleInputChange("issueRelatedTo", e.target.value)}
                          style={{
                            accentColor: "#C72030",
                            width: "16px",
                            height: "16px",
                            borderColor: "#C72030",
                          }}
                        />
                        <span className="text-sm text-gray-700">Project</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="issueRelatedTo"
                          value="FM"
                          checked={formData.issueRelatedTo === "FM"}
                          onChange={(e) =>
                            handleInputChange("issueRelatedTo", e.target.value)
                          }
                          style={{
                            accentColor: "#C72030",
                            width: "16px",
                            height: "16px",
                            borderColor: "#C72030",
                          }}
                        />
                        <span className="text-sm text-gray-700">FM</span>
                      </label>
                    </div>
                  </div>

                  {/* Associated To */}
                  <div className="space-y-1">

                    <label className="block text-sm font-medium text-gray-700 mb-2">Associated To</label>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="associatedTo"
                            value="asset"
                            checked={formData.associatedTo.asset}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData((prev) => ({
                                  ...prev,
                                  associatedTo: { asset: true, service: false },
                                  selectedService: "", // Reset service selection
                                }));
                                fetchAssets(false); // Don't auto-select when manually changing
                              }
                            }}
                            style={{
                              accentColor: "#C72030",
                              width: "16px",
                              height: "16px",
                              borderColor: "#C72030",
                            }}
                          />
                          <span className="text-sm text-gray-700">Asset</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="associatedTo"
                            value="service"
                            checked={formData.associatedTo.service}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData((prev) => ({
                                  ...prev,
                                  associatedTo: { asset: false, service: true },
                                  selectedAsset: "", // Reset asset selection
                                }));
                                fetchServices(false); // Don't auto-select when manually changing
                              }
                            }}
                            style={{
                              accentColor: "#C72030",
                              width: "16px",
                              height: "16px",
                              borderColor: "#C72030",
                            }}
                          />
                          <span className="text-sm text-gray-700">Service</span>
                        </label>
                      </div>
                      {(formData.associatedTo.asset || formData.associatedTo.service) && (
                        <FormControl
                          fullWidth
                          variant="outlined"
                          sx={{
                            minWidth: 260, // Increased width
                            maxWidth: 340, // Optional: limit max width
                            ...fieldStyles,
                          }}
                        >
                          <InputLabel shrink>{formData.associatedTo.asset ? "Select Asset" : "Select Service"}</InputLabel>
                          <MuiSelect
                            value={formData.associatedTo.asset ? formData.selectedAsset : formData.selectedService}
                            onChange={(e) => {
                              if (formData.associatedTo.asset) {
                                handleInputChange("selectedAsset", e.target.value);
                              } else {
                                handleInputChange("selectedService", e.target.value);
                              }
                            }}
                            label={formData.associatedTo.asset ? "Select Asset" : "Select Service"}
                            notched
                            displayEmpty
                            disabled={isLoadingAssets || isLoadingServices}
                          >
                            <MenuItem value="">
                              <span className="text-gray-500">{isLoadingAssets || isLoadingServices ? "Loading..." : `Select ${formData.associatedTo.asset ? "Asset" : "Service"}`}</span>
                            </MenuItem>
                            {formData.associatedTo.asset && assetOptions.length > 0 &&
                              assetOptions.map((asset) => (
                                <MenuItem key={asset.id} value={asset.id.toString()}>
                                  {asset.name}
                                </MenuItem>
                              ))}
                            {formData.associatedTo.service && serviceOptions.length > 0 &&
                              serviceOptions.map((service) => (
                                <MenuItem key={service.id} value={service.id.toString()}>
                                  {service.service_name}
                                </MenuItem>
                              ))}
                          </MuiSelect>
                        </FormControl>
                      )}
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Comments
                  </label>
                  <Textarea
                    value={formData.comments}
                    onChange={(e) => handleInputChange("comments", e.target.value)}
                    rows={4}
                    className="text-base border rounded min-h-[100px] w-full border-gray-300 bg-white px-3 py-2 focus:outline-none"
                    placeholder="Add comment"
                  />
                  <div className="mt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.costInvolved}
                        onChange={(e) => handleCostInvolvedChange(e.target.checked)}
                        style={{
                          accentColor: '#C72030',
                          width: '12px',
                          height: '12px',
                        }}
                        className="mr-2"
                      />
                      Cost Involved
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 7: Cost Approval Requests */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                    <DollarSign size={16} color="#C72030" />
                  </span>
                  Cost Approval Requests
                </h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">
                          Request Id
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">
                          Comments
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">
                          Created On
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">
                          Created By
                        </th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700 border-b">
                          L1
                        </th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700 border-b">
                          L2
                        </th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700 border-b">
                          L3
                        </th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700 border-b">
                          L4
                        </th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700 border-b">
                          L5
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">
                          Master Status
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">
                          Cancelled By
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">
                          Attachments
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {costApprovalRequests.length > 0 ? (
                        costApprovalRequests.map((request) => (
                          <tr key={request.id}>
                            <td className="px-4 py-3 text-gray-900 border-b">
                              {request.id}
                            </td>
                            <td className="px-4 py-3 text-gray-900 border-b">
                              {request.amount}
                            </td>
                            <td className="px-4 py-3 text-gray-900 border-b">
                              {request.comments}
                            </td>
                            <td className="px-4 py-3 text-gray-900 border-b">
                              {request.createdOn}
                            </td>
                            <td className="px-4 py-3 text-gray-900 border-b">
                              {request.createdBy}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-900 border-b">
                              {request.approvals?.L1 || "-"}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-900 border-b">
                              {request.approvals?.L2 || "-"}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-900 border-b">
                              {request.approvals?.L3 || "-"}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-900 border-b">
                              {request.approvals?.L4 || "-"}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-900 border-b">
                              {request.approvals?.L5 || "-"}
                            </td>
                            <td className="px-4 py-3 text-gray-900 border-b">
                              {request.masterStatus || "Pending"}
                            </td>
                            <td className="px-4 py-3 text-gray-900 border-b">
                              {request.cancelledBy || "-"}
                            </td>
                            <td className="px-4 py-3 text-gray-900 border-b">
                              {request.attachments &&
                                request.attachments.length > 0 ? (
                                <div className="flex flex-col gap-1 max-w-xs">
                                  {request.attachments.map(
                                    (attachment, index) => {
                                      const fileName =
                                        attachment.name ||
                                        (attachment.url
                                          ? attachment.url.split("/").pop()
                                          : `Attachment ${index + 1}`);

                                      return (
                                        <button
                                          key={index}
                                          onClick={() => {
                                            if (attachment.url) {
                                              // API attachment with URL
                                              handleDownloadAttachment(
                                                attachment.url,
                                                fileName
                                              );
                                            } else if (
                                              attachment instanceof File
                                            ) {
                                              // File object (new upload)
                                              handleDownloadAttachment(
                                                attachment
                                              );
                                            } else {
                                              // Fallback for other formats
                                              handleDownloadAttachment(
                                                attachment,
                                                fileName
                                              );
                                            }
                                          }}
                                          className="flex items-center gap-2 text-[#C72030] hover:text-[#a81926] rounded px-2 py-1 text-sm text-left transition-colors"
                                          title="Download attachment"
                                        >
                                          <Download className="w-4 h-4 flex-shrink-0" />
                                          <span className="truncate">
                                            {fileName}
                                          </span>
                                        </button>
                                      );
                                    }
                                  )}
                                  {request.attachments.length > 1 && (
                                    <span className="text-xs text-gray-500 mt-1">
                                      {request.attachments.length} file(s) total
                                    </span>
                                  )}
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            className="px-4 py-3 text-gray-500 text-center"
                            colSpan={13}
                          >
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <Button
                type="submit"
                className="bg-[#C72030] text-white hover:bg-[#C72030]/90 px-8 py-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "SAVING..." : "SAVE"}
              </Button>
            </div>
          </form>
        )}

        {/* Cost Popup Modal */}
        {showCostPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 max-w-md mx-4">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  Cost involved
                </h3>
                <button
                  onClick={handleCostPopupClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Cost Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={costPopupData.cost}
                    onChange={(e) => {
                      const value = e.target.value;

                      const regex = /^\d*\.?\d{0,2}$/;
                      if (regex.test(value) && Number(value) >= 0) {
                        setCostPopupData(prev =>
                          ({ ...prev, cost: value })
                        );
                      }
                    }}
                    placeholder="Enter Cost"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={costPopupData.description}
                    onChange={(e) =>
                      setCostPopupData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Enter Description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                  />
                </div>

                {/* Attachment Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attachment<span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      id="cost-popup-file-upload"
                      multiple
                      onChange={handleCostPopupFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="cost-popup-file-upload"
                      className="cursor-pointer flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Files
                    </label>
                  </div>

                  {/* Display uploaded files in popup */}
                  {costPopupData.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {costPopupData.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                        >
                          <span className="text-gray-700">{file.name}</span>
                          <Button
                            onClick={() => removeCostPopupAttachment(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t">
                <div className="flex justify-center">
                  <Button
                    onClick={handleCostPopupSubmit}
                    className="bg-[#C72030] text-white hover:bg-[#C72030]/90 px-8 py-2"
                    disabled={!costPopupData.cost || !costPopupData.description}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateTicketsPage;
