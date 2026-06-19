import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, Paperclip } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start">
    <span className="text-gray-500 w-[200px] shrink-0">{label}</span>
    <span className="text-gray-900 font-medium break-words w-full">: {value || '-'}</span>
  </div>
);

const tabTriggerCls =
  'rounded-none border-b-2 border-transparent data-[state=active]:border-[#D92818] data-[state=active]:text-[#D92818] data-[state=active]:bg-transparent px-2 py-3 font-semibold text-gray-500 hover:text-gray-700 data-[state=inactive]:shadow-none transition-none focus-visible:ring-0 focus-visible:outline-none';

export const VendorOtherBillDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState<any>(null);

  useEffect(() => {
    if (!id || !baseUrl || !token) return;
    const fetch_ = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://${baseUrl}/pms/bills/${id}.json`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch bill details');
        const data = await res.json();
        setBill(data.bill || data);
      } catch (e) {
        toast.error('Failed to load bill details');
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!bill) return <div className="p-6 text-gray-500">No data found.</div>;

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-[#fafafa]">
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">
          Vendor &gt; Other Bills &gt; <span className="text-gray-900 font-medium">Bill Details</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold uppercase text-[#1a1a1a]">BILL DETAILS</h1>
      </div>

      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="flex items-center justify-start gap-6 bg-transparent border-b border-gray-200 rounded-none p-0 h-auto w-full mb-6">
          <TabsTrigger value="basic-info" className={tabTriggerCls}>Basic Information</TabsTrigger>
          <TabsTrigger value="attachments" className={tabTriggerCls}>Attachments</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info" className="mt-0">
          <Card className="w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden">
            <CardHeader className="bg-white pb-4 border-b border-gray-100">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#f0e8dc]">
                  <Receipt className="w-5 h-5" style={{ color: '#eb5e28' }} />
                </div>
                <span className="uppercase tracking-wide" style={{ color: '#eb5e28' }}>Bill Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm">
                <DetailRow label="Description" value={bill.description} />
                <DetailRow label="Supplier" value={bill.supplier_name || bill.supplier} />
                <DetailRow label="Amount" value={String(bill.amount || bill.bill_amount || '')} />
                <DetailRow label="Deduction" value={String(bill.deduction ?? '')} />
                <DetailRow label="TDS (%)" value={String(bill.tds_percent || bill.tds_percentage || '')} />
                <DetailRow label="TDS Amount" value={String(bill.tds_amount ?? '')} />
                <DetailRow label="Retention (%)" value={String(bill.retention_percent || bill.retention_percentage || '')} />
                <DetailRow label="Retention Amount" value={String(bill.retention_amount ?? '')} />
                <DetailRow label="Payable Amount" value={String(bill.payable_amount ?? '')} />
                <DetailRow label="Bill Date" value={bill.bill_date} />
                <DetailRow label="Invoice Number" value={bill.invoice_number} />
                <DetailRow label="Payment Tenure (Days)" value={String(bill.payment_tenure ?? '')} />
                <DetailRow label="Last Approved By" value={bill.last_approved_by} />
                <DetailRow label="Amount Paid" value={String(bill.amount_paid ?? '')} />
                <DetailRow label="Balance Amount" value={String(bill.balance_amount ?? '')} />
                <DetailRow label="Payment Status" value={bill.payment_status} />
                <DetailRow label="Created On" value={bill.created_at?.split('T')[0]} />
                <DetailRow label="Created By" value={bill.created_by} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments" className="mt-0">
          <Card className="w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden">
            <CardHeader className="bg-white pb-4 border-b border-gray-100">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#f0e8dc]">
                  <Paperclip className="w-5 h-5" style={{ color: '#eb5e28' }} />
                </div>
                <span className="uppercase tracking-wide" style={{ color: '#eb5e28' }}>Attachments</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white min-h-[100px]">
              {bill.attachments?.length ? (
                <ul className="space-y-2 text-sm">
                  {bill.attachments.map((a: any, i: number) => (
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorOtherBillDetailPage;
