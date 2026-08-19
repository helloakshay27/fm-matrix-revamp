import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Briefcase, FileText, CreditCard, Paperclip, CheckCircle, ShoppingCart } from 'lucide-react';
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

const ApprovalBadge = ({ status }: { status?: string | boolean | null }) => {
  const s = String(status || '').toLowerCase();
  const label = status === true ? 'Approved' : status === false || status === null ? 'Pending' : String(status);
  const cls = s === 'approved' || status === true ? 'bg-green-100 text-green-800' : s === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>{label}</span>;
};

export const VendorWODetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<any>(null);

  useEffect(() => {
    if (!id || !baseUrl || !token) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://${baseUrl}/pms/work_orders/${id}.json`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        // Response shape: { page: { work_order, inventories, totals, ... } }
        setPage(data.page || data);
      } catch {
        toast.error('Failed to load WO details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!page) return <div className="p-6 text-gray-500">No data found.</div>;

  const wo = page.work_order || {};
  const supplier = wo.supplier_details || {};
  const supplierAddr = wo.supplier_address || {};
  const paymentTerms = wo.payment_terms || {};
  const billing = page.billing_address || {};
  const company = page.company || {};
  const inventories: any[] = page.inventories || [];
  const totals = page.totals || {};
  const invoices: any[] = page.invoices || [];
  const payments: any[] = page.payments || page.approved_payment_details || [];
  const approvalStatus = page.approval_status || {};
  const attachments: any[] = Array.isArray(page.attachments) ? page.attachments : [];

  const overallApproval = approvalStatus.all_level_approved === true ? 'Approved' : 'Pending';

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-[#fafafa]">
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">
          Vendor &gt; My WO &gt; <span className="text-gray-900 font-medium">WO Details</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold uppercase text-[#1a1a1a]">WORK ORDER DETAILS</h1>
      </div>

      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="flex flex-wrap items-center justify-start gap-6 bg-transparent border-b border-gray-200 rounded-none p-0 h-auto w-full mb-6">
          <TabsTrigger value="basic-info" className={tabTriggerCls}>Basic Information</TabsTrigger>
          <TabsTrigger value="items" className={tabTriggerCls}>WO Items ({inventories.length})</TabsTrigger>
          <TabsTrigger value="approval" className={tabTriggerCls}>Approval</TabsTrigger>
          {invoices.length > 0 && <TabsTrigger value="invoices" className={tabTriggerCls}>Invoices ({invoices.length})</TabsTrigger>}
          {payments.length > 0 && <TabsTrigger value="payments" className={tabTriggerCls}>Payments ({payments.length})</TabsTrigger>}
          <TabsTrigger value="attachments" className={tabTriggerCls}>Attachments ({attachments.length})</TabsTrigger>
        </TabsList>

        {/* ── Basic Information ── */}
        <TabsContent value="basic-info" className="mt-0 space-y-6">
          {/* WO Core */}
          <SectionCard icon={<Briefcase className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Work Order Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              <Field label="WO Number" value={wo.number || page.external_id} />
              <Field label="Reference Number" value={fmt(wo.reference_number || wo.reference_no)} />
              <Field label="WO Date" value={wo.wo_date || wo.date} />
              <Field label="Created By" value={wo.created_by || page.prepared_by} />
              <Field label="Created On" value={page.created_at} />
              <Field label="Related To" value={wo.related_to} />
              <Field label="PR Type" value={page.pr_type} />
              <Field label="WO Status" value={wo.wo_status || page.status} />
              <Field label="Approval Status" value={overallApproval} />
              <Field label="Plant" value={wo.plant_detail} />
              <Field label="Kind Attention" value={wo.kind_attention} />
              <Field label="Address To" value={wo.address_to} />
              <Field label="Subject" value={wo.subject} />
              {wo.term_condition && (
                <div className="flex items-start text-sm md:col-span-2">
                  <span className="text-gray-500 w-[200px] shrink-0">Terms & Conditions</span>
                  <span className="text-gray-900 font-medium flex-1">: {wo.term_condition}</span>
                </div>
              )}
              {wo.description && (
                <div className="flex items-start text-sm md:col-span-2">
                  <span className="text-gray-500 w-[200px] shrink-0">Description</span>
                  <span className="text-gray-900 font-medium flex-1">: {wo.description}</span>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Financial Totals */}
          <SectionCard icon={<CreditCard className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Financial Totals">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              <Field label="Net Amount" value={fmtAmt(totals.net_amount)} />
              <Field label="Total Taxable" value={fmtAmt(totals.total_taxable)} />
              <Field label="Total Taxes" value={fmtAmt(totals.taxes)} />
              <Field label="Total Value" value={fmtAmt(totals.total_value)} />
              <Field label="Advance Amount" value={fmtAmt(wo.advance_amount)} />
              {totals.amount_in_words && (
                <div className="flex items-start text-sm md:col-span-2">
                  <span className="text-gray-500 w-[200px] shrink-0">Amount in Words</span>
                  <span className="text-gray-900 font-medium flex-1">: {totals.amount_in_words}</span>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Payment Terms */}
          <SectionCard icon={<CreditCard className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Payment Terms">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              <Field label="Payment Tenure (Days)" value={fmt(paymentTerms.payment_tenure)} />
              <Field label="Retention (%)" value={fmt(paymentTerms.retention)} />
              <Field label="TDS (%)" value={fmt(paymentTerms.tds)} />
              <Field label="Quality Holding (%)" value={fmt(paymentTerms.quality_holding)} />
              <Field label="QC (%)" value={fmt(paymentTerms.qc)} />
            </div>
          </SectionCard>

          {/* Supplier */}
          {supplier.id && (
            <SectionCard icon={<ShoppingCart className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Supplier Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                <Field label="Company Name" value={supplier.company_name || wo.contractor} />
                <Field label="Mobile" value={supplier.mobile1 || wo.phone} />
                <Field label="Email" value={supplier.email || wo.email} />
                <Field label="PAN Number" value={supplier.pan_number || wo.pan} />
                <Field label="GSTIN" value={supplier.gstin_number || wo.gst} />
                <Field label="MSME Number" value={supplier.msme_number} />
                <Field label="Vendor Code" value={supplier.vendor_code} />
                {(supplierAddr.address || supplierAddr.city) && (
                  <div className="flex items-start text-sm md:col-span-2">
                    <span className="text-gray-500 w-[200px] shrink-0">Supplier Address</span>
                    <span className="text-gray-900 font-medium flex-1">
                      : {[supplierAddr.address, supplierAddr.address2, supplierAddr.city, supplierAddr.pincode, supplierAddr.state, supplierAddr.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Site & Billing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {company.site_name && (
              <SectionCard icon={<Briefcase className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Site">
                <div className="space-y-4">
                  <Field label="Site Name" value={company.site_name} />
                  <Field label="Plant" value={wo.plant_detail} />
                </div>
              </SectionCard>
            )}
            {billing.address && (
              <SectionCard icon={<Briefcase className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Billing Address">
                <div className="space-y-4">
                  <Field label="Title" value={billing.title} />
                  <Field label="Building" value={billing.building_name} />
                  <Field label="Address" value={billing.address} />
                  <Field label="GST" value={billing.gst_number} />
                  <Field label="PAN" value={billing.pan_number} />
                </div>
              </SectionCard>
            )}
          </div>
        </TabsContent>

        {/* ── WO Items ── */}
        <TabsContent value="items" className="mt-0">
          <SectionCard icon={<Briefcase className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Work Order Items">
            {inventories.length === 0 ? (
              <p className="text-gray-400 text-sm">No items found.</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#fcf5f5] hover:bg-[#fcf5f5]">
                        {['S.No', 'Service Name', 'BOQ Details', 'Unit', 'Qty', 'Rate (₹)', 'Total Value (₹)', 'Taxable Value (₹)', 'CGST %', 'CGST Amt', 'SGST %', 'SGST Amt', 'Tax Amt', 'WBS Code', 'Expected Date'].map(h => (
                          <TableHead key={h} className="font-semibold text-gray-700 text-xs whitespace-nowrap py-3">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventories.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-xs py-2">{item.sno || '-'}</TableCell>
                          <TableCell className="text-xs py-2 whitespace-nowrap font-medium">{item.service_name || item.description || '-'}</TableCell>
                          <TableCell className="text-xs py-2 max-w-[200px] truncate" title={item.boq_details}>{item.boq_details || '-'}</TableCell>
                          <TableCell className="text-xs py-2">{item.unit || item.uom || '-'}</TableCell>
                          <TableCell className="text-xs py-2">{fmt(item.quantity)}</TableCell>
                          <TableCell className="text-xs py-2">{fmt(item.rate)}</TableCell>
                          <TableCell className="text-xs py-2">{fmt(item.total_value || item.total_amount)}</TableCell>
                          <TableCell className="text-xs py-2">{fmt(item.taxable_value)}</TableCell>
                          <TableCell className="text-xs py-2">{fmt(item.cgst_rate)}</TableCell>
                          <TableCell className="text-xs py-2">{fmt(item.cgst_amount)}</TableCell>
                          <TableCell className="text-xs py-2">{fmt(item.sgst_rate)}</TableCell>
                          <TableCell className="text-xs py-2">{fmt(item.sgst_amount)}</TableCell>
                          <TableCell className="text-xs py-2">{fmt(item.tax_amount)}</TableCell>
                          <TableCell className="text-xs py-2">{item.wbs_code || '-'}</TableCell>
                          <TableCell className="text-xs py-2 whitespace-nowrap">{fmtDate(item.expected_date)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Totals row */}
                {totals.total_value && (
                  <div className="mt-4 flex justify-end">
                    <div className="bg-[#fcf5f5] rounded-lg p-4 text-sm space-y-2 min-w-[300px]">
                      <div className="flex justify-between gap-8"><span className="text-gray-500">Net Amount</span><span className="font-semibold">{fmtAmt(totals.net_amount)}</span></div>
                      <div className="flex justify-between gap-8"><span className="text-gray-500">Total Taxes</span><span className="font-semibold">{fmtAmt(totals.taxes)}</span></div>
                      <div className="flex justify-between gap-8 border-t pt-2"><span className="text-gray-700 font-bold">Total Value</span><span className="font-bold text-[#D92818]">{fmtAmt(totals.total_value)}</span></div>
                    </div>
                  </div>
                )}
              </>
            )}
          </SectionCard>
        </TabsContent>

        {/* ── Approval ── */}
        <TabsContent value="approval" className="mt-0">
          <SectionCard icon={<CheckCircle className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Approval Status">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              {[
                { label: 'PO Approve', val: approvalStatus.po_approve, by: approvalStatus.po_approved_by, at: approvalStatus.po_approved_at },
                { label: 'HSE Approve', val: approvalStatus.hse_approve, by: approvalStatus.hse_approved_by, at: approvalStatus.hse_approved_at },
                { label: 'Admin Approve', val: approvalStatus.admin_approve, by: approvalStatus.admin_approved_by, at: approvalStatus.admin_approved_at },
              ].map(({ label, val, by, at }) => (
                <div key={label} className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">{label}</p>
                  <ApprovalBadge status={val} />
                  {by && <p className="text-xs text-gray-700">By: {by}</p>}
                  {at && <p className="text-xs text-gray-500">At: {at}</p>}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t flex items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">Overall Approval:</span>
              <ApprovalBadge status={approvalStatus.all_level_approved} />
            </div>
          </SectionCard>
        </TabsContent>

        {/* ── Invoices ── */}
        {invoices.length > 0 && (
          <TabsContent value="invoices" className="mt-0">
            <SectionCard icon={<FileText className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="WO Invoices">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#fcf5f5] hover:bg-[#fcf5f5]">
                      {['Invoice No', 'Invoice Date', 'WO Amount', 'Invoice Amount', 'Payable Amount', 'Payment Status', 'Approval Status'].map(h => (
                        <TableHead key={h} className="font-semibold text-gray-700 text-xs whitespace-nowrap py-3">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((inv: any, i: number) => (
                      <TableRow key={inv.id ?? i}>
                        <TableCell className="text-xs py-2">{inv.invoice_number || '-'}</TableCell>
                        <TableCell className="text-xs py-2">{fmtDate(inv.invoice_date)}</TableCell>
                        <TableCell className="text-xs py-2">{fmtAmt(inv.wo_amount)}</TableCell>
                        <TableCell className="text-xs py-2">{fmtAmt(inv.total_invoice_amount)}</TableCell>
                        <TableCell className="text-xs py-2">{fmtAmt(inv.payable_amount)}</TableCell>
                        <TableCell className="text-xs py-2">{inv.payment_status || '-'}</TableCell>
                        <TableCell className="text-xs py-2">{inv.approved_status || 'Pending'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SectionCard>
          </TabsContent>
        )}

        {/* ── Payments ── */}
        {payments.length > 0 && (
          <TabsContent value="payments" className="mt-0">
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
                    {payments.map((p: any, i: number) => (
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
          </TabsContent>
        )}

        {/* ── Attachments ── */}
        <TabsContent value="attachments" className="mt-0">
          <SectionCard icon={<Paperclip className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Attachments">
            {attachments.length === 0 ? (
              <p className="text-gray-400 text-sm">No attachments found.</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {attachments.map((a: any, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-gray-400 shrink-0" />
                    <a href={a.url || a.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                      {a.filename || a.name || `Attachment ${i + 1}`}
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

export default VendorWODetailPage;
