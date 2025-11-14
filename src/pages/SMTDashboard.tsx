import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { Eye, Users, UserCheck, ClipboardList, Building2, Download } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const SMTDashboard = () => {
  // simple debounce hook (local)
  function useDebounce<T>(value: T, delay: number) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const id = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
  }

  // Server-driven data and pagination
  type SMTRecord = {
    id: number;
    area_of_visit?: string | null;
    facility_name?: string | null;
    other_facility_name?: string | null;
    created_at?: string | null;
    circle_name?: string | null;
    smt_user?: { id: number; name?: string | null; department?: string | null; email?: string | null } | null;
    people_interacted_with?: (string | null)[];
  };

  type PaginationData = { current_page: number; total_count: number; total_pages: number };

  const [serverData, setServerData] = useState<SMTRecord[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationData>({ current_page: 1, total_count: 0, total_pages: 1 });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const cardData = useMemo(() => {
    const uniqueCircles = new Set(serverData.map((d) => d.circle_name || '-')).size;
    const peopleInteracted = serverData.reduce((acc, r) => acc + (r.people_interacted_with?.filter((n) => (n || '').toString().trim().length > 0).length || 0), 0);
    return [
      { title: 'Total SMTs', count: paginationData.total_count, icon: Users },
      { title: 'Unique Circles', count: uniqueCircles, icon: Building2 },
      { title: 'Distinct Functions', count: 0, icon: ClipboardList },
      { title: 'People Interacted', count: peopleInteracted, icon: UserCheck },
    ];
  }, [serverData, paginationData.total_count]);

  const columns = [
    { key: 'actions', label: 'Action', sortable: false, defaultVisible: true },
    { key: 'smt_done_by_name', label: 'SMT Done By Name', sortable: true, defaultVisible: true },
    { key: 'smt_done_by_email', label: 'SMT Done By Email', sortable: true, defaultVisible: true },
    { key: 'smt_done_by_function', label: 'SMT Done By Function', sortable: true, defaultVisible: true },
    { key: 'smt_done_by_circle', label: 'SMT Done By Circle', sortable: true, defaultVisible: true },
    { key: 'area_of_visit', label: 'Area Of Visit', sortable: true, defaultVisible: true },
    { key: 'type_of_facility', label: 'Type Of Facility', sortable: true, defaultVisible: true },
    { key: 'smt_done_date', label: 'SMT Done Date', sortable: true, defaultVisible: true },
  ];



  const pageSize = 5; // per_page on server

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  // Fetch data from API
  const fetchSMTs = useCallback(async (page: number, searchValue?: string) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
      const trimmed = (searchValue || '').trim();
      const cleanBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
      let url = `${cleanBaseUrl}/smts.json?page=${page}&per_page=${pageSize}`;
      if (trimmed) {
        url += `&q[user_email_cont]=${encodeURIComponent(trimmed)}`;
      }
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const resp = await axios.get(url, { headers });
      const payload = resp.data || {};
      const rows: SMTRecord[] = Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : [];
      const pagination: PaginationData = payload.pagination || { current_page: page, total_count: rows.length, total_pages: Math.max(1, Math.ceil((payload.total_count || rows.length) / pageSize)) };
      setServerData(rows);
      setPaginationData(pagination);
    } catch (e: any) {
      console.error('Failed to fetch SMTs:', e);
      setError(e?.message || 'Failed to fetch SMTs');
      toast.error('Failed to fetch SMTs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Always fetch from page 1 when search changes
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchSMTs(currentPage, debouncedSearch);
  }, [fetchSMTs, currentPage, debouncedSearch]);

  // Map server data to table rows expected by EnhancedTable
  const tableData = useMemo(() => {
    return serverData.map((r) => ({
      id: r.id,
      smt_done_by_name: r.smt_user?.name || '-',
      smt_done_by_email: r.smt_user?.email || '-',
      smt_done_by_function: r.smt_user?.department || '-',
      smt_done_by_circle: r.circle_name || '-',
      area_of_visit: r.area_of_visit || '-',
      type_of_facility: r.facility_name || r.other_facility_name || '-',
      smt_done_date: r.created_at || '-',
      _raw: r,
    }));
  }, [serverData]);

  const formatDate = (val: string | null | undefined) => {
    if (!val) return '-';
    const d = new Date(val);
    if (isNaN(d.getTime())) return '-';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => navigate(`/safety/m-safe/smt/${item.id}`, { state: { row: item } })}
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
      case 'smt_done_date':
        return formatDate(item.smt_done_date);
      default:
        return item[columnKey] || '';
    }
  };

  // Generate PDF for a specific SMT entry mirroring SMTDetailPage UI
  const downloadPdf = async (row: any) => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    if (!baseUrl || !token) {
      setError('Missing base URL or token');
      toast.error('Missing base URL or token');
      return;
    }
    setGeneratingId(row.id);
    try {
      // Fetch full detail
      const cleanBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
      const url = `${cleanBaseUrl}/smts/${row.id}.json`;
      const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      const payload = resp.data || {};
      const detail: any = Array.isArray(payload?.data) ? payload.data[0] : payload?.data || payload || {};

      // Helpers copied from detail page behavior
      const parsePeople = (val: any): string[] => {
        if (!val) return [];
        if (Array.isArray(val)) return val.map((p) => (p || '').toString().trim()).filter((p) => p.length > 0);
        if (typeof val === 'string') {
          const s = val.trim();
          if (s.startsWith('[') && s.endsWith(']')) {
            try { const parsed = JSON.parse(s); if (Array.isArray(parsed)) return parsed.map((p: any) => (p || '').toString().trim()).filter((p: string) => p.length > 0); } catch {}
          }
          return s.split(/[;\n,]/g).map((x) => x.trim()).filter((x) => x.length > 0);
        }
        return [];
      };
      const formDetails = (detail?.form_details || {}) as Record<string, any>;
      const yn = (v: any) => String(v ?? '').toLowerCase() === 'yes' || v === true || v === 'true';
      const topics = {
        road_safety: yn(formDetails['road_safety']),
        electrical_safety: yn(formDetails['electrical_safety']),
        work_height_safety: yn(formDetails['work_height'] || formDetails['work_height_safety']),
        ofc: yn(formDetails['ofc']),
        health_wellbeing: yn(formDetails['health_well'] || formDetails['health_wellbeing']),
        tool_box_talk: yn(formDetails['tool_box'] || formDetails['tool_box_talk']),
        thank_you_card: yn(formDetails['thank_you_card']),
      };
      const peopleList = parsePeople(detail?.people_interacted_with);
      const thankYouCardUrl = (detail?.card_attachments || []).map((a: any) => a?.url).filter(Boolean)[0] || '';
      const otherImages: string[] = (detail?.other_attachments || []).map((a: any) => a?.url).filter(Boolean);

      const formatDateStr = (val?: string | null) => {
        if (!val) return '—';
        const d = new Date(val);
        if (isNaN(d.getTime())) return '—';
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      };

  // Offscreen containers for snapshot (split to force page break)
  const containerMain = document.createElement('div');
  containerMain.style.padding = '20px';
  containerMain.style.fontFamily = 'Arial, sans-serif';
  containerMain.style.width = '1000px';
  containerMain.style.background = '#f3f4f6';
  containerMain.style.position = 'absolute';
  containerMain.style.left = '-10000px';

  const containerTail = document.createElement('div');
  containerTail.style.padding = '20px';
  containerTail.style.fontFamily = 'Arial, sans-serif';
  containerTail.style.width = '1000px';
  containerTail.style.background = '#f3f4f6';
  containerTail.style.position = 'absolute';
  containerTail.style.left = '-10000px';

      const sectionCard = (title: string, bodyHtml: string) => `
        <div style='background:#fff;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:24px;'>
          <div style='display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #e5e7eb;background:#f6f4ee;'>
            <div style='width:32px;height:32px;flex:0 0 auto;display:inline-block;'>
              <svg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' aria-hidden='true' focusable='false' style='display:block'>
                <circle cx='16' cy='16' r='16' fill='#C72030' />
                <text x='16' y='16' dy='.35em' fill='#ffffff' font-family='Arial, sans-serif' font-size='16' font-weight='700' text-anchor='middle'>${title.charAt(0).toUpperCase()}</text>
              </svg>
            </div>
            <h2 style='margin:0;font-size:16px;font-weight:700;color:#111;'>${title}</h2>
          </div>
          <div style='padding:24px;'>${bodyHtml}</div>
        </div>`;

      const labelVal = (label: string, value: string) => `
        <div style='display:flex;flex-direction:column;gap:4px;'>
          <span style='color:#6b7280;font-size:12px;'>${label}</span>
          <span style='color:#111;font-size:13px;font-weight:600;'>${value || '—'}</span>
        </div>`;

      const grid2 = (items: string[]) => `
        <div style='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 48px;'>${items.join('')}</div>`;

      const smtDetailsHtml = grid2([
        labelVal('Name', detail?.smt_user?.name || '—'),
        labelVal('Email Id', detail?.smt_user?.email || '—'),
        labelVal('Function', detail?.smt_user?.department || '—'),
        labelVal('Circle', detail?.circle_name || '—'),
        labelVal('Zone/Work Location', detail?.work_location || '—'),
      ]);

      const facilityHtml = grid2([
        labelVal('Type of Facility', detail?.facility_name || detail?.other_facility_name || '—'),
        labelVal('Area of Visit', detail?.area_of_visit || '—'),
      ]);

      const dateHtml = `<div style='font-weight:600;'>${formatDateStr(detail?.smt_done_date || detail?.created_at)}</div>`;

      const peopleHtml = peopleList.length
        ? `<ol style='margin:8px 0 0 16px;'>${peopleList.map((p) => `<li style='margin-bottom:6px;font-size:13px;'>${p}</li>`).join('')}</ol>`
        : `<span style='color:#9ca3af;font-size:13px;'>N/A</span>`;

      const topicsHtml = `
        <ul style='margin:0;padding-left:16px;'>
          <li>Road Safety: ${topics.road_safety ? 'Yes' : 'No'}</li>
          <li>Electrical Safety: ${topics.electrical_safety ? 'Yes' : 'No'}</li>
          <li>Work/Height Safety: ${topics.work_height_safety ? 'Yes' : 'No'}</li>
          <li>OFC: ${topics.ofc ? 'Yes' : 'No'}</li>
          <li>Health and wellbeing initiatives by in: ${topics.health_wellbeing ? 'Yes' : 'No'}</li>
          <li>Tool Box Talk: ${topics.tool_box_talk ? 'Yes' : 'No'}</li>
          <li>Thank you card given: ${topics.thank_you_card ? 'Yes' : 'No'}</li>
        </ul>`;

      const attachmentsHtml = `
        <div style='display:flex;flex-direction:column;gap:8px;'>
          <div>
            <div style='font-weight:600;margin-bottom:4px;'>Attach Card Image</div>
            ${thankYouCardUrl ? `<div style='font-size:12px;word-break:break-all;color:#1f2937;'>${thankYouCardUrl}</div>` : `<span style='color:#9ca3af;font-size:13px;'>No file</span>`}
          </div>
          <div>
            <div style='font-weight:600;margin-bottom:4px;'>Attach Other Images</div>
            ${otherImages.length ? otherImages.map((u) => `<div style='font-size:12px;word-break:break-all;color:#1f2937;'>${u}</div>`).join('') : `<span style='color:#9ca3af;font-size:13px;'>No images</span>`}
          </div>
        </div>`;

      // Key Observations
      const keyObsHtml = `
        <div style='font-size:13px;color:#111;'>${(detail?.key_observations && String(detail.key_observations)) || '<span style="color:#9ca3af;">N/A</span>'}</div>`;

      // Person Responsible for Location
      const responsibleHtml = `
        <div style='font-size:13px;color:#111;'>${(detail?.responsible_person?.name && String(detail.responsible_person.name)) || '<span style="color:#9ca3af;">N/A</span>'}</div>`;

      // Build HTML parts
      containerMain.innerHTML = `
        ${sectionCard('SMT DETAILS', smtDetailsHtml)}
        ${sectionCard('TYPE OF FACILITY & AREA OF VISIT', facilityHtml)}
        ${sectionCard('SMT DATE', dateHtml)}
        ${sectionCard('PEOPLE INTERACTED WITH', peopleHtml)}
        ${sectionCard('TOPICS DISCUSSED', topicsHtml)}
        ${sectionCard('ATTACHMENTS', attachmentsHtml)}
      `;

      containerTail.innerHTML = `
        ${sectionCard('KEY OBSERVATIONS/EXPERIENCE WITH TALKING TO PEOPLE', keyObsHtml)}
        ${sectionCard('PERSON RESPONSIBLE FOR LOCATION', responsibleHtml)}
        <div style='text-align:right;font-size:10px;color:#666;margin-top:8px;'>Generated: ${new Date().toLocaleString()}</div>
      `;

      // Append both containers for rendering
      document.body.appendChild(containerMain);
      document.body.appendChild(containerTail);

      // Render canvases
      const canvasMain = await html2canvas(containerMain, { scale: 2 });
      const canvasTail = await html2canvas(containerTail, { scale: 2 });
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const marginX = 20;
      const marginY = 20;
      const usableWidth = pageWidth - marginX * 2;
  const ratioMain = usableWidth / canvasMain.width;
  const fullHeightPtMain = canvasMain.height * ratioMain;

      const saveWithFallback = (pdfInst: any, filename: string) => {
        try { pdfInst.save(filename); }
        catch {
          try {
            const blob = pdfInst.output('blob');
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = filename; document.body.appendChild(a); a.click();
            setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 1500);
          } catch {}
        }
      };

      // Render main part (can be multipage)
      let pagesRendered = 0;
      if (fullHeightPtMain <= pageHeight - marginY * 2) {
        const imgDataMain = canvasMain.toDataURL('image/png');
        pdf.addImage(imgDataMain, 'PNG', marginX, marginY, usableWidth, fullHeightPtMain, undefined, 'FAST');
        pagesRendered++;
      } else {
        const pageUsableHeightPt = pageHeight - marginY * 2;
        const sliceHeightPx = Math.floor(pageUsableHeightPt / ratioMain);
        let renderedPx = 0;
        let pageIndex = 0;
        while (renderedPx < canvasMain.height) {
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvasMain.width;
          sliceCanvas.height = Math.min(sliceHeightPx, canvasMain.height - renderedPx);
          const ctx = sliceCanvas.getContext('2d');
          ctx?.drawImage(canvasMain, 0, renderedPx, canvasMain.width, sliceCanvas.height, 0, 0, canvasMain.width, sliceCanvas.height);
          const sliceData = sliceCanvas.toDataURL('image/png');
          if (pageIndex > 0) pdf.addPage();
          const sliceHeightPt = sliceCanvas.height * ratioMain;
          pdf.addImage(sliceData, 'PNG', marginX, marginY, usableWidth, sliceHeightPt, undefined, 'FAST');
          renderedPx += sliceCanvas.height;
          pageIndex++;
          pagesRendered++;
        }
      }

      // Determine if an extra blank page was left after rendering main
      const getCurrentPageNumber = () => {
        const infoGetter = (pdf as any)?.internal?.getCurrentPageInfo;
        try {
          if (typeof infoGetter === 'function') {
            return infoGetter.call((pdf as any)).pageNumber as number;
          }
        } catch {}
        return pdf.getNumberOfPages();
      };
      const currentPageAfterMain = getCurrentPageNumber();
      const hasBlankSpacerPage = currentPageAfterMain > pagesRendered;

      // Render tail part (can be multipage)
      const ratioTail = usableWidth / canvasTail.width;
      const fullHeightPtTail = canvasTail.height * ratioTail;
      if (fullHeightPtTail <= pageHeight - marginY * 2) {
        // Start tail on a new page unless a blank spacer page already exists
        if (!hasBlankSpacerPage) pdf.addPage();
        const imgDataTail = canvasTail.toDataURL('image/png');
        pdf.addImage(imgDataTail, 'PNG', marginX, marginY, usableWidth, fullHeightPtTail, undefined, 'FAST');
      } else {
        const pageUsableHeightPt = pageHeight - marginY * 2;
        const sliceHeightPx = Math.floor(pageUsableHeightPt / ratioTail);
        let renderedPx = 0;
        let pageIndex = 0;
        // First tail slice starts on the next page, unless we already have a blank one
        if (!hasBlankSpacerPage) pdf.addPage();
        while (renderedPx < canvasTail.height) {
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvasTail.width;
          sliceCanvas.height = Math.min(sliceHeightPx, canvasTail.height - renderedPx);
          const ctx = sliceCanvas.getContext('2d');
          ctx?.drawImage(canvasTail, 0, renderedPx, canvasTail.width, sliceCanvas.height, 0, 0, canvasTail.width, sliceCanvas.height);
          const sliceData = sliceCanvas.toDataURL('image/png');
          if (pageIndex > 0) pdf.addPage();
          const sliceHeightPt = sliceCanvas.height * ratioTail;
          pdf.addImage(sliceData, 'PNG', marginX, marginY, usableWidth, sliceHeightPt, undefined, 'FAST');
          renderedPx += sliceCanvas.height;
          pageIndex++;
        }
      }

      saveWithFallback(pdf, `smt_${row.id}.pdf`);
      document.body.removeChild(containerMain);
      document.body.removeChild(containerTail);
    } catch (e: any) {
      console.error('[SMT][PDF] Generation error', e);
      setError(e?.message || 'Failed to generate PDF');
      toast.error('Failed to generate PDF');
    } finally {
      setGeneratingId(null);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(tableData.map(item => item.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  // Pagination rendering (same style as MSafeDashboard)
  const totalPages = paginationData.total_pages || 1;
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
      {/* SMT Summary Cards */}
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
      <EnhancedTable
        data={tableData}
        columns={columns}
        renderCell={renderCell}
        // selectable={true}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        getItemId={item => item.id.toString()}
        storageKey="smt-dashboard-table"
  emptyMessage="No SMT records found"
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  searchPlaceholder="Search by email..."
        enableExport={false}
        showBulkActions={false}
        pagination={false}
        loading={loading}
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
    </div>
  );
}

export default SMTDashboard;
