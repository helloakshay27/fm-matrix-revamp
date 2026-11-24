import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Mail, Paperclip, Phone, Send, User, Wallet, X } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/utils/apiClient';
import { getApiErrorMessage } from './apiErrorMessage';
import {
  PASS_PAYMENT_LABEL,
  PASS_PAYMENT_STYLE,
  PASS_STATUS_LABEL,
  PASS_STATUS_STYLE,
  PAYMENT_MODES,
  PassPayment,
  formatDate,
  passPaymentOf,
  passStatusOf,
  paymentLabel,
  paymentMethodsFor,
  toAmount,
} from './dayPassUtils';

// A day pass is a club member allocation of the Day Pass plan, for one or more people (one club member each). The page
// is opened through any of its people (GET /club_members/:id); when the pass was created through an allocation it has a
// bill: payment is marked against that bill and the invoice is that bill's PDF, exactly as for a club membership
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
  allocation_payment_method?: string | null;
  plan_details?: { id: number; name: string; price?: number | string | null } | null;
  member_payment_detail?: { total_amount?: number | string | null; payment_mode?: string | null } | null;
}

interface AllocationPaymentDetail {
  base_amount?: number | string | null;
  cgst?: number | string | null;
  sgst?: number | string | null;
  total_tax?: number | string | null;
  total_amount?: number | string | null;
  payment_mode?: string | null;
  payment_method?: string | null; // prepaid / pay_at_facility / complementary
  payment_status?: string | null;
  notes?: string | null; // the reason, for a complementary pass
}

interface PassAllocation {
  id: number;
  status?: string | null;
  club_members?: PassMember[];
  allocation_payment_detail?: AllocationPaymentDetail | null;
}

interface BillCharge {
  id: number;
  name: string;
  amount?: number | string | null;
  cgst_amount?: number | string | null;
  sgst_amount?: number | string | null;
  discount?: number | string | null;
  total_amount?: number | string | null;
  quantity?: number | string | null;
  rate?: number | string | null;
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
  user_name?: string | null; // which of the pass's people booked it
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
    <span className="text-gray-500 min-w-[150px]">{label}</span>
    <span className="text-gray-900 font-medium break-words">{children || '-'}</span>
  </div>
);

const tabClass =
  'flex-1 min-w-0 bg-white data-[state=active]:bg-brand-selected px-3 py-2 data-[state=active]:text-brand border-r border-gray-200 last:border-r-0';

const billIsPaid = (bill: PassBill) => bill.status?.toLowerCase() === 'paid';

