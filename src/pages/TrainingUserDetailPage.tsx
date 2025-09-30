import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Download, FileText } from 'lucide-react';

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
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>

      {error && <div className="mb-4 p-3 border border-red-300 text-red-600 rounded bg-red-50 text-sm">{error}</div>}

      {/* Personal Details */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Personal Details</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div><span className="text-gray-500 text-sm">Name</span><p className="text-gray-900 font-medium">{createdBy?.name || '—'}</p></div>
          <div><span className="text-gray-500 text-sm">Email Id</span><p className="text-gray-900 font-medium">{createdBy?.email || '—'}</p></div>
          <div><span className="text-gray-500 text-sm">Mobile Number</span><p className="text-gray-900 font-medium">{createdBy?.mobile || '—'}</p></div>
          <div><span className="text-gray-500 text-sm">User Type</span><p className="text-gray-900 font-medium">{createdBy?.employee_type || '—'}</p></div>
          <div>
            <span className="text-gray-500 text-sm">Status</span>
            <p className="text-gray-900 font-medium">{getStatusMeta(primary?.status).label}</p>
          </div>
          <div><span className="text-gray-500 text-sm">Training Date</span><p className="text-gray-900 font-medium">{formatDateTime(primary?.training_date)}</p></div>
        </div>
      </div>

      {/* Training Records (show all) */}
      {records.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-sm text-gray-500">No trainings found.</div>
      )}
      {records.map((rec, idx) => {
        return (
          <div key={rec.id || idx} className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#f6f4ee]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Training Details {records.length > 1 ? `(${idx + 1})` : ''}</h2>
              </div>
              {(() => {
                const meta = getStatusMeta(rec.status);
                return (
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${meta.className}`}>
                    {meta.label}
                  </span>
                );
              })()}
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div><span className="text-gray-500 text-sm">Training Name</span><p className="text-gray-900 font-medium">{rec.training_subject_name || '—'}</p></div>
              <div><span className="text-gray-500 text-sm">Training Type</span><p className="text-gray-900 font-medium">{rec.training_type || '—'}</p></div>
              <div><span className="text-gray-500 text-sm">Training Date</span><p className="text-gray-900 font-medium">{formatDateTime(rec.training_date)}</p></div>
              <div><span className="text-gray-500 text-sm">Resource</span><p className="text-gray-900 font-medium">{rec.resource_type || '—'} {rec.resource_id ? `#${rec.resource_id}` : ''}</p></div>
              <div><span className="text-gray-500 text-sm">Created On</span><p className="text-gray-900 font-medium">{formatDateTime(rec.created_at)}</p></div>
              <div><span className="text-gray-500 text-sm">Updated On</span><p className="text-gray-900 font-medium">{formatDateTime(rec.updated_at)}</p></div>
            </div>
            <div className="p-6 pt-0">
              <div className="text-sm font-semibold text-gray-700 mb-2">Attachments</div>
              {!rec.training_attachments || rec.training_attachments.length === 0 ? (
                <div className="text-gray-400 text-sm">No attachments</div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {rec.training_attachments!.map((att) => {
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
        );
      })}

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
