import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, CreditCard, Paperclip, CheckCircle, ShoppingCart } from 'lucide-react';
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
    <span className="text-gray-500 w-[200px] shrink-0">{label}</span>
    <span className="text-gray-900 font-medium break-words flex-1">: {value ?? '-'}</span>
  </div>
);

const fmt = (v: any) => (v != null && v !== '' ? String(v) : '-');
const fmtDate = (v?: string | null) => (v ? v.split('T')[0] : '-');
const fmtAmt = (v: any) => (v != null ? `₹ ${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-');

const ApprovalBadge = ({ status }: { status?: string }) => {
  const s = (status || '').toLowerCase();
  const cls = s === 'approved' ? 'bg-green-100 text-green-800' : s === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>{status || 'Pending'}</span>;
};

export const VendorGRNDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [loading, setLoading] = useState(false);
  const [grn, setGrn] = useState<any>(null);

  useEffect(() => {
    if (!id || !baseUrl || !token) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://${baseUrl}/pms/grns/${id}.json`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        // Response shape: { grn: {...}, metadata: {...} }
        setGrn(data.grn || data);
      } catch {
        toast.error('Failed to load GRN details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!grn) return <div className="p-6 text-gray-500">No data found.</div>;

  const inventories: any[] = grn.grn_inventories || [];
  const approvalLevels: any[] = grn.approval_status?.approval_levels || [];
  const generalAttachments: any[] = grn.attachments?.general_attachments || [];
  const copAttachments: any[] = grn.attachments?.cop_attachments || [];
  const allAttachments = [...generalAttachments, ...copAttachments];
  const paymentDetails: any[] = grn.payment_details || [];
  const po = grn.purchase_order;

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-[#fafafa]">
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">
          Vendor &gt; My GRN &gt; <span className="text-gray-900 font-medium">GRN Details</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold uppercase text-[#1a1a1a]">GRN DETAILS</h1>
      </div>

      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="flex flex-wrap items-center justify-start gap-6 bg-transparent border-b border-gray-200 rounded-none p-0 h-auto w-full mb-6">
          <TabsTrigger value="basic-info" className={tabTriggerCls}>Basic Information</TabsTrigger>
          <TabsTrigger value="items" className={tabTriggerCls}>Inventory Items ({inventories.length})</TabsTrigger>
          <TabsTrigger value="approval" className={tabTriggerCls}>Approval ({approvalLevels.length})</TabsTrigger>
          <TabsTrigger value="payment" className={tabTriggerCls}>Payment</TabsTrigger>
          <TabsTrigger value="attachments" className={tabTriggerCls}>Attachments ({allAttachments.length})</TabsTrigger>
        </TabsList>

        {/* ── Basic Information ── */}
        <TabsContent value="basic-info" className="mt-0 space-y-6">
          <SectionCard icon={<Package className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="GRN Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              <Field label="GRN ID" value={grn.id} />
              <Field label="Invoice Number" value={grn.invoice_no} />
              <Field label="Bill Date" value={fmtDate(grn.bill_date)} />
              <Field label="Posting Date" value={fmtDate(grn.posting_date)} />
              <Field label="Related To" value={grn.related_to} />
              <Field label="Payment Mode" value={grn.payment_mod} />
              <Field label="Payment Approval" value={grn.payment_approval?.status} />
              <Field label="Overall Approval" value={grn.all_level_approved === true ? 'Approved' : grn.all_level_approved === false ? 'Pending' : '-'} />
            </div>
          </SectionCard>

          {/* Financial Summary */}
          <SectionCard icon={<CreditCard className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Financial Summary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              <Field label="GRN Amount" value={fmtAmt(grn.grn_amount)} />
              <Field label="Invoice Amount" value={fmtAmt(grn.invoice_amount)} />
              <Field label="Total Amount" value={fmtAmt(grn.amount)} />
              <Field label="Total Taxes" value={fmtAmt(grn.total_taxes)} />
              <Field label="Payable Amount" value={fmtAmt(grn.payable_amount)} />
              <Field label="Retention Amount" value={fmtAmt(grn.retention_amount)} />
              <Field label="TDS Amount" value={fmtAmt(grn.tds_amount)} />
              <Field label="QC Hold Amount" value={fmtAmt(grn.qh_amount)} />
              <Field label="Adjustment Amount" value={fmtAmt(grn.adj_amount)} />
              <Field label="Other Expenses" value={fmtAmt(grn.other_expenses)} />
            </div>
          </SectionCard>

          {/* Supplier */}
          {grn.supplier && (
            <SectionCard icon={<ShoppingCart className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Supplier">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                <Field label="Supplier ID" value={grn.supplier.id} />
                <Field label="Company Name" value={grn.supplier.company_name} />
              </div>
            </SectionCard>
          )}

          {/* PO Reference */}
          {po && (
            <SectionCard icon={<ShoppingCart className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Purchase Order Reference">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                <Field label="PO Number" value={po.external_id} />
                <Field label="Reference Number" value={fmt(po.reference_number)} />
                <Field label="PO Amount" value={fmtAmt(po.amount)} />
                <Field label="Plant" value={po.plant_name} />
                {po.billing_address && (
                  <div className="flex items-start text-sm md:col-span-2">
                    <span className="text-gray-500 w-[200px] shrink-0">Billing Address</span>
                    <span className="text-gray-900 font-medium flex-1">: {po.billing_address.address || '-'}</span>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* QC Approval */}
          {grn.qc_approval && (
            <SectionCard icon={<CheckCircle className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="QC Approval">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                <Field label="QC Approved" value={grn.qc_approval.qc_approved ? 'Yes' : 'No'} />
                <Field label="Admin Approved" value={grn.qc_approval.admin_approved ? 'Yes' : 'No'} />
                <Field label="Quality Holding Amount" value={fmtAmt(grn.qc_approval.quality_holding_amount)} />
              </div>
            </SectionCard>
          )}
        </TabsContent>

        {/* ── Inventory Items ── */}
        <TabsContent value="items" className="mt-0">
          <SectionCard icon={<Package className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Inventory Items">
            {inventories.length === 0 ? (
              <p className="text-gray-400 text-sm">No inventory items found.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#fcf5f5] hover:bg-[#fcf5f5]">
                      {['Inventory', 'Expected Qty', 'Received Qty', 'Approved Qty', 'Rejected Qty', 'Rate (₹)', 'Total Value (₹)', 'Taxable Value (₹)', 'CGST %', 'CGST Amt', 'SGST %', 'SGST Amt', 'IGST %', 'IGST Amt'].map(h => (
                        <TableHead key={h} className="font-semibold text-gray-700 text-xs whitespace-nowrap py-3">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventories.map((inv: any) => (
                      <TableRow key={inv.id}>
                        <TableCell className="text-xs py-2 whitespace-nowrap font-medium">{inv.inventory_name}</TableCell>
                        <TableCell className="text-xs py-2">{fmt(inv.expected_quantity)}</TableCell>
                        <TableCell className="text-xs py-2">{fmt(inv.received_quantity)}</TableCell>
                        <TableCell className="text-xs py-2">{fmt(inv.approved_qty)}</TableCell>
                        <TableCell className="text-xs py-2">{fmt(inv.rejected_qty)}</TableCell>
                        <TableCell className="text-xs py-2">{fmt(inv.rate)}</TableCell>
                        <TableCell className="text-xs py-2">{fmt(inv.total_value)}</TableCell>
                        <TableCell className="text-xs py-2">{fmt(inv.taxable_value)}</TableCell>
                        <TableCell className="text-xs py-2">{fmt(inv.cgst_rate)}</TableCell>
                        <TableCell className="text-xs py-2">{fmt(inv.cgst_amount)}</TableCell>
                        <TableCell className="text-xs py-2">{fmt(inv.sgst_rate)}</TableCell>
                        <TableCell className="text-xs py-2">{fmt(inv.sgst_amount)}</TableCell>
                        <TableCell className="text-xs py-2">{fmt(inv.igst_rate)}</TableCell>
                        <TableCell className="text-xs py-2">{fmt(inv.igst_amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        {/* ── Approval ── */}
        <TabsContent value="approval" className="mt-0">
          <SectionCard icon={<CheckCircle className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Approval Levels">
            {approvalLevels.length === 0 ? (
              <p className="text-gray-400 text-sm">No approval levels defined.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#fcf5f5] hover:bg-[#fcf5f5]">
                      {['Order', 'Level Name', 'Status', 'Approved By', 'Approved At', 'Rejection Reason'].map(h => (
                        <TableHead key={h} className="font-semibold text-gray-700 text-xs whitespace-nowrap py-3">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvalLevels.map((lvl: any) => (
                      <TableRow key={lvl.id}>
                        <TableCell className="text-xs py-3 font-medium">{lvl.order}</TableCell>
                        <TableCell className="text-xs py-3 whitespace-nowrap">{lvl.name}</TableCell>
                        <TableCell className="text-xs py-3"><ApprovalBadge status={lvl.status} /></TableCell>
                        <TableCell className="text-xs py-3">{lvl.approved_by || '-'}</TableCell>
                        <TableCell className="text-xs py-3 whitespace-nowrap">{lvl.approved_at || '-'}</TableCell>
                        <TableCell className="text-xs py-3">{lvl.rejection_reason || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        {/* ── Payment ── */}
        <TabsContent value="payment" className="mt-0 space-y-6">
          <SectionCard icon={<CreditCard className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Payment Status">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              <Field label="Payment Approval" value={grn.payment_approval?.status} />
              <Field label="Payable Amount" value={fmtAmt(grn.payable_amount)} />
            </div>
          </SectionCard>

          {paymentDetails.length > 0 && (
            <SectionCard icon={<CreditCard className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Payment Records">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#fcf5f5] hover:bg-[#fcf5f5]">
                      {['Date', 'Amount', 'Mode', 'Reference', 'Status'].map(h => (
                        <TableHead key={h} className="font-semibold text-gray-700 text-xs py-3">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentDetails.map((p: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs py-2">{fmtDate(p.payment_date || p.date)}</TableCell>
                        <TableCell className="text-xs py-2">{fmtAmt(p.amount)}</TableCell>
                        <TableCell className="text-xs py-2">{p.payment_mode || '-'}</TableCell>
                        <TableCell className="text-xs py-2">{p.reference_number || '-'}</TableCell>
                        <TableCell className="text-xs py-2">{p.status || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SectionCard>
          )}
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
                      href={a.document_url || a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {a.filename || `Attachment ${a.id}`}
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

export default VendorGRNDetailPage;
