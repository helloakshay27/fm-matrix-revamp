import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Download, Recycle, Truck, Clock, CheckCircle2, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';
import { fetchWasteDispatches, WasteDispatch } from '@/services/wasteDispatchAPI';
import { DispatchRecord } from '@/data/wasteDispatchDummyData';
import { AttachmentPreviewModal } from '@/components/AttachmentPreviewModal';

type ExistingAttachment = { id: number; url: string; name: string };

// Same normalization WasteDispatchDetailPage.tsx uses: the API returns
// { id, document: "<url-encoded, protocol-relative S3 URL>", active } — no
// separate filename field, so the display name is derived from the URL's
// last path segment.
const normalizeAttachment = (raw: unknown): ExistingAttachment | null => {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;

  const rawUrl = [record.document, record.url, record.document_url, record.file_url].find(
    (v): v is string => typeof v === 'string' && v.trim().length > 0
  );
  if (!rawUrl) return null;

  let decoded = rawUrl;
  try {
    decoded = decodeURIComponent(rawUrl);
  } catch {
    // Not actually URL-encoded — use as-is.
  }
  const url = decoded.startsWith('//') ? `https:${decoded}` : decoded;

  const explicitName = [record.document_name, record.document_file_name, record.name, record.file_name].find(
    (v): v is string => typeof v === 'string' && v.trim().length > 0
  );
  const name = explicitName ?? (url.split('/').pop() || 'Attachment').split('?')[0];

  const id = typeof record.id === 'number' ? record.id : Number(record.id) || 0;

  return { id, url, name };
};

// Table 2 — Waste Dispatch List columns. "Checkbox" isn't listed here since
// EnhancedTable renders its own selection column via the `selectable` prop.
const columns = [
  { key: 'actions', label: 'Action' },
  { key: 'id', label: 'Id' },
  { key: 'dispatch_datetime', label: 'Dispatch Date & Time' },
  { key: 'waste_category', label: 'Waste Category' },
  { key: 'waste_type', label: 'Waste Type' },
  { key: 'total_generated_kg', label: 'Total Generated Weight (KG)' },
  { key: 'dispatch_weight_kg', label: 'Dispatch Weight (KG)' },
  { key: 'recycled_weight_kg', label: 'Recycled Weight (KG)' },
  { key: 'total_generated_ltr', label: 'Total Generated Weight (L)' },
  { key: 'dispatch_weight_ltr', label: 'Dispatch Weight (L)' },
  { key: 'recycled_weight_ltr', label: 'Recycled Weight (L)' },
  { key: 'vendor_name', label: 'Vendor Name' },
  { key: 'vehicle_no', label: 'Vehicle No' },
  { key: 'driver_name', label: 'Driver Name' },
  { key: 'contact_no', label: 'Contact No' },
  { key: 'destination_facility', label: 'Destination Facility' },
  { key: 'disposal_method', label: 'Disposal Method' },
  { key: 'supporting_documents', label: 'Supporting Documents' },
  // { key: 'manifest_no', label: 'Manifest No.' },
  { key: 'status', label: 'Status' },
];

// Some columns (recycled weight) still have no backing data on this endpoint
// — those show '-' until/unless the backend adds it.
const renderDispatchCell = (item: WasteDispatch, key: string) => {
  if (key === 'id') return item.id;
  if (key === 'dispatch_datetime') {
    let timePart = '';
    if (item.created_at) {
      try { timePart = new Date(item.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); }
      catch { timePart = ''; }
    }
    return [item.dispatch_date, timePart].filter(Boolean).join(' ') || '-';
  }
  if (key === 'waste_category') return item.category_names || '-';
  if (key === 'waste_type') return item.waste_type ? item.waste_type.replace(/\b\w/g, (c) => c.toUpperCase()) : '-';
  if (key === 'total_generated_kg') return item.total_waste_captured_kg != null ? `${item.total_waste_captured_kg} KG` : '-';
  if (key === 'dispatch_weight_kg') return item.dispatch_weight_kg != null ? `${item.dispatch_weight_kg} KG` : '-';
  if (key === 'recycled_weight_kg') return '-';
  if (key === 'total_generated_ltr') return item.total_waste_captured_ltr != null ? `${item.total_waste_captured_ltr} L` : '-';
  if (key === 'dispatch_weight_ltr') return item.dispatch_weight_ltr != null ? `${item.dispatch_weight_ltr} L` : '-';
  if (key === 'recycled_weight_ltr') return '-';
  if (key === 'vendor_name') return item.vendor?.company_name || item.vendor?.full_name || '-';
  if (key === 'vehicle_no') return item.vehicle_number || '-';
  if (key === 'driver_name') return item.driver_name || '-';
  if (key === 'contact_no') return item.driver_contact || '-';
  if (key === 'destination_facility') return item.destination_type || '-';
  if (key === 'disposal_method') return item.disposal_method_kg || item.disposal_method_ltr || '-';
  if (key === 'supporting_documents') return item.attachments && item.attachments.length > 0 ? `${item.attachments.length} file(s)` : '-';
  // if (key === 'manifest_no') return item.waste_transfer_note || '-';
  if (key === 'status') return item.approval_status || '-';
  return '-';
};

