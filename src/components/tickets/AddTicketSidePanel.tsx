/**
 * AddTicketSidePanel
 *
 * A self-contained side-panel (slides in from the right, half screen) that renders
 * the full "Add Ticket" form — identical UI to AddTicketDashboardEmployee.
 *
 * HOW TO USE:
 * -----------
 * 1. Import this component wherever you need it.
 * 2. Maintain an `open` boolean state and an `onClose` callback in the parent.
 * 3. Pass `onSuccess` if you want to refresh data after a ticket is created.
 *
 * Example:
 *   import { AddTicketSidePanel } from '@/components/tickets/AddTicketSidePanel';
 *
 *   const [openPanel, setOpenPanel] = useState(false);
 *
 *   <Button onClick={() => setOpenPanel(true)}>+ Add Ticket</Button>
 *   <AddTicketSidePanel
 *     open={openPanel}
 *     onClose={() => setOpenPanel(false)}
 *     onSuccess={() => refetchTickets()}   // optional
 *   />
 */

import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, Slide, FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import { X, Upload, Paperclip, Ticket, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { ticketManagementAPI, CategoryResponse, SubCategoryResponse, UserAccountResponse, OccupantUserResponse } from '@/services/ticketManagementAPI';
import { employeeTicketAPI } from '@/services/employeeTicketAPI';
import { FMUser } from '@/store/slices/fmUserSlice';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';

// ─── Transition: slides in from the right ───────────────────────────────────

const SlideLeft = forwardRef(function SlideLeft(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface ComplaintModeResponse {
  id: number;
  name: string;
}

interface AreaResponse {
  id: number;
  name: string;
  wing_id: string;
  building_id: string;
}

interface BuildingResponse {
  id: number;
  name: string;
  site_id: string;
}

interface WingResponse {
  id: number;
  name: string;
  building_id: string;
}

interface FloorResponse {
  id: number;
  name: string;
  wing_id: number;
  area_id: number;
  building_id: string;
}

interface RoomResponse {
  id: number;
  name: string;
  floor_id: number;
  wing_id: number;
  area_id: string;
  building_id: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PRIORITY_OPTIONS = [
  { value: 'P1', label: 'P1 - Critical' },
  { value: 'P2', label: 'P2 - Very High' },
  { value: 'P3', label: 'P3 - High' },
  { value: 'P4', label: 'P4 - Medium' },
  { value: 'P5', label: 'P5 - Low' },
];

const fieldStyles = {
  height: '45px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  '& .MuiOutlinedInput-root': {
    height: '45px',
    '& fieldset': { borderColor: '#ddd' },
    '&:hover fieldset': { borderColor: '#C72030' },
    '&.Mui-focused fieldset': { borderColor: '#C72030' },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': { color: '#C72030' },
  },
};

// ─── localStorage helpers ────────────────────────────────────────────────────

const getUserDataFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    const department =
      user.department_name ||
      user.designation ||
      user.department ||
      user.role_name ||
      user.lock_user_permission?.designation ||
      user.user_permission?.designation ||
      user.profile?.designation ||
      user.profile?.department_name ||
      '';
    return {
      name: `${user.firstname || ''} ${user.lastname || ''}`.trim(),
      department,
      contactNumber: user.mobile || user.contactNumber || '',
      site_id: user.site_id,
      id: user.id,
      email: user.email || '',
      company_id: user.company_id || '',
    };
  } catch {
    return null;
  }
};

const getFMUsersFromLocalStorage = (): FMUser[] => {
  try {
    const raw = localStorage.getItem('fmUsers');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const getOccupantUsersFromLocalStorage = (): OccupantUserResponse[] => {
  try {
    const raw = localStorage.getItem('occupantUsers');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// ─── Props ───────────────────────────────────────────────────────────────────

interface AddTicketSidePanelProps {
  /** Controls whether the panel is visible */
  open: boolean;
  /** Called when the user closes the panel */
  onClose: () => void;
  /** Optional callback fired after a ticket is successfully created */
  onSuccess?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const AddTicketSidePanel: React.FC<AddTicketSidePanelProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  // ── Ticket type ──────────────────────────────────────────────────────────
  const [onBehalfOf, setOnBehalfOf] = useState('self');
  const [ticketType, setTicketType] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFieldsReadOnly, setIsFieldsReadOnly] = useState(false);
  const [isGoldenTicket] = useState(false);
  const [isFlagged] = useState(false);

  // ── Dropdown data ────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategoryResponse[]>([]);
  const [fmUsers, setFmUsers] = useState<FMUser[]>([]);
  const [occupantUsers, setOccupantUsers] = useState<OccupantUserResponse[]>([]);
  const [userAccount, setUserAccount] = useState<UserAccountResponse | null>(null);
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>([]);
  const [buildings, setBuildings] = useState<BuildingResponse[]>([]);
  const [filteredWings, setFilteredWings] = useState<WingResponse[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<AreaResponse[]>([]);
  const [filteredFloors, setFilteredFloors] = useState<FloorResponse[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomResponse[]>([]);
  const [webComplaintModeId, setWebComplaintModeId] = useState<number | null>(null);

  // ── Loading ──────────────────────────────────────────────────────────────
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  // ── Form data ────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    site: 'Lockated',
    department: '',
    unit: '',
    categoryType: '',
    subCategoryType: '',
    description: '',
    assignedTo: '',
    proactiveReactive: '',
    adminPriority: '',
    severity: '',
    referenceNumber: '',
    mode: '',
    vendor: '',
    area: '',
    building: '',
    wing: '',
    floor: '',
    room: '',
  });

  // ── Reset when panel opens/closes ────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setOnBehalfOf('self');
      setTicketType('');
      setSelectedUser('');
      setSelectedUserId(null);
      setAttachedFiles([]);
      setIsFieldsReadOnly(false);
      setFormData({
        name: '',
        contactNumber: '',
        site: 'Lockated',
        department: '',
        unit: '',
        categoryType: '',
        subCategoryType: '',
        description: '',
        assignedTo: '',
        proactiveReactive: 'Proactive',
        adminPriority: '',
        severity: '',
        referenceNumber: '',
        mode: '',
        vendor: '',
        area: '',
        building: '',
        wing: '',
        floor: '',
        room: '',
      });
    }
  }, [open]);

  // ── proactiveReactive default ────────────────────────────────────────────
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      proactiveReactive:
        onBehalfOf === 'self' || onBehalfOf === 'fm-user'
          ? 'Proactive'
          : onBehalfOf === 'occupant-user'
          ? 'Reactive'
          : '',
    }));
  }, [onBehalfOf]);

  // ── Load API data once on mount ──────────────────────────────────────────
  useEffect(() => {
    loadCategories();
    loadFMUsersFromStorage();
    loadOccupantUsersFromStorage();
    loadComplaintModes();
    loadBuildings();
    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load user when onBehalfOf === 'self' ─────────────────────────────────
  const loadUserAccountFromAPI = useCallback(async () => {
    setLoadingAccount(true);
    try {
      const response = await ticketManagementAPI.getUserAccount();
      setUserAccount(response);
      localStorage.setItem('user', JSON.stringify(response));
      if (onBehalfOf === 'self' && response) {
        setFormData((prev) => ({
          ...prev,
          name: `${response.firstname} ${response.lastname}`,
          department: response.department_name || '',
          contactNumber: response.mobile || '',
          unit: '',
          site: 'Lockated',
        }));
      }
    } catch {
      toast.error('Failed to load user account');
    } finally {
      setLoadingAccount(false);
    }
  }, [onBehalfOf]);

  const loadUserAccountFromStorage = useCallback(() => {
    setLoadingAccount(true);
    try {
      const userData = getUserDataFromLocalStorage();
      if (userData) {
        setUserAccount({
          firstname: userData.name.split(' ')[0] || '',
          lastname: userData.name.split(' ').slice(1).join(' ') || '',
          department_name: userData.department,
          mobile: userData.contactNumber,
          site_id: userData.site_id,
          id: userData.id,
          email: userData.email || '',
          company_id: userData.company_id || '',
        });
        if (onBehalfOf === 'self') {
          if (!userData.department) {
            loadUserAccountFromAPI();
            return;
          }
          setFormData((prev) => ({
            ...prev,
            name: userData.name,
            department: userData.department,
            contactNumber: userData.contactNumber,
            unit: '',
            site: 'Lockated',
          }));
        }
      } else {
        loadUserAccountFromAPI();
      }
    } catch {
      loadUserAccountFromAPI();
    } finally {
      setLoadingAccount(false);
    }
  }, [onBehalfOf, loadUserAccountFromAPI]);

  useEffect(() => {
    setSelectedUser('');
    setSelectedUserId(null);
    setIsFieldsReadOnly(false);
    if (onBehalfOf === 'self') {
      loadUserAccountFromStorage();
    } else {
      setFormData((prev) => ({
        ...prev,
        name: '',
        contactNumber: '',
        department: '',
        unit: '',
      }));
    }
  }, [onBehalfOf, loadUserAccountFromStorage]);

  useEffect(() => {
    if (onBehalfOf === 'self' && userAccount) {
      setFormData((prev) => ({
        ...prev,
        name: `${userAccount.firstname} ${userAccount.lastname}`,
        department: userAccount.department_name || '',
        contactNumber: userAccount.mobile || '',
        unit: '',
        site: 'Lockated',
      }));
    }
  }, [userAccount, onBehalfOf]);

  // ── Data loaders ─────────────────────────────────────────────────────────
  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await ticketManagementAPI.getCategories();
      setCategories(response.helpdesk_categories || []);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadSubcategories = async (categoryId: number) => {
    setLoadingSubcategories(true);
    try {
      const subcats = await ticketManagementAPI.getSubCategoriesByCategory(categoryId);
      setSubcategories(subcats);
    } catch {
      toast.error('Failed to load subcategories');
    } finally {
      setLoadingSubcategories(false);
    }
  };

  const loadFMUsersFromAPI = useCallback(async () => {
    try {
      const response = await ticketManagementAPI.getEngineers();
      const users = response.users || [];
      setFmUsers(users);
      localStorage.setItem('fmUsers', JSON.stringify(users));
    } catch {
      /* silent */
    }
  }, []);

  const loadFMUsersFromStorage = useCallback(() => {
    const data = getFMUsersFromLocalStorage();
    if (data.length > 0) {
      setFmUsers(data);
    } else {
      loadFMUsersFromAPI();
    }
  }, [loadFMUsersFromAPI]);

  const loadOccupantUsersFromAPI = useCallback(async () => {
    try {
      const response = await ticketManagementAPI.getOccupantUsers();
      setOccupantUsers(response);
      localStorage.setItem('occupantUsers', JSON.stringify(response));
    } catch {
      /* silent */
    }
  }, []);

  const loadOccupantUsersFromStorage = useCallback(() => {
    const data = getOccupantUsersFromLocalStorage();
    if (data.length > 0) {
      setOccupantUsers(data);
    } else {
      loadOccupantUsersFromAPI();
    }
  }, [loadOccupantUsersFromAPI]);

  const loadComplaintModes = async () => {
    try {
      const url = getFullUrl(API_CONFIG.ENDPOINTS.COMPLAINT_MODE);
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) throw new Error();
      const data = await response.json();
      const modes: ComplaintModeResponse[] = Array.isArray(data) ? data : [];
      const webMode = modes.find((m) => m.name.toLowerCase() === 'web');
      if (webMode) setWebComplaintModeId(webMode.id);
    } catch {
      /* silent */
    }
  };

  const loadBuildings = async () => {
    setLoadingBuildings(true);
    try {
      const url = getFullUrl('/pms/buildings.json');
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setBuildings(data.pms_buildings || data || []);
    } catch {
      /* silent */
    } finally {
      setLoadingBuildings(false);
    }
  };

  const fetchSuppliers = async () => {
    setLoadingSuppliers(true);
    try {
      const url = getFullUrl('/pms/suppliers.json');
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setSuppliers(
        Array.isArray(data.pms_suppliers)
          ? data.pms_suppliers.map((s: { id: number; company_name?: string }) => ({
              id: s.id,
              name: s.company_name || `Supplier #${s.id}`,
            }))
          : []
      );
    } catch {
      /* silent */
    } finally {
      setLoadingSuppliers(false);
    }
  };

  // ── Location handlers (cascaded) ─────────────────────────────────────────
  const handleBuildingChange = async (buildingId: string) => {
    setFormData((prev) => ({ ...prev, building: buildingId, wing: '', area: '', floor: '', room: '' }));
    setFilteredWings([]);
    setFilteredAreas([]);
    setFilteredFloors([]);
    setFilteredRooms([]);
    if (!buildingId) return;
    setLoadingWings(true);
    try {
      const url = getFullUrl(`/pms/wings.json?building_id=${buildingId}`);
      const response = await fetch(url, getAuthenticatedFetchOptions('GET'));
      if (response.ok) setFilteredWings((await response.json()).wings || []);
    } catch {
      /* silent */
    } finally {
      setLoadingWings(false);
    }
  };

  const handleWingChange = async (wingId: string) => {
    setFormData((prev) => ({ ...prev, wing: wingId, area: '', floor: '', room: '' }));
    setFilteredAreas([]);
    setFilteredFloors([]);
    setFilteredRooms([]);
    if (!wingId) return;
    setLoadingAreas(true);
    try {
      const url = getFullUrl(`/pms/areas.json?wing_id=${wingId}`);
      const response = await fetch(url, getAuthenticatedFetchOptions('GET'));
      if (response.ok) setFilteredAreas((await response.json()).areas || []);
    } catch {
      /* silent */
    } finally {
      setLoadingAreas(false);
    }
  };

  const handleAreaChange = async (areaId: string) => {
    setFormData((prev) => ({ ...prev, area: areaId, floor: '', room: '' }));
    setFilteredFloors([]);
    setFilteredRooms([]);
    if (!areaId) return;
    setLoadingFloors(true);
    try {
      const url = getFullUrl(`/pms/floors.json?area_id=${areaId}`);
      const response = await fetch(url, getAuthenticatedFetchOptions('GET'));
      if (response.ok) setFilteredFloors((await response.json()).floors || []);
    } catch {
      /* silent */
    } finally {
      setLoadingFloors(false);
    }
  };

  const handleFloorChange = async (floorId: string) => {
    setFormData((prev) => ({ ...prev, floor: floorId, room: '' }));
    setFilteredRooms([]);
    if (!floorId) return;
    setLoadingRooms(true);
    try {
      const url = getFullUrl(`/pms/rooms.json?floor_id=${floorId}`);
      const response = await fetch(url, getAuthenticatedFetchOptions('GET'));
      if (response.ok) {
        const data = await response.json();
        setFilteredRooms(Array.isArray(data) ? data : data.rooms || []);
      }
    } catch {
      /* silent */
    } finally {
      setLoadingRooms(false);
    }
  };

  // ── User selection ────────────────────────────────────────────────────────
  const handleUserSelection = (userId: string) => {
    setSelectedUser(userId);
    const userIdNum = parseInt(userId);
    setSelectedUserId(userIdNum);

    if (onBehalfOf === 'fm-user') {
      const u = fmUsers.find((usr) => usr.id === userIdNum);
      if (u) {
        setFormData((prev) => ({
          ...prev,
          name: u.full_name,
          contactNumber: u.mobile || '',
          department: u.designation || u.role_name || '',
          unit: `Unit ${u.unit_id || ''}`,
          site: u.company_name || 'Lockated',
        }));
        setIsFieldsReadOnly(true);
      }
    } else if (onBehalfOf === 'occupant-user') {
      const u = occupantUsers.find((usr) => usr.id === userIdNum);
      if (u) {
        setFormData((prev) => ({
          ...prev,
          name: `${u.firstname} ${u.lastname}`,
          contactNumber: u.mobile || '',
          department: u.lock_user_permission?.designation || '',
          unit: `Unit ${u.unit_id || ''}`,
          site: u.company || 'Lockated',
        }));
        setIsFieldsReadOnly(true);
      }
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData((prev) => ({ ...prev, categoryType: categoryId, subCategoryType: '' }));
    setSubcategories([]);
    if (categoryId) loadSubcategories(parseInt(categoryId));
  };

  // ── File upload ───────────────────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setAttachedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };
  const removeFile = (index: number) => setAttachedFiles((prev) => prev.filter((_, i) => i !== index));

  // ── Dropdown items helper ─────────────────────────────────────────────────
  const getUsersForDropdown = () => {
    if (onBehalfOf === 'occupant-user')
      return occupantUsers.map((u) => ({ id: u.id.toString(), name: `${u.firstname} ${u.lastname}` }));
    if (onBehalfOf === 'fm-user')
      return fmUsers.map((u) => ({ id: u.id.toString(), name: u.full_name }));
    return [];
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!ticketType || !formData.categoryType || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!webComplaintModeId) {
      toast.error('Complaint mode not available. Please refresh the page.');
      return;
    }
    if (onBehalfOf !== 'self' && !selectedUserId) {
      toast.error('Please select a user when creating ticket on behalf of others');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!userAccount) await loadUserAccountFromAPI();

      const siteId = userAccount?.site_id?.toString();
      if (!siteId) {
        toast.error('Unable to determine site ID. Please refresh and try again.');
        return;
      }

      const ticketData = {
        of_phase: 'pms',
        site_id: parseInt(siteId),
        on_behalf_of: onBehalfOf === 'self' ? 'admin' : onBehalfOf,
        complaint_type: ticketType,
        category_type_id: parseInt(formData.categoryType),
        priority: formData.adminPriority || '',
        severity: formData.severity || '',
        society_staff_type: 'User',
        ...(formData.vendor && { supplier_id: parseInt(formData.vendor) }),
        proactive_reactive: formData.proactiveReactive || '',
        heading: formData.description,
        complaint: { complaint_mode_id: webComplaintModeId },
        ...(onBehalfOf === 'self' && userAccount?.id && { id_user: userAccount.id }),
        ...(onBehalfOf !== 'self' && selectedUserId && {
          sel_id_user: selectedUserId,
          id_user: selectedUserId,
        }),
        ...(formData.assignedTo && { assigned_to: parseInt(formData.assignedTo) }),
        ...(formData.referenceNumber && { reference_number: formData.referenceNumber }),
        ...(formData.subCategoryType && { sub_category_id: parseInt(formData.subCategoryType) }),
        ...(formData.area && { area_id: parseInt(formData.area) }),
        ...(formData.building && { tower_id: parseInt(formData.building) }),
        ...(formData.wing && { wing_id: parseInt(formData.wing) }),
        ...(formData.floor && { floor_id: parseInt(formData.floor) }),
        ...(formData.room && { room_id: parseInt(formData.room) }),
        is_golden_ticket: isGoldenTicket,
        is_flagged: isFlagged,
      };

      const response = await employeeTicketAPI.createTicket(ticketData, attachedFiles);
      const ticketNumber =
        response?.ticket_number || response?.complaint_number || response?.number || response?.complaint?.ticket_number;

      toast.success(ticketNumber ? `Ticket created successfully - ${ticketNumber}` : 'Ticket created successfully!');
      onClose();
      onSuccess?.();
    } catch {
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={SlideLeft}
      maxWidth={false}
    >
      <DialogContent
        className="w-[50vw] fixed right-0 top-0 rounded-none bg-white text-sm overflow-y-auto"
        style={{ margin: 0, maxHeight: '100vh', display: 'flex', flexDirection: 'column' }}
        sx={{
          padding: '0 !important',
          '& .MuiDialogContent-root': { padding: '0 !important', overflow: 'auto' },
        }}
      >
        {/* ── Sticky header ───────────────────────────────────────────────── */}
        <div className="sticky top-0 bg-white z-10">
          <h3 className="text-[14px] font-medium text-center mt-8">New Ticket</h3>
          <X
            className="absolute top-[26px] right-8 cursor-pointer w-4 h-4"
            onClick={onClose}
          />
          <hr className="border border-[#C72030] mt-4" />
        </div>

        {/* ── Scrollable body ──────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-6">

          {/* ── On Behalf Of ──────────────────────────────────────────────── */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-200">
              <h2 className="text-base font-medium text-gray-900 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#E5E0D3' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C72030" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                Requestor Details
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {/* On behalf radio */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Create On Behalf Of</p>
                <RadioGroup value={onBehalfOf} onValueChange={setOnBehalfOf} className="flex gap-6">
                  {[
                    { value: 'self', label: 'Self' },
                    { value: 'occupant-user', label: 'Occupant User' },
                    { value: 'fm-user', label: 'FM User' },
                  ].map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={opt.value}
                        id={`behalf-${opt.value}`}
                        className="text-[#C72030] border-[#C72030]"
                      />
                      <label htmlFor={`behalf-${opt.value}`} className="text-sm font-medium cursor-pointer">
                        {opt.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* User selector for non-self */}
              {onBehalfOf !== 'self' && (
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>
                    {onBehalfOf === 'occupant-user' ? 'Select Occupant User' : 'Select FM User'}
                  </InputLabel>
                  <MuiSelect
                    value={selectedUser}
                    onChange={(e) => handleUserSelection(e.target.value)}
                    label={onBehalfOf === 'occupant-user' ? 'Select Occupant User' : 'Select FM User'}
                    notched
                    displayEmpty
                  >
                    <MenuItem value="">Select User</MenuItem>
                    {getUsersForDropdown().map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              )}

              {/* Name / Department / Contact / Site */}
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Name"
                  value={formData.name}
                  onChange={(e) => !isFieldsReadOnly && setFormData({ ...formData, name: e.target.value })}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ readOnly: isFieldsReadOnly, sx: fieldStyles }}
                  disabled={loadingAccount}
                />
                <TextField
                  label="Department"
                  value={formData.department}
                  onChange={(e) => !isFieldsReadOnly && setFormData({ ...formData, department: e.target.value })}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ readOnly: isFieldsReadOnly, sx: fieldStyles }}
                />
                <TextField
                  label="Contact Number"
                  value={formData.contactNumber}
                  onChange={(e) => !isFieldsReadOnly && setFormData({ ...formData, contactNumber: e.target.value })}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ readOnly: isFieldsReadOnly, sx: fieldStyles }}
                />
                <TextField
                  label="Site"
                  value={formData.site}
                  onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>
            </div>
          </div>

          {/* ── Ticket Type ───────────────────────────────────────────────── */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-200">
              <h2 className="text-base font-medium text-gray-900 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#E5E0D3' }}
                >
                  <Ticket size={16} color="#C72030" />
                </span>
                Tickets Type
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Request / Complaint / Suggestion */}
              <RadioGroup value={ticketType} onValueChange={setTicketType} className="flex gap-6">
                {['request', 'complaint', 'suggestion'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={type}
                      id={`type-${type}`}
                      className="text-[#C72030] border-[#C72030]"
                    />
                    <label htmlFor={`type-${type}`} className="text-sm font-medium capitalize cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </RadioGroup>

              {/* Category & Sub-category */}
              <div className="grid grid-cols-2 gap-4">
                <FormControl fullWidth variant="outlined" required sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Category Type</InputLabel>
                  <MuiSelect
                    value={formData.categoryType}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    label="Category Type"
                    notched
                    displayEmpty
                    disabled={loadingCategories}
                  >
                    <MenuItem value="">{loadingCategories ? 'Loading...' : 'Select Category Type'}</MenuItem>
                    {categories.map((c) => (
                      <MenuItem key={c.id} value={c.id.toString()}>{c.name}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Sub Category Type</InputLabel>
                  <MuiSelect
                    value={formData.subCategoryType}
                    onChange={(e) => setFormData({ ...formData, subCategoryType: e.target.value })}
                    label="Sub Category Type"
                    notched
                    displayEmpty
                    disabled={loadingSubcategories || !formData.categoryType}
                  >
                    <MenuItem value="">
                      {loadingSubcategories ? 'Loading...' : !formData.categoryType ? 'Select Category First' : 'Select Sub Category'}
                    </MenuItem>
                    {subcategories.map((s) => (
                      <MenuItem key={s.id} value={s.id.toString()}>{s.name}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>

              {/* Description */}
              <div className="relative w-full">
                <textarea
                  id="panel-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder=" "
                  className="peer block w-full appearance-none rounded border border-gray-300 bg-white px-3 pt-6 pb-2 text-base text-gray-900 placeholder-transparent focus:outline-none focus:border-[2px] focus:border-[rgb(25,118,210)] resize-vertical"
                />
                <label
                  htmlFor="panel-description"
                  className="absolute left-3 -top-[10px] bg-white px-1 text-sm text-gray-500 z-[1] transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-[10px] peer-focus:text-sm peer-focus:text-[rgb(25,118,210)]"
                >
                  Description <span className="text-red-500">*</span>
                </label>
              </div>
            </div>
          </div>

          {/* ── Location Details ──────────────────────────────────────────── */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-200">
              <h2 className="text-base font-medium text-gray-900 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#E5E0D3' }}
                >
                  <MapPin size={16} color="#C72030" />
                </span>
                Location Details
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Building */}
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Building</InputLabel>
                  <MuiSelect
                    value={formData.building}
                    onChange={(e) => handleBuildingChange(e.target.value)}
                    label="Building"
                    notched
                    displayEmpty
                    disabled={loadingBuildings}
                  >
                    <MenuItem value="">{loadingBuildings ? 'Loading...' : 'Select Building'}</MenuItem>
                    {buildings.map((b) => (
                      <MenuItem key={b.id} value={b.id.toString()}>{b.name}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                {/* Wing */}
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
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
                      {loadingWings ? 'Loading...' : !formData.building ? 'Select Building First' : 'Select Wing'}
                    </MenuItem>
                    {filteredWings.map((w) => (
                      <MenuItem key={w.id} value={w.id.toString()}>{w.name}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                {/* Area */}
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
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
                      {loadingAreas ? 'Loading...' : !formData.wing ? 'Select Wing First' : 'Select Area'}
                    </MenuItem>
                    {filteredAreas.map((a) => (
                      <MenuItem key={a.id} value={a.id.toString()}>{a.name}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                {/* Floor */}
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
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
                      {loadingFloors ? 'Loading...' : !formData.area ? 'Select Area First' : 'Select Floor'}
                    </MenuItem>
                    {filteredFloors.map((f) => (
                      <MenuItem key={f.id} value={f.id.toString()}>{f.name}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                {/* Room */}
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
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
                      {loadingRooms ? 'Loading...' : !formData.floor ? 'Select Floor First' : 'Select Room'}
                    </MenuItem>
                    {filteredRooms.map((r) => (
                      <MenuItem key={r.id} value={r.id.toString()}>{r.name}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
            </div>
          </div>

          {/* ── Attachments ───────────────────────────────────────────────── */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-200">
              <h2 className="text-base font-medium text-gray-900 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#E5E0D3' }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 2C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V5.41421C14 5.149 13.8946 4.89464 13.7071 4.70711L11.2929 2.29289C11.1054 2.10536 10.851 2 10.5858 2H3Z" fill="#C72030" />
                    <path d="M10 2V5C10 5.55228 10.4477 6 11 6H14" fill="#E5E0D3" />
                  </svg>
                </span>
                Add Attachments
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <input type="file" multiple onChange={handleFileUpload} className="hidden" id="panel-file-upload" />
              <Button
                type="button"
                onClick={() => document.getElementById('panel-file-upload')?.click()}
                variant="outline"
                className="border-dashed border-2 border-gray-300 hover:border-gray-400 text-gray-600 bg-white hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>

              {attachedFiles.length > 0 && (
                <div className="space-y-2">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded border">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                        <span>{file.name}</span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Action buttons ────────────────────────────────────────────── */}
          <div className="flex gap-4 justify-center pt-2 pb-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#C72030] hover:bg-[#A61B28] text-white px-8 py-2"
            >
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTicketSidePanel;
