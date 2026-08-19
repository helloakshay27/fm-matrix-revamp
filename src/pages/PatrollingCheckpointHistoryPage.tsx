import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Shield, Loader2, CheckCircle2, Paperclip, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { toast } from 'sonner';

interface VisitAttachment {
  id: number;
  file_name: string;
  file_url: string;
  content_type: string;
}

interface VisitAnswer {
  id: number;
  question_text: string | null;
  answer: string | null;
  option_text: string | null;
  comments: string | null;
}

interface CheckpointHistorySession {
  id: number;
  route_name: string;
  assigned_guard: string;
  status: string;
  scheduled_start: string;
}

interface CheckpointHistoryVisit {
  id: number;
  visited_at: string;
  patrolling_date: string;
  patrolling_time: string;
  notes: string;
  qr_code_scanned: string;
  was_in_sequence: boolean;
  scanned_by_id: number;
  scanned_by_name: string;
  approved_on: string | null;
  approved_by_name: string | null;
  attachments: VisitAttachment[];
  shift: string;
  shift_date: string;
  session: CheckpointHistorySession;
  // Not present in the history payload today — rendered as "-" when absent
  answers?: VisitAnswer[];
}

interface CheckpointHistoryShift {
  shift: string;
  visits: CheckpointHistoryVisit[];
}

interface CheckpointHistoryDateGroup {
  date: string;
  shifts: CheckpointHistoryShift[];
}

interface CheckpointHistoryData {
  checkpoint: {
    id: number;
    name: string;
    location_path: string;
    grace_time_hours: number | null;
  };
  total_visits: number;
  history: CheckpointHistoryDateGroup[];
}

// One flat row per visit, holding only the fields the table displays
interface CheckpointHistoryRow {
  id: number;
  patrolling_date: string;
  patrolling_time: string;
  grace_time_hours: number | null;
  approved: boolean;
  answer: string;
  comments: string;
  submitted_by: string;
  attachments: VisitAttachment[];
}

const flattenHistory = (
  history: CheckpointHistoryDateGroup[],
  checkpointGraceTimeHours: number | null
): CheckpointHistoryRow[] =>
  history.flatMap((dateGroup) =>
    dateGroup.shifts.flatMap((shiftGroup) =>
      shiftGroup.visits.map((visit) => {
        const answers = visit.answers || [];
        const answerText = answers.length
          ? answers.map((a) => a.answer || a.option_text || '-').join(', ')
          : '-';
        const commentsText = answers.length
          ? answers.map((a) => a.comments).filter(Boolean).join(', ') || '-'
          : visit.notes || '-';

        return {
          id: visit.id,
          patrolling_date: visit.patrolling_date,
          patrolling_time: visit.patrolling_time,
          grace_time_hours: checkpointGraceTimeHours,
          approved: !!visit.approved_on,
          answer: answerText,
          comments: commentsText,
          submitted_by: visit.scanned_by_name || '-',
          attachments: visit.attachments || [],
        };
      })
    )
  );

const columns: ColumnConfig[] = [
  { key: 'id', label: 'ID', sortable: true, draggable: true, defaultVisible: true, hideable: true },
  { key: 'patrolling_date', label: 'Patrolling Date', sortable: true, draggable: true, defaultVisible: true, hideable: true },
  { key: 'patrolling_time', label: 'Patrolling Time', sortable: true, draggable: true, defaultVisible: true, hideable: true },
  { key: 'grace_time_hours', label: 'Grace Time(Hours)', sortable: true, draggable: true, defaultVisible: true, hideable: true },
  { key: 'approved', label: 'Approve', sortable: true, draggable: true, defaultVisible: true, hideable: true },
  { key: 'answer', label: 'Answer', sortable: false, draggable: true, defaultVisible: true, hideable: true },
  { key: 'comments', label: 'Comments', sortable: false, draggable: true, defaultVisible: true, hideable: true },
  { key: 'submitted_by', label: 'Submitted By', sortable: true, draggable: true, defaultVisible: true, hideable: true },
  { key: 'attachments', label: 'Attachments', sortable: false, draggable: true, defaultVisible: true, hideable: true },
];

const formatTo12Hour = (time24: string): string => {
  if (!time24) return '-';
  const [hoursStr, minutesStr] = time24.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  if (isNaN(hours) || isNaN(minutes)) return time24;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
};

const decodeFileUrl = (fileUrl: string): string => {
  try {
    const decoded = decodeURIComponent(fileUrl);
    return decoded.startsWith('//') ? `https:${decoded.split('?')[0]}` : decoded.split('?')[0];
  } catch {
    return fileUrl;
  }
};

