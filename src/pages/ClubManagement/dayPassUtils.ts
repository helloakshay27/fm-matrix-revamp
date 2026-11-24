// Shared by the Day Pass list and detail pages.

export type PassStatus = 'today' | 'upcoming' | 'past';

export const todayString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// 'YYYY-MM-DD...' -> 'DD/MM/YYYY' without going through Date (no timezone shift).
export const formatDate = (value?: string | null) => {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : '-';
};

// Where a pass stands on the calendar: its date is today, still to come, or gone.
export const passStatusOf = (pass: { start_date?: string | null; end_date?: string | null }): PassStatus => {
  const today = todayString();
  if (pass.start_date && pass.start_date > today) return 'upcoming';
  if (pass.end_date && pass.end_date < today) return 'past';
  return 'today';
};

export const PASS_STATUS_LABEL: Record<PassStatus, string> = { today: 'Valid today', upcoming: 'Upcoming', past: 'Expired' };
export const PASS_STATUS_STYLE: Record<PassStatus, string> = {
  today: 'bg-brand-success-bg text-brand-success border-transparent',
  upcoming: 'bg-brand-selected text-brand border-transparent',
  past: 'bg-gray-100 text-gray-600 border-transparent',
};

// Where a pass's payment stands. 'untracked': made before payments were tracked, so it has no bill or invoice.
export type PassPayment = 'paid' | 'pending' | 'free' | 'complementary' | 'untracked';

export const PASS_PAYMENT_LABEL: Record<PassPayment, string> = {
  paid: 'Paid',
  pending: 'Payment pending',
  free: 'Free',
  complementary: 'Complementary',
  untracked: 'No invoice',
};
export const PASS_PAYMENT_STYLE: Record<PassPayment, string> = {
  paid: 'bg-brand-success-bg text-brand-success border-transparent',
  pending: 'bg-brand-warning-light text-gray-800 border-transparent',
  free: 'bg-gray-100 text-gray-600 border-transparent',
  complementary: 'bg-brand-selected text-brand border-transparent',
  untracked: 'bg-gray-100 text-gray-500 border-transparent',
};

// How a pass is to be paid, chosen when it is created (like a facility booking's payment method):
// prepaid / pay at facility are charged at the plan's price and billed as pending until the payment is marked;
// a complementary pass is given free, with a reason.
export const DAY_PASS_PAYMENT_METHODS = [
  { value: 'prepaid', label: 'Prepaid' },
  { value: 'pay_at_facility', label: 'Pay at Facility' },
  { value: 'complementary', label: 'Complementary' },
];

// How a payment is made, asked when it is marked: the same choices as the Mark Payment dialog of a club membership
// allocation.
export const PAYMENT_MODES = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
];

export const paymentMethodsFor = (mode: string) =>
  mode === 'offline'
    ? [{ value: 'offline', label: 'Offline' }]
    : [
        { value: 'upi', label: 'UPI' },
        { value: 'card', label: 'Card' },
        { value: 'cash', label: 'Cash' },
        { value: 'netbanking', label: 'Net Banking' },
      ];

export const paymentLabel = (value?: string | null) =>
  [...DAY_PASS_PAYMENT_METHODS, ...PAYMENT_MODES, ...paymentMethodsFor('online'), ...paymentMethodsFor('offline')].find(
    (option) => option.value === value
  )?.label ||
  value ||
  '-';

export const toAmount = (value: unknown) => {
  const parsed = parseFloat(String(value ?? ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

// From what the members API says of a pass: allocation_status ('approved' once paid, or at once when free) and
// allocation_amount (null without an allocation).
export const passPaymentOf = (pass: {
  club_member_allocation_id?: number | null;
  allocation_status?: string | null;
  allocation_amount?: number | null;
  allocation_payment_method?: string | null;
}): PassPayment => {
  if (!pass.club_member_allocation_id) return 'untracked';
  if (pass.allocation_payment_method === 'complementary') return 'complementary';
  if (!toAmount(pass.allocation_amount)) return 'free';
  return pass.allocation_status === 'approved' ? 'paid' : 'pending';
};