export const DayPassDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [member, setMember] = useState<PassMember | null>(null);
  const [allocation, setAllocation] = useState<PassAllocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [bills, setBills] = useState<PassBill[]>([]);
  const [amenities, setAmenities] = useState<PlanAmenity[]>([]);
  const [bookings, setBookings] = useState<PassBooking[]>([]);

  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [sendingInvoice, setSendingInvoice] = useState(false);

  // Payment dialog (the same fields as a club membership allocation's), started from how the pass was to be paid
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
      const [allocationResult, billsResult, planResult, bookingsResult] = await Promise.allSettled([
        allocationId ? apiClient.get(`/club_member_allocations/${allocationId}.json`) : Promise.resolve(null),
        allocationId ? apiClient.get(`/club_member_allocations/${allocationId}/get_bill_by_allocation.json`) : Promise.resolve(null),
        planId ? apiClient.get(`/membership_plans/${planId}.json`) : Promise.resolve(null),
        allocationId ? apiClient.get(`/club_member_allocations/${allocationId}/facility_bookings.json`, { params: { per_page: 100 } }) : Promise.resolve(null),
      ]);

      const allocationData = allocationResult.status === 'fulfilled' ? allocationResult.value?.data : null;
      setAllocation(allocationData ? (allocationData.club_member_allocation ?? allocationData) : null);

      const billData = billsResult.status === 'fulfilled' ? billsResult.value?.data : null;
      setBills(Array.isArray(billData) ? billData : []);
      setAmenities(planResult.status === 'fulfilled' ? planResult.value?.data?.plan_amenities || [] : []);

      // The allocation lists the holders' bookings of every date: only the pass date's belong to this pass.
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

  const detail = allocation?.allocation_payment_detail ?? null;
  const people: PassMember[] = allocation?.club_members?.length ? allocation.club_members : member ? [member] : [];
  const bill = bills.find((candidate) => !billIsPaid(candidate)) ?? bills[0];
  const payment: PassPayment = member ? passPaymentOf(member) : 'untracked';
  const status = member ? passStatusOf(member) : 'today';
  const charges = bills.flatMap((candidate) => candidate.lock_account_bill_charges || []);
  const sum = (key: 'amount' | 'cgst_amount' | 'sgst_amount' | 'discount') => charges.reduce((total, charge) => total + toAmount(charge[key]), 0);
  const total = bill ? toAmount(bill.total_amount) : toAmount(member?.allocation_amount ?? member?.member_payment_detail?.total_amount);
  const allocationId = member?.club_member_allocation_id;
  const pricePerPerson = toAmount(member?.plan_details?.price);

  const resetPayment = useCallback(() => {
    const mode = detail?.payment_mode || 'online';
    const expected = detail?.payment_method || '';
    setPaymentMode(mode);
    setPaymentMethod(paymentMethodsFor(mode).some((option) => option.value === expected) ? expected : '');
    setTransactionId('');
    setAttachments([]);
  }, [detail?.payment_mode, detail?.payment_method]);

  const openPayment = () => {
    resetPayment();
    setPaymentOpen(true);
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
      await load();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to record the payment'));
    } finally {
      setPaying(false);
    }
  };

  const handleDownloadInvoice = async (target: PassBill) => {
    setDownloadingId(target.id);
    try {
      const response = await apiClient.get('/club_member_allocations/show_pdf', {
        params: { lock_account_bill_id: target.id },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${target.bill_number || `DayPass_${member?.membership_number || target.id}`}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to download the invoice'));
    } finally {
      setDownloadingId(null);
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

  const peopleLabel = `${people.length} ${people.length === 1 ? 'person' : 'people'}`;
  // Nothing to pay and no invoice to show (a free plan's or a complementary pass's bill is for ₹0).
  const nothingToPay = payment === 'free' || payment === 'complementary';

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
          <span>Back to Day Passes</span>
        </button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-semibold" style={{ color: 'var(--color-primary)' }}>
                Day Pass {member.membership_number}
              </h1>
              <Badge className={PASS_STATUS_STYLE[status]}>{PASS_STATUS_LABEL[status]}</Badge>
              <Badge className={PASS_PAYMENT_STYLE[payment]}>{PASS_PAYMENT_LABEL[payment]}</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {peopleLabel} • {formatDate(member.start_date)} • {payment === 'complementary' ? 'Complementary' : money(total)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {payment === 'pending' && bill && !billIsPaid(bill) && (
              <Button className="bg-brand hover:bg-brand-hover text-white" onClick={openPayment}>
                <Wallet className="w-4 h-4 mr-2" /> Mark Payment
              </Button>
            )}
            {bill && !nothingToPay && (
              <Button variant="outline" onClick={() => handleDownloadInvoice(bill)} disabled={downloadingId === bill.id}>
                <Download className="w-4 h-4 mr-2" /> {downloadingId === bill.id ? 'Downloading...' : 'Download Invoice'}
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

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch">
            <TabsTrigger value="overview" className={tabClass}>Pass Overview</TabsTrigger>
            <TabsTrigger value="people" className={tabClass}>People ({people.length})</TabsTrigger>
            <TabsTrigger value="payment" className={tabClass}>Payment Details</TabsTrigger>
            <TabsTrigger value="bill" className={tabClass}>Bill Details</TabsTrigger>
            <TabsTrigger value="facilities" className={tabClass}>Facilities</TabsTrigger>
            <TabsTrigger value="bookings" className={tabClass}>Bookings ({bookings.length})</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="p-4 sm:p-6 space-y-3">
            <h2 className="text-lg font-semibold mb-2">Pass details</h2>
            <Field label="Pass number">{member.membership_number}</Field>
            <Field label="Pass date">{formatDate(member.start_date)}</Field>
            <Field label="Plan">{member.plan_details?.name}</Field>
            <Field label="People">{peopleLabel}</Field>
            <Field label="Total">{money(total)}</Field>
            <Field label="Payment method">{detail?.payment_method ? paymentLabel(detail.payment_method) : '-'}</Field>
            <Field label="Payment">{PASS_PAYMENT_LABEL[payment]}</Field>
            {bill && !nothingToPay && (
              <Field label="Invoice">
                {bill.bill_number || 'Created, number issued when the payment is marked'} • {money(bill.total_amount)} •{' '}
                {bill.status} • Due {formatDate(bill.due_date)}
              </Field>
            )}
            <Field label="Created on">{formatDate(member.created_at)}</Field>
          </TabsContent>

          {/* People on the pass */}
          <TabsContent value="people" className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-3">
              <User className="w-5 h-5 text-brand" />
              People on this pass
            </h2>
            <div className="space-y-3">
              {people.map((person, index) => (
                <div key={person.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-brand text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{person.user_name || '-'}</h3>
                      <p className="text-sm text-gray-500">Pass no. {person.membership_number || '-'}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          <Mail className="w-3 h-3 inline mr-1" />
                          {person.user_email || '-'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <Phone className="w-3 h-3 inline mr-1" />
                          {person.user_mobile || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Price, tax and how it is paid */}
          <TabsContent value="payment" className="p-4 sm:p-6 space-y-4">
            <h2 className="text-lg font-semibold">Payment details</h2>
            {payment === 'untracked' && (
              <p className="text-sm text-gray-500">
                This pass was created before payments and invoices were tracked, so it has no bill to mark paid or invoice to download.
                {member.member_payment_detail?.total_amount !== undefined && member.member_payment_detail?.total_amount !== null
                  ? ` Amount recorded: ${money(member.member_payment_detail.total_amount)}.`
                  : ''}
              </p>
            )}
            {payment === 'free' && <p className="text-sm text-gray-500">This is a free pass: there is nothing to pay and no invoice.</p>}
            {payment === 'complementary' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">This is a complementary pass: nothing is charged and there is no invoice to pay.</p>
                <Field label="Payment method">Complementary</Field>
                <Field label="Reason">{detail?.notes}</Field>
              </div>
            )}
            {payment !== 'untracked' && !nothingToPay && (
              <>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">Price per person</td>
                      <td className="py-2 text-right">{money(pricePerPerson)}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">People</td>
                      <td className="py-2 text-right">× {people.length}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">Subtotal</td>
                      <td className="py-2 text-right">{money(charges.length ? sum('amount') : detail?.base_amount)}</td>
                    </tr>
                    {sum('discount') > 0 && (
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-500">Discount</td>
                        <td className="py-2 text-right">-{money(sum('discount'))}</td>
                      </tr>
                    )}
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">CGST</td>
                      <td className="py-2 text-right">{money(charges.length ? sum('cgst_amount') : detail?.cgst)}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">SGST</td>
                      <td className="py-2 text-right">{money(charges.length ? sum('sgst_amount') : detail?.sgst)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">Total</td>
                      <td className="py-2 text-right font-semibold text-brand">{money(total)}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <Field label="Payment method">{paymentLabel(detail?.payment_method)}</Field>
                  <Field label="Payment status">{PASS_PAYMENT_LABEL[payment]}</Field>
                  {payment === 'paid' && <Field label="Paid via">{paymentLabel(detail?.payment_mode)}</Field>}
                </div>
              </>
            )}
          </TabsContent>

          {/* Bills / invoices */}
          <TabsContent value="bill" className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-brand" />
              Bill Details
            </h2>
            {bills.length === 0 || nothingToPay ? (
              <p className="text-gray-500 text-center py-8">
                {payment === 'complementary'
                  ? 'A complementary pass has no invoice.'
                  : payment === 'free'
                    ? 'A free pass has no invoice.'
                    : 'No bill details available'}
              </p>
            ) : (
              <div className="space-y-3">
                {bills.map((candidate) => {
                  const paid = billIsPaid(candidate);
                  const quantity = toAmount(candidate.lock_account_bill_charges?.[0]?.quantity);
                  return (
                    <div key={candidate.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {candidate.bill_number ? `Bill #${candidate.bill_number}` : 'Pending invoice'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Due: {formatDate(candidate.due_date)}
                            {quantity > 1 ? ` • ${quantity} people` : ''}
                          </p>
                          {!candidate.bill_number && (
                            <p className="text-xs text-gray-500 mt-1">The invoice number is issued when the payment is marked.</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="font-semibold text-gray-900">{money(candidate.total_amount)}</p>
                          <Badge
                            className={`capitalize ${paid ? 'bg-brand-success-bg text-brand-success border-transparent' : 'bg-brand-warning-light text-gray-800 border-transparent'}`}
                          >
                            {candidate.status}
                          </Badge>
                          <div className="flex gap-2">
                            {!paid && payment === 'pending' && (
                              <Button size="sm" className="bg-brand hover:bg-brand-hover text-white" onClick={openPayment}>
                                <Wallet className="w-4 h-4 mr-1" /> Mark Payment
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadInvoice(candidate)}
                              disabled={downloadingId === candidate.id}
                            >
                              <Download className="w-4 h-4 mr-1" /> {downloadingId === candidate.id ? 'Downloading...' : 'Invoice'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* What the pass covers */}
          <TabsContent value="facilities" className="p-4 sm:p-6 space-y-3">
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
          </TabsContent>

          {/* Bookings made on the pass date */}
          <TabsContent value="bookings" className="p-4 sm:p-6 space-y-3">
            <h2 className="text-lg font-semibold">Bookings on the pass date</h2>
            {!allocationId ? (
              <p className="text-sm text-gray-500">Bookings are not listed for a pass created before payments were tracked.</p>
            ) : bookings.length === 0 ? (
              <p className="text-sm text-gray-500">No facility has been booked with this pass yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="py-2 font-medium">Booking</th>
                    <th className="py-2 font-medium">Person</th>
                    <th className="py-2 font-medium">Facility</th>
                    <th className="py-2 font-medium">Date</th>
                    <th className="py-2 font-medium">Status</th>
                    <th className="py-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/club-management/amenities-booking-club/${booking.id}`)}
                    >
                      <td className="py-2 text-brand">#{booking.id}</td>
                      <td className="py-2">{booking.user_name || '-'}</td>
                      <td className="py-2">{booking.facility_name || '-'}</td>
                      <td className="py-2">{formatDate(booking.startdate)}</td>
                      <td className="py-2">{booking.current_status || '-'}</td>
                      <td className="py-2 text-right">{money(booking.amount_full)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Mark payment */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="sm:max-w-[560px] w-[95vw] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mark Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 px-1">
            <p className="text-sm text-gray-600">
              Amount to collect: <span className="font-semibold">{money(total)}</span> ({peopleLabel})
            </p>
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
                  {PAYMENT_MODES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
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
                  {paymentMethodsFor(paymentMode).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
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
