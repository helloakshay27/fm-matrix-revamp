import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileCheck, Eye, Download, FileText, FileSpreadsheet, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { fetchWasteDispatchById, WasteDispatch } from '@/services/wasteDispatchAPI';
import { AttachmentPreviewModal } from '@/components/AttachmentPreviewModal';

const categoryBadgeClass = (category: string) => {
  const c = category.toLowerCase();
  if (c.includes('hazard')) return 'bg-red-100 text-red-700';
  if (c.includes('e-waste')) return 'bg-purple-100 text-purple-700';
  if (c.includes('recycl')) return 'bg-blue-100 text-blue-700';
  return 'bg-gray-100 text-gray-700';
};

// "250 Kg | 80 Litre" — always shows both units side by side; a unit the
// record doesn't carry a number for just shows a dash instead of being hidden.
const formatDual = (kg: number | null | undefined, ltr: number | null | undefined) => {
  const kgPart = kg != null ? `${kg.toLocaleString('en-IN')} Kg` : '- Kg';
  const ltrPart = ltr != null ? `${ltr.toLocaleString('en-IN')} Litre` : '- Litre';
  return `${kgPart} | ${ltrPart}`;
};

const titleCase = (value: string) => value.replace(/\b\w/g, (c) => c.toUpperCase());

type ExistingAttachment = { id: number; url: string; name: string };

// Real shape returned by the waste APIs: { id, document: "<url-encoded,
// protocol-relative S3 URL>", active } — no separate filename field, so the
// display name has to be derived from the URL's last path segment. `id` here
// is the generic Attachfile record id (same id space `/attachfiles/:id` uses
// elsewhere in the app), which is why AttachmentPreviewModal can download it.
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

const isImageFile = (url: string) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
const isPdfFile = (url: string) => /\.pdf$/i.test(url);
const isExcelFile = (url: string) => /\.(xls|xlsx|csv)$/i.test(url);
const isWordFile = (url: string) => /\.(doc|docx)$/i.test(url);

type Field = { label: string; value: string | number | null | undefined };

const hasData = (value: string | number | null | undefined) =>
  value !== null && value !== undefined && value !== '';

