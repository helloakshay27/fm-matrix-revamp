import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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

// "210 L" / "1.2 t" / "340 kg" -> { value: 210, unit: 'L' }
const parseQuantity = (raw: string): { value: number; unit: string } => {
  const match = raw.trim().match(/^([\d.,]+)\s*(.*)$/);
  if (!match) return { value: 0, unit: '' };
  return { value: parseFloat(match[1].replace(/,/g, '')) || 0, unit: match[2] || '' };
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

  const dispatchedQuantity = useMemo(
    () => (record ? parseQuantity(record.dispatchWeight) : { value: 0, unit: '' }),
    [record]
  );
  const recycledQuantity = useMemo(
    () => (record?.recycleDetail ? parseQuantity(record.recycleDetail.recycledQuantity) : null),
    [record]
  );
  const wastage = useMemo(() => {
    if (!recycledQuantity) return null;
    return Math.max(dispatchedQuantity.value - recycledQuantity.value, 0);
  }, [dispatchedQuantity, recycledQuantity]);

  const handleBack = () => navigate('/maintenance/waste/dispatch');

  const handleDeleteWeightEntry = (entryId: string) => {
    // Client-side only — no backend endpoint to persist this deletion yet.
    setWeightEntries((prev) => prev.filter((e) => e.id !== entryId));
    toast.success('Weight entry removed.');
  };

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
        <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${statusBadgeClass(record.status)}`}>
          {record.status}
        </span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch mb-4">
          {[
            { label: 'Dispatch Details', value: 'dispatch-details' },
            { label: 'Recycle Detail', value: 'recycle-detail' },
            { label: 'Weight Table', value: 'weight-table' },
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

        {/* Dispatch Details */}
        <TabsContent value="dispatch-details">
          <CardShell
            title="Dispatch Reference"
            badge={
              <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${statusBadgeClass(record.status)}`}>
                {record.status}
              </span>
            }
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Field label="Category">
                <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${categoryBadgeClass(record.category)}`}>
                  {record.category}
                </span>
              </Field>
              <Field label="Dispatch Weight">{record.dispatchWeight}</Field>
              <Field label="Vendor / Facility">{record.destination}</Field>
              <Field label="Dispatch Date">{record.dispatchDate}</Field>
              <Field label="Vehicle No.">{record.vehicleNumber}</Field>
              <Field label="Manifest No.">
                <span className="text-brand">{record.manifestNumber}</span>
              </Field>
              <Field label="Site">
                <span className="text-brand">{record.site}</span>
              </Field>
              <Field label="Dispatched By">{record.dispatchedBy}</Field>
            </div>
          </CardShell>
        </TabsContent>

        {/* Recycle Detail */}
        <TabsContent value="recycle-detail">
          <CardShell title="Recycle Confirmation">
            {record.recycleDetail ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Field label="Recycled Quantity">{record.recycleDetail.recycledQuantity}</Field>
                  <Field label="Recycling Confirmation Date">{record.recycleDetail.confirmationDate}</Field>
                  <Field label="Recycling Status">{record.recycleDetail.recyclingStatus}</Field>
                  <Field label="Recycling Method">{record.recycleDetail.recyclingMethod}</Field>
                  <Field label="Recycling Certificate No.">{record.recycleDetail.certificateNumber}</Field>
                  <Field label="Confirmed By">{record.recycleDetail.confirmedBy}</Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="border border-gray-200 rounded-lg p-4 border-l-4 border-l-gray-400 bg-white">
                    <p className="text-xs text-gray-500 mb-1">Dispatched Quantity</p>
                    <p className="text-xl font-bold text-gray-900">
                      {dispatchedQuantity.value.toLocaleString('en-IN')}{' '}
                      <span className="text-sm font-medium text-gray-500">{dispatchedQuantity.unit}</span>
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 border-l-4 border-l-green-700 bg-white">
                    <p className="text-xs text-gray-500 mb-1">Recycled Quantity</p>
                    <p className="text-xl font-bold text-gray-900">
                      {recycledQuantity.value.toLocaleString('en-IN')}{' '}
                      <span className="text-sm font-medium text-gray-500">{recycledQuantity.unit || dispatchedQuantity.unit}</span>
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 border-l-4 border-l-red-600 bg-white">
                    <p className="text-xs text-gray-500 mb-1">Wastage / Loss</p>
                    <p className="text-xl font-bold text-gray-900">
                      {wastage != null ? (
                        <>
                          {wastage.toLocaleString('en-IN')} <span className="text-sm font-medium text-gray-500">{dispatchedQuantity.unit}</span>
                        </>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </p>
                  </div>
                </div>
              </>
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
      </Tabs>
    </div>
  );
};

export default WasteDispatchDetailPage;