export const PatrollingCheckpointHistoryPage: React.FC = () => {
  const { checkpointId } = useParams<{ checkpointId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<CheckpointHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Attachment preview state
  const [previewImages, setPreviewImages] = useState<VisitAttachment[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const openPreview = (attachments: VisitAttachment[], index: number) => {
    setPreviewImages(attachments);
    setPreviewIndex(index);
    setShowPreview(true);
  };

  useEffect(() => {
    if (!checkpointId) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const url = new URL(getFullUrl(`/patrolling/checkpoints/${checkpointId}/history`));
        if (API_CONFIG.TOKEN) url.searchParams.append('access_token', API_CONFIG.TOKEN);

        const response = await fetch(url.toString(), getAuthenticatedFetchOptions());
        if (!response.ok) throw new Error('Failed to fetch checkpoint history');

        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Failed to load checkpoint history');

        setData(result.data);
      } catch (error) {
        console.error('Error fetching checkpoint history:', error);
        toast.error('Failed to load checkpoint history');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [checkpointId]);

  const rows = useMemo(
    () => (data ? flattenHistory(data.history, data.checkpoint.grace_time_hours) : []),
    [data]
  );

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      [row.submitted_by, row.answer, row.comments].join(' ').toLowerCase().includes(q)
    );
  }, [rows, searchTerm]);

  const renderCell = (row: CheckpointHistoryRow, columnKey: string): React.ReactNode => {
    switch (columnKey) {
      case 'id':
        return <span className="font-medium text-gray-900">#{row.id}</span>;
      case 'grace_time_hours':
        return <span>{row.grace_time_hours ?? '-'}</span>;
      case 'approved':
        return row.approved ? (
          <span className="text-xs font-medium text-green-700">Yes</span>
        ) : (
          <span className="text-xs text-gray-400">No</span>
        );
      case 'answer':
        return (
          <span className="text-sm text-gray-800 max-w-[200px] truncate block" title={row.answer}>
            {row.answer}
          </span>
        );
      case 'comments':
        return (
          <span className="text-sm text-gray-600 max-w-[200px] truncate block" title={row.comments}>
            {row.comments}
          </span>
        );
      case 'attachments':
        if (!row.attachments.length) return <span className="text-gray-400 text-xs">-</span>;
        return (
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              {row.attachments.slice(0, 3).map((att, idx) => {
                const imgUrl = decodeFileUrl(att.file_url);
                const isImage = att.content_type?.startsWith('image/');
                return isImage ? (
                  <button
                    key={att.id}
                    onClick={() => openPreview(row.attachments, idx)}
                    className="w-8 h-8 rounded overflow-hidden border border-gray-200 hover:border-[#C72030] transition-colors flex-shrink-0"
                    title={att.file_name}
                  >
                    <img src={imgUrl} alt={att.file_name} className="w-full h-full object-cover" />
                  </button>
                ) : (
                  <button
                    key={att.id}
                    onClick={() => openPreview(row.attachments, idx)}
                    className="w-8 h-8 rounded border border-gray-200 hover:border-[#C72030] transition-colors flex-shrink-0 flex items-center justify-center bg-gray-50"
                    title={att.file_name}
                  >
                    <Paperclip className="w-3 h-3 text-gray-500" />
                  </button>
                );
              })}
            </div>
            {row.attachments.length > 3 && (
              <button
                onClick={() => openPreview(row.attachments, 0)}
                className="text-xs text-[#C72030] font-medium hover:underline"
              >
                +{row.attachments.length - 3}
              </button>
            )}
          </div>
        );
      case 'patrolling_time':
        return <span>{formatTo12Hour(row.patrolling_time)}</span>;
      default:
        return <span>{String(row[columnKey as keyof CheckpointHistoryRow] ?? '-')}</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
          <span className="ml-2 text-gray-600">Loading checkpoint history...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Checkpoint history not found</h2>
          <p className="text-gray-600 mt-2">The requested checkpoint history could not be loaded.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded bg-[#C72030] text-white hover:bg-[#C72030]/90"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Attachment Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/90 border-none">
          <div className="relative flex items-center justify-center min-h-[400px]">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </button>
            {previewImages.length > 1 && (
              <button
                onClick={() => setPreviewIndex((i) => (i - 1 + previewImages.length) % previewImages.length)}
                className="absolute left-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {previewImages[previewIndex] && (() => {
              const att = previewImages[previewIndex];
              const imgUrl = decodeFileUrl(att.file_url);
              const isImage = att.content_type?.startsWith('image/');
              return isImage ? (
                <img src={imgUrl} alt={att.file_name} className="max-h-[70vh] max-w-full object-contain" />
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
            {previewImages.length > 1 && (
              <button
                onClick={() => setPreviewIndex((i) => (i + 1) % previewImages.length)}
                className="absolute right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="bg-black/80 px-4 py-2 flex items-center justify-between text-white text-xs">
            <span className="truncate max-w-[70%]">{previewImages[previewIndex]?.file_name}</span>
            {previewImages.length > 1 && (
              <span className="flex-shrink-0">{previewIndex + 1} / {previewImages.length}</span>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030] flex-shrink-0">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{data.checkpoint.name}</h1>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {data.checkpoint.location_path}
          </p>
        </div>
      </div>

      {/* Summary card */}
      {/* <div className="bg-white p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 mb-6 max-w-xs">
        <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded">
          <CheckCircle2 className="w-6 h-6 text-[#C72030]" />
        </div>
        <div>
          <div className="text-2xl font-semibold text-[#1A1A1A]">{data.total_visits}</div>
          <div className="text-sm font-medium text-[#1A1A1A]">Total Visits</div>
        </div>
      </div> */}

      {/* History table */}
      <EnhancedTable
        data={filteredRows}
        columns={columns}
        renderCell={renderCell}
        storageKey="patrolling-checkpoint-history-table"
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search history..."
        emptyMessage="No visit history recorded for this checkpoint yet."
        pagination={true}
        pageSize={20}
      />
    </div>
  );
};

export default PatrollingCheckpointHistoryPage;
