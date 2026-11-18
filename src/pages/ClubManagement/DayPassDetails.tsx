import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Paperclip, Send, Wallet, X } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/utils/apiClient';
import { getApiErrorMessage } from './apiErrorMessage';
import {
  PASS_PAYMENT_LABEL,
  PASS_PAYMENT_STYLE,
  PASS_STATUS_LABEL,
  PASS_STATUS_STYLE,
  PassPayment,
  formatDate,
  passPaymentOf,
  passStatusOf,
  toAmount,
} from './dayPassUtils';

// A day pass is a club member of the Day Pass plan (GET /club_members/:id). When it was created through an allocation it
// has a bill: payment is marked against that bill and the invoice is that bill's PDF, exactly as for a club membership
// allocation (/club_member_allocations/:id/payment, /club_member_allocations/show_pdf).
interface PassMember {
  id: number;
  membership_number?: string | null;
  user_name?: string | null;
  user_email?: string | null;
  user_mobile?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string | null;
  club_member_allocation_id?: number | null;
  allocation_status?: string | null;
  allocation_amount?: number | null;
  plan_details?: { id: number; name: string; price?: number | string | null } | null;
  member_payment_detail?: { total_amount?: number | string | null; payment_mode?: string | null } | null;
}

interface BillCharge {
  id: number;
  name: string;
  amount?: number | string | null;
  cgst_amount?: number | string | null;
  sgst_amount?: number | string | null;
  discount?: number | string | null;
  total_amount?: number | string | null;
}

interface PassBill {
  id: number;
  bill_number?: string | null;
  status: string;
  total_amount: number | string;
  due_date?: string | null;
  lock_account_bill_charges?: BillCharge[];
}

interface PlanAmenity {
  id: number;
  facility_setup_id: number;
  facility_setup_name?: string | null;
  slot_limit?: number | null;
  can_book_after_slot_limit?: boolean;
}

interface PassBooking {
  id: number;
  facility_name?: string | null;
  startdate?: string | null;
  current_status?: string | null;
  amount_full?: number | string | null;
  payment_method?: string | null;
}

const money = (value: unknown) => `₹${toAmount(value).toFixed(2)}`;

const slotsLabel = (amenity: PlanAmenity) => {
  if (amenity.slot_limit === null || amenity.slot_limit === undefined) return 'Unlimited';
  if (amenity.slot_limit === 0) return amenity.can_book_after_slot_limit ? 'No free slots' : 'No slots';
  return `${amenity.slot_limit} slot${amenity.slot_limit === 1 ? '' : 's'}`;
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex gap-3 text-sm">
    <span className="text-gray-500 min-w-[130px]">{label}</span>
    <span className="text-gray-900 font-medium break-words">{children || '-'}</span>
  </div>
);

