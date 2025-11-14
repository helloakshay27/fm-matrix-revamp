import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { Eye } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const columns = [
  { key: 'actions', label: 'Action', sortable: false, defaultVisible: true },
  { key: 'user_name', label: 'User Name', sortable: true, defaultVisible: true },
  { key: 'email', label: 'Email ID', sortable: true, defaultVisible: true },
  { key: 'user_type', label: 'Type of User', sortable: true, defaultVisible: true },
  // { key: 'training_type', label: 'Training Type(Internal/External)', sortable: true, defaultVisible: true },
  // { key: 'training_name', label: 'Training Name', sortable: true, defaultVisible: true },
  // { key: 'training_date', label: 'Training Date', sortable: true, defaultVisible: true },
  // { key: 'attachment', label: 'Attachment', sortable: false, defaultVisible: true },
];

// API typess
interface TrainingAttachment {
  id: number;
  url: string;
  doctype: string | null;
}

interface TrainingApiRecord {
  id: number;
  training_type: string | null;
  training_subject_id: number | null;
  training_date: string | null;
  status: string | null;
  approved_by_id: number | null;
  created_by_id: number | null;
  comment: string | null;
  total_score: number | null;
  actual_score: number | null;
  resource_id: number | null;
  resource_type: string | null;
  created_at: string | null;
  updated_at: string | null;
  url: string | null;
  form_url: string | null;
  training_subject_name: string | null;
  created_by?: {
    id?: number;
    name?: string;
    email?: string;
    mobile?: string | null;
    employee_type?: string | null;
  } | null;
  training_attachments?: TrainingAttachment[];
}

interface TrainingPagination {
  current_page: number;
  total_count: number;
  total_pages: number;
}

interface TrainingApiResponse {
  code?: number;
  data?: TrainingApiRecord[];
  pagination?: TrainingPagination;
}

interface TrainingRow {
  id: number;
  user_name: string;
  email: string;
  user_type: string;
  training_type: string;
  training_name: string;
  training_date: string; // formatted
  raw_date?: string | null; // original for potential sorting
  attachment_url?: string;
  attachment_doctype?: string | null;
  attachment_id?: number | null;
}


import { useNavigate } from 'react-router-dom';
import { Users, ClipboardList, CalendarCheck2, UserCheck, FileText, FileSpreadsheet, Download } from 'lucide-react';
import TrainingFilterDialog from '@/components/TrainingFilterDialog';

const TrainingDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [trainings, setTrainings] = useState<TrainingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); // email search input
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewAttachmentId, setPreviewAttachmentId] = useState<number | null>(null);
  const [downloadingAttachment, setDownloadingAttachment] = useState(false);
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  // Filter dialog state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterEmail, setFilterEmail] = useState('');
  const [filterTrainingName, setFilterTrainingName] = useState('');
  const navigate = useNavigate();

  const formatDateTime = (iso: string | null): string => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return '—';
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch { return '—'; }
  };

  // Debounce search input (500ms)
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 500);
    return () => clearTimeout(id);
  }, [searchTerm]);

  // Reset to first page when search term changes
  useEffect(() => {
    if (debouncedSearch) setCurrentPage(1);
  }, [debouncedSearch]);

  const fetchTrainings = useCallback(async (page: number, emailSearch?: string) => {
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
  const dialogFilterActive = filterEmail.trim() || filterTrainingName.trim();
  const effectivePage = page;
   // honor requested page; we already reset page elsewhere when search/filter changes
           const cleanBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
      let url = `${cleanBaseUrl}/trainings.json?approval=true&page=${effectivePage}`;
      // If dialog filter active, append each provided field separately (no combined OR param)
      if (dialogFilterActive) {
        const params: string[] = [];
        if (filterTrainingName.trim()) {
          params.push(`q[training_subject_category_name_cont]=${encodeURIComponent(filterTrainingName.trim())}`);
        }
        if (filterEmail.trim()) {
          params.push(`q[created_by_email_cont]=${encodeURIComponent(filterEmail.trim())}`);
        }
        if (params.length) {
          url += `&${params.join('&')}`;
        }
      } else if (emailSearch) {
        // Inline search (email only)
        url += `&q[created_by_email_cont]=${encodeURIComponent(emailSearch)}`;
      }
      console.debug('[Training] Fetch URL:', url);
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const json: TrainingApiResponse = await res.json();
      const records = json.data || [];
      const mapped: TrainingRow[] = records.map(r => ({
        id: r.id,
        user_name: r.created_by?.name || '—',
        email: r.created_by?.email || '—',
        user_type: r.created_by?.employee_type || '—',
        training_type: (r.training_type || '').toString().toLowerCase() === 'internal' ? 'Internal' : (r.training_type || '') ? (r.training_type || '').charAt(0).toUpperCase() + (r.training_type || '').slice(1) : '—',
        training_name: r.training_subject_name || '—',
        training_date: formatDateTime(r.training_date),
        raw_date: r.training_date,
        attachment_url: r.training_attachments?.[0]?.url,
        attachment_doctype: r.training_attachments?.[0]?.doctype || null,
        attachment_id: r.training_attachments?.[0]?.id ?? null,
      }));
      setTrainings(mapped);
      if (json.pagination) {
        setCurrentPage(json.pagination.current_page);
        setTotalPages(json.pagination.total_pages);
        setTotalCount(json.pagination.total_count);
      } else {
        setTotalPages(1);
        setTotalCount(mapped.length);
      }
    } catch (e: any) {
      console.error('Training fetch error', e);
      setError(e.message || 'Failed to load trainings');
      toast.error('Failed to load trainings');
    } finally {
      setLoading(false);
    }
  }, [filterEmail, filterTrainingName]);

  useEffect(() => {
    fetchTrainings(currentPage, debouncedSearch || undefined);
  }, [fetchTrainings, currentPage, debouncedSearch]);

  // Summary card data (training-specific) using current page data & totals
  const cardData = [
    {
      title: 'Total Trainings',
      count: totalCount || trainings.length,
      icon: Users,
    },
    {
      title: 'Unique Users (page)',
      count: Array.from(new Set(trainings.map(d => d.user_name))).filter(n => n !== '—').length,
      icon: UserCheck,
    },
    {
      title: 'Training Types (page)',
      count: Array.from(new Set(trainings.map(d => d.training_type))).filter(t => t !== '—').length,
      icon: ClipboardList,
    },
    {
      title: 'Internal / External (page)',
      count: `${trainings.filter(d => d.training_type === 'Internal').length} / ${trainings.filter(d => d.training_type !== 'Internal' && d.training_type !== '—').length}`,
      icon: CalendarCheck2,
    },
  ];

  const renderCell = (item: TrainingRow, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="View user trainings"
              onClick={() => navigate(`/safety/m-safe/training-list/training-user-details/${item.id}`, { state: { row: item } })}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {/* <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 disabled:opacity-50"
              title={generatingId === item.id ? 'Generating PDF...' : 'Download PDF'}
              disabled={generatingId === item.id}
              onClick={() => downloadPdf(item)}
            >
              {generatingId === item.id ? (
                <span className="animate-pulse text-xs">...</span>
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button> */}
          </div>
        );
      case 'training_date':
        return item.training_date;
      case 'attachment': {
        if (!item.attachment_url) return '—';
        const url = item.attachment_url;
        const doctype = item.attachment_doctype || '';
        const isImage = /(jpg|jpeg|png|webp|gif|svg)$/i.test(url) || doctype.startsWith('image/');
        const isPdf = /pdf$/i.test(url) || doctype === 'application/pdf';
        const isExcel = /(xls|xlsx|csv)$/i.test(url) || /spreadsheetml|excel|csv/i.test(doctype);
        const isWord = /(doc|docx)$/i.test(url) || /word/i.test(doctype);
        if (isImage) {
          return (
            <div className="flex justify-center">
              <div
                className="w-14 h-14 flex items-center justify-center bg-[#F6F4EE] rounded border overflow-hidden cursor-pointer group"
                onClick={() => { setPreviewImage(url); setPreviewAttachmentId(item.attachment_id ?? null); }}
                title="View image"
              >
                <img src={url} alt="Attachment" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
            </div>
          );
        }
        let icon: React.ReactNode = <FileText className="w-6 h-6 text-gray-600" />;
        if (isPdf) icon = <FileText className="w-6 h-6 text-red-600" />;
        else if (isExcel) icon = <FileSpreadsheet className="w-6 h-6 text-green-600" />;
        else if (isWord) icon = <FileText className="w-6 h-6 text-blue-600" />;
        return (
          <div className="flex justify-center">
            <div title="Download attachment" className="w-14 h-14 flex items-center justify-center bg-[#F6F4EE] rounded border cursor-pointer hover:ring-1 hover:ring-[#C72030]"
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token');
                  if (!token) {
                    window.open(url, '_blank');
                    return;
                  }
                  window.open(url, '_blank');
                } catch (e) {
                  console.error('Attachment open error', e);
                }
              }}
            >
              {icon}
            </div>
          </div>
        );
      }
      default:
        return item[columnKey] || '';
    }
  };

  // Download PDF for a user's trainings mirroring TrainingUserDetailPage
  const downloadPdf = async (row: TrainingRow) => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    if (!baseUrl || !token) {
      setError('Missing base URL or token');
      toast.error('Missing base URL or token');
      return;
    }
    setGeneratingId(row.id);
    try {
      // Fetch same data as TrainingUserDetailPage
      const url = `https://${baseUrl}/trainings/${row.id}/user_trainings.json`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json: { data?: any[] } = await res.json();
  let records: any[] = json.data || [];
  let primary = records[0] || {};

      const pad = (n: number) => String(n).padStart(2, '0');
      const formatDateTime = (iso?: string | null) => {
        if (!iso) return '—';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return '—';
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`; // date only
      };
      const statusLabel = (status?: string | null) => {
        const s = (status || '').trim().toLowerCase();
        if (!s) return 'Not Yet';
        if (s === 'completed') return 'Pass';
        if (s === 'pending') return 'Fail';
        return 'Not Yet';
      };

      // Helpers for attachments/images
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
          // Replace leading mime if it's application/octet-stream or empty
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
            reader.onload = () => {
              const raw = String(reader.result || url);
              resolve(fixDataUrlMime(raw, url));
            };
            reader.onerror = reject;
          });
          reader.readAsDataURL(blob);
          return await p;
        } catch {
          return url; // fallback
        }
      };
      const toDataUrlViaApi = async (attId?: number | null, fallbackUrl?: string | null): Promise<string> => {
        if (!attId) return fallbackUrl || '';
        try {
          const apiUrl = `https://${baseUrl}/attachfiles/${attId}?show_file=true`;
          const resp = await fetch(apiUrl, { headers: { Authorization: `Bearer ${token}` } });
          if (!resp.ok) throw new Error('attach fetch failed');
          const blob = await resp.blob();
          const reader = new FileReader();
          const p: Promise<string> = new Promise((resolve, reject) => {
            reader.onload = () => {
              const raw = String(reader.result || fallbackUrl || '');
              resolve(fixDataUrlMime(raw, fallbackUrl));
            };
            reader.onerror = reject;
          });
          reader.readAsDataURL(blob);
          return await p;
        } catch {
          // fallback to unauthenticated fetch or original url
          return fallbackUrl ? await toDataUrl(fallbackUrl) : '';
        }
      };
      const enrichAttachments = async (recs: any[]) => {
        return Promise.all(
          recs.map(async (rec) => {
            const atts = Array.isArray(rec?.training_attachments) ? rec.training_attachments : [];
            const enhanced = await Promise.all(
              atts.map(async (a: any) => ({
                ...a,
                dataUrl: isImage(a?.url, a?.doctype) ? await toDataUrlViaApi(a?.id, a?.url) : undefined,
              }))
            );
            return { ...rec, __enhanced_attachments: enhanced };
          })
        );
      };

      // Preload images to avoid CORS issues and keep quality
      records = await enrichAttachments(records);
      primary = records[0] || {};

      // Build offscreen DOM mirroring sections
      const container = document.createElement('div');
      container.style.padding = '24px';
      container.style.fontFamily = 'Arial, sans-serif';
      container.style.width = '1000px';
      container.style.background = '#f3f4f6';
      container.style.position = 'absolute';
      container.style.left = '-10000px';

      const section = (title: string, bodyHtml: string) => `
        <div style='background:#fff;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:24px;'>
          <div style='display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #e5e7eb;background:#f6f4ee;'>
            <h2 style='margin:0;font-size:16px;font-weight:700;color:#111;'>${title}</h2>
          </div>
          <div style='padding:24px;'>${bodyHtml}</div>
        </div>`;

      const label = (l: string, v: string) => `
        <div style='display:flex;flex-direction:column;gap:4px;'>
          <span style='color:#6b7280;font-size:12px;'>${l}</span>
          <span style='color:#111;font-size:13px;font-weight:600;'>${v || '—'}</span>
        </div>`;
      const grid3 = (items: string[]) => `
        <div style='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 32px;'>${items.join('')}</div>`;

  // Personal Details (from primary)
      const createdBy = (primary?.created_by || {}) as any;
      const personalHtml = grid3([
        label('Name', createdBy?.name || '—'),
        label('Email Id', createdBy?.email || '—'),
        label('Mobile Number', createdBy?.mobile || '—'),
        label('User Type', createdBy?.employee_type || '—'),
        label('Status', statusLabel(primary?.status)),
        label('Training Date', formatDateTime(primary?.training_date)),
      ]);

      const recordCard = (rec: any, index: number) => {
        // Removed separate top bar to eliminate whitespace; integrate Status into grid
        const body = `
          <div style='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 32px;'>
            ${label('Training Name', rec?.training_subject_name || '—')}
            ${label('Training Type', rec?.training_type || '—')}
            ${label('Training Date', formatDateTime(rec?.training_date))}
            ${label('Created On', formatDateTime(rec?.created_at))}
            ${label('Updated On', formatDateTime(rec?.updated_at))}
            ${label('Status', statusLabel(rec?.status))}
          </div>`;
  // Attachments: render images as smaller thumbnails (2-column grid) for compact PDFs
        const atts = Array.isArray(rec?.__enhanced_attachments) ? rec.__enhanced_attachments : (Array.isArray(rec?.training_attachments) ? rec.training_attachments : []);
        const attList = atts.length
          ? atts
              .map((a: any) =>
                isImage(a?.url, a?.doctype)
  ? `<div style='width:100%;margin:0;page-break-inside:avoid;padding:4px 0 4px 0;'>
     <img src='${a?.dataUrl || a?.url || ''}' crossOrigin='anonymous' style='width:auto;max-width:160px;height:auto;max-height:110px;object-fit:contain;display:block;' />
      </div>`
                  : `<div style='font-size:12px;color:#1f2937;word-break:break-all;margin:4px 0;'>• ${a?.url || ''}</div>`
              )
              .join('')
          : `<span style='color:#9ca3af;font-size:13px;'>No attachments</span>`;
        const attachments = `
          <div style='margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;'>
            <div style='font-weight:600;margin-bottom:6px;'>Attachments</div>
      <div style='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;'>${attList}</div>
          </div>`;
  return section('TRAINING DETAILS', body + attachments);
      };

      container.innerHTML = `
        ${section('PERSONAL DETAILS', personalHtml)}
        ${records.map((r, i) => recordCard(r, i)).join('')}
        <div style='text-align:right;font-size:10px;color:#666;margin-top:8px;'>Generated: ${new Date().toLocaleString()}</div>
      `;

      document.body.appendChild(container);

      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(container, { scale: 3, useCORS: true, allowTaint: false });
      } catch (e) {
        console.warn('[Training][PDF] html2canvas failed with images, falling back to URLs only', e);
        // Fallback: rebuild container replacing images with URLs to avoid CORS-taint
        const rebuildWithUrlOnly = () => {
          const recsHtml = records
            .map((rec: any, i: number) => {
              const top = `
                <!-- top removed: status moved into grid to remove whitespace -->`;
              const body = `
                <div style='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 32px;'>
                  ${label('Training Name', rec?.training_subject_name || '—')}
                  ${label('Training Type', rec?.training_type || '—')}
                  ${label('Training Date', formatDateTime(rec?.training_date))}
                  ${label('Created On', formatDateTime(rec?.created_at))}
                  ${label('Updated On', formatDateTime(rec?.updated_at))}
                  ${label('Status', statusLabel(rec?.status))}
                </div>`;
              const atts = Array.isArray(rec?.training_attachments) ? rec.training_attachments : [];
              const list = atts.length
                ? atts.map((a: any) => `<div style='font-size:12px;color:#1f2937;word-break:break-all;'>• ${a?.url || ''}</div>`).join('')
                : `<span style='color:#9ca3af;font-size:13px;'>No attachments</span>`;
              const attachments = `
                <div style='margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;'>
                  <div style='font-weight:600;margin-bottom:6px;'>Attachments</div>
                  ${list}
                </div>`;
              return section('TRAINING DETAILS', body + attachments);
            })
            .join('');

          container.innerHTML = `
            ${section('PERSONAL DETAILS', personalHtml)}
            ${recsHtml}
            <div style='text-align:right;font-size:10px;color:#666;margin-top:8px;'>Generated: ${new Date().toLocaleString()}</div>
          `;
        };
        rebuildWithUrlOnly();
        canvas = await html2canvas(container, { scale: 2 });
      }
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
        const sliceHeightPx = Math.floor(pageUsableHeightPt / ratio);
        let renderedPx = 0;
        let pageIndex = 0;
        while (renderedPx < canvas.height) {
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = Math.min(sliceHeightPx, canvas.height - renderedPx);
          const ctx = sliceCanvas.getContext('2d');
          ctx?.drawImage(canvas, 0, renderedPx, canvas.width, sliceCanvas.height, 0, 0, canvas.width, sliceCanvas.height);
          const sliceData = sliceCanvas.toDataURL('image/png');
          if (pageIndex > 0) pdf.addPage();
          const sliceHeightPt = sliceCanvas.height * ratio;
          pdf.addImage(sliceData, 'PNG', marginX, marginY, usableWidth, sliceHeightPt, undefined, 'FAST');
          renderedPx += sliceCanvas.height;
          pageIndex++;
        }
      }

      try { pdf.save(`training_${row.id}.pdf`); }
      catch {
        try {
          const blob = pdf.output('blob');
          const urlObj = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = urlObj; a.download = `training_${row.id}.pdf`; document.body.appendChild(a); a.click();
          setTimeout(() => { URL.revokeObjectURL(urlObj); document.body.removeChild(a); }, 1500);
        } catch {}
      }

      document.body.removeChild(container);
    } catch (e: any) {
      console.error('[Training][PDF] Generation error', e);
      setError(e?.message || 'Failed to generate PDF');
      toast.error('Failed to generate PDF');
    } finally {
      setGeneratingId(null);
    }
  };

  // Filter dialog handlers
  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const handleApplyFilters = (filters: { email: string; trainingName: string }) => {
    setFilterEmail(filters.email);
    setFilterTrainingName(filters.trainingName);
    // Clear inline search when dialog filters are applied
    if (filters.email || filters.trainingName) {
      setSearchTerm('');
      setDebouncedSearch('');
    }
    // Go to first page when filters change
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(trainings.map(item => item.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  // Pagination rendering (same style as MSafeDashboard)
  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;
    if (showEllipsis) {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => setCurrentPage(1)} isActive={currentPage === 1} className="cursor-pointer">
            1
          </PaginationLink>
        </PaginationItem>
      );
      // Show ellipsis or pages 2-3
      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <span className="px-2">...</span>
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i} className="cursor-pointer">
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }
      // Show current page area
      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }
      // Show ellipsis or pages before last
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <span className="px-2">...</span>
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find(item => item.key === i)) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i} className="cursor-pointer">
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }
      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink onClick={() => setCurrentPage(totalPages)} isActive={currentPage === totalPages} className="cursor-pointer">
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i} className="cursor-pointer">
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    return items;
  };

  return (
    <div className="p-6">
      {/* Training Summary Cards */}
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
      {error && (
        <div className="mb-4 p-3 border border-red-300 text-red-600 rounded bg-red-50 text-sm">{error}</div>
      )}
      <EnhancedTable
        data={trainings}
        columns={columns}
        renderCell={renderCell}
        // selectable={true}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        getItemId={(item: TrainingRow) => item.id.toString()}
        storageKey="training-dashboard-table"
        emptyMessage={loading ? 'Loading trainings...' : 'No training records found'}
        searchPlaceholder="Search by user email..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        enableSearch={true}
        enableExport={false}
        showBulkActions={false}
        pagination={false}
        loading={loading}
        onFilterClick={handleFilterClick}
      />
      {/* Pagination (same as MSafeDashboard) */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      {totalPages === 1 && !loading && (
        <div className="text-xs text-gray-500 mt-4">Showing {trainings.length} record(s)</div>
      )}

      {/* Image Preview Modal */}
      <Dialog open={!!previewImage} onOpenChange={(open) => { if (!open) { setPreviewImage(null); setPreviewAttachmentId(null); } }}>
        <DialogContent className="max-w-[90vw] md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Attachment Preview</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="flex flex-col items-center gap-4">
              <img src={previewImage} alt="Preview" className="max-h-[70vh] w-auto object-contain rounded border" />
              <div className="flex gap-2">
                {/* <Button variant="secondary" onClick={() => window.open(previewImage!, '_blank')}>Open in New Tab</Button> */}
                <Button
                  className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
                  disabled={downloadingAttachment}
                  onClick={async () => {
                    try {
                      setDownloadingAttachment(true);
                      const token = localStorage.getItem('token');
                      const baseUrl = localStorage.getItem('baseUrl');
                      if (previewAttachmentId && token && baseUrl) {
                        const apiUrl = `https://${baseUrl}/attachfiles/${previewAttachmentId}?show_file=true`;
                        const response = await fetch(apiUrl, {
                          method: 'GET',
                          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                        });
                        if (!response.ok) throw new Error('Failed to fetch the file');
                        // Try to extract filename from Content-Disposition
                        const disposition = response.headers.get('Content-Disposition') || response.headers.get('content-disposition') || '';
                        let fileName = `Training_Attachment_${previewAttachmentId}`;
                        const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
                        if (match) fileName = decodeURIComponent(match[1] || match[2] || fileName);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = fileName;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } else {
                        // Fallback: try direct URL download
                        const a = document.createElement('a');
                        a.href = previewImage!;
                        a.download = 'Training_Attachment';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }
                    } catch (e) {
                      console.error('Error downloading attachment:', e);
                      window.open(previewImage!, '_blank');
                    } finally {
                      setDownloadingAttachment(false);
                    }
                  }}
                >
                  {downloadingAttachment ? (
                    <svg className="animate-spin h-4 w-4 mr-2 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  ) : (
                    <Download className="w-4 h-4 mr-1" />
                  )}
                  {downloadingAttachment ? 'Downloading...' : 'Download'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <TrainingFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        initialEmail={filterEmail}
        initialTrainingName={filterTrainingName}
      />
    </div>
  );
};

export default TrainingDashboard;
