import React, { useState, useEffect, useCallback } from 'react';
import { Shield, CheckCircle, AlertCircle, Activity, X, ChevronLeft, ChevronRight, Paperclip, CalendarIcon, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import ReactSelect from 'react-select';
import { TicketPagination } from '@/components/TicketPagination';

interface VisitAttachment {
  id: number;
  file_name: string;
  file_url: string;
  file_size: number;
  content_type: string;
  uploaded_at: string;
}

interface Session {
  id: number;
  route_name: string;
  assigned_guard: string;
  guard_id: number;
  status: string;
  scheduled_start: string;
  actual_start: string;
}

interface Checkpoint {
  id: number;
  name: string;
  description: string;
  order_sequence: number;
  building_name: string | null;
  location_path: string;
}

interface Answer {
  id: number;
  question_id: number | null;
  question_text: string | null;
  answer: string | null;
  option_id: number | null;
  option_text: string | null;
  is_negative: boolean;
  answered_at: string;
  quest_map_id: number;
}

interface Ticket {
  id: number;
  ticket_number: string;
  heading: string;
  category: string | null;
  priority: string;
  status: string;
  type: string;
  created_at: string;
  assigned_to: number | null;
}

interface PatrollingVisit {
  id: number;
  building: string | null;
  wing: string | null;
  area: string | null;
  floor: string | null;
  room: string | null;
  schedule_datetime: string;
  grace_time_hours: number;
  status: string;
  patrolling_date: string;
  patrolling_time: string;
  comments: string;
  approve_datetime: string | null;
  session: Session;
  checkpoint: Checkpoint;
  visited_at: string;
  notes: string;
  qr_code_scanned: string;
  was_in_sequence: boolean;
  attachments: VisitAttachment[];
  answers: Answer[];
  tickets: Ticket[];
  tickets_count: number;
  issues_count: number;
}

interface PatrollingResponse {
  id: number;
  patrol_name: string;
  checkpoint_name: string;
  building: string;
  wing: string;
  area: string;
  floor: string;
  room: string;
  schedule_date_time: string;
  grace_time: string | number;
  status: string;
  patrolling_date: string;
  patrolling_time: string;
  submitted_by: string;
  attachments: VisitAttachment[];
  approved_by: string;
  approved_at: string;
  ticket_id: string;
  incident_id: string;
  // dynamic question columns: q1_answer, q1_comment, q1_negative, q2_answer …
  [key: string]: string | number | boolean | VisitAttachment[] | undefined;
}

// ── Helpers for dropdown data extraction ─────────────────────────────────────
interface RawItem { id: number; name?: string; route_name?: string; full_name?: string; }
interface RawStatusItem { name: string; value: string; }
interface DropdownOption { value: number; label: string; }
interface StatusOption  { value: string; label: string; }

const toOpts = (arr: RawItem[], fallback: string): DropdownOption[] =>
  arr.map(i => ({ value: i.id, label: i.route_name || i.name || i.full_name || `${fallback} ${i.id}` }));
// ─────────────────────────────────────────────────────────────────────────────

// ── Pure helper functions (outside component for stable references) ───────────

// Parse the comments string (format: "89971: p1 comment\n89972: p2 comment") into a map of question_id -> comment text
const parseCommentsMap = (commentsStr: string): Map<string, string> => {
  const map = new Map<string, string>();
  if (!commentsStr) return map;
  const lines = commentsStr.split('\n');
  lines.forEach(line => {
    const match = line.match(/^(\d+):\s*(.*)$/);
    if (match) {
      map.set(match[1], match[2].trim());
    }
  });
  return map;
};

// Collect all unique questions across all visits (preserving first-seen order)
const collectUniqueQuestions = (visits: PatrollingVisit[]): Array<{ question_id: number | null; question_text: string }> => {
  const seen = new Map<string, { question_id: number | null; question_text: string }>();
  visits.forEach(visit => {
    (visit.answers || []).forEach(ans => {
      if (!ans.question_text) return;
      const key = String(ans.question_id ?? ans.question_text);
      if (!seen.has(key)) seen.set(key, { question_id: ans.question_id, question_text: ans.question_text });
    });
  });
  return Array.from(seen.values());
};

// Transform API visits — ONE ROW PER VISIT with dynamic q${n}_answer/comment/negative columns
const transformVisitsToResponses = (
  visits: PatrollingVisit[],
  questions: Array<{ question_id: number | null; question_text: string }>,
): PatrollingResponse[] => {
  return visits.map((visit) => {
    const scheduledDate = visit.schedule_datetime ? new Date(visit.schedule_datetime) : null;
    const scheduleFormatted = scheduledDate
      ? scheduledDate.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
      : '-';
    const approveDate = visit.approve_datetime ? new Date(visit.approve_datetime) : null;
    const approveFormatted = approveDate
      ? approveDate.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
      : '-';

    const answerMap = new Map<string, Answer>();
    (visit.answers || []).forEach(ans => {
      const key = String(ans.question_id ?? ans.question_text);
      if (!answerMap.has(key)) answerMap.set(key, ans);
    });

    const commentsMap = parseCommentsMap(visit.comments || visit.notes || '');
    const allTickets = (visit.tickets || []).map(t => t.ticket_number).join(', ') || '-';

    const baseRow: PatrollingResponse = {
      id: visit.id,
      patrol_name: visit.session?.route_name || '-',
      checkpoint_name: visit.checkpoint?.name || '-',
      building: visit.building || visit.checkpoint?.building_name || '-',
      wing: visit.wing || '-',
      area: visit.area || '-',
      floor: visit.floor || '-',
      room: visit.room || '-',
      schedule_date_time: scheduleFormatted,
      grace_time: visit.grace_time_hours ?? '-',
      status: visit.status || visit.session?.status || '-',
      patrolling_date: visit.patrolling_date || '-',
      patrolling_time: visit.patrolling_time || '-',
      submitted_by: visit.session?.assigned_guard || '-',
      attachments: visit.attachments || [],
      approved_by: '-',
      approved_at: approveFormatted,
      ticket_id: allTickets,
      incident_id: '-',
    };

    questions.forEach((q, idx) => {
      const n = idx + 1;
      const key = String(q.question_id ?? q.question_text);
      const ans = answerMap.get(key);
      const commentFromMap = q.question_id ? commentsMap.get(String(q.question_id)) : undefined;
      baseRow[`q${n}_answer`]   = ans ? (ans.answer || ans.option_text || '-') : '-';
      baseRow[`q${n}_comment`]  = commentFromMap || '-';
      baseRow[`q${n}_negative`] = ans ? ans.is_negative : false;
    });

    return baseRow;
  });
};

const baseColumnDefs = [
  { key: 'id', label: 'Response ID', visible: true },
  { key: 'patrol_name', label: 'Patrol Name', visible: true },
  { key: 'checkpoint_name', label: 'Checkpoint Name', visible: true },
  { key: 'building', label: 'Building', visible: true },
  { key: 'wing', label: 'Wing', visible: true },
  { key: 'area', label: 'Area', visible: true },
  { key: 'floor', label: 'Floor', visible: true },
  { key: 'room', label: 'Room', visible: true },
  { key: 'schedule_date_time', label: 'Schedule Date/Time', visible: true },
  { key: 'grace_time', label: 'Grace Time (Hours)', visible: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'patrolling_date', label: 'Patrolling Date', visible: true },
  { key: 'patrolling_time', label: 'Patrolling Time', visible: true },
  { key: 'submitted_by', label: 'Submitted By', visible: true },
  { key: 'attachments', label: 'Attachments', visible: true },
  { key: 'approved_at', label: 'Approve Date/Time', visible: true },
  { key: 'ticket_id', label: 'Ticket Id', visible: true },
  { key: 'incident_id', label: 'Incident Id', visible: true },
];
// ─────────────────────────────────────────────────────────────────────────────

export const PatrollingResponsePage = () => {
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState<PatrollingResponse[]>([]);
  const [allQuestions, setAllQuestions] = useState<Array<{ question_id: number | null; question_text: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_count: 0,
    total_pages: 1,
  });
  const [perPage, setPerPage] = useState(10);
  const [summaryStats, setSummaryStats] = useState({
    total_visits: 0,
    completed: 0,
    missed: 0,
    incident_reported: 0,
    ticket_raised: 0,
  });

  // ── Filter dialog state ───────────────────────────────────────
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter form fields (pending — not yet applied)
  const [fPatrolName,      setFPatrolName]      = useState('');
  const [fStatus,          setFStatus]          = useState('');
  // Schedule date range
  const [fScheduleDateFrom, setFScheduleDateFrom] = useState<Date | undefined>(undefined);
  const [fScheduleDateTo,   setFScheduleDateTo]   = useState<Date | undefined>(undefined);
  // Patrol (visited_at) date range
  const [fPatrolDateFrom,  setFPatrolDateFrom]  = useState<Date | undefined>(undefined);
  const [fPatrolDateTo,    setFPatrolDateTo]    = useState<Date | undefined>(undefined);
  const [fGuardId,         setFGuardId]         = useState<number | null>(null);
  const [fBuildingId,      setFBuildingId]      = useState<number | null>(null);
  const [fWingId,          setFWingId]          = useState<number | null>(null);
  const [fAreaId,          setFAreaId]          = useState<number | null>(null);
  const [fFloorId,         setFFloorId]         = useState<number | null>(null);
  const [fRoomId,          setFRoomId]          = useState<number | null>(null);

  // Applied filters — keys match API q[] param names
  interface AppliedFilters {
    patrolName:           string;   // q[patrolling_checkpoint_patrolling_route_name_eq]
    status:               string;   // q[patrolling_session_status_eq]  (also used for card click)
    scheduleDateFrom:     string;   // q[patrolling_session_scheduled_start_time_gteq]
    scheduleDateTo:       string;   // q[patrolling_session_scheduled_start_time_lteq]
    patrolDateFrom:       string;   // q[visited_at_gteq]
    patrolDateTo:         string;   // q[visited_at_lteq]
    guardId:              number | null; // submitted by guard
    buildingId:           number | null; // q[patrolling_checkpoint_building_id_eq]
    wingId:               number | null; // q[patrolling_checkpoint_wing_id_eq]
    areaId:               number | null; // q[patrolling_checkpoint_area_id_eq]
    floorId:              number | null; // q[patrolling_checkpoint_floor_id_eq]
    roomId:               number | null; // q[patrolling_checkpoint_room_id_eq]
  }
  const emptyFilters: AppliedFilters = {
    patrolName: '', status: '',
    scheduleDateFrom: '', scheduleDateTo: '',
    patrolDateFrom: '', patrolDateTo: '',
    guardId: null,
    buildingId: null, wingId: null, areaId: null, floorId: null, roomId: null,
  };
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(emptyFilters);

  // ── Dropdown data (all loaded from /patrolling/dropdowns) ─────
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);
  const [guards,        setGuards]        = useState<DropdownOption[]>([]);
  const [buildings,     setBuildings]     = useState<DropdownOption[]>([]);
  const [wings,         setWings]         = useState<DropdownOption[]>([]);
  const [areas,         setAreas]         = useState<DropdownOption[]>([]);
  const [floors,        setFloors]        = useState<DropdownOption[]>([]);
  const [rooms,         setRooms]         = useState<DropdownOption[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  // Load all dropdown data from single endpoint when filter opens
  useEffect(() => {
    if (!isFilterOpen) return;
    setLoadingDropdowns(true);
    (async () => {
      try {
        const url = new URL(getFullUrl('/patrolling/dropdowns'));
        if (API_CONFIG.TOKEN) url.searchParams.append('access_token', API_CONFIG.TOKEN);
        const res = await fetch(url.toString(), getAuthenticatedFetchOptions());
        if (!res.ok) return;
        const json = await res.json();
        const d = json?.data || json;

        if (Array.isArray(d.buildings))
          setBuildings(toOpts(d.buildings as RawItem[], 'Building'));
        if (Array.isArray(d.wings))
          setWings(toOpts(d.wings as RawItem[], 'Wing'));
        if (Array.isArray(d.areas))
          setAreas(toOpts(d.areas as RawItem[], 'Area'));
        if (Array.isArray(d.floors))
          setFloors(toOpts(d.floors as RawItem[], 'Floor'));
        if (Array.isArray(d.rooms))
          setRooms(toOpts(d.rooms as RawItem[], 'Room'));
        if (Array.isArray(d.assigned_guards))
          setGuards(toOpts(d.assigned_guards as RawItem[], 'Guard'));
        if (Array.isArray(d.response_statuses))
          setStatusOptions(
            (d.response_statuses as RawStatusItem[]).map(s => ({
              value: s.value,
              label: s.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            }))
          );
      } finally {
        setLoadingDropdowns(false);
      }
    })();
  }, [isFilterOpen]);

  // Image preview state
  const [previewImages, setPreviewImages] = useState<VisitAttachment[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const openPreview = (attachments: VisitAttachment[], index: number) => {
    setPreviewImages(attachments);
    setPreviewIndex(index);
    setShowPreview(true);
  };

  const decodeFileUrl = (fileUrl: string): string => {
    try {
      const decoded = decodeURIComponent(fileUrl);
      return decoded.startsWith('//') ? `https:${decoded.split('?')[0]}` : decoded.split('?')[0];
    } catch {
      return fileUrl;
    }
  };

  const COLUMN_STORAGE_KEY = 'patrolling-columns-visibility';

  const getInitialColumns = () => {
    try {
      const saved = localStorage.getItem(COLUMN_STORAGE_KEY);
      if (saved) {
        const savedMap: Record<string, boolean> = JSON.parse(saved);
        return baseColumnDefs.map(col => ({ ...col, visible: savedMap[col.key] ?? col.visible }));
      }
    } catch { /* ignore */ }
    return baseColumnDefs;
  };

  const [columns, setColumns] = useState(() => getInitialColumns());

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch patrolling responses
  const fetchPatrollingResponses = useCallback(async (
    page: number = 1,
    searchQuery?: string,
    status?: string | null,
    filters?: AppliedFilters,
  ) => {
    const isSearch = searchQuery && searchQuery.trim() !== '';
    if (isSearch) {
      setSearchLoading(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const url = getFullUrl('/patrolling/visits/all');
      const urlWithParams = new URL(url);
      
      urlWithParams.searchParams.append('page', page.toString());
      urlWithParams.searchParams.append('per_page', '20');
      
      if (API_CONFIG.TOKEN) {
        urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
      }

      // Status from card click (overridden by filter dialog status if set)
      const effectiveStatus = filters?.status || status || '';
      if (effectiveStatus) urlWithParams.searchParams.append('q[patrolling_session_status_eq]', effectiveStatus);

      if (searchQuery && searchQuery.trim()) {
        urlWithParams.searchParams.append('search', searchQuery.trim());
      }

      // ── Server-side filter params (q[] Ransack-style) ─────────
      if (filters) {
        if (filters.patrolName)
          urlWithParams.searchParams.append('q[patrolling_checkpoint_patrolling_route_name_eq]', filters.patrolName);
        if (filters.scheduleDateFrom)
          urlWithParams.searchParams.append('q[patrolling_session_scheduled_start_time_gteq]', filters.scheduleDateFrom);
        if (filters.scheduleDateTo)
          urlWithParams.searchParams.append('q[patrolling_session_scheduled_start_time_lteq]', filters.scheduleDateTo);
        if (filters.patrolDateFrom)
          urlWithParams.searchParams.append('q[visited_at_gteq]', filters.patrolDateFrom);
        if (filters.patrolDateTo)
          urlWithParams.searchParams.append('q[visited_at_lteq]', filters.patrolDateTo);
        if (filters.guardId)
          urlWithParams.searchParams.append('q[patrolling_session_assigned_guard_id_eq]', filters.guardId.toString());
        if (filters.buildingId)
          urlWithParams.searchParams.append('q[patrolling_checkpoint_building_id_eq]', filters.buildingId.toString());
        if (filters.wingId)
          urlWithParams.searchParams.append('q[patrolling_checkpoint_wing_id_eq]', filters.wingId.toString());
        if (filters.areaId)
          urlWithParams.searchParams.append('q[patrolling_checkpoint_area_id_eq]', filters.areaId.toString());
        if (filters.floorId)
          urlWithParams.searchParams.append('q[patrolling_checkpoint_floor_id_eq]', filters.floorId.toString());
        if (filters.roomId)
          urlWithParams.searchParams.append('q[patrolling_checkpoint_room_id_eq]', filters.roomId.toString());
      }

      const options = getAuthenticatedFetchOptions();
      const response = await fetch(urlWithParams.toString(), options);

      if (!response.ok) {
        throw new Error('Failed to fetch patrolling visits');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch data');
      }

      const rawVisits = result.data.visits || [];
      const uniqueQuestions = collectUniqueQuestions(rawVisits);
      setAllQuestions(uniqueQuestions);
      const transformedData = transformVisitsToResponses(rawVisits, uniqueQuestions);
      setResponseData(transformedData);
      
      if (result.data.pagination) {
        setPagination({
          current_page: parseInt(result.data.pagination.current_page),
          per_page: parseInt(result.data.pagination.per_page),
          total_count: result.data.pagination.total_count,
          total_pages: result.data.pagination.total_pages,
        });
      }

      // Summary stats come from pagination object in this API
      if (result.data.pagination) {
        setSummaryStats({
          total_visits: result.data.pagination.total_count || 0,
          completed: result.data.pagination.completed || 0,
          missed: result.data.pagination.missed || 0,
          incident_reported: result.data.pagination.incident_reported || 0,
          ticket_raised: result.data.pagination.ticket_raised || 0,
        });
      } else if (result.data.summary) {
        setSummaryStats({
          total_visits: result.data.summary.total_visits || 0,
          completed: result.data.summary.completed || 0,
          missed: result.data.summary.missed || 0,
          incident_reported: result.data.summary.incident_reported || 0,
          ticket_raised: result.data.summary.total_tickets_raised || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching patrolling visits:', error);
      toast.error('Failed to load patrolling visits');
      setResponseData([]);
    } finally {
      if (isSearch) {
        setSearchLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchPatrollingResponses(currentPage, debouncedSearchTerm, selectedStatus, appliedFilters);
  }, [currentPage, debouncedSearchTerm, selectedStatus, appliedFilters, fetchPatrollingResponses]);

  const handleViewDetails = (item: PatrollingResponse) => {
    navigate(`/security/patrolling/response/details/${item.id}`, {
      state: { responseData: item },
    });
  };

  const handleSearchChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handleStatusCardClick = (status: string | null) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      patrolName:       fPatrolName,
      status:           fStatus,
      scheduleDateFrom: fScheduleDateFrom ? format(fScheduleDateFrom, 'yyyy-MM-dd') : '',
      scheduleDateTo:   fScheduleDateTo   ? format(fScheduleDateTo,   'yyyy-MM-dd') : '',
      patrolDateFrom:   fPatrolDateFrom   ? format(fPatrolDateFrom,   'yyyy-MM-dd') : '',
      patrolDateTo:     fPatrolDateTo     ? format(fPatrolDateTo,     'yyyy-MM-dd') : '',
      guardId:          fGuardId,
      buildingId:       fBuildingId,
      wingId:           fWingId,
      areaId:           fAreaId,
      floorId:          fFloorId,
      roomId:           fRoomId,
    });
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setFPatrolName('');           setFStatus('');
    setFScheduleDateFrom(undefined); setFScheduleDateTo(undefined);
    setFPatrolDateFrom(undefined);   setFPatrolDateTo(undefined);
    setFGuardId(null);
    setFBuildingId(null); setFWingId(null); setFAreaId(null);
    setFFloorId(null);    setFRoomId(null);
    setAppliedFilters(emptyFilters);
    setCurrentPage(1);
  };

  const activeFilterCount = [
    appliedFilters.patrolName, appliedFilters.status,
    appliedFilters.scheduleDateFrom, appliedFilters.scheduleDateTo,
    appliedFilters.patrolDateFrom,   appliedFilters.patrolDateTo,
    appliedFilters.guardId,
    appliedFilters.buildingId, appliedFilters.wingId, appliedFilters.areaId,
    appliedFilters.floorId, appliedFilters.roomId,
  ].filter(Boolean).length;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const url = getFullUrl('/patrolling/visits/all');
      const urlWithParams = new URL(url);

      urlWithParams.searchParams.append('export', 'true');

      if (API_CONFIG.TOKEN) {
        urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
      }

      if (selectedStatus) {
        urlWithParams.searchParams.append('status', selectedStatus);
      }

      if (debouncedSearchTerm) {
        urlWithParams.searchParams.append('search', debouncedSearchTerm);
      }

      const options = getAuthenticatedFetchOptions();
      const response = await fetch(urlWithParams.toString(), options);

      if (!response.ok) {
        throw new Error('Failed to export patrolling visits');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      link.download = `patrolling-visits-${timestamp}.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success('Patrolling visits exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export patrolling visits. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Column visibility handlers
  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setColumns((prev) => {
      const next = prev.map((col) => (col.key === columnKey ? { ...col, visible } : col));
      try {
        const visMap: Record<string, boolean> = {};
        next.forEach(c => { visMap[c.key] = c.visible; });
        // Also persist dynamic question columns' current visibility
        allQuestions.forEach((_, idx) => {
          const n = idx + 1;
          const aKey = `q${n}_answer`;
          const cKey = `q${n}_comment`;
          if (!(aKey in visMap)) visMap[aKey] = true;
          if (!(cKey in visMap)) visMap[cKey] = true;
        });
        if (columnKey.match(/^q\d+_(answer|comment)$/)) {
          visMap[columnKey] = visible;
        }
        localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(visMap));
      } catch { /* ignore */ }
      return next;
    });
  };

  // Persist dynamic column visibility separately (called from column toggle in EnhancedTable)
  const [dynColVisibility, setDynColVisibility] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(COLUMN_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return {};
  });

  const handleDynColumnToggle = (columnKey: string, visible: boolean) => {
    setDynColVisibility(prev => {
      const next = { ...prev, [columnKey]: visible };
      try { localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const isColumnVisible = useCallback(
    (columnKey: string) => {
      // Dynamic question columns
      if (columnKey.match(/^q\d+_(answer|comment)$/)) {
        return dynColVisibility[columnKey] ?? true;
      }
      const column = columns.find((col) => col.key === columnKey);
      return column?.visible ?? true;
    },
    [columns, dynColVisibility]
  );

  const handleResetColumns = () => {
    setColumns(baseColumnDefs);
    setDynColVisibility({});
    try { localStorage.removeItem(COLUMN_STORAGE_KEY); } catch { /* ignore */ }
    toast.success('All columns have been restored to default visibility');
  };

  // Enhanced table columns — base + dynamic question columns
  const enhancedTableColumns = React.useMemo(() => {
    const baseColumns = [
      { key: 'id', label: 'Response ID', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('id'), hideable: true },
      { key: 'patrol_name', label: 'Patrol Name', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('patrol_name'), hideable: true },
      { key: 'checkpoint_name', label: 'Checkpoint Name', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('checkpoint_name'), hideable: true },
      { key: 'building', label: 'Building', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('building'), hideable: true },
      { key: 'wing', label: 'Wing', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('wing'), hideable: true },
      { key: 'area', label: 'Area', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('area'), hideable: true },
      { key: 'floor', label: 'Floor', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('floor'), hideable: true },
      { key: 'room', label: 'Room', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('room'), hideable: true },
      { key: 'schedule_date_time', label: 'Schedule Date/Time', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('schedule_date_time'), hideable: true },
      { key: 'grace_time', label: 'Grace Time (Hours)', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('grace_time'), hideable: true },
      { key: 'status', label: 'Status', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('status'), hideable: true },
      { key: 'patrolling_date', label: 'Patrolling Date', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('patrolling_date'), hideable: true },
      { key: 'patrolling_time', label: 'Patrolling Time', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('patrolling_time'), hideable: true },
      { key: 'submitted_by', label: 'Submitted By', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('submitted_by'), hideable: true },
      { key: 'attachments', label: 'Attachments', sortable: false, draggable: true, defaultVisible: true, visible: isColumnVisible('attachments'), hideable: true },
      { key: 'approved_at', label: 'Approve Date/Time', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('approved_at'), hideable: true },
    ];

    // Dynamic question columns: each question → Answer column + Comment column
    const questionColumns = allQuestions.flatMap((q, idx) => {
      const n = idx + 1;
      const shortLabel = q.question_text.length > 40
        ? `${q.question_text.substring(0, 40)}…`
        : q.question_text;
      return [
        {
          key: `q${n}_answer`,
          label: shortLabel,
          sortable: true,
          draggable: true,
          defaultVisible: true,
          visible: isColumnVisible(`q${n}_answer`),
          hideable: true,
        },
        {
          key: `q${n}_comment`,
          label: `${shortLabel} — Comment`,
          sortable: true,
          draggable: true,
          defaultVisible: true,
          visible: isColumnVisible(`q${n}_comment`),
          hideable: true,
        },
      ];
    });

    const endColumns = [
      { key: 'ticket_id', label: 'Ticket Id', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('ticket_id'), hideable: true },
      { key: 'incident_id', label: 'Incident Id', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('incident_id'), hideable: true },
    ];

    return [...baseColumns, ...questionColumns, ...endColumns].filter((col) => col.visible);
  }, [isColumnVisible, allQuestions]);

  const renderCell = (item: PatrollingResponse, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return <span className="font-medium text-gray-900">#{item.id}</span>;
      case 'patrol_name':
        return <span className="font-medium">{item.patrol_name}</span>;
      case 'checkpoint_name':
        return <span>{item.checkpoint_name}</span>;
      case 'building':
        return <span>{item.building}</span>;
      case 'wing':
        return <span>{item.wing}</span>;
      case 'area':
        return <span>{item.area}</span>;
      case 'floor':
        return <span>{item.floor}</span>;
      case 'room':
        return <span>{item.room}</span>;
      case 'schedule_date_time':
        return <span className="text-sm">{item.schedule_date_time}</span>;
      case 'grace_time':
        return <span>{item.grace_time}</span>;
      case 'status':
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : item.status === 'partially_completed'
                ? 'bg-yellow-100 text-yellow-800'
                : item.status === 'in_progress'
                ? 'bg-blue-100 text-blue-800'
                : item.status === 'scheduled'
                ? 'bg-gray-100 text-gray-800'
                : item.status === 'missed'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {item.status ? item.status.replace(/_/g, ' ').toUpperCase() : '-'}
          </span>
        );
      case 'patrolling_date':
        return <span className="text-sm">{item.patrolling_date}</span>;
      case 'patrolling_time':
        return <span className="text-sm">{item.patrolling_time}</span>;
      case 'submitted_by':
        return <span>{item.submitted_by}</span>;
      case 'attachments':
        return (
          <div className="flex items-center gap-1">
            {item.attachments && item.attachments.length > 0 ? (
              <>
                <div className="flex items-center gap-1">
                  {item.attachments.slice(0, 3).map((att, idx) => {
                    const imgUrl = decodeFileUrl(att.file_url);
                    const isImage = att.content_type?.startsWith('image/');
                    return isImage ? (
                      <button
                        key={att.id}
                        onClick={() => openPreview(item.attachments as VisitAttachment[], idx)}
                        className="w-8 h-8 rounded overflow-hidden border border-gray-200 hover:border-[#C72030] transition-colors flex-shrink-0"
                        title={att.file_name}
                      >
                        <img
                          src={imgUrl}
                          alt={att.file_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </button>
                    ) : (
                      <button
                        key={att.id}
                        onClick={() => openPreview(item.attachments as VisitAttachment[], idx)}
                        className="w-8 h-8 rounded border border-gray-200 hover:border-[#C72030] transition-colors flex-shrink-0 flex items-center justify-center bg-gray-50"
                        title={att.file_name}
                      >
                        <Paperclip className="w-3 h-3 text-gray-500" />
                      </button>
                    );
                  })}
                </div>
                {item.attachments.length > 3 && (
                  <button
                    onClick={() => openPreview(item.attachments as VisitAttachment[], 0)}
                    className="text-xs text-[#C72030] font-medium hover:underline"
                  >
                    +{item.attachments.length - 3}
                  </button>
                )}
              </>
            ) : (
              <span className="text-gray-400 text-xs">-</span>
            )}
          </div>
        );
      case 'approved_by':
        return <span>{item.approved_by}</span>;
      case 'approved_at':
        return <span className="text-sm">{item.approved_at}</span>;
      case 'ticket_id':
        return item.ticket_id !== '-' ? (
          <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
            {item.ticket_id}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        );
      case 'incident_id':
        return item.incident_id !== '-' ? (
          <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
            {item.incident_id}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        );
      default: {
        // Dynamic answer column: q1_answer, q2_answer, …
        if (columnKey.match(/^q\d+_answer$/)) {
          const isNegative = item[columnKey.replace('_answer', '_negative')] as boolean;
          const val = String(item[columnKey] ?? '-');
          return (
            <span className="flex items-center gap-1.5">
              {isNegative && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-100 text-red-700 text-xs font-bold flex-shrink-0">✗</span>
              )}
              <span className={isNegative ? 'text-red-700 font-medium' : 'text-gray-800'}>{val}</span>
            </span>
          );
        }
        // Dynamic comment column: q1_comment, q2_comment, …
        if (columnKey.match(/^q\d+_comment$/)) {
          const val = String(item[columnKey] ?? '-');
          return <span className="text-sm text-gray-600 max-w-[180px] truncate block" title={val}>{val}</span>;
        }
        return <span>{String(item[columnKey] ?? '-')}</span>;
      }
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
      {/* Image Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/90 border-none">
          <div className="relative flex items-center justify-center min-h-[400px]">
            {/* Close */}
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </button>
            {/* Prev */}
            {previewImages.length > 1 && (
              <button
                onClick={() => setPreviewIndex((i) => (i - 1 + previewImages.length) % previewImages.length)}
                className="absolute left-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {/* Image / File */}
            {previewImages[previewIndex] && (() => {
              const att = previewImages[previewIndex];
              const imgUrl = decodeFileUrl(att.file_url);
              const isImage = att.content_type?.startsWith('image/');
              return isImage ? (
                <img
                  src={imgUrl}
                  alt={att.file_name}
                  className="max-h-[70vh] max-w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-white p-8">
                  <Paperclip className="w-12 h-12 opacity-60" />
                  <p className="text-sm">{att.file_name}</p>
                  <a
                    href={imgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#C72030] rounded text-xs hover:bg-[#C72030]/80"
                  >
                    Open File
                  </a>
                </div>
              );
            })()}
            {/* Next */}
            {previewImages.length > 1 && (
              <button
                onClick={() => setPreviewIndex((i) => (i + 1) % previewImages.length)}
                className="absolute right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Counter + filename */}
          <div className="bg-black/80 px-4 py-2 flex items-center justify-between text-white text-xs">
            <span className="truncate max-w-[70%]">{previewImages[previewIndex]?.file_name}</span>
            {previewImages.length > 1 && (
              <span className="flex-shrink-0">{previewIndex + 1} / {previewImages.length}</span>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Breadcrumb */}
      {/* <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patrolling Response</h1>
            <p className="text-sm text-gray-600">View and manage patrolling checkpoint responses</p>
          </div>
        </div>
      </div> */}

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Response List
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList> */}

        {/* List Tab */}
        <TabsContent value="list" className="mt-0">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
            {/* Total Visits Card */}
            <div 
              onClick={() => handleStatusCardClick(null)}
              className={`bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow ${
                selectedStatus === null
                  ? "shadow-lg transition-shadow shadow-[0px_1px_8px_rgba(45,45,45,0.05)]"
                  : ""
              }`}
            >
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#1A1A1A]">
                  {summaryStats.total_visits}
                  {isLoading && (
                    <span className="ml-1 text-xs animate-pulse">...</span>
                  )}
                </div>
                <div className="text-sm font-medium text-[#1A1A1A]">
                  Total Patrol Schedule
                </div>
              </div>
            </div>

            {/* Completed Card */}
            <div
              onClick={() => handleStatusCardClick('completed')}
              className={`bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow ${
                selectedStatus === 'completed' ? 'ring-0 ring-[#C72030]' : ''
              }`}
            >
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#1A1A1A]">
                  {summaryStats.completed}
                  {isLoading && (
                    <span className="ml-1 text-xs animate-pulse">...</span>
                  )}
                </div>
                <div className="text-sm font-medium text-[#1A1A1A]">Completed</div>
              </div>
            </div>

            {/* Missed Card */}
            <div
              onClick={() => handleStatusCardClick('missed')}
              className={`bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow ${
                selectedStatus === 'missed' ? 'ring-0 ring-[#C72030]' : ''
              }`}
            >
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#1A1A1A]">
                  {summaryStats.missed}
                  {isLoading && (
                    <span className="ml-1 text-xs animate-pulse">...</span>
                  )}
                </div>
                <div className="text-sm font-medium text-[#1A1A1A]">Missed</div>
              </div>
            </div>

            {/* Tickets Raised Card */}
            <div className="bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4">
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#1A1A1A]">
                  {summaryStats.ticket_raised}
                  {isLoading && (
                    <span className="ml-1 text-xs animate-pulse">...</span>
                  )}
                </div>
                <div className="text-sm font-medium text-[#1A1A1A]">Tickets Raised</div>
              </div>
            </div>

            {/* Incident Reported Card */}
            <div className="bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4">
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#1A1A1A]">
                  {summaryStats.incident_reported}
                  {isLoading && (
                    <span className="ml-1 text-xs animate-pulse">...</span>
                  )}
                </div>
                <div className="text-sm font-medium text-[#1A1A1A]">Incident Reported</div>
              </div>
            </div>
          </div>

          {/* Enhanced Data Table */}
          <div className="overflow-x-auto animate-fade-in">
            <div className="space-y-4">
            <EnhancedTable
              data={responseData}
              columns={enhancedTableColumns}
              renderCell={renderCell}
              storageKey="patrolling-response-table"
              enableExport={true}
              exportFileName="patrolling-response-data"
              handleExport={handleExport}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Search responses..."
              pagination={false}
              pageSize={pagination.per_page}
              hideColumnsButton={false}
              hideTableExport={false}
              loading={isLoading}
              onFilterClick={() => setIsFilterOpen(true)}
              rightActions={
                activeFilterCount > 0 ? (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-[#C72030] text-white">
                    {activeFilterCount}
                  </span>
                ) : null
              }
            />

            {/* Server-side Pagination Controls */}
            {pagination.total_count > 0 && (
              <TicketPagination
                currentPage={currentPage}
                totalPages={pagination.total_pages}
                totalRecords={pagination.total_count}
                perPage={perPage}
                isLoading={isLoading || searchLoading}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
              />
            )}
          </div>
          </div>

          {/* Filter Dialog */}
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" aria-describedby="patrolling-filter-description">
              <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <DialogTitle className="text-lg font-semibold">Filter Patrolling Responses</DialogTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)} className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
                <div id="patrolling-filter-description" className="sr-only">Filter patrolling responses by various criteria</div>
              </DialogHeader>
              <div className="space-y-4 py-2">

                {/* Patrol Name */}
                <div className="space-y-2">
                  <Label htmlFor="f-patrol-name">Patrol Name</Label>
                  <Input
                    id="f-patrol-name"
                    placeholder="Enter patrol name..."
                    value={fPatrolName}
                    onChange={e => setFPatrolName(e.target.value)}
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <ReactSelect
                    isClearable
                    isLoading={loadingDropdowns}
                    options={statusOptions}
                    value={statusOptions.find(o => o.value === fStatus) || null}
                    onChange={opt => setFStatus(opt?.value || '')}
                    placeholder="Select status..."
                  />
                </div>

                {/* Schedule Date Range */}
                <div className="space-y-2">
                  <Label>Schedule Date</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('flex-1 justify-start text-left font-normal h-10', !fScheduleDateFrom && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fScheduleDateFrom ? format(fScheduleDateFrom, 'dd MMM yyyy') : 'From'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={fScheduleDateFrom} onSelect={setFScheduleDateFrom} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('flex-1 justify-start text-left font-normal h-10', !fScheduleDateTo && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fScheduleDateTo ? format(fScheduleDateTo, 'dd MMM yyyy') : 'To'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={fScheduleDateTo} onSelect={setFScheduleDateTo} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Patrol Date Range (visited_at) */}
                <div className="space-y-2">
                  <Label>Patrol Date</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('flex-1 justify-start text-left font-normal h-10', !fPatrolDateFrom && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fPatrolDateFrom ? format(fPatrolDateFrom, 'dd MMM yyyy') : 'From'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={fPatrolDateFrom} onSelect={setFPatrolDateFrom} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('flex-1 justify-start text-left font-normal h-10', !fPatrolDateTo && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fPatrolDateTo ? format(fPatrolDateTo, 'dd MMM yyyy') : 'To'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={fPatrolDateTo} onSelect={setFPatrolDateTo} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Submitted By */}
                <div className="space-y-2">
                  <Label>Submitted By</Label>
                  <ReactSelect
                    isClearable
                    isLoading={loadingDropdowns}
                    options={guards}
                    value={guards.find(o => o.value === fGuardId) || null}
                    onChange={opt => setFGuardId(opt ? opt.value : null)}
                    placeholder="Select guard..."
                  />
                </div>

                {/* Location – all dropdowns from /patrolling/dropdowns (no cascade) */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Location</Label>

                  {/* Building – full width */}
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Building</Label>
                    <ReactSelect
                      isClearable
                      isLoading={loadingDropdowns}
                      options={buildings}
                      value={buildings.find(o => o.value === fBuildingId) || null}
                      onChange={opt => setFBuildingId(opt ? opt.value : null)}
                      placeholder="Select building..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Wing */}
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Wing</Label>
                      <ReactSelect
                        isClearable
                        isLoading={loadingDropdowns}
                        options={wings}
                        value={wings.find(o => o.value === fWingId) || null}
                        onChange={opt => setFWingId(opt ? opt.value : null)}
                        placeholder="Select wing..."
                      />
                    </div>

                    {/* Area */}
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Area</Label>
                      <ReactSelect
                        isClearable
                        isLoading={loadingDropdowns}
                        options={areas}
                        value={areas.find(o => o.value === fAreaId) || null}
                        onChange={opt => setFAreaId(opt ? opt.value : null)}
                        placeholder="Select area..."
                      />
                    </div>

                    {/* Floor */}
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Floor</Label>
                      <ReactSelect
                        isClearable
                        isLoading={loadingDropdowns}
                        options={floors}
                        value={floors.find(o => o.value === fFloorId) || null}
                        onChange={opt => setFFloorId(opt ? opt.value : null)}
                        placeholder="Select floor..."
                      />
                    </div>

                    {/* Room */}
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Room</Label>
                      <ReactSelect
                        isClearable
                        isLoading={loadingDropdowns}
                        options={rooms}
                        value={rooms.find(o => o.value === fRoomId) || null}
                        onChange={opt => setFRoomId(opt ? opt.value : null)}
                        placeholder="Select room..."
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleApplyFilters} className="flex-1 bg-[#C72030] text-white hover:bg-[#C72030]/90">
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={handleClearFilters} className="flex-1">
                    Clear Filters
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patrolling Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Analytics dashboard coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