export const DayPassDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [member, setMember] = useState<PassMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [bills, setBills] = useState<PassBill[]>([]);
  const [amenities, setAmenities] = useState<PlanAmenity[]>([]);
  const [bookings, setBookings] = useState<PassBooking[]>([]);

  const [downloading, setDownloading] = useState(false);
  const [sendingInvoice, setSendingInvoice] = useState(false);

  // Payment dialog (the same fields as a club membership allocation's)
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState('online');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [paying, setPaying] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const response = await apiClient.get(`/club_members/${id}.json`);
      const loaded: PassMember = response.data?.club_member ?? response.data;
      setMember(loaded);

      const allocationId = loaded.club_member_allocation_id;
      const planId = loaded.plan_details?.id;
      const [billsResult, planResult, bookingsResult] = await Promise.allSettled([
        allocationId ? apiClient.get(`/club_member_allocations/${allocationId}/get_bill_by_allocation`) : Promise.resolve(null),
        planId ? apiClient.get(`/membership_plans/${planId}.json`) : Promise.resolve(null),
        allocationId ? apiClient.get(`/club_member_allocations/${allocationId}/facility_bookings`, { params: { per_page: 100 } }) : Promise.resolve(null),
      ]);

      const billData = billsResult.status === 'fulfilled' ? billsResult.value?.data : null;
      setBills(Array.isArray(billData) ? billData : []);
      setAmenities(planResult.status === 'fulfilled' ? planResult.value?.data?.plan_amenities || [] : []);

      // The allocation lists the holder's bookings of every date: only the pass date's belong to this pass.
      const allBookings: PassBooking[] = bookingsResult.status === 'fulfilled' ? bookingsResult.value?.data?.facility_bookings || [] : [];
      setBookings(allBookings.filter((booking) => booking.startdate?.slice(0, 10) === loaded.start_date));
    } catch (error) {
      setLoadError(getApiErrorMessage(error, 'Failed to load the day pass'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const bill = bills[0];
  const payment: PassPayment = member ? passPaymentOf(member) : 'untracked';
  const status = member ? passStatusOf(member) : 'today';
  const charges = bill?.lock_account_bill_charges || [];
  const sum = (key: 'amount' | 'cgst_amount' | 'sgst_amount' | 'discount') => charges.reduce((total, charge) => total + toAmount(charge[key]), 0);
  const total = bill ? toAmount(bill.total_amount) : toAmount(member?.allocation_amount ?? member?.member_payment_detail?.total_amount);
  const allocationId = member?.club_member_allocation_id;

  const resetPayment = () => {
    setPaymentMode('online');
    setPaymentMethod('');
    setTransactionId('');
    setAttachments([]);
  };

  const handlePayment = async () => {
    if (!bill || !allocationId) return;
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    setPaying(true);
    try {
      const formData = new FormData();
      formData.append('bill_id', String(bill.id));
      formData.append('payment[payment_mode]', paymentMode);
      formData.append('payment[payment_method]', paymentMethod);
      formData.append('payment[pg_transaction_id]', transactionId);
      attachments.forEach((file) => formData.append('attachments[]', file));

      await apiClient.post(`/club_member_allocations/${allocationId}/payment.json`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Payment recorded');
      setPaymentOpen(false);
      resetPayment();
      await load();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to record the payment'));
    } finally {
      setPaying(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!bill) return;
    setDownloading(true);
    try {
      const response = await apiClient.get('/club_member_allocations/show_pdf', {
        params: { lock_account_bill_id: bill.id },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${bill.bill_number || `DayPass_${member?.membership_number || bill.id}`}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to download the invoice'));
    } finally {
      setDownloading(false);
    }
  };

  const handleSendInvoice = async () => {
    if (!bill || !allocationId) return;
    setSendingInvoice(true);
    try {
      await apiClient.post(`/club_member_allocations/${allocationId}/send_invoice_mail.json`, { bill_id: bill.id });
      toast.success('Invoice sent successfully');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to send the invoice'));
    } finally {
      setSendingInvoice(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading day pass...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="p-6 min-h-screen text-center py-12">
        <p className="text-gray-600">{loadError || 'Day pass not found'}</p>
        <Button className="mt-4" onClick={() => navigate('/club-management/day-pass')}>
          Back to Day Passes
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/club-management/day-pass')}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold" style={{ color: 'var(--color-primary)' }}>
              Day Pass {member.membership_number}
            </h1>
            <Badge className={PASS_STATUS_STYLE[status]}>{PASS_STATUS_LABEL[status]}</Badge>
            <Badge className={PASS_PAYMENT_STYLE[payment]}>{PASS_PAYMENT_LABEL[payment]}</Badge>
          </div>
          <div className="flex flex-wrap gap-3">
            {payment === 'pending' && bill && (
              <Button className="bg-brand hover:bg-brand-hover text-white" onClick={() => setPaymentOpen(true)}>
                <Wallet className="w-4 h-4 mr-2" /> Mark Payment
              </Button>
            )}
            {bill && payment !== 'free' && (
              <Button variant="outline" onClick={handleDownloadInvoice} disabled={downloading}>
                <Download className="w-4 h-4 mr-2" /> {downloading ? 'Downloading...' : 'Download Invoice'}
              </Button>
            )}
            {payment === 'paid' && bill && (
              <Button variant="outline" onClick={handleSendInvoice} disabled={sendingInvoice}>
                <Send className="w-4 h-4 mr-2" /> {sendingInvoice ? 'Sending...' : 'Send Invoice'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-lg shadow-sm space-y-3">
          <h2 className="text-lg font-semibold">Pass holder</h2>
          <Field label="Name">{member.user_name}</Field>
          <Field label="Mobile">{member.user_mobile}</Field>
          <Field label="Email">{member.user_email}</Field>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm space-y-3">
          <h2 className="text-lg font-semibold">Pass details</h2>
          <Field label="Pass number">{member.membership_number}</Field>
          <Field label="Pass date">{formatDate(member.start_date)}</Field>
          <Field label="Plan">{member.plan_details?.name}</Field>
          <Field label="Created on">{formatDate(member.created_at)}</Field>
        </section>
      </div>

      {/* Payment and invoice */}
      <section className="bg-white p-6 rounded-lg shadow-sm space-y-3">
        <h2 className="text-lg font-semibold">Payment &amp; invoice</h2>
        {payment === 'untracked' && (
          <p className="text-sm text-gray-500">
            This pass was created before payments and invoices were tracked, so it has no bill to mark paid or invoice to download.
            {member.member_payment_detail?.total_amount !== undefined && member.member_payment_detail?.total_amount !== null
              ? ` Amount recorded: ${money(member.member_payment_detail.total_amount)}.`
              : ''}
          </p>
        )}
        {payment === 'free' && <p className="text-sm text-gray-500">This is a free pass: there is nothing to pay and no invoice.</p>}
        {bill && payment !== 'free' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="Invoice number">{bill.bill_number || 'Issued when the payment is marked'}</Field>
              <Field label="Bill status">{bill.status}</Field>
              <Field label="Due date">{formatDate(bill.due_date)}</Field>
            </div>
            <table className="w-full text-sm mt-2">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500">Price</td>
                  <td className="py-2 text-right">{money(sum('amount'))}</td>
                </tr>
                {sum('discount') > 0 && (
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-500">Discount</td>
                    <td className="py-2 text-right">-{money(sum('discount'))}</td>
                  </tr>
                )}
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500">CGST</td>
                  <td className="py-2 text-right">{money(sum('cgst_amount'))}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500">SGST</td>
                  <td className="py-2 text-right">{money(sum('sgst_amount'))}</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">Total</td>
                  <td className="py-2 text-right font-semibold text-brand">{money(total)}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </section>

      {/* What the pass covers */}
      <section className="bg-white p-6 rounded-lg shadow-sm space-y-3">
        <h2 className="text-lg font-semibold">Facilities included</h2>
        {amenities.length === 0 ? (
          <p className="text-sm text-gray-500">No facilities are set up on the Day Pass plan.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-2 font-medium">Facility</th>
                <th className="py-2 font-medium">Slots included</th>
                <th className="py-2 font-medium">After the limit</th>
              </tr>
            </thead>
            <tbody>
              {amenities.map((amenity) => (
                <tr key={amenity.id} className="border-b border-gray-100">
                  <td className="py-2">{amenity.facility_setup_name || `Facility ${amenity.facility_setup_id}`}</td>
                  <td className="py-2">{slotsLabel(amenity)}</td>
                  <td className="py-2">{amenity.can_book_after_slot_limit ? 'Bookable at the member rate' : 'Not bookable'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Bookings made on the pass date */}
      <section className="bg-white p-6 rounded-lg shadow-sm space-y-3">
        <h2 className="text-lg font-semibold">Bookings on the pass date</h2>
        {!allocationId ? (
          <p className="text-sm text-gray-500">Bookings are not listed for a pass created before payments were tracked.</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-gray-500">No facility has been booked with this pass yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-2 font-medium">Facility</th>
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100">
                  <td className="py-2">{booking.facility_name || '-'}</td>
                  <td className="py-2">{formatDate(booking.startdate)}</td>
                  <td className="py-2">{booking.current_status || '-'}</td>
                  <td className="py-2 text-right">{money(booking.amount_full)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Mark payment */}
      <Dialog
        open={paymentOpen}
        onOpenChange={(open) => {
          setPaymentOpen(open);
          if (!open) resetPayment();
        }}
      >
        <DialogContent className="sm:max-w-[560px] w-[95vw] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mark Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 px-1">
            <p className="text-sm text-gray-600">Amount to collect: <span className="font-semibold">{money(total)}</span></p>
            <div>
              <Label htmlFor="pass_payment_mode">Payment Mode</Label>
              <Select
                value={paymentMode}
                onValueChange={(value) => {
                  setPaymentMode(value);
                  setPaymentMethod('');
                }}
                disabled={paying}
              >
                <SelectTrigger className="w-full mt-1" id="pass_payment_mode">
                  <SelectValue placeholder="Select Payment Mode" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pass_payment_method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={paying}>
                <SelectTrigger className="w-full mt-1" id="pass_payment_method">
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {paymentMode === 'online' ? (
                    <>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                    </>
                  ) : (
                    <SelectItem value="offline">Offline</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pass_transaction_id">Transaction ID</Label>
              <Input
                id="pass_transaction_id"
                value={transactionId}
                onChange={(event) => setTransactionId(event.target.value)}
                placeholder="Enter Transaction ID"
                className="mt-1"
                disabled={paying}
              />
            </div>
            <div>
              <Label>Attachments</Label>
              <input
                ref={fileInput}
                type="file"
                multiple
                className="hidden"
                onChange={(event) => {
                  const picked = Array.from(event.target.files || []);
                  setAttachments((current) => [...current, ...picked]);
                  if (fileInput.current) fileInput.current.value = '';
                }}
              />
              <Button type="button" variant="outline" className="mt-1" disabled={paying} onClick={() => fileInput.current?.click()}>
                <Paperclip className="w-4 h-4 mr-2" /> Add files
              </Button>
              {attachments.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {attachments.map((file, index) => (
                    <li key={`${file.name}-${index}`} className="flex items-center justify-between rounded border border-gray-200 px-3 py-2 text-sm">
                      <span className="truncate">{file.name}</span>
                      <button
                        type="button"
                        title="Remove file"
                        disabled={paying}
                        className="ml-3 text-gray-400 hover:text-red-600"
                        onClick={() => setAttachments((current) => current.filter((_, i) => i !== index))}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPaymentOpen(false)} disabled={paying}>
              Cancel
            </Button>
            <Button type="button" className="bg-brand hover:bg-brand-hover text-white" onClick={handlePayment} disabled={paying}>
              {paying ? 'Processing...' : 'Submit Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DayPassDetails;
