import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShoppingCart, Package, Paperclip, CheckCircle } from 'lucide-react';
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
const fmtDate = (v?: string) => (v ? v.split('T')[0] : '-');
const fmtAmt = (v: any) => (v != null ? `₹ ${Number(v).toLocaleString('en-IN')}` : '-');

export const VendorPODetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [loading, setLoading] = useState(false);
  const [po, setPo] = useState<any>(null);

  useEffect(() => {
    if (!id || !baseUrl || !token) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://${baseUrl}/pms/purchase_orders/${id}.json`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPo(data.purchase_order || data);
      } catch {
        toast.error('Failed to load PO details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!po) return <div className="p-6 text-gray-500">No data found.</div>;

  const approvalStatus = po.all_level_approved === true ? 'Approved' : po.all_level_approved === false ? 'Rejected' : 'Pending';
  const inventories: any[] = po.pms_po_inventories || [];
  const grns: any[] = po.pms_grns || [];
  const approvalLevels: any[] = po.approval_levels || [];

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-[#fafafa]">
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">
          Vendor &gt; My PO &gt; <span className="text-gray-900 font-medium">PO Details</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold uppercase text-[#1a1a1a]">PO DETAILS</h1>
      </div>

      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="flex flex-wrap items-center justify-start gap-6 bg-transparent border-b border-gray-200 rounded-none p-0 h-auto w-full mb-6">
          <TabsTrigger value="basic-info" className={tabTriggerCls}>Basic Information</TabsTrigger>
          <TabsTrigger value="items" className={tabTriggerCls}>PO Items ({inventories.length})</TabsTrigger>
          <TabsTrigger value="grn" className={tabTriggerCls}>GRN ({grns.length})</TabsTrigger>
          <TabsTrigger value="approval" className={tabTriggerCls}>Approval</TabsTrigger>
          <TabsTrigger value="attachments" className={tabTriggerCls}>Attachments</TabsTrigger>
        </TabsList>

        {/* ── Basic Information ── */}
        <TabsContent value="basic-info" className="mt-0 space-y-6">
          <SectionCard icon={<ShoppingCart className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Purchase Order Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              <Field label="PO Number" value={po.external_id || po.po_number} />
              <Field label="Reference Number" value={fmt(po.reference_number)} />
              <Field label="PO Date" value={fmtDate(po.po_date)} />
              <Field label="Related To" value={po.related_to} />
              <Field label="PR Type" value={po.pr_type} />
              <Field label="Approval Status" value={approvalStatus} />
              <Field label="Amount" value={fmtAmt(po.amount)} />
              <Field label="Net Amount" value={fmtAmt(po.net_amount)} />
              <Field label="Total Taxable Amount" value={fmtAmt(po.total_taxable_amount)} />
              <Field label="Total Tax Amount" value={fmtAmt(po.total_tax_amount)} />
              <Field label="Total Amount" value={fmtAmt(po.total_amount)} />
              <Field label="Retention (%)" value={fmt(po.retention)} />
              <Field label="TDS (%)" value={fmt(po.tds)} />
              <Field label="QC (%)" value={fmt(po.quality_holding)} />
              <Field label="Payment Tenure (Days)" value={fmt(po.payment_tenure)} />
              <Field label="Advance Amount" value={fmtAmt(po.advance_amount)} />
              <Field label="Created By" value={po.created_by} />
              <Field label="Created On" value={fmtDate(po.created_at)} />
              <div className="flex items-start text-sm md:col-span-2">
                <span className="text-gray-500 w-[200px] shrink-0">Terms & Conditions</span>
                <span className="text-gray-900 font-medium flex-1">: {po.terms_conditions || '-'}</span>
              </div>
              <div className="flex items-start text-sm md:col-span-2">
                <span className="text-gray-500 w-[200px] shrink-0">Amount in Words</span>
                <span className="text-gray-900 font-medium flex-1">: {po.amount_in_words || '-'}</span>
              </div>
            </div>
          </SectionCard>

          {/* Supplier */}
          {po.supplier && (
            <SectionCard icon={<ShoppingCart className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Supplier Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                <Field label="Company Name" value={po.supplier.company_name} />
                <Field label="Email" value={po.supplier.email} />
                <Field label="Mobile" value={po.supplier.mobile1} />
                <Field label="PAN Number" value={po.supplier.pan_number} />
                <Field label="GSTIN" value={po.supplier.gstin_number} />
                <Field label="City" value={po.supplier.city} />
                <div className="flex items-start text-sm md:col-span-2">
                  <span className="text-gray-500 w-[200px] shrink-0">Address</span>
                  <span className="text-gray-900 font-medium flex-1">: {po.supplier.formatted_address || po.supplier.address || '-'}</span>
                </div>
              </div>
            </SectionCard>
          )}

          {/* Site / Plant / Billing / Shipping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {po.site && (
              <SectionCard icon={<ShoppingCart className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Site & Plant">
                <div className="space-y-4">
                  <Field label="Site" value={po.site.name} />
                  <Field label="Plant" value={po.plant_detail?.plant_name} />
                </div>
              </SectionCard>
            )}
            {po.billing_address && (
              <SectionCard icon={<ShoppingCart className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Billing Address">
                <div className="space-y-4">
                  <Field label="Title" value={po.billing_address.title} />
                  <Field label="Building" value={po.billing_address.building_name} />
                  <Field label="Address" value={po.billing_address.address} />
                  <Field label="GST" value={po.billing_address.gst_number} />
                  <Field label="PAN" value={po.billing_address.pan_number} />
                </div>
              </SectionCard>
            )}
          </div>
        </TabsContent>

        {/* ── PO Items ── */}
        <TabsContent value="items" className="mt-0">
          <SectionCard icon={<Package className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="PO Items">
            {inventories.length === 0 ? (
              <p className="text-gray-400 text-sm">No items found.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#fcf5f5] hover:bg-[#fcf5f5]">
                      {['Item No', 'Inventory', 'Code', 'Unit', 'Qty', 'Rate', 'Total Value', 'Taxable Value', 'CGST%', 'CGST Amt', 'SGST%', 'SGST Amt', 'SAC/HSN', 'WBS Code', 'Expected Date'].map(h => (
                        <TableHead key={h} className="font-semibold text-gray-700 text-xs whitespace-nowrap py-3">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventories.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-xs py-2">{item.item_no || '-'}</TableCell>
                        <TableCell className="text-xs py-2 whitespace-nowrap">{item.inventory?.name || '-'}</TableCell>
                        <TableCell className="text-xs py-2">{item.inventory?.code || '-'}</TableCell>
                        <TableCell className="text-xs py-2">{item.unit || '-'}</TableCell>
                        <TableCell className="text-xs py-2">{item.quantity}</TableCell>
                        <TableCell className="text-xs py-2">{item.rate}</TableCell>
                        <TableCell className="text-xs py-2">{item.total_value}</TableCell>
                        <TableCell className="text-xs py-2">{item.taxable_value}</TableCell>
                        <TableCell className="text-xs py-2">{item.cgst_rate ?? '-'}</TableCell>
                        <TableCell className="text-xs py-2">{item.cgst_amount ?? '-'}</TableCell>
                        <TableCell className="text-xs py-2">{item.sgst_rate ?? '-'}</TableCell>
                        <TableCell className="text-xs py-2">{item.sgst_amount ?? '-'}</TableCell>
                        <TableCell className="text-xs py-2">{item.sac_hsn_code || '-'}</TableCell>
                        <TableCell className="text-xs py-2">{item.wbs_code || '-'}</TableCell>
                        <TableCell className="text-xs py-2 whitespace-nowrap">{fmtDate(item.expected_date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        {/* ── GRN ── */}
        <TabsContent value="grn" className="mt-0 space-y-6">
          {grns.length === 0 ? (
            <p className="text-gray-400 text-sm p-4">No GRNs linked to this PO.</p>
          ) : (
            grns.map((grn: any) => (
              <SectionCard key={grn.id} icon={<Package className="w-5 h-5" style={{ color: '#eb5e28' }} />} title={`GRN #${grn.id} — ${grn.invoice_no || '-'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 text-sm mb-6">
                  <Field label="Invoice No" value={grn.invoice_no} />
                  <Field label="Posting Date" value={fmtDate(grn.posting_date)} />
                  <Field label="Bill Date" value={fmtDate(grn.bill_date)} />
                  <Field label="Amount" value={fmtAmt(grn.amount)} />
                  <Field label="Payable Amount" value={fmtAmt(grn.payable_amount)} />
                  <Field label="Retention Amount" value={fmtAmt(grn.retention_amount)} />
                  <Field label="TDS Amount" value={fmtAmt(grn.tds_amount)} />
                  <Field label="Payment Status" value={grn.payment_status} />
                  <Field label="Payment Mode" value={grn.payment_mod} />
                  <Field label="Created By" value={grn.creator_name} />
                  <Field label="QC Approval" value={grn.qc_approval_status} />
                  <Field label="HSE Approval" value={grn.hse_approval_status} />
                </div>
                {grn.grn_inventories?.length > 0 && (
                  <div className="overflow-x-auto">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Inventory Items</p>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#fcf5f5] hover:bg-[#fcf5f5]">
                          {['Inventory', 'Expected Qty', 'Received Qty', 'Approved Qty', 'Rate', 'Total Value', 'Taxable', 'CGST%', 'CGST Amt', 'SGST%', 'SGST Amt'].map(h => (
                            <TableHead key={h} className="font-semibold text-gray-700 text-xs whitespace-nowrap py-2">{h}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {grn.grn_inventories.map((inv: any) => (
                          <TableRow key={inv.id}>
                            <TableCell className="text-xs py-2 whitespace-nowrap">{inv.inventory_name}</TableCell>
                            <TableCell className="text-xs py-2">{inv.expected_quantity}</TableCell>
                            <TableCell className="text-xs py-2">{inv.received_quantity}</TableCell>
                            <TableCell className="text-xs py-2">{inv.approved_qty}</TableCell>
                            <TableCell className="text-xs py-2">{inv.rate}</TableCell>
                            <TableCell className="text-xs py-2">{inv.total_value}</TableCell>
                            <TableCell className="text-xs py-2">{inv.taxable_value}</TableCell>
                            <TableCell className="text-xs py-2">{inv.cgst_rate}</TableCell>
                            <TableCell className="text-xs py-2">{inv.cgst_amount}</TableCell>
                            <TableCell className="text-xs py-2">{inv.sgst_rate}</TableCell>
                            <TableCell className="text-xs py-2">{inv.sgst_amount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </SectionCard>
            ))
          )}
        </TabsContent>

        {/* ── Approval ── */}
        <TabsContent value="approval" className="mt-0">
          <SectionCard icon={<CheckCircle className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Approval Information">
            {approvalLevels.length === 0 ? (
              <p className="text-gray-400 text-sm">No approval levels defined.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#fcf5f5] hover:bg-[#fcf5f5]">
                      {['Level', 'Name', 'Approved By', 'Status', 'Date'].map(h => (
                        <TableHead key={h} className="font-semibold text-gray-700 text-xs py-3">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvalLevels.map((lvl: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs py-2">{lvl.level || i + 1}</TableCell>
                        <TableCell className="text-xs py-2">{lvl.name || lvl.level_name || '-'}</TableCell>
                        <TableCell className="text-xs py-2">{lvl.approved_by || '-'}</TableCell>
                        <TableCell className="text-xs py-2">{lvl.status || '-'}</TableCell>
                        <TableCell className="text-xs py-2">{fmtDate(lvl.approved_at || lvl.date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        {/* ── Attachments ── */}
        <TabsContent value="attachments" className="mt-0">
          <SectionCard icon={<Paperclip className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Attachments">
            {po.attachments?.length ? (
              <ul className="space-y-2 text-sm">
                {po.attachments.map((a: any, i: number) => (
                  <li key={i}>
                    <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      {a.filename || a.name || `Attachment ${i + 1}`}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">No attachments found.</p>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorPODetailPage;
