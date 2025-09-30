
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, Clock, Settings, Shield, Eye, Trash2, Plus, Filter, Download, RefreshCw } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { KRCCFormFilterDialog } from '@/components/KRCCFormFilterDialog';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Local debounce hook (kept here to avoid external dependency assumptions)
function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// Define KRCC Form interface
interface KRCCForm {
  id: number;
  user: string;           // mapped from user.fullname
  user_email: string;     // mapped from user.email
  status: string;
  created_date?: string;  // created_at
  form_type?: string;     // form_details.form_type
}

interface ApiKRCCFormRecord {
  id: number;
  status: string;
  created_at: string;
  form_details?: { form_type?: string } & Record<string, any>;
  user?: { fullname?: string; email?: string };
}

interface KRCCApiResponse {
  krcc_forms: ApiKRCCFormRecord[];
  pagination?: { current_page: number; total_count: number; total_pages: number };
}

export const KRCCFormListDashboard = () => {
  const navigate = useNavigate();

  // Remote data state
  const [krccForms, setKrccForms] = useState<KRCCForm[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [statusFilter] = useState<string>('Pending'); // As per requirement always using Pending for now
  const pageSize = 20; // API default (in sample it's 20 records)
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  // Filter values from modal (email/circle)
  const [filterEmail, setFilterEmail] = useState<string>('');
  const [filterCircle, setFilterCircle] = useState<string>('');

  // KPI cards (Approved/Pending/Rejected derived from current page; total forms from API pagination total_count)
  const cardData = [
    {
      title: 'Total Forms',
      count: totalCount || krccForms.length,
      icon: Users
    },
    {
      title: 'Approved (page)',
      count: krccForms.filter(f => f.status?.toLowerCase() === 'approved').length,
      icon: UserCheck
    },
    {
      title: 'Pending (page)',
      count: krccForms.filter(f => f.status?.toLowerCase() === 'pending').length,
      icon: Clock
    },
    {
      title: 'Rejected (page)',
      count: krccForms.filter(f => f.status?.toLowerCase() === 'rejected').length,
      icon: Shield
    }
  ];
  // Fetch data from API
  const fetchKRCCForms = useCallback(async (page: number, searchValue?: string) => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    if (!baseUrl || !token) {
      setError('Missing base URL or token');
      toast.error('Missing base URL or token');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const trimmed = (searchValue || '').trim();
      const emailMatch = trimmed.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
      const cleanedSearch = emailMatch ? emailMatch[0] : trimmed;
      const searchActive = !!cleanedSearch;

      // Build base URL
      const cleanBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
      let url = `${cleanBaseUrl}/krcc_forms.json?approval=yes&page=${page}`;

      // Email param priority: explicit search box else filter email
      const effectiveEmail = searchActive ? cleanedSearch : (filterEmail || '').trim();
      const effectiveCircle = (filterCircle || '').trim();

      if (effectiveEmail) {
        url += `&q[user_email_cont]=${encodeURIComponent(effectiveEmail)}`;
      }
      if (effectiveCircle) {
        url += `&q[user_lock_user_permissions_circle_name_cont]=${encodeURIComponent(effectiveCircle)}`;
      }
      if (!effectiveEmail && !effectiveCircle) {
        url += `&status=${encodeURIComponent(statusFilter)}`; // default status filter only when no field filters
      }

      console.debug('[KRCC] Fetch URL:', url);

      let res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

      // Fallback to legacy param for email if needed
      if (searchActive && res.ok && effectiveEmail) {
        const firstPayload = await res.clone().json();
        if ((firstPayload.krcc_forms?.length ?? 0) === 0 && cleanedSearch.includes('@')) {
          const cleanBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
          const fallbackUrl = `${cleanBaseUrl}/krcc_forms.json?approval=yes&q[email_cont]=${encodeURIComponent(cleanedSearch)}&page=1`;
          res = await fetch(fallbackUrl, { headers: { Authorization: `Bearer ${token}` } });
        }
      }

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      const data: KRCCApiResponse = await res.json();
      const mapped: KRCCForm[] = (data.krcc_forms || []).map(item => ({
        id: item.id,
        status: item.status,
        user: item.user?.fullname || 'Unknown',
        user_email: item.user?.email || '-',
        created_date: item.created_at?.split('T')[0],
        form_type: item.form_details?.form_type,
      }));
      setKrccForms(mapped);
      if (data.pagination) {
        setCurrentPage(data.pagination.current_page);
        setTotalPages(data.pagination.total_pages);
        setTotalCount(data.pagination.total_count);
      } else {
        setTotalPages(1);
        setTotalCount(mapped.length);
      }
      if (searchActive && mapped.length === 0) {
        toast.info('No results found');
      }
    } catch (e: any) {
      console.error('KRCC fetch error', e);
      setError(e.message || 'Failed to load KRCC forms');
      toast.error('Failed to load KRCC forms');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, filterEmail, filterCircle]);

  // Reset to first page when search changes (debounced)
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchKRCCForms(currentPage, debouncedSearch);
  }, [fetchKRCCForms, currentPage, debouncedSearch]);

  const handleRefresh = () => fetchKRCCForms(currentPage, debouncedSearch);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  // Build pagination items similar to M-Safe dashboard
  const paginationItems = React.useMemo(() => {
    const items: React.ReactNode[] = [];
    if (totalPages <= 1) return items;
    const pushPage = (p: number) => {
      items.push(
        <PaginationItem key={p}>
          <PaginationLink className='cursor-pointer' isActive={currentPage === p} onClick={() => handlePageChange(p)}>
            {p}
          </PaginationLink>
        </PaginationItem>
      );
    };
    const pushEllipsis = (key: string) => items.push(<PaginationItem key={key}><PaginationEllipsis /></PaginationItem>);
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pushPage(i);
    } else {
      pushPage(1);
      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) pushPage(i);
        pushEllipsis('e1');
      } else if (currentPage >= totalPages - 2) {
        pushEllipsis('e1');
        for (let i = totalPages - 3; i < totalPages; i++) pushPage(i);
      } else {
        pushEllipsis('e1');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pushPage(i);
        pushEllipsis('e2');
      }
      pushPage(totalPages);
    }
    return items;
  }, [currentPage, totalPages]);


  const getStatusBadge = (status: string) => {
    if (!status) {
      return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Unknown</Badge>;
    }
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white hover:bg-red-600">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">{status}</Badge>;
    }
  };

  const columns: ColumnConfig[] = [{
    key: 'action',
    label: 'Action',
    sortable: false,
    hideable: true
  }, {
    key: 'user',
    label: 'User',
    sortable: true,
    hideable: true
  }, {
    key: 'user_email',
    label: 'User Email',
    sortable: true,
    hideable: true
  }, {
    key: 'status',
    label: 'Status',
    sortable: true,
    hideable: true
  }];

  const renderCell = (form: KRCCForm, columnKey: string): React.ReactNode => {
    switch (columnKey) {
      case 'action':
        return (
          <div className="flex justify-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/safety/m-safe/krcc-list/${form.id}`)}
              className="h-8 w-8 p-0"
              title="View Form"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload(form)}
              disabled={!!downloading[form.id]}
              className="h-8 w-8 p-0"
              title="Download Form"
            >
              {downloading[form.id] ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          </div>
        );
      case 'user':
        return form.user;
      case 'user_email':
        return form.user_email;
      case 'status':
        return getStatusBadge(form.status);
      case 'delete':
        return (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(form.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      default:
        const value = form[columnKey as keyof KRCCForm];
        return value?.toString() || '';
    }
  };

  const handleDelete = (formId: number) => {
    if (window.confirm('Are you sure you want to delete this KRCC form?')) {
      setKrccForms(prevForms => prevForms.filter(form => form.id !== formId));
      toast.success('KRCC form deleted successfully');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(krccForms.map(form => form.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handleActionClick = () => {
    setShowActionPanel(true);
  };

  const handleExport = async () => {
    console.log('Exporting selected KRCC forms:', selectedItems);
    // Implement export logic here
  };

  const handleFiltersClick = () => {
    setIsFilterDialogOpen(true);
  };

  const handleApplyFilters = (filters: { email?: string; circle?: string }) => {
    setFilterEmail(filters.email || '');
    setFilterCircle(filters.circle || '');
    // Clear search so circle/email filters are visible in payload even if user previously searched
    setSearchTerm('');
    setCurrentPage(1);
    toast.success('Filters applied');
  };

  // Per-row PDF download with loader
  const [downloading, setDownloading] = useState<Record<number, boolean>>({});

  const handleDownload = async (form: KRCCForm) => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    if (!baseUrl || !token) {
      toast.error('Missing base URL or token');
      return;
    }
    setDownloading(prev => ({ ...prev, [form.id]: true }));
    try {
      const protocolBase = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
      // 1) Fetch KRCC detail JSON (same as detail page uses)
      const detailRes = await fetch(`${protocolBase}/krcc_forms/${form.id}.json`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (!detailRes.ok) throw new Error(`HTTP ${detailRes.status}`);
      const detailJson = await detailRes.json();

      // Helpers
      const pad = (n: number) => String(n).padStart(2, '0');
      const fmtDate = (iso?: string | null) => {
        if (!iso) return '—';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return '—';
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
      };
      const fmtDateTime = (iso?: string | null) => {
        if (!iso) return '—';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return '—';
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };
      // PDF label + value formatter ensuring any variant becomes 'M-Parivahan'
      const isMParivahan = (val: string) => val.replace(/[_\s-]/g, '').toLowerCase().includes('mparivahan');
      const normalizeMParivahan = (s: string) => isMParivahan(s) ? 'M-Parivahan' : s;
      const toTitle = (s: string) => {
        const raw = String(s || '');
        if (isMParivahan(raw)) return 'M-Parivahan';
        return raw
          .replace(/_/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .replace(/\b\w/g, (c) => c.toUpperCase());
      };
      const formatValue = (v: any) => {
        if (v == null) return v;
        if (typeof v === 'string') return normalizeMParivahan(v);
        return v;
      };
      const isImage = (url?: string, doctype?: string | null) => {
        const u = url || '';
        const dt = (doctype || '').toLowerCase();
        return /(jpg|jpeg|png|webp|gif|svg)$/i.test(u) || dt.startsWith('image/');
      };
      const extToMime = (url?: string | null) => {
        const u = (url || '').toLowerCase();
        if (u.endsWith('.png')) return 'image/png';
        if (u.endsWith('.jpg') || u.endsWith('.jpeg')) return 'image/jpeg';
        if (u.endsWith('.webp')) return 'image/webp';
        if (u.endsWith('.gif')) return 'image/gif';
        if (u.endsWith('.svg')) return 'image/svg+xml';
        return 'image/jpeg';
      };
      const fixDataUrlMime = (dataUrl: string, fallbackUrl?: string | null) => {
        if (!dataUrl.startsWith('data:image')) {
          const mime = extToMime(fallbackUrl);
          return dataUrl.replace(/^data:[^;]+/, `data:${mime}`);
        }
        return dataUrl;
      };
      const toDataUrl = async (url: string): Promise<string> => {
        try {
          const resp = await fetch(url, { mode: 'cors', credentials: 'omit' });
          const blob = await resp.blob();
          const reader = new FileReader();
          const p: Promise<string> = new Promise((resolve, reject) => {
            reader.onload = () => resolve(fixDataUrlMime(String(reader.result || url), url));
            reader.onerror = reject;
          });
          reader.readAsDataURL(blob);
          return await p;
        } catch {
          return url; // fallback to direct URL
        }
      };
      const toDataUrlViaApi = async (attId?: number | null, fallbackUrl?: string | null): Promise<string> => {
        if (!attId) return fallbackUrl || '';
        try {
          const apiUrl = `${protocolBase}/attachfiles/${attId}?show_file=true`;
          const resp = await fetch(apiUrl, { headers: { Authorization: `Bearer ${token}` } });
          if (!resp.ok) throw new Error('attach fetch failed');
          const blob = await resp.blob();
          const reader = new FileReader();
          const p: Promise<string> = new Promise((resolve, reject) => {
            reader.onload = () => resolve(fixDataUrlMime(String(reader.result || fallbackUrl || ''), fallbackUrl));
            reader.onerror = reject;
          });
          reader.readAsDataURL(blob);
          return await p;
        } catch {
          return fallbackUrl ? await toDataUrl(fallbackUrl) : '';
        }
      };

      // Extract data parts
      const user = detailJson?.user || {};
      const approvedBy = detailJson?.approved_by || null;
      const status = detailJson?.status || '—';
      const createdAt = detailJson?.created_at || null;
      const updatedAt = detailJson?.updated_at || null;
  // Removed formType display from PDF per latest request (previously: detailJson?.form_details?.form_type)
      const formDetails = detailJson?.form_details || {};
      const categories = detailJson?.categories || {};
      const topLevelAtts: Array<{ id?: number; url?: string; doctype?: string | null }> = detailJson?.krcc_attachments || [];

      // Attachment groups per category with preloaded thumbnails
      type AttItem = { id?: number; url?: string; doctype?: string | null; dataUrl?: string };
      type AttGroup = { title: string; items: AttItem[] };
      const preloadGroup = async (title: string, arr?: any[]): Promise<AttGroup | null> => {
        const items = (arr || [])
          .filter((a) => a && (a.url || a.id))
          .filter((a) => isImage(a.url, a.doctype || a.document_content_type)) as AttItem[];
        if (items.length === 0) return null;
        const withData = await Promise.all(items.map(async (a) => ({
          ...a,
          dataUrl: a.id ? await toDataUrlViaApi(a.id as number, a.url || '') : (a.url ? await toDataUrl(a.url!) : ''),
        })));
        return { title, items: withData };
      };
      const collectCatGroups = async (cat: any): Promise<AttGroup[]> => {
        const res: AttGroup[] = [];
        const att = cat?.attachments || {};
        const entries = Object.entries(att as Record<string, any[] | undefined>);
        for (const [key, list] of entries) {
          const pretty = key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
          const grp = await preloadGroup(pretty, list || []);
          if (grp) res.push(grp);
        }
        return res;
      };
      const topLevelImageGroups: AttGroup[] = [];
      if (topLevelAtts && topLevelAtts.length) {
        const grp = await preloadGroup('Other Attachments', topLevelAtts as any[]);
        if (grp) topLevelImageGroups.push(grp);
      }

      // Build offscreen DOM for PDF
      const container = document.createElement('div');
      container.style.padding = '24px';
      container.style.fontFamily = 'Arial, sans-serif';
      container.style.width = '1000px';
      container.style.background = '#f3f4f6';
      container.style.position = 'absolute';
      container.style.left = '-10000px';

      const section = (title: string, bodyHtml: string, opts?: { marginTop?: number }) => `
    <div style='background:#fff;border:1px solid #e5e7eb;border-radius:8px;margin:${opts?.marginTop ?? 0}px 0 24px;'>
          <div style='display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #e5e7eb;background:#f6f4ee;'>
            <h2 style='margin:0;font-size:16px;font-weight:700;color:#111;'>${title}</h2>
          </div>
      <div style='padding:24px;'>${bodyHtml}</div>
        </div>`;
      const label = (l: string, v: string) => {
        // If the label is Vehicle or Vehicle Type, make it span the full row to avoid crowding/overlap
        const isVehicle = /^(vehicle|vehicle type)$/i.test(l.trim());
        const extraStyle = isVehicle ? 'grid-column:1 / -1;' : '';
        // Mark vehicle row as non-splittable to avoid pagination slicing issues
        const avoidAttr = isVehicle ? " data-avoid-split='1'" : '';
        return `
        <div${avoidAttr} style='display:flex;flex-direction:column;gap:4px;${extraStyle}'>
          <span style='color:#6b7280;font-size:12px;'>${l}</span>
          <span style='color:#111;font-size:13px;font-weight:600;'>${v || '—'}</span>
        </div>`;
      };
      const labelIf = (l: string, v?: any) => {
        const has = v !== undefined && v !== null && String(v).toString().trim() !== '';
        return has ? label(l, String(v)) : '';
      };
      const grid3 = (items: string[]) => `
        <div style='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 32px;margin-top:4px;'>${items.join('')}</div>`;

      const userHtml = grid3([
        label('Full Name', user?.fullname || [user?.firstname, user?.lastname].filter(Boolean).join(' ') || '—'),
        label('Employee ID', user?.employee_id || '—'),
        label('Email Id', user?.email || '—'),
        label('Mobile Number', user?.mobile || '—'),
        label('Gender', user?.gender || '—'),
        label('Blood Group', user?.blood_group || '—'),
        label('DOB', user?.birth_date || '—'),
        label('Circle', user?.circle_name || '—'),
        label('Company', user?.company_name || '—'),
        label('Department', user?.department_name || '—'),
        label('Role', user?.role_name || '—'),
        label('Status', status || '—'),
        label('Created On', fmtDateTime(createdAt)),
        label('Updated On', fmtDateTime(updatedAt)),
      ]);

      const approvedByHtml = approvedBy ? (() => {
        const items = [
          labelIf('Full Name', approvedBy?.fullname || [approvedBy?.firstname, approvedBy?.lastname].filter(Boolean).join(' ')),
          labelIf('Employee ID', approvedBy?.employee_id),
          labelIf('Email Id', approvedBy?.email),
          labelIf('Mobile Number', approvedBy?.mobile),
          labelIf('Department', approvedBy?.department_name),
          labelIf('Role', approvedBy?.role_name),
        ].filter(Boolean) as string[];
        return items.length ? grid3(items) : '';
      })() : '';

      // Checklist helpers (mirror detail page logic)
      const FIELD_LABELS: Record<string, string> = {
        dl_number: 'Driving License Number',
        dl_date: 'DL Date',
        reg_number: 'Registration Number',
        vehicle_type: 'Vehicle Type',
        valid_insurence: 'Valid Insurance',
        valid_insurence_date: 'Valid Insurance Till',
        valid_puc: 'Valid PUC',
        valid_puc_date: 'Valid PUC Till',
        medical_certificate_valid_date: 'Medical Certificate Valid Till',
        full_face_helmet: 'Full Face Helmet',
        reflective_jacket: 'Reflective Jacket',
        yoe: 'Experience (Years)',
        role: 'Role',
        fit_to_work: 'Fit to Work',
      };
      const isYes = (v: any) => String(v).toLowerCase() === 'yes' || v === true || String(v).toLowerCase() === 'true' || v === 1;
      const isNo = (v: any) => String(v).toLowerCase() === 'no' || String(v).toLowerCase() === 'false' || v === 0;
      // Remove all checklist boxes & labels entirely (per latest request)
      const buildChecklist = (_prefix: string, _title: string) => '';


      // Build category sections mirroring UPDATED detail page (separate sections + MHE + None of the Above)
      // Order list to keep a consistent, readable sequence of common fields
      const FIELD_ORDER = [
        'dl_number', 'dl_valid_till', 'vehicle_type', 'reg_number',
        'valid_insurance', 'valid_insurance_till', 'valid_insurence', 'valid_insurence_date',
        'valid_puc', 'puc_date', 'valid_puc_date',
        'medical_certificate_valid_till', 'medical_certificate_valid_date',
        'qualification', 'license_number', 'license_validity',
        'experience_years', 'role', 'fit_to_work', 'full_body_harness', 'first_aid_valid_till', 'first_aid_certificate_valid_till',
        'safety_shoes', 'hand_gloves', 'reflective_jacket', 'full_face_helmet', 'yoe'
      ];
      const orderIndex = (k: string) => {
        const i = FIELD_ORDER.indexOf(k);
        return i === -1 ? FIELD_ORDER.length + 100 + k.charCodeAt(0) : i;
      };
      // If keys array omitted, automatically include all primitive (non-object) keys except attachments
      // Added optional labelOverrides to customize specific field labels per category (e.g., electrical fit_to_work)
      const buildCatKV = (cat: any, keys?: string[], labelOverrides?: Record<string,string>) => {
        if (!cat) return '';
        let useKeys = keys && keys.length ? keys : Object.keys(cat).filter(k => k !== 'attachments');
        // Sort according to predefined order then fallback alpha
        useKeys.sort((a, b) => {
          const ai = orderIndex(a); const bi = orderIndex(b);
          if (ai !== bi) return ai - bi; return a.localeCompare(b);
        });
        const items: string[] = [];
        useKeys.forEach(k => {
          const v = cat?.[k];
          const isObj = v && typeof v === 'object' && !Array.isArray(v);
          const has = !isObj && v !== undefined && v !== null && String(v).toString().trim() !== '';
          if (has) {
            const displayLabel = labelOverrides?.[k] || toTitle(k);
            items.push(label(displayLabel, String(formatValue(v))));
          }
        });
        return items.length ? grid3(items) : '';
      };
      const catHtml: string[] = [];

      // 2 Wheeler Section
      if (categories?.bike) {
        const bike = (categories as any).bike;
        // Show all available simple fields for bike (2 Wheeler)
        const kvBike = buildCatKV(bike); // dynamic extraction now includes insurance, puc, medical, etc.
        const checklist2w = buildChecklist('2w_', '2 Wheeler');
        const groups = await collectCatGroups(bike);
        const attHtml = groups.map(g => `
            <div style='margin-top:8px;'>
              <div style='font-weight:600;margin-bottom:6px;'>${g.title}</div>
              <div style='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;'>
  ${g.items.map(it => `<div data-avoid-split='1' style='border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;'>
      <img src='${it.dataUrl || it.url || ''}' style='width:100%;height:auto;max-height:240px;object-fit:contain;display:block;background:#fff;'/>
                </div>`).join('')}
              </div>
            </div>`).join('');
        if (kvBike || checklist2w || attHtml) {
          catHtml.push(section('KRCC Details (Ride a 2 Wheeler)', kvBike + (checklist2w || '') + attHtml));
        }
      }

      // 4 Wheeler Section
      if (categories?.car) {
        const car = (categories as any).car;
        const kvCar = buildCatKV(car, ['dl_number', 'dl_valid_till', 'vehicle_type', 'reg_number', 'valid_insurance', 'valid_insurance_till', 'valid_puc', 'puc_date', 'medical_certificate_valid_till']);
        const checklist4w = buildChecklist('4w_', '4 Wheeler');
        const groups = await collectCatGroups(car);
        const attHtml = groups.map(g => `
            <div style='margin-top:8px;'>
              <div style='font-weight:600;margin-bottom:6px;'>${g.title}</div>
              <div style='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;'>
  ${g.items.map(it => `<div data-avoid-split='1' style='border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;'>
      <img src='${it.dataUrl || it.url || ''}' style='width:100%;height:auto;max-height:240px;object-fit:contain;display:block;background:#fff;'/>
                </div>`).join('')}
              </div>
            </div>`).join('');
        if (kvCar || checklist4w || attHtml) {
          catHtml.push(section('KRCC Details (Drive a 4 Wheeler)', kvCar + (checklist4w || '') + attHtml));
        }
      }

      // Electrical Work
      if (categories?.electrical) {
        const electrical = (categories as any).electrical;
        const kv = buildCatKV(
          electrical,
          ['qualification', 'license_number', 'license_validity', 'fit_to_work', 'medical_certificate_valid_till', 'first_aid_valid_till'],
          { fit_to_work: 'Fit to work on electrical system' }
        );
        const groups = await collectCatGroups(electrical);
        const attHtml = groups.map(g => `
          <div style='margin-top:8px;'>
            <div style='font-weight:600;margin-bottom:6px;'>${g.title}</div>
            <div style='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;'>
  ${g.items.map(it => `<div data-avoid-split='1' style='border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;'>
        <img src='${it.dataUrl || it.url || ''}' style='width:100%;height:auto;max-height:240px;object-fit:contain;display:block;background:#fff;'/>
              </div>`).join('')}
            </div>
          </div>`).join('');
        if (kv || attHtml) catHtml.push(section('Work on Electrical System', kv + attHtml));
      }

      // Work at Height
      if (categories?.height) {
        const height = (categories as any).height;
        const kv = buildCatKV(height, ['experience_years', 'fit_to_work', 'full_body_harness', 'medical_certificate_valid_till', 'first_aid_certificate_valid_till']);
        const groups = await collectCatGroups(height);
        const attHtml = groups.map(g => `
          <div style='margin-top:8px;'>
            <div style='font-weight:600;margin-bottom:6px;'>${g.title}</div>
            <div style='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;'>
  ${g.items.map(it => `<div data-avoid-split='1' style='border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;'>
        <img src='${it.dataUrl || it.url || ''}' style='width:100%;height:auto;max-height:240px;object-fit:contain;display:block;background:#fff;'/>
              </div>`).join('')}
            </div>
          </div>`).join('');
        if (kv || attHtml) catHtml.push(section('Work at Height', kv + attHtml));
      }

      // Work Underground
      if (categories?.underground) {
        const underground = (categories as any).underground;
        const kv = buildCatKV(underground, ['experience_years', 'role', 'fit_to_work', 'medical_certificate_valid_till']);
        const checklistUG = buildChecklist('work_under_ground_', 'Work Underground');
        const groups = await collectCatGroups(underground);
        const attHtml = groups.map(g => `
          <div style='margin-top:8px;'>
            <div style='font-weight:600;margin-bottom:6px;'>${g.title}</div>
            <div style='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;'>
              ${g.items.map(it => `<div data-avoid-split='1' style='border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;'>
                <img src='${it.dataUrl || it.url || ''}' style='width:100%;height:auto;max-height:240px;object-fit:contain;display:block;background:#fff;'/>
              </div>`).join('')}
            </div>
          </div>`).join('');
        if (kv || checklistUG || attHtml) catHtml.push(section('Work Underground', kv + (checklistUG || '') + attHtml));
      }

      // Ride a Bicycle
      if (categories?.bicycle) {
        const bicycle = (categories as any).bicycle;
        const kv = buildCatKV(bicycle, ['reflective_jacket', 'training_available']);
        if (kv) catHtml.push(section('Ride a Bicycle', kv));
      }

      // Operate MHE
      if (categories?.mhe) {
        const mhe = (categories as any).mhe;
        const kv = buildCatKV(mhe, ['safety_shoes', 'hand_gloves', 'reflective_jacket']);
        if (kv) catHtml.push(section('Operate MHE', kv));
      }

      // None of the Above
      if (categories?.none_of_the_above) {
        catHtml.push(section('None of the Above', `<p style='font-size:12px;color:#374151;'>User selected "None of the above"; no category-specific details provided.</p>`));
      }

      // (Still skipping top-level standalone attachments unless needed later)
      container.innerHTML = `
  ${section('Personal Details', userHtml)}
  ${approvedByHtml ? section('Approved Details', approvedByHtml) : ''}
    ${catHtml.join('')}
    <div style='text-align:right;font-size:10px;color:#666;margin-top:8px;'>Generated: ${new Date().toLocaleString()}</div>
  `;
      // Final safety normalization pass – replace any residual variants (e.g., "Mparivahan", "M_parivahan", etc.)
      container.innerHTML = container.innerHTML.replace(/M[ _-]?parivahan/gi, 'M-Parivahan');

      document.body.appendChild(container);

      // Helper to compute non-splittable regions (CSS px -> canvas px) with extra padding
      const computeAvoidRanges = (scaleVal: number) => {
        const rootRect = container.getBoundingClientRect();
        const nodes = Array.from(container.querySelectorAll('[data-avoid-split]')) as HTMLElement[];
        const pad = Math.ceil(8 * scaleVal); // add safety padding around avoid blocks
        const ranges = nodes.map((el) => {
          const r = el.getBoundingClientRect();
          const topCss = r.top - rootRect.top;
          const bottomCss = r.bottom - rootRect.top;
          return {
            top: Math.max(0, Math.floor(topCss * scaleVal) - pad),
            bottom: Math.max(0, Math.ceil(bottomCss * scaleVal) + pad),
          };
        });
        // Merge overlapping ranges for faster checks
        ranges.sort((a, b) => a.top - b.top);
        const merged: { top: number; bottom: number }[] = [];
        for (const rng of ranges) {
          const last = merged[merged.length - 1];
          if (!last || rng.top > last.bottom) merged.push({ ...rng });
          else last.bottom = Math.max(last.bottom, rng.bottom);
        }
        return merged;
      };

      let canvas: HTMLCanvasElement;
      try {
        const renderScale = 3;
        const avoidRanges = computeAvoidRanges(renderScale);
        canvas = await html2canvas(container, { scale: renderScale, useCORS: true, allowTaint: false });
        // Pagination & slicing with avoid-split awareness
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const marginX = 20;
        const marginY = 20;
        const usableWidth = pageWidth - marginX * 2;
        const ratio = usableWidth / canvas.width;
        const fullHeightPt = canvas.height * ratio;

        if (fullHeightPt <= pageHeight - marginY * 2) {
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', marginX, marginY, usableWidth, fullHeightPt, undefined, 'FAST');
        } else {
          const pageUsableHeightPt = pageHeight - marginY * 2;
          const sliceHeightPxBase = Math.floor(pageUsableHeightPt / ratio);
          let startY = 0;
          let pageIndex = 0;
          const minSlicePx = Math.max(120, Math.floor(60 * renderScale));
          const findSafeEnd = (start: number, desired: number) => {
            let end = Math.min(canvas.height, desired);
            // If ending inside an avoid-split block, snap to just above it
            const hit = avoidRanges.find(r => r.top < end && r.bottom > end);
            if (hit) end = Math.max(start + minSlicePx, hit.top - 2);
            // Ensure not inside any avoid block
            let safety = 0;
            while (avoidRanges.some(r => r.top < end && r.bottom > end) && safety < 5) {
              const r = avoidRanges.find(rr => rr.top < end && rr.bottom > end)!;
              end = Math.max(start + minSlicePx, r.top - 2);
              safety++;
            }
            // If too small, push past the next block's bottom when possible
            if (end - start < minSlicePx) {
              const next = avoidRanges.find(r => r.bottom > start);
              if (next) end = Math.min(canvas.height, Math.max(next.bottom + 2, start + minSlicePx));
            }
            if (end <= start) end = Math.min(canvas.height, start + sliceHeightPxBase);
            return end;
          };
          while (startY < canvas.height) {
            let endY = findSafeEnd(startY, startY + sliceHeightPxBase);

            const sliceCanvas = document.createElement('canvas');
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = Math.min(endY - startY, canvas.height - startY);
            const ctx = sliceCanvas.getContext('2d');
            ctx?.drawImage(canvas, 0, startY, canvas.width, sliceCanvas.height, 0, 0, canvas.width, sliceCanvas.height);
            const sliceData = sliceCanvas.toDataURL('image/png');
            if (pageIndex > 0) pdf.addPage();
            const sliceHeightPt = sliceCanvas.height * ratio;
            pdf.addImage(sliceData, 'PNG', marginX, marginY, usableWidth, sliceHeightPt, undefined, 'FAST');
            startY += sliceCanvas.height;
            pageIndex++;
          }
        }

        try { pdf.save(`krcc_${form.id}.pdf`); }
        catch {
          try {
            const blob = pdf.output('blob');
            const urlObj = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = urlObj; a.download = `krcc_${form.id}.pdf`; document.body.appendChild(a); a.click();
            setTimeout(() => { URL.revokeObjectURL(urlObj); document.body.removeChild(a); }, 1500);
          } catch { }
        }

        document.body.removeChild(container);
        toast.success('PDF generated');
        return; // end normal path early so we don't run old pagination logic below
      } catch (e) {
        console.warn('[KRCC][PDF] html2canvas failed, falling back to text-only sections', e);
        // Fallback: rebuild with text-only sections (no images)
        const buildKRCCTextOnly = () => {
          let body = '';
          if (categories?.bike) {
            const bike = (categories as any).bike;
            const kvBike = buildCatKV(bike, ['dl_number', 'dl_valid_till', 'reg_number']);
            const checklist2w = buildChecklist('2w_', '2 Wheeler');
            body += `
              <div style='margin-bottom:16px;'>
                <div style='font-size:14px;font-weight:700;color:#111;margin-bottom:8px;'>Ride a 2 Wheeler</div>
                ${kvBike}
                ${checklist2w}
              </div>`;
          }
          if (categories?.car) {
            const car = (categories as any).car;
            const kvCar = buildCatKV(car, ['dl_number', 'dl_valid_till', 'vehicle_type', 'reg_number', 'valid_insurance', 'valid_insurance_till', 'valid_puc', 'medical_certificate_valid_till']);
            const checklist4w = buildChecklist('4w_', '4 Wheeler');
            body += `
              <div style='margin-bottom:16px;'>
                <div style='font-size:14px;font-weight:700;color:#111;margin-bottom:8px;'>Drive a 4 Wheeler</div>
                ${kvCar}
                ${checklist4w}
              </div>`;
          }
          return body;
        };

        const ugText = categories?.underground ? (() => {
          const underground = (categories as any).underground;
          const kv = buildCatKV(underground, ['experience_years', 'role', 'fit_to_work', 'medical_certificate_valid_till']);
          const checklistUG = buildChecklist('work_under_ground_', 'Work Underground');
          return kv + checklistUG;
        })() : '';

        const heightText = categories?.height ? (() => {
          const height = (categories as any).height;
          return buildCatKV(height, ['experience_years', 'fit_to_work', 'full_body_harness', 'medical_certificate_valid_till', 'first_aid_certificate_valid_till']);
        })() : '';

        const electricalText = categories?.electrical ? (() => {
          const electrical = (categories as any).electrical;
          return buildCatKV(
            electrical,
            ['qualification', 'license_number', 'license_validity', 'fit_to_work', 'medical_certificate_valid_till', 'first_aid_valid_till'],
            { fit_to_work: 'Fit to work on electrical system' }
          );
        })() : '';

        const bicycleText = categories?.bicycle ? (() => {
          const bicycle = (categories as any).bicycle;
          return buildCatKV(bicycle, ['reflective_jacket', 'training_available']);
        })() : '';

        const consolidatedKRCC = buildKRCCTextOnly(); // still used for fallback (2W + 4W)
        const noneAboveText = categories?.none_of_the_above ? section('None of the Above', `<p style='font-size:12px;color:#374151;'>User selected "None of the above"; no category-specific details provided.</p>`) : '';
        const mheText = categories?.mhe ? section('Operate MHE', buildCatKV((categories as any).mhe, ['safety_shoes', 'hand_gloves', 'reflective_jacket'])) : '';
        const sectionsHtml = [
          section('Personal Details', userHtml),
          approvedBy ? section('Approved Details', approvedByHtml) : '',
          consolidatedKRCC ? section('KRCC Details (Ride / Drive)', consolidatedKRCC) : '',
          ugText ? section('Work Underground', ugText) : '',
          bicycleText ? section('Ride a Bicycle', bicycleText) : '',
          heightText ? section('Work at Height', heightText) : '',
          electricalText ? section('Work on Electrical System', electricalText) : '',
          mheText,
          noneAboveText,
        ].join('');

        container.innerHTML = `
          ${sectionsHtml}
          <div style='text-align:right;font-size:10px;color:#666;margin-top:8px;'>Generated: ${new Date().toLocaleString()}</div>
        `;
        const renderScale2 = 2;
        const avoidRanges2 = computeAvoidRanges(renderScale2);
        canvas = await html2canvas(container, { scale: renderScale2 });

        // Repeat pagination with avoid ranges for fallback
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const marginX = 20;
        const marginY = 20;
        const usableWidth = pageWidth - marginX * 2;
        const ratio = usableWidth / canvas.width;
        const fullHeightPt = canvas.height * ratio;

        if (fullHeightPt <= pageHeight - marginY * 2) {
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', marginX, marginY, usableWidth, fullHeightPt, undefined, 'FAST');
        } else {
          const pageUsableHeightPt = pageHeight - marginY * 2;
          const sliceHeightPxBase = Math.floor(pageUsableHeightPt / ratio);
          let startY = 0;
          let pageIndex = 0;
          const minSlicePx = Math.max(120, Math.floor(60 * renderScale2));
          const findSafeEnd = (start: number, desired: number) => {
            let end = Math.min(canvas.height, desired);
            const hit = avoidRanges2.find(r => r.top < end && r.bottom > end);
            if (hit) end = Math.max(start + minSlicePx, hit.top - 2);
            let safety = 0;
            while (avoidRanges2.some(r => r.top < end && r.bottom > end) && safety < 5) {
              const r = avoidRanges2.find(rr => rr.top < end && rr.bottom > end)!;
              end = Math.max(start + minSlicePx, r.top - 2);
              safety++;
            }
            if (end - start < minSlicePx) {
              const next = avoidRanges2.find(r => r.bottom > start);
              if (next) end = Math.min(canvas.height, Math.max(next.bottom + 2, start + minSlicePx));
            }
            if (end <= start) end = Math.min(canvas.height, start + sliceHeightPxBase);
            return end;
          };
          while (startY < canvas.height) {
            let endY = findSafeEnd(startY, startY + sliceHeightPxBase);
            const sliceCanvas = document.createElement('canvas');
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = Math.min(endY - startY, canvas.height - startY);
            const ctx = sliceCanvas.getContext('2d');
            ctx?.drawImage(canvas, 0, startY, canvas.width, sliceCanvas.height, 0, 0, canvas.width, sliceCanvas.height);
            const sliceData = sliceCanvas.toDataURL('image/png');
            if (pageIndex > 0) pdf.addPage();
            const sliceHeightPt = sliceCanvas.height * ratio;
            pdf.addImage(sliceData, 'PNG', marginX, marginY, usableWidth, sliceHeightPt, undefined, 'FAST');
            startY += sliceCanvas.height;
            pageIndex++;
          }
        }

        try { pdf.save(`krcc_${form.id}.pdf`); }
        catch {
          try {
            const blob = pdf.output('blob');
            const urlObj = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = urlObj; a.download = `krcc_${form.id}.pdf`; document.body.appendChild(a); a.click();
            setTimeout(() => { URL.revokeObjectURL(urlObj); document.body.removeChild(a); }, 1500);
          } catch { }
        }

        document.body.removeChild(container);
        toast.success('PDF generated');
        return;
      }

    } catch (e: any) {
      console.error('[KRCC][PDF] Generation error', e);
      toast.error(e?.message || 'Failed to generate PDF');
    } finally {
      setDownloading(prev => ({ ...prev, [form.id]: false }));
    }
  };

  return (
    <>
      <div className="p-6">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee]"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54] rounded-full">
                <card.icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                  {card.count}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                  {card.title}
                </div>
              </div>
            </div>
          ))}
        </div> */}

        {showActionPanel && (
          <SelectionPanel
            actions={[
              { label: 'Export Selected', icon: Plus, onClick: handleExport },
            ]}
            onClearSelection={() => setShowActionPanel(false)}
          />
        )}

        <div className="rounded-lg">
          {error && (
            <div className="mb-4 p-3 border border-red-300 text-red-600 rounded bg-red-50 text-sm">{error}</div>
          )}
          <EnhancedTable
            data={krccForms || []}
            // leftActions={
            //   <Button
            //     onClick={handleActionClick}
            //     className="text-white bg-[#C72030] hover:bg-[#C72030]/90"
            //   >
            //     <Plus className="w-4 h-4" />
            //     Action
            //   </Button>
            // }
            columns={columns}
            onFilterClick={handleFiltersClick}
            renderCell={renderCell}
            onSelectAll={handleSelectAll}
            storageKey="krcc-forms"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search..."
            handleExport={handleExport}
            exportFileName="krcc-forms"
            pagination={false} // using server-side pagination below
            loading={loading}
            enableSearch={true}
            onRowClick={form => console.log('Row clicked:', form)}
          />
          {!loading && totalPages > 1 && (
            <div className="flex flex-col items-center gap-2 mt-6">
              <div className="text-sm text-gray-600">Page {currentPage} of {totalPages} | Total {totalCount}</div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious className='cursor-pointer' onClick={() => handlePageChange(currentPage - 1)} />
                  </PaginationItem>
                  {paginationItems}
                  <PaginationItem>
                    <PaginationNext className='cursor-pointer' onClick={() => handlePageChange(currentPage + 1)} />
                  </PaginationItem>
                  {/* <PaginationItem>
                    <Button variant="outline" size="sm" onClick={handleRefresh} title="Refresh" disabled={loading}>
                      <RefreshCw className={"w-4 h-4" + (loading ? ' animate-spin' : '')} />
                    </Button>
                  </PaginationItem> */}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        <KRCCFormFilterDialog
          isOpen={isFilterDialogOpen}
          onClose={() => setIsFilterDialogOpen(false)}
          onApplyFilters={handleApplyFilters}
        />
      </div>
    </>
  );
};
