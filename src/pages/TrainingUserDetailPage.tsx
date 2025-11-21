import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Download, FileText, User2, ClipboardList, Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

type TrainingAttachment = { id: number; url: string; doctype: string | null };
type CreatedBy = { id?: number; name?: string; email?: string; mobile?: string | null; employee_type?: string | null };
type TrainingApiRecord = {
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
  created_by?: CreatedBy | null;
  training_attachments?: TrainingAttachment[];
};

type ApiResponse = { code?: number; data?: TrainingApiRecord[] };

const pad = (n: number) => String(n).padStart(2, '0');
const formatDateTime = (iso?: string | null) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`; // date only per request
  } catch { return '—'; }
};

// Map API status to label and color per requirements
const getStatusMeta = (status?: string | null) => {
  const s = (status || '').trim().toLowerCase();
  if (!s) return { label: 'Not Yet', className: 'bg-gray-100 text-gray-700' };
  if (s === 'completed') return { label: 'Pass', className: 'bg-green-100 text-green-700' };
  if (s === 'pending') return { label: 'Fail', className: 'bg-red-100 text-red-700' };
  // Default fallback
  return { label: 'Not Yet', className: 'bg-gray-100 text-gray-700' };
};

const TrainingUserDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<TrainingApiRecord[]>([]);
  
  // Preview modal state (like KRCC)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItems, setPreviewItems] = useState<TrainingAttachment[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewTitle, setPreviewTitle] = useState('');

  const openPreview = useCallback((items: TrainingAttachment[], index: number, title: string) => {
    setPreviewItems(items);
    setPreviewIndex(index);
    setPreviewTitle(title);
    setPreviewOpen(true);
  }, []);
  
  const closePreview = useCallback(() => setPreviewOpen(false), []);
  const gotoPrev = useCallback(() => setPreviewIndex(i => (i - 1 + previewItems.length) % previewItems.length), [previewItems.length]);
  const gotoNext = useCallback(() => setPreviewIndex(i => (i + 1) % previewItems.length), [previewItems.length]);

  // Keyboard navigation for preview
  useEffect(() => {
    if (!previewOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePreview();
      if (e.key === 'ArrowLeft') gotoPrev();
      if (e.key === 'ArrowRight') gotoNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [previewOpen, closePreview, gotoPrev, gotoNext]);

  const primary = records[0];
  const createdBy = primary?.created_by;

  const fetchDetail = useCallback(async () => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    if (!baseUrl || !token || !id) { setError('Missing baseUrl/token/id'); return; }
    setLoading(true);
    setError(null);
    try {
      const cleanBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
      const url = `${cleanBaseUrl}/trainings/${id}/user_trainings.json`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ApiResponse = await res.json();
      setRecords(json.data || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load training details');
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-gray-800 mb-4 text-base text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Trainings
          </button>
        </div>
        {/* (Optional future actions) */}
      </div>

      {error && <div className="mb-4 p-3 border border-red-300 text-red-600 rounded bg-red-50 text-sm">{error}</div>}

      {/* PERSONAL DETAILS */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
            <User2 className="w-6 h-6 text-[#C72030]" />
          </div>
          <h2 className="text-lg font-bold tracking-wide">PERSONAL DETAILS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {[{
            label:'Name', value: createdBy?.name
          },{label:'Email Id', value: createdBy?.email},{label:'Mobile Number', value: createdBy?.mobile},{label:'User Type', value: createdBy?.employee_type},{label:'Status', value: (()=>{ const meta = getStatusMeta(primary?.status); return (
              <span className={`px-2 py-1 rounded font-bold leading-snug text-xs ${meta.className}`}>{meta.label}</span>
            );})()},{label:'Training Date', value: formatDateTime(primary?.training_date)}]
            .map((f,i)=>(
              <div key={i} className="space-y-1">
                <span className="text-gray-500 text-sm">{f.label}</span>
                <p className="text-gray-900 font-medium text-sm">{f.value || '—'}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Training Records (show all) */}
      {records.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-sm text-gray-500">No trainings found.</div>
      )}
      {records.map((rec, idx) => (
        <div key={rec.id || idx} className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                <ClipboardList className="w-6 h-6 text-[#C72030]" />
              </div>
              <h2 className="text-lg font-bold tracking-wide">TRAINING DETAILS {records.length > 1 ? `(${idx + 1})` : ''}</h2>
            </div>
            {(() => { const meta = getStatusMeta(rec.status); return (
              <span className={`px-2 py-1 rounded font-bold text-xs md:text-sm ${meta.className}`}>{meta.label}</span>
            ); })()}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {[
              { label: 'Training Name', value: rec.training_subject_name },
              { label: 'Training Type', value: rec.training_type },
              { label: 'Training Date', value: formatDateTime(rec.training_date) },
              { label: 'Created On', value: formatDateTime(rec.created_at) },
              { label: 'Updated On', value: formatDateTime(rec.updated_at) },
              { label: 'Total Score', value: rec.total_score ?? '—' },
              { label: 'Actual Score', value: rec.actual_score ?? '—' },
            ].map((f,i)=>(
              <div key={i} className="space-y-1">
                <span className="text-gray-500 text-sm">{f.label}</span>
                <p className="text-gray-900 font-medium text-sm">{f.value || '—'}</p>
              </div>
            ))}
          </div>
          {/* ---__________________ */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 bg-gradient-to-tr from-[#C72030] to-[#e54654] text-white rounded-md flex items-center justify-center shadow-sm">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <label className="text-sm font-semibold tracking-wide text-gray-800">Attachments</label>
              {rec.training_attachments && rec.training_attachments.length > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] rounded bg-gray-200 text-gray-700 font-medium">
                  {rec.training_attachments.length}
                </span>
              )}
            </div>
            {!rec.training_attachments || rec.training_attachments.length === 0 ? (
              <div className="text-gray-400 text-sm">No attachments</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                {rec.training_attachments.map((att, idx) => {
                  const url = att.url;
                  const doctype = att.doctype || '';
                  const isImage = /(jpg|jpeg|png|webp|gif|svg)$/i.test(url) || doctype.startsWith('image/');
                  const display = `Attachment-${att.id}`;
                  
                  if (!isImage) {
                    return (
                      <a 
                        key={att.id} 
                        href={url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-2 text-[#C72030] hover:underline text-sm p-2 border rounded"
                      >
                        <FileText className="w-4 h-4" /> Open
                      </a>
                    );
                  }
                  
                  return (
                    <button
                      key={att.id}
                      type="button"
                      onClick={() => openPreview(rec.training_attachments || [], idx, `Training Attachments (${idx + 1})`)}
                      className="relative group/image rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#C72030]/40"
                    >
                      <div className="aspect-square w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                        <img
                          src={url}
                          alt={display}
                          loading="lazy"
                          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover/image:scale-105"
                        />
                        <div className="absolute inset-0 opacity-0 group-hover/image:opacity-100 bg-black/40 flex items-center justify-center transition-opacity">
                          <Maximize2 className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="p-1.5 text-[11px] font-medium truncate text-gray-700 text-left w-full bg-white/80 backdrop-blur-sm border-t border-gray-100">
                        {display}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {/* ---_________________ */}
        </div>
      ))}

      {/* Image Preview Modal (KRCC-style lightbox) */}
      {previewOpen && previewItems.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-3 text-white">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                <span className="font-medium text-sm tracking-wide">{previewTitle}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 border border-white/20">
                  {previewIndex + 1}/{previewItems.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={gotoPrev} 
                  className="h-8 w-8 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button 
                  onClick={gotoNext} 
                  className="h-8 w-8 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button 
                  onClick={closePreview} 
                  className="h-8 w-8 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-2xl bg-black/40 border border-white/10">
              <img
                src={previewItems[previewIndex].url}
                alt={`Training Attachment ${previewItems[previewIndex].id}`}
                className="mx-auto max-h-[70vh] object-contain w-full select-none"
                draggable={false}
              />
            </div>
            <div className="mt-3 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-32 overflow-y-auto pr-1">
              {previewItems.map((item, i) => {
                const active = i === previewIndex;
                const thumbName = `Attachment-${item.id}`;
                return (
                  <button
                    key={item.id}
                    onClick={() => setPreviewIndex(i)}
                    className={`relative group/thumb rounded border ${
                      active 
                        ? 'border-[#C72030] ring-2 ring-[#C72030]/50' 
                        : 'border-white/20 hover:border-white/50'
                    } overflow-hidden h-14 bg-white/5`}
                    title={thumbName}
                  >
                    <img 
                      src={item.url} 
                      alt={thumbName} 
                      className="h-full w-full object-cover" 
                      loading="lazy" 
                    />
                    {active && (
                      <span className="absolute inset-0 border-2 border-[#C72030] pointer-events-none"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingUserDetailPage;