// Bridges a real API record into the shape WasteDispatchDetailPage.tsx still
// expects (it isn't wired to a real endpoint yet) — fields the dispatch API
// doesn't return fall back to '-' rather than being guessed.
const toDispatchRecordView = (item: WasteDispatch): DispatchRecord => {
  let timePart = '';
  if (item.created_at) {
    try { timePart = new Date(item.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); }
    catch { timePart = ''; }
  }
  return {
    id: item.id.toString(),
    dispatchId: item.id.toString(),
    wasteItem: '-',
    category: '-',
    dispatchWeight: item.dispatch_weight_kg != null
      ? `${item.dispatch_weight_kg} KG`
      : (item.dispatch_weight_ltr != null ? `${item.dispatch_weight_ltr} L` : '-'),
    destination: item.vendor?.company_name || item.vendor?.full_name || '-',
    vehicleNumber: item.vehicle_number || '-',
    dispatchedBy: item.department?.department_name || item.authorized_by_type || '-',
    dispatchDate: item.dispatch_date || '-',
    // manifestNumber: item.waste_transfer_note || '-',
    status: item.approval_status || '-',
    site: '-',
    weightEntries: [],
    dispatchTime: timePart,
    totalGeneratedWeightKg: null,
    dispatchWeightKg: item.dispatch_weight_kg ?? null,
    recycledWeightKg: null,
    totalGeneratedWeightLtr: null,
    dispatchWeightLtr: item.dispatch_weight_ltr ?? null,
    recycledWeightLtr: null,
    driverName: item.driver_name || '-',
    contactNo: item.driver_contact || '-',
    destinationFacility: item.destination_type || '-',
    disposalMethod: item.disposal_method_kg || item.disposal_method_ltr || '-',
    supportingDocumentsCount: item.attachments?.length ?? 0,
    vendorAcknowledge: '-',
  };
};

const WasteDispatchHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { shouldShow } = useDynamicPermissions();

  const [dispatchRecords, setDispatchRecords] = useState<WasteDispatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{
    id: number;
    document_name?: string;
    document_file_name?: string;
    url: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    const loadDispatches = async () => {
      setIsLoading(true);
      try {
        const response = await fetchWasteDispatches(1);
        setDispatchRecords(response.waste_dispatches);
      } catch (error) {
        console.error('Error loading waste dispatches:', error);
        toast.error('Failed to load waste dispatch history.');
        setDispatchRecords([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadDispatches();
  }, []);

  const filteredRecords = useMemo(() => {
    if (!searchTerm) return dispatchRecords;
    const q = searchTerm.toLowerCase();
    return dispatchRecords.filter((record) =>
      record.id.toString().includes(q) ||
      (record.vehicle_number || '').toLowerCase().includes(q) ||
      (record.waste_transfer_note || '').toLowerCase().includes(q) ||
      (record.destination_type || '').toLowerCase().includes(q) ||
      (record.vendor?.company_name || record.vendor?.full_name || '').toLowerCase().includes(q)
    );
  }, [dispatchRecords, searchTerm]);

  const summaryCards = useMemo(() => {
    const totalKg = dispatchRecords.reduce((sum, r) => sum + (r.dispatch_weight_kg || 0), 0);
    const totalLtr = dispatchRecords.reduce((sum, r) => sum + (r.dispatch_weight_ltr || 0), 0);
    const pendingApproval = dispatchRecords.filter((r) => r.approval_status === 'pending_approval').length;
    const approved = dispatchRecords.filter((r) => r.approval_status === 'approved').length;

    return [
      { label: 'Total Dispatch Requests', value: dispatchRecords.length, icon: <Truck className="w-6 h-6 text-[#C72030]" /> },
      { label: 'Pending Approval', value: pendingApproval, icon: <Clock className="w-6 h-6 text-[#C72030]" /> },
      { label: 'Approved', value: approved, icon: <CheckCircle2 className="w-6 h-6 text-[#C72030]" /> },
      { label: 'Total Dispatch Weight (Kg)', value: `${totalKg.toLocaleString('en-IN')} KG`, icon: <Scale className="w-6 h-6 text-[#C72030]" /> },
      { label: 'Total Dispatch Weight (Ltr)', value: `${totalLtr.toLocaleString('en-IN')} L`, icon: <Scale className="w-6 h-6 text-[#C72030]" /> },
    ];
  }, [dispatchRecords]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredRecords.map((r) => r.id.toString()) : []);
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    setSelectedItems((prev) => (checked ? [...prev, itemId] : prev.filter((id) => id !== itemId)));
  };

  const handleView = (record: WasteDispatch) => {
    // WasteDispatchDetailPage fetches the record itself via fetchWasteDispatchById,
    // so no need to pass it through router state.
    navigate(`/maintenance/waste/dispatch/${record.id}`);
  };

  const handleRecycleEntry = () => {
    const record = dispatchRecords.find((r) => r.id.toString() === selectedItems[0]);
    if (!record) return;
    navigate(`/maintenance/waste/dispatch/recycle-entry/${record.id}`, { state: { record: toDispatchRecordView(record) } });
  };

  const handleExportSelected = () => {
    const rows = dispatchRecords.filter((r) => selectedItems.includes(r.id.toString()));
    const headers = columns.filter((c) => c.key !== 'actions').map((c) => c.label);
    const csvRows = rows.map((r) =>
      columns.filter((c) => c.key !== 'actions').map((c) => renderDispatchCell(r, c.key))
    );
    const csv = [headers, ...csvRows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `waste-dispatch-history-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">WASTE DISPATCH HISTORY</h1>
        <p className="text-sm text-gray-600 mt-1">
          All past waste dispatches across sites, with destination, quantity and manifest details.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 hover:shadow-lg transition-shadow duration-300">
            <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center shrink-0">
              {card.icon}
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#1A1A1A]">{card.value}</div>
              <div className="text-sm font-medium text-[#1A1A1A]">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <EnhancedTable
        data={filteredRecords}
        loading={isLoading}
        loadingMessage="Loading..."
        columns={columns}
        renderCell={(item: WasteDispatch, key: string) => {
          if (key === 'actions') {
            return shouldShow('Waste Generation', 'show') ? (
              <Button variant="ghost" onClick={() => handleView(item)}>
                <Eye className="h-4 w-4" />
              </Button>
            ) : null;
          }
          if (key === 'supporting_documents') {
            const docs = (item.attachments || [])
              .map(normalizeAttachment)
              .filter((a): a is ExistingAttachment => Boolean(a));
            if (docs.length === 0) return '-';
            return (
              <div className="flex flex-col gap-1">
                {docs.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    title={`View ${doc.name}`}
                    className="flex items-center gap-1.5 text-gray-700 hover:text-[#C72030] max-w-[220px]"
                    onClick={() => {
                      setSelectedDoc({ id: doc.id, document_name: doc.name, url: doc.url });
                      setIsPreviewOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 shrink-0" />
                    <span className="text-xs truncate">{doc.name}</span>
                  </button>
                ))}
              </div>
            );
          }
          return renderDispatchCell(item, key);
        }}
        getItemId={(item) => item.id.toString()}
        selectable={true}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by vehicle no, vendor, ..."
        pagination
        pageSize={10}
        emptyMessage="No dispatch history yet"
      />

      {selectedItems.length > 0 && (
        <SelectionPanel
          actions={[
            { label: 'Recycle Entry', icon: Recycle, onClick: handleRecycleEntry },
            { label: 'Export', icon: Download, onClick: handleExportSelected },
          ]}
          onClearSelection={() => setSelectedItems([])}
        />
      )}

      <AttachmentPreviewModal
        isModalOpen={isPreviewOpen}
        setIsModalOpen={setIsPreviewOpen}
        selectedDoc={selectedDoc}
        setSelectedDoc={setSelectedDoc}
      />
    </div>
  );
};

export default WasteDispatchHistoryPage;