const FieldColumns = ({ fields }: { fields: Field[] }) => {
  const visible = fields.filter((f) => hasData(f.value));
  if (visible.length === 0) {
    return <p className="text-sm text-gray-500">No data available.</p>;
  }
  const midpoint = Math.ceil(visible.length / 2);
  const colA = visible.slice(0, midpoint);
  const colB = visible.slice(midpoint);
  return (
    <div className="flex flex-col sm:flex-row gap-10">
      {[colA, colB].map((col, ci) => (
        <div key={ci} className="flex flex-col gap-4 min-w-[280px] flex-1">
          {col.map((field) => (
            <div key={field.label} className="flex text-[14px] leading-snug min-w-0">
              <div className="w-[200px] flex-shrink-0 text-[#6B6B6B] font-medium">
                {field.label}
              </div>
              <div className="flex-1 text-[14px] font-semibold text-[#1A1A1A] break-words overflow-wrap-anywhere min-w-0">
                {String(field.value)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const CardShell = ({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card className="w-full bg-white rounded-lg shadow-sm border mb-6">
    <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
      <h3 className="text-lg font-semibold uppercase text-black">{title}</h3>
      {badge}
    </div>
    <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-4">{children}</div>
  </Card>
);

const InfoField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
    <div className="text-sm font-semibold text-gray-900">{children}</div>
  </div>
);

const WasteDispatchDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [dispatchData, setDispatchData] = useState<WasteDispatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dispatch-details');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{
    id: number;
    document_name?: string;
    document_file_name?: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    const loadDispatch = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWasteDispatchById(parseInt(id, 10));
        setDispatchData(data);
      } catch (err) {
        console.error('Error fetching waste dispatch details:', err);
        setError('Failed to fetch waste dispatch details');
      } finally {
        setLoading(false);
      }
    };
    loadDispatch();
  }, [id]);

  const wastageKg = useMemo(() => {
    if (!dispatchData || dispatchData.dispatch_weight_kg == null || dispatchData.recycle_entry?.recycled_quantity_kg == null) return null;
    return Math.max(dispatchData.dispatch_weight_kg - dispatchData.recycle_entry.recycled_quantity_kg, 0);
  }, [dispatchData]);

  const wastageLtr = useMemo(() => {
    if (!dispatchData || dispatchData.dispatch_weight_ltr == null || dispatchData.recycle_entry?.recycled_quantity_ltr == null) return null;
    return Math.max(dispatchData.dispatch_weight_ltr - dispatchData.recycle_entry.recycled_quantity_ltr, 0);
  }, [dispatchData]);

  const handleBack = () => navigate('/maintenance/waste/dispatch');

  const handleCertificate = () => {
    // TODO: wire this up to a real certificate-generation endpoint once the backend exposes one.
    toast.info('Certificate generation is not yet available.');
  };

  // Weight Table — one row per waste generation folded into this dispatch.
  // Each generation's total weight is the sum of its category breakdown
  // (which is itself the sum of that category's bag weights, per the create
  // flow) — falling back to that sum if the generation's own waste_unit isn't
  // present on older records.
  const weightTableRows = useMemo(() => {
    if (!dispatchData) return [];
    return (dispatchData.waste_generations || []).map((gen) => {
      const categories = gen.categories || [];
      const categorySum = categories.reduce((sum, c) => sum + (c.waste_unit || 0), 0);
      const weight = gen.waste_unit ?? categorySum;
      const units = Array.from(new Set(categories.map((c) => c.uom).filter(Boolean)));
      const unit = units.length > 0 ? units.join(', ') : '-';
      const breakdown = categories.length > 0
        ? categories
            .map((c) => `${c.category_name}${c.commodity_name ? ` / ${c.commodity_name}` : ''} (${c.waste_unit} ${c.uom})`)
            .join(', ')
        : '-';
      return {
        key: `gen-${gen.id}`,
        generationId: gen.id,
        referenceNumber: gen.reference_number,
        date: gen.wg_date,
        breakdown,
        weight,
        unit,
      };
    });
  }, [dispatchData]);

  // Logs tab — a best-effort activity history built from real timestamps and
  // fields already on this record. There's no dedicated audit-log API yet,
  // so this isn't a complete history, just what can be honestly derived today.
  const logEntries = useMemo(() => {
    if (!dispatchData) return [];
    const entries: { date: string; activity: string; performedBy: string; remarks: string }[] = [];
    entries.push({
      date: dispatchData.dispatch_date || '-',
      activity: 'Dispatch Created',
      performedBy: dispatchData.created_by?.full_name || '-',
      remarks: `Vehicle ${dispatchData.vehicle_number || '-'}, Driver ${dispatchData.driver_name || '-'}`,
    });
    if (dispatchData.updated_at && dispatchData.updated_at !== dispatchData.created_at) {
      entries.push({
        date: new Date(dispatchData.updated_at).toLocaleString(),
        activity: 'Record Updated',
        performedBy: dispatchData.created_by?.full_name || '-',
        remarks: '-',
      });
    }
    entries.push({
      date: dispatchData.updated_at ? new Date(dispatchData.updated_at).toLocaleString() : dispatchData.dispatch_date || '-',
      activity: `Status: ${dispatchData.approval_status || '-'}`,
      performedBy: dispatchData.approved_by?.full_name || '-',
      remarks: dispatchData.vendor?.company_name ? `To ${dispatchData.vendor.company_name}` : '-',
    });
    if (dispatchData.recycle_entry) {
      entries.push({
        date: dispatchData.recycle_entry.recycling_confirmation_date || '-',
        activity: 'Recycling Confirmed',
        performedBy: dispatchData.recycle_entry.confirmed_by_vendor_contact || '-',
        remarks: [
          dispatchData.recycle_entry.recycled_quantity_kg != null ? `${dispatchData.recycle_entry.recycled_quantity_kg} Kg` : null,
          dispatchData.recycle_entry.recycled_quantity_ltr != null ? `${dispatchData.recycle_entry.recycled_quantity_ltr} L` : null,
          dispatchData.recycle_entry.recycling_status,
        ].filter(Boolean).join(' · ') || '-',
      });
    }
    return entries;
  }, [dispatchData]);

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
          <p className="text-gray-700">Loading waste dispatch details...</p>
        </div>
      </div>
    );
  }

  if (error || !dispatchData) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <Button variant="ghost" onClick={handleBack} className="p-0 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center text-gray-500 py-16">{error || 'Dispatch record not found.'}</div>
      </div>
    );
  }

  // Every field the API returns for this dispatch record.
  const dispatchFields: Field[] = [
    { label: 'Dispatch ID', value: dispatchData.id },
    { label: 'Destination Type', value: dispatchData.destination_type },
    { label: 'Vendor / Facility', value: dispatchData.vendor?.company_name || dispatchData.vendor?.full_name },
    { label: 'Source Site', value: dispatchData.source_site?.name },
    { label: 'Source Building', value: dispatchData.source_building?.name },
    { label: 'Vehicle Number', value: dispatchData.vehicle_number },
    { label: 'Driver Name', value: dispatchData.driver_name },
    { label: 'Driver Contact', value: dispatchData.driver_contact },
    { label: 'Dispatch Date', value: dispatchData.dispatch_date },
    { label: 'Waste Category', value: dispatchData.category_names },
    { label: 'Commodity', value: dispatchData.commodity_names },
    { label: 'Waste Type', value: dispatchData.waste_type ? titleCase(dispatchData.waste_type) : undefined },
    { label: 'Total Waste Captured (Kg)', value: dispatchData.total_waste_captured_kg != null ? `${dispatchData.total_waste_captured_kg} Kg` : undefined },
    { label: 'Total Waste Captured (Ltr)', value: dispatchData.total_waste_captured_ltr != null ? `${dispatchData.total_waste_captured_ltr} L` : undefined },
    { label: 'Dispatch Weight (Kg)', value: dispatchData.dispatch_weight_kg != null ? `${dispatchData.dispatch_weight_kg} Kg` : undefined },
    { label: 'Disposal Method (Kg)', value: dispatchData.disposal_method_kg },
    { label: 'Dispatch Weight (Ltr)', value: dispatchData.dispatch_weight_ltr != null ? `${dispatchData.dispatch_weight_ltr} L` : undefined },
    { label: 'Disposal Method (Ltr)', value: dispatchData.disposal_method_ltr },
    { label: 'Waste Transfer Note / Manifest No.', value: dispatchData.waste_transfer_note },
    { label: 'Authorized By', value: dispatchData.authorized_by_type },
    { label: 'Department', value: dispatchData.department?.name || dispatchData.department?.department_name },
    { label: 'Approved By', value: dispatchData.approved_by?.full_name },
    { label: 'Approval Status', value: dispatchData.approval_status },
    { label: 'Created By', value: dispatchData.created_by?.full_name },
    { label: 'Created At', value: dispatchData.created_at ? new Date(dispatchData.created_at).toLocaleString() : undefined },
    { label: 'Updated At', value: dispatchData.updated_at ? new Date(dispatchData.updated_at).toLocaleString() : undefined },
  ];

  const supportingDocuments = (dispatchData.attachments || [])
    .map(normalizeAttachment)
    .filter((a): a is ExistingAttachment => Boolean(a));

  const recycleEntry = dispatchData.recycle_entry;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Button variant="ghost" onClick={handleBack} className="p-0 mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">WASTE DISPATCH DETAILS</h1>
          <p className="text-sm text-gray-600 mt-1">
            Dispatch #{dispatchData.id}{dispatchData.category_names ? ` · ${dispatchData.category_names}` : ''}
          </p>
        </div>
        <Button
          onClick={handleCertificate}
          variant="outline"
          className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-4 py-2"
        >
          <FileCheck className="w-4 h-4 mr-2" />
          Certificate
        </Button>
      </div>

      {/* Summary cards — both units shown together in each card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg p-4 border-l-4 border-l-gray-400 bg-white">
          <p className="text-xs text-gray-500 mb-1">Dispatch Quantity</p>
          <p className="text-lg font-bold text-gray-900">
            {formatDual(dispatchData.dispatch_weight_kg, dispatchData.dispatch_weight_ltr)}
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 border-l-4 border-l-green-700 bg-white">
          <p className="text-xs text-gray-500 mb-1">Recycled Quantity</p>
          <p className="text-lg font-bold text-gray-900">
            {formatDual(recycleEntry?.recycled_quantity_kg, recycleEntry?.recycled_quantity_ltr)}
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 border-l-4 border-l-red-600 bg-white">
          <p className="text-xs text-gray-500 mb-1">Wastage / Loss</p>
          <p className="text-lg font-bold text-gray-900">
            {formatDual(wastageKg, wastageLtr)}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch mb-4">
          {[
            { label: 'Dispatch Details', value: 'dispatch-details' },
            { label: 'Recycle Detail', value: 'recycle-detail' },
            { label: 'Weight Table', value: 'weight-table' },
            { label: 'Logs', value: 'logs' },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-brand border-r border-gray-200 last:border-r-0"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Dispatch Details — every field the API returns for this record */}
        <TabsContent value="dispatch-details">
          <CardShell
            title="Dispatch Details"
            badge={
              dispatchData.category_names ? (
                <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${categoryBadgeClass(dispatchData.category_names)}`}>
                  {dispatchData.category_names}
                </span>
              ) : undefined
            }
          >
            <FieldColumns fields={dispatchFields} />
            {supportingDocuments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Supporting Documents</p>
                <div className="flex flex-wrap gap-4">
                  {supportingDocuments.map((doc) => {
                    const image = isImageFile(doc.url);
                    const pdf = isPdfFile(doc.url);
                    const excel = isExcelFile(doc.url);
                    const word = isWordFile(doc.url);
                    const openPreview = () =>
                      setSelectedDoc({ id: doc.id, document_name: doc.name, url: doc.url });
                    return (
                      <div
                        key={doc.id}
                        className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-white shadow-md"
                      >
                        <button
                          type="button"
                          className="absolute top-2 right-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                          title="View"
                          onClick={() => {
                            openPreview();
                            setIsPreviewOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {image ? (
                          <img
                            src={doc.url}
                            alt={doc.name}
                            className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                            onClick={() => {
                              openPreview();
                              setIsPreviewOpen(true);
                            }}
                          />
                        ) : pdf ? (
                          <div className="w-14 h-14 flex items-center justify-center border rounded-md text-red-600 bg-white mb-2">
                            <FileText className="w-6 h-6" />
                          </div>
                        ) : excel ? (
                          <div className="w-14 h-14 flex items-center justify-center border rounded-md text-green-600 bg-white mb-2">
                            <FileSpreadsheet className="w-6 h-6" />
                          </div>
                        ) : word ? (
                          <div className="w-14 h-14 flex items-center justify-center border rounded-md text-blue-600 bg-white mb-2">
                            <FileText className="w-6 h-6" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 flex items-center justify-center border rounded-md text-gray-600 bg-white mb-2">
                            <FileIcon className="w-6 h-6" />
                          </div>
                        )}
                        <span className="text-xs text-center truncate max-w-[120px] font-medium">
                          {doc.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardShell>
        </TabsContent>

        {/* Recycle Detail */}
        <TabsContent value="recycle-detail">
          <CardShell title="Recycle Confirmation">
            {recycleEntry ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoField label="Recycled Quantity (Kg)">{recycleEntry.recycled_quantity_kg ?? '-'}</InfoField>
                <InfoField label="Recycled Quantity (Ltr)">{recycleEntry.recycled_quantity_ltr ?? '-'}</InfoField>
                <InfoField label="Recycling Method (Kg)">{recycleEntry.recycling_method_kg || '-'}</InfoField>
                <InfoField label="Recycling Method (Ltr)">{recycleEntry.recycling_method_ltr || '-'}</InfoField>
                <InfoField label="Recycling Confirmation Date">{recycleEntry.recycling_confirmation_date || '-'}</InfoField>
                <InfoField label="Recycling Status">{recycleEntry.recycling_status || '-'}</InfoField>
                <InfoField label="Recycling Certificate No.">{recycleEntry.recycling_certificate_no || '-'}</InfoField>
                <InfoField label="Confirmed By (Vendor Contact)">{recycleEntry.confirmed_by_vendor_contact || '-'}</InfoField>
                <InfoField label="Comments">{recycleEntry.comments || '-'}</InfoField>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No recycle confirmation has been recorded for this dispatch yet.
              </p>
            )}
          </CardShell>
        </TabsContent>

        {/* Weight Table — waste-generation-wise, weight = sum of that
            generation's category bag-weight totals */}
        <TabsContent value="weight-table">
          <CardShell title="Weight Table">
            <div className="overflow-x-auto -m-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Generation ID</TableHead>
                    <TableHead>Reference No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Category / Commodity Breakdown</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weightTableRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-400 py-6">
                        No waste generations linked to this dispatch.
                      </TableCell>
                    </TableRow>
                  ) : (
                    weightTableRows.map((row) => (
                      <TableRow key={row.key}>
                        <TableCell className="font-medium text-gray-900">{row.generationId}</TableCell>
                        <TableCell>{row.referenceNumber ?? '-'}</TableCell>
                        <TableCell>{row.date || '-'}</TableCell>
                        <TableCell className="max-w-[360px]">{row.breakdown}</TableCell>
                        <TableCell>{row.weight}</TableCell>
                        <TableCell>{row.unit}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                {weightTableRows.length > 0 && (
                  <TableFooter>
                    <TableRow className="bg-gray-50 font-semibold">
                      <TableCell colSpan={4} className="text-right">Total</TableCell>
                      <TableCell>{weightTableRows.reduce((sum, r) => sum + (r.weight || 0), 0)}</TableCell>
                      <TableCell>{dispatchData.total_waste_captured_kg != null ? 'Kg' : '-'}</TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </div>
          </CardShell>
        </TabsContent>

        {/* Logs */}
        <TabsContent value="logs">
          <CardShell title="Logs">
            <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Date</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-400 py-6">
                        No activity recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    logEntries.map((entry, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="whitespace-nowrap">{entry.date}</TableCell>
                        <TableCell className="font-medium text-gray-900">{entry.activity}</TableCell>
                        <TableCell>{entry.performedBy}</TableCell>
                        <TableCell>{entry.remarks}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              This history is derived from the fields available on this record. A dedicated
              activity-log endpoint would be needed for a complete audit trail.
            </p>
          </CardShell>
        </TabsContent>
      </Tabs>

      <AttachmentPreviewModal
        isModalOpen={isPreviewOpen}
        setIsModalOpen={setIsPreviewOpen}
        selectedDoc={selectedDoc}
        setSelectedDoc={setSelectedDoc}
      />
    </div>
  );
};

export default WasteDispatchDetailPage;
