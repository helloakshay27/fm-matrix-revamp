import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileCheck, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { DUMMY_DISPATCH_RECORDS, DispatchRecord, WeightEntry } from '@/data/wasteDispatchDummyData';

const statusBadgeClass = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('delivered')) return 'bg-blue-100 text-blue-700';
  if (s.includes('transit')) return 'bg-amber-100 text-amber-700';
  return 'bg-gray-100 text-gray-700';
};

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
  <Card className="w-full bg-white rounded-lg shadow-sm border">
    <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
      <h3 className="text-lg font-semibold uppercase text-black">{title}</h3>
      {badge}
    </div>
    <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-4">{children}</div>
  </Card>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
    <div className="text-sm font-semibold text-gray-900">{children}</div>
  </div>
);

const WasteDispatchDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const record: DispatchRecord | null = useMemo(() => {
    const fromState = (location.state as { record?: DispatchRecord } | null)?.record;
    if (fromState) return fromState;
    return DUMMY_DISPATCH_RECORDS.find((r) => r.id === id) ?? null;
  }, [location.state, id]);

  const [activeTab, setActiveTab] = useState('dispatch-details');
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(record?.weightEntries ?? []);

  const wastageKg = useMemo(() => {
    if (!record || record.dispatchWeightKg == null || record.recycledWeightKg == null) return null;
    return Math.max(record.dispatchWeightKg - record.recycledWeightKg, 0);
  }, [record]);

  const wastageLtr = useMemo(() => {
    if (!record || record.dispatchWeightLtr == null || record.recycledWeightLtr == null) return null;
    return Math.max(record.dispatchWeightLtr - record.recycledWeightLtr, 0);
  }, [record]);

  const handleBack = () => navigate('/maintenance/waste/dispatch');

  const handleCertificate = () => {
    // TODO: wire this up to a real certificate-generation endpoint once the backend exposes one.
    toast.info('Certificate generation is not yet available.');
  };

  const handleDeleteWeightEntry = (entryId: string) => {
    // Client-side only — no backend endpoint to persist this deletion yet.
    setWeightEntries((prev) => prev.filter((e) => e.id !== entryId));
    toast.success('Weight entry removed.');
  };

  // Every column shown on the Waste Dispatch List page (Table 2), plus the
  // extra reference fields (Manifest No., Site) already tracked on this record.
  const dispatchListFields: Field[] = record
    ? [
        { label: 'Id', value: record.dispatchId },
        { label: 'Dispatch Date & Time', value: `${record.dispatchDate} ${record.dispatchTime}`.trim() },
        { label: 'Waste Category', value: record.category },
        { label: 'Waste Type', value: record.wasteItem },
        { label: 'Total Generated Weight (KG)', value: record.totalGeneratedWeightKg != null ? `${record.totalGeneratedWeightKg} KG` : undefined },
        { label: 'Dispatch Weight (KG)', value: record.dispatchWeightKg != null ? `${record.dispatchWeightKg} KG` : undefined },
        { label: 'Recycled Weight (KG)', value: record.recycledWeightKg != null ? `${record.recycledWeightKg} KG` : undefined },
        { label: 'Total Generated Weight (L)', value: record.totalGeneratedWeightLtr != null ? `${record.totalGeneratedWeightLtr} L` : undefined },
        { label: 'Dispatch Weight (L)', value: record.dispatchWeightLtr != null ? `${record.dispatchWeightLtr} L` : undefined },
        { label: 'Recycled Weight (L)', value: record.recycledWeightLtr != null ? `${record.recycledWeightLtr} L` : undefined },
        { label: 'Vendor Name', value: record.destination },
        { label: 'Vehicle No', value: record.vehicleNumber },
        { label: 'Driver Name', value: record.driverName },
        { label: 'Contact No', value: record.contactNo },
        { label: 'Destination Facility', value: record.destinationFacility },
        { label: 'Disposal Method', value: record.disposalMethod },
        { label: 'Supporting Documents', value: record.supportingDocumentsCount > 0 ? `${record.supportingDocumentsCount} file(s)` : '-' },
        { label: 'Vendor Acknowledge', value: record.vendorAcknowledge },
        { label: 'Status', value: record.status },
        { label: 'Recycling Status', value: record.recycleDetail?.recyclingStatus || 'Not Recycled' },
        { label: 'Manifest No.', value: record.manifestNumber },
        { label: 'Site', value: record.site },
        { label: 'Dispatched By', value: record.dispatchedBy },
      ]
    : [];

  // Logs tab — a best-effort activity history built from the timestamps and
  // fields already on this record. There's no dedicated audit-log API yet,
  // so this isn't a complete history, just what can be honestly derived today.
  const logEntries = useMemo(() => {
    if (!record) return [];
    const entries: { date: string; activity: string; performedBy: string; remarks: string }[] = [];
    entries.push({
      date: `${record.dispatchDate} ${record.dispatchTime}`.trim(),
      activity: 'Dispatch Created',
      performedBy: record.dispatchedBy,
      remarks: `Vehicle ${record.vehicleNumber}, Driver ${record.driverName}`,
    });
    entries.push({
      date: `${record.dispatchDate} ${record.dispatchTime}`.trim(),
      activity: `Status: ${record.status}`,
      performedBy: '-',
      remarks: `To ${record.destination}${record.destinationFacility ? ` (${record.destinationFacility})` : ''}`,
    });
    if (record.recycleDetail) {
      entries.push({
        date: record.recycleDetail.confirmationDate,
        activity: 'Recycling Confirmed',
        performedBy: record.recycleDetail.confirmedBy,
        remarks: `${record.recycleDetail.recycledQuantity} recycled (${record.recycleDetail.recyclingStatus})`,
      });
    }
    return entries;
  }, [record]);

  if (!record) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <Button variant="ghost" onClick={handleBack} className="p-0 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center text-gray-500 py-16">Dispatch record not found.</div>
      </div>
    );
  }

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
            {record.dispatchId} · {record.wasteItem}
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
            {formatDual(record.dispatchWeightKg, record.dispatchWeightLtr)}
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 border-l-4 border-l-green-700 bg-white">
          <p className="text-xs text-gray-500 mb-1">Recycled Quantity</p>
          <p className="text-lg font-bold text-gray-900">
            {formatDual(record.recycledWeightKg, record.recycledWeightLtr)}
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

        {/* Dispatch Details — every field shown on the Dispatch List page */}
        <TabsContent value="dispatch-details">
          <CardShell
            title="Dispatch Details"
            badge={
              <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${categoryBadgeClass(record.category)}`}>
                {record.category}
              </span>
            }
          >
            <FieldColumns fields={dispatchListFields} />
          </CardShell>
        </TabsContent>

        {/* Recycle Detail */}
        <TabsContent value="recycle-detail">
          <CardShell title="Recycle Confirmation">
            {record.recycleDetail ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Field label="Recycled Quantity">{record.recycleDetail.recycledQuantity}</Field>
                <Field label="Recycling Confirmation Date">{record.recycleDetail.confirmationDate}</Field>
                <Field label="Recycling Status">{record.recycleDetail.recyclingStatus}</Field>
                <Field label="Recycling Method">{record.recycleDetail.recyclingMethod}</Field>
                <Field label="Recycling Certificate No.">{record.recycleDetail.certificateNumber}</Field>
                <Field label="Confirmed By">{record.recycleDetail.confirmedBy}</Field>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No recycle confirmation has been recorded for this dispatch yet.
              </p>
            )}
          </CardShell>
        </TabsContent>

        {/* Weight Table */}
        <TabsContent value="weight-table">
          <CardShell title="Weight Table">
            <div className="overflow-x-auto -m-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Date</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Subcategory</TableHead>
                    <TableHead>Weight/Unit</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weightEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-400 py-6">
                        No weight entries.
                      </TableCell>
                    </TableRow>
                  ) : (
                    weightEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell className="font-medium text-gray-900">{entry.customerName}</TableCell>
                        <TableCell>{entry.category}</TableCell>
                        <TableCell>{entry.subcategory}</TableCell>
                        <TableCell>{entry.weight}</TableCell>
                        <TableCell>
                          <button
                            type="button"
                            onClick={() => handleDeleteWeightEntry(entry.id)}
                            className="text-red-600 hover:underline text-sm font-medium"
                          >
                            Delete
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
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
    </div>
  );
};

export default WasteDispatchDetailPage;
