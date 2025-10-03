import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Download, FileText, User2, ClipboardList } from 'lucide-react';

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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewAttachmentId, setPreviewAttachmentId] = useState<number | null>(null);
  const [downloadingAttachment, setDownloadingAttachment] = useState(false);

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
          <div className="px-4 pb-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">Attachments</div>
            {!rec.training_attachments || rec.training_attachments.length === 0 ? (
              <div className="text-gray-400 text-sm">No attachments</div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {rec.training_attachments.map((att) => {
                  const url = att.url;
                  const doctype = att.doctype || '';
                  const isImage = /(jpg|jpeg|png|webp|gif|svg)$/i.test(url) || doctype.startsWith('image/');
                  return (
                    <div key={att.id}>
                      {isImage ? (
                        <div
                          className="w-20 h-20 bg-[#F6F4EE] border rounded flex items-center justify-center overflow-hidden cursor-pointer"
                          onClick={() => { setPreviewImage(url); setPreviewAttachmentId(att.id); }}
                          title="View image"
                        >
                          <img src={url} alt="Attachment" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#C72030] hover:underline">
                          <FileText className="w-4 h-4" /> Open attachment
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ))}

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
                        const response = await fetch(apiUrl, { method: 'GET', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
                        if (!response.ok) throw new Error('Failed to fetch the file');
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
                  {downloadingAttachment ? 'Downloading...' : (<><Download className="w-4 h-4 mr-1" /> Download</>)}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainingUserDetailPage;
