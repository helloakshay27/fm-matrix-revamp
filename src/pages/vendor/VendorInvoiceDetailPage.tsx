import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, CreditCard, CheckCircle, Paperclip, Building } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const tabTriggerCls =
  'rounded-none border-b-2 border-transparent data-[state=active]:border-[#D92818] data-[state=active]:text-[#D92818] data-[state=active]:bg-transparent px-2 py-3 font-semibold text-gray-500 hover:text-gray-700 data-[state=inactive]:shadow-none transition-none focus-visible:ring-0 focus-visible:outline-none';

const SectionCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <Card className="w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden mb-6">
    <CardHeader className="bg-white pb-4 border-b border-gray-100">
      <CardTitle className="flex items-center gap-3 text-lg font-semibold">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#f0e8dc]">
          {icon}
        </div>
        <span className="uppercase tracking-wide" style={{ color: '#eb5e28' }}>{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 bg-white">{children}</CardContent>
  </Card>
);

const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="flex items-start text-sm">
    <span className="text-gray-500 w-[210px] shrink-0">{label}</span>
    <span className="text-gray-900 font-medium break-words flex-1">: {value ?? '-'}</span>
  </div>
);

const fmt = (v: any) => (v != null && v !== '' ? String(v) : '-');
const fmtAmt = (v: any) =>
  v != null ? `₹ ${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-';

const ApprovalBadge = ({ status }: { status?: string }) => {
  const s = (status || '').toLowerCase();
  const cls =
    s === 'approved' ? 'bg-green-100 text-green-800' :
    s === 'rejected' ? 'bg-red-100 text-red-800' :
    'bg-yellow-100 text-yellow-800';
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>{status || 'Pending'}</span>;
};

export const VendorInvoiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [loading, setLoading] = useState(false);
  const [inv, setInv] = useState<any>(null);

  useEffect(() => {
    if (!id || !baseUrl || !token) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://${baseUrl}/pms/work_order_invoices/${id}.json`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        // Response is the invoice object at root level
        setInv(data.work_order_invoice || data);
      } catch {
        toast.error('Failed to load invoice details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!inv) return <div className="p-6 text-gray-500">No data found.</div>;

  const approvalLevels: any[] = inv.approval_levels || [];
  const items: any[] = inv.wo_invoice_inventories || [];
  const attachments: any[] = inv.attachments || [];
  const cowAttachments: any[] = inv.cow_attachments || [];
  const allAttachments = [...attachments, ...cowAttachments];
  const billing = inv.billing_address || {};
  const overallStatus = inv.all_level_approved === true ? 'Approved' : 'Pending';

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-[#fafafa]">
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">
          Vendor &gt; My WO Invoice &gt; <span className="text-gray-900 font-medium">Invoice Details</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold uppercase text-[#1a1a1a]">WO INVOICE DETAILS</h1>
      </div>

      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="flex flex-wrap items-center justify-start gap-6 bg-transparent border-b border-gray-200 rounded-none p-0 h-auto w-full mb-6">
          <TabsTrigger value="basic-info" className={tabTriggerCls}>Basic Information</TabsTrigger>
          <TabsTrigger value="items" className={tabTriggerCls}>Invoice Items ({items.length})</TabsTrigger>
          <TabsTrigger value="approval" className={tabTriggerCls}>Approval ({approvalLevels.length})</TabsTrigger>
          <TabsTrigger value="attachments" className={tabTriggerCls}>Attachments ({allAttachments.length})</TabsTrigger>
        </TabsList>

        {/* ── Basic Information ── */}
        <TabsContent value="basic-info" className="mt-0 space-y-6">

          {/* Invoice Core */}
          <SectionCard icon={<FileText className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Invoice Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              <Field label="Invoice Number" value={inv.invoice_number} />
              <Field label="Invoice Date" value={inv.invoice_date} />
              <Field label="Posting Date" value={inv.posting_date} />
              <Field label="Supplier" value={inv.supplier_name} />
              <Field label="WO Number" value={fmt(inv.wo_number)} />
              <Field label="WO Reference Number" value={inv.wo_reference_number} />
              <Field label="Related To" value={inv.related_to} />
              <Field label="Approval Status" value={overallStatus} />
              <Field label="Physical Invoice Sent" value={inv.physical_invoice_sent_at || 'Not Sent'} />
              <Field label="Physical Invoice Received" value={inv.physical_invoice_received_at || 'Not Received'} />
              {inv.notes && (
                <div className="flex items-start text-sm md:col-span-2">
                  <span className="text-gray-500 w-[210px] shrink-0">Notes</span>
                  <span className="text-gray-900 font-medium flex-1">: {inv.notes}</span>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Financial Summary */}
          <SectionCard icon={<CreditCard className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Financial Summary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              <Field label="Net Amount" value={fmtAmt(inv.net_amount)} />
              <Field label="Total Taxable Value" value={fmtAmt(inv.total_taxable_value)} />
              <Field label="Total Taxes" value={fmtAmt(inv.total_taxes)} />
              <Field label="Invoice Amount" value={fmtAmt(inv.invoice_amount)} />
              <Field label="Total Invoice Amount" value={fmtAmt(inv.total_invoice_amount)} />
              <Field label="Total Value" value={fmtAmt(inv.total_value)} />
              <Field label="Payable Amount" value={fmtAmt(inv.payable_amount)} />
              <Field label="Retention Amount" value={fmtAmt(inv.retention_amount)} />
              <Field label="TDS Amount" value={fmtAmt(inv.tds_amount)} />
              <Field label="QC Amount" value={fmtAmt(inv.qc_amount)} />
              <Field label="Adjustment Amount" value={fmtAmt(inv.adjustment_amount)} />
              {inv.amount_in_words && (
                <div className="flex items-start text-sm md:col-span-2">
                  <span className="text-gray-500 w-[210px] shrink-0">Amount in Words</span>
                  <span className="text-gray-900 font-medium flex-1">: ₹ {Number(inv.amount_in_words).toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Billing Address */}
          {billing.address && (
            <SectionCard icon={<Building className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Billing Address">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                <Field label="Building" value={billing.building_name} />
                <Field label="Phone" value={billing.phone} />
                <Field label="Email" value={billing.email} />
                <Field label="GST Number" value={billing.gst_number} />
                <Field label="PAN Number" value={billing.pan_number} />
                <div className="flex items-start text-sm md:col-span-2">
                  <span className="text-gray-500 w-[210px] shrink-0">Address</span>
                  <span className="text-gray-900 font-medium flex-1">: {billing.address}</span>
                </div>
              </div>
            </SectionCard>
          )}
        </TabsContent>

        {/* ── Invoice Items ── */}
        <TabsContent value="items" className="mt-0">
          <SectionCard icon={<FileText className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Invoice Items">
            {items.length === 0 ? (
              <p className="text-gray-400 text-sm">No items found.</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#fcf5f5] hover:bg-[#fcf5f5]">
                        {['Sr No', 'BOQ Details', 'Quantity', 'Completed %', 'Rate (₹)', 'Tax Amount (₹)', 'Total Amount (₹)'].map(h => (
                          <TableHead key={h} className="font-semibold text-gray-700 text-xs whitespace-nowrap py-3">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item: any, i: number) => (
                        <TableRow key={item.sr_no ?? i}>
                          <TableCell className="text-xs py-3">{item.sr_no || '-'}</TableCell>
                          <TableCell className="text-xs py-3">{item.boq_details || '-'}</TableCell>
                          <TableCell className="text-xs py-3">{fmt(item.quantity)}</TableCell>
                          <TableCell className="text-xs py-3">{item.completed_percentage != null ? `${item.completed_percentage}%` : '-'}</TableCell>
                          <TableCell className="text-xs py-3">{fmtAmt(item.rate)}</TableCell>
                          <TableCell className="text-xs py-3">{fmtAmt(item.tax_amount)}</TableCell>
                          <TableCell className="text-xs py-3 font-medium">{fmtAmt(item.total_amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Totals summary */}
                <div className="mt-4 flex justify-end">
                  <div className="bg-[#fcf5f5] rounded-lg p-4 text-sm space-y-2 min-w-[280px]">
                    <div className="flex justify-between gap-8">
                      <span className="text-gray-500">Net Amount</span>
                      <span className="font-semibold">{fmtAmt(inv.net_amount)}</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span className="text-gray-500">Total Taxes</span>
                      <span className="font-semibold">{fmtAmt(inv.total_taxes)}</span>
                    </div>
                    <div className="flex justify-between gap-8 border-t pt-2">
                      <span className="text-gray-700 font-bold">Payable Amount</span>
                      <span className="font-bold text-[#D92818]">{fmtAmt(inv.payable_amount)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </SectionCard>
        </TabsContent>

        {/* ── Approval ── */}
        <TabsContent value="approval" className="mt-0">
          <SectionCard icon={<CheckCircle className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Approval Levels">
            {approvalLevels.length === 0 ? (
              <p className="text-gray-400 text-sm">No approval levels defined.</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#fcf5f5] hover:bg-[#fcf5f5]">
                        {['#', 'Level Name', 'Status', 'Updated By', 'Date'].map(h => (
                          <TableHead key={h} className="font-semibold text-gray-700 text-xs whitespace-nowrap py-3">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvalLevels.map((lvl: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs py-3 font-medium">{i + 1}</TableCell>
                          <TableCell className="text-xs py-3 whitespace-nowrap">{lvl.name}</TableCell>
                          <TableCell className="text-xs py-3"><ApprovalBadge status={lvl.status} /></TableCell>
                          <TableCell className="text-xs py-3">{lvl.updated_by || '-'}</TableCell>
                          <TableCell className="text-xs py-3 whitespace-nowrap">{lvl.status_updated_at || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 pt-4 border-t flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-medium">Overall Approval:</span>
                  <ApprovalBadge status={overallStatus} />
                </div>
              </>
            )}
          </SectionCard>
        </TabsContent>

        {/* ── Attachments ── */}
        <TabsContent value="attachments" className="mt-0">
          <SectionCard icon={<Paperclip className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Attachments">
            {allAttachments.length === 0 ? (
              <p className="text-gray-400 text-sm">No attachments found.</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {allAttachments.map((a: any) => (
                  <li key={a.id} className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-gray-400 shrink-0" />
                    <a
                      href={a.url || a.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {/* API uses "fine_name" (typo in response) */}
                      {a.fine_name || a.filename || a.name || `Attachment ${a.id}`}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorInvoiceDetailPage;
