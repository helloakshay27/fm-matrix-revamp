import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Ticket, Trash2 } from 'lucide-react';
import { MenuItem, TextField } from '@mui/material';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { apiClient } from '@/utils/apiClient';
import { getApiErrorMessage } from './apiErrorMessage';
import { DAY_PASS_PAYMENT_METHODS } from './dayPassUtils';

interface PlanAmenity {
  id: number;
  facility_setup_id: number;
  facility_setup_name?: string | null;
  slot_limit?: number | null; // null = unlimited, 0 = no included slots
  can_book_after_slot_limit?: boolean;
}

// The site's one-day plan: GET /membership_plans/day_pass finds it, or creates it on first use.
interface DayPassPlan {
  id: number;
  name: string;
  price?: number | string | null;
  cgst?: number | string | null;
  sgst?: number | string | null;
  site?: { id: number } | null;
  plan_amenities?: PlanAmenity[];
}

interface HolderOption {
  id: number;
  name?: string;
  firstname?: string;
  lastname?: string;
  mobile?: string;
}

// One person on the pass: someone new (their details are entered) or an existing user (picked from the list).
interface PassPerson {
  key: number;
  mode: 'new' | 'existing';
  userId: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  gender: string;
}

type BlockReason = 'membership' | 'day_pass';

const BLOCK_REASON_LABEL: Record<BlockReason, string> = {
  membership: 'has a club membership on this date',
  day_pass: 'already has a day pass for this date',
};

let nextPersonKey = 0;
const blankPerson = (): PassPerson => ({
  key: ++nextPersonKey,
  mode: 'new',
  userId: '',
  firstName: '',
  lastName: '',
  mobile: '',
  email: '',
  gender: '',
});

const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    height: { xs: '36px', sm: '45px' },
    '& fieldset': { borderColor: '#d1d5db' },
    '&:hover fieldset': { borderColor: '#9ca3af' },
    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
  },
  '& .MuiInputLabel-root': { '&.Mui-focused': { color: '#3b82f6' } },
};

const today = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
};

const toNumber = (value: unknown) => {
  const parsed = parseFloat(String(value ?? ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const slotsLabel = (amenity: PlanAmenity) => {
  if (amenity.slot_limit === null || amenity.slot_limit === undefined) return 'Unlimited';
  if (amenity.slot_limit === 0) return amenity.can_book_after_slot_limit ? 'No free slots' : 'No slots';
  return `${amenity.slot_limit} slot${amenity.slot_limit === 1 ? '' : 's'}`;
};

export const AddDayPassPage = () => {
  const navigate = useNavigate();

  const [plan, setPlan] = useState<DayPassPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [planError, setPlanError] = useState('');

  const [passDate, setPassDate] = useState(today());

  const [people, setPeople] = useState<PassPerson[]>(() => [blankPerson()]);
  const [holders, setHolders] = useState<HolderOption[]>([]);
  const [holdersLoading, setHoldersLoading] = useState(false);
  // Who cannot be given a pass on the pass date (they hold a membership or a pass then), by user id.
  const [blocked, setBlocked] = useState<Record<string, BlockReason>>({});

  // prepaid / pay_at_facility / complementary (see DAY_PASS_PAYMENT_METHODS); a complementary pass needs its reason.
  const [paymentMethod, setPaymentMethod] = useState('');
  const [complementaryReason, setComplementaryReason] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // The Day Pass plan is found (or created) and selected for the site: nothing to choose.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPlanLoading(true);
      setPlanError('');
      try {
        const response = await apiClient.get('/membership_plans/day_pass.json', {
          params: { site_id: localStorage.getItem('selectedSiteId') || undefined },
        });
        if (cancelled) return;
        setPlan(response.data);
      } catch (error) {
        if (!cancelled) setPlanError(getApiErrorMessage(error, 'Could not load the Day Pass plan'));
      } finally {
        if (!cancelled) setPlanLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // People who can be given a pass, loaded once someone on the pass is an "Existing user".
  const needsHolders = people.some((person) => person.mode === 'existing');
  useEffect(() => {
    if (!needsHolders || holders.length > 0) return;
    let cancelled = false;
    (async () => {
      setHoldersLoading(true);
      try {
        const response = await apiClient.get('/pms/account_setups/occupant_users.json');
        if (!cancelled) setHolders(response.data?.occupant_users || []);
      } catch (error) {
        if (!cancelled) toast.error(getApiErrorMessage(error, 'Failed to load users'));
      } finally {
        if (!cancelled) setHoldersLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [needsHolders, holders.length]);

  // Who is blocked on the pass date, asked again whenever the date changes (only needed to pick existing users).
  useEffect(() => {
    if (!needsHolders || !passDate) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await apiClient.get('/club_member_allocations/day_pass_blocked_users.json', {
          params: { site_id: plan?.site?.id ?? (localStorage.getItem('selectedSiteId') || undefined), date: passDate },
        });
        if (cancelled) return;
        const rows: { user_id: number; reason: BlockReason }[] = response.data?.blocked_users || [];
        setBlocked(Object.fromEntries(rows.map((row) => [String(row.user_id), row.reason])));
      } catch {
        // Not knowing who is blocked only means the server says so on submit instead.
        if (!cancelled) setBlocked({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [needsHolders, passDate, plan?.site?.id]);

  // Price and tax are set up on the plan (Membership Plan), not typed in per pass, and charged for each person; a
  // complementary pass is not charged at all. A plan without a price is free, so there is no payment method to choose.
  const pricePerPerson = toNumber(plan?.price);
  const peopleCount = people.length;
  const isPriced = pricePerPerson > 0;
  const isComplementary = isPriced && paymentMethod === 'complementary';
  const base = isComplementary ? 0 : pricePerPerson * peopleCount;
  const cgstAmount = (base * toNumber(plan?.cgst)) / 100;
  const sgstAmount = (base * toNumber(plan?.sgst)) / 100;
  const total = base + cgstAmount + sgstAmount;

  const holderName = (holder: HolderOption) =>
    holder.name || `${holder.firstname || ''} ${holder.lastname || ''}`.trim() || `User ${holder.id}`;

  const updatePerson = (key: number, changes: Partial<PassPerson>) =>
    setPeople((current) => current.map((person) => (person.key === key ? { ...person, ...changes } : person)));

  const removePerson = (key: number) => setPeople((current) => current.filter((person) => person.key !== key));

  const validate = () => {
    if (!plan) {
      toast.error('The Day Pass plan is not loaded yet');
      return false;
    }
    if (!passDate) {
      toast.error('Please select the pass date');
      return false;
    }
    if (passDate < today()) {
      toast.error('A day pass cannot be for a past date');
      return false;
    }
    for (const [index, person] of people.entries()) {
      const who = peopleCount > 1 ? `Person ${index + 1}: ` : '';
      if (person.mode === 'existing') {
        if (!person.userId) {
          toast.error(`${who}please select the user`);
          return false;
        }
        const reason = blocked[person.userId];
        if (reason) {
          const holder = holders.find((candidate) => String(candidate.id) === person.userId);
          toast.error(`${who}${holder ? holderName(holder) : 'this user'} ${BLOCK_REASON_LABEL[reason]}: choose someone else or another date`);
          return false;
        }
        continue;
      }
      if (!person.firstName.trim() || !person.lastName.trim()) {
        toast.error(`${who}please enter the first and last name`);
        return false;
      }
      if (!/^\d{10}$/.test(person.mobile.trim())) {
        toast.error(`${who}please enter a 10 digit mobile number`);
        return false;
      }
      if (!/^\S+@\S+\.\S+$/.test(person.email.trim())) {
        toast.error(`${who}please enter a valid email`);
        return false;
      }
    }
    // Each person only once (the server refuses it too).
    const keys = people.map((person) =>
      person.mode === 'existing' ? `user:${person.userId}` : `email:${person.email.trim().toLowerCase()}`
    );
    const mobiles = people.filter((person) => person.mode === 'new').map((person) => person.mobile.trim());
    if (new Set(keys).size !== keys.length || new Set(mobiles).size !== mobiles.length) {
      toast.error('The same person is added more than once');
      return false;
    }
    if (isPriced && !paymentMethod) {
      toast.error('Please select the payment method');
      return false;
    }
    if (isComplementary && !complementaryReason.trim()) {
      toast.error('Please enter the reason for the complementary pass');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting || !validate() || !plan) return;

    setIsSubmitting(true);
    try {
      const siteId = plan.site?.id ?? Number(localStorage.getItem('selectedSiteId'));
      const companyId = Number(localStorage.getItem('selectedCompanyId'));

      // The pass is created through the allocation route: that bills it (a Pending invoice for everyone on it), and the
      // payment is marked afterwards on the pass's own page (Mark Payment), like a club membership allocation.
      const members = people.map((person): Record<string, unknown> =>
        person.mode === 'existing'
          ? { user_id: Number(person.userId), club_member: { club_member_enabled: true } }
          : {
              firstname: person.firstName.trim(),
              lastname: person.lastName.trim(),
              mobile: person.mobile.trim(),
              email: person.email.trim(),
              gender: person.gender || undefined,
              club_member: { club_member_enabled: true },
              ...(companyId
                ? {
                    permissions: [
                      { account_id: companyId, user_type: 'pms_occupant', access_level: 'Site', access_to: [siteId], status: 'approved' },
                    ],
                  }
                : {}),
            }
      );

      const response = await apiClient.post(
        '/club_member_allocations.json',
        {
          club_member_allocation: {
            pms_site_id: siteId,
            membership_plan_id: plan.id,
            start_date: passDate,
            end_date: passDate,
            name: `Day Pass ${passDate}`,
            // The server prices the pass from the plan for each person; these are what the form showed.
            allocation_payment_detail_attributes: {
              base_amount: base,
              discount: 0,
              cgst: cgstAmount,
              sgst: sgstAmount,
              igst: 0,
              total_tax: cgstAmount + sgstAmount,
              total_amount: total,
              landed_amount: total,
              payment_mode: 'online',
              payment_method: isPriced ? paymentMethod : undefined,
              notes: isComplementary ? complementaryReason.trim() : undefined,
              payment_status: 'pending',
            },
            members,
          },
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      toast.success('Day pass created');
      const memberId = response.data?.club_member_ids?.[0];
      navigate(memberId ? `/club-management/day-pass/${memberId}` : '/club-management/day-pass');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to create the day pass'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const amenities = plan?.plan_amenities || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f5f4f0' }}>
            <Ticket className="text-[rgba(26,26,24,0.68)] w-5 h-5" />
          </div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--color-primary)' }}>Add Day Pass</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* The plan, found or created and selected for the site */}
        <section className="bg-white p-6 rounded-lg shadow-sm space-y-3">
          <h2 className="text-lg font-semibold">Day Pass plan</h2>
          {planLoading && <p className="text-sm text-gray-500">Loading the Day Pass plan...</p>}
          {planError && <p className="text-sm text-brand-error">{planError}</p>}
          {plan && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{plan.name}</span> is selected for this site. It is valid on the pass date only.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/settings/vas/membership-plan/setup/edit/${plan.id}`)}
                >
                  Set up facilities
                </Button>
              </div>
              {amenities.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No facilities are set up on this plan yet, so a pass holder cannot book anything. Use "Set up facilities" to add
                  the facilities and how many slots of each the pass includes.
                </p>
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
            </>
          )}
        </section>

        {/* Pass details */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Pass details</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <TextField
              label="Pass date *"
              type="date"
              value={passDate}
              onChange={(event) => setPassDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: today() }}
              variant="outlined"
              fullWidth
              sx={fieldStyles}
            />
          </div>
        </section>

        {/* People on the pass */}
        <section className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">People on this pass ({peopleCount})</h2>
            <Button type="button" variant="outline" onClick={() => setPeople((current) => [...current, blankPerson()])}>
              <Plus className="w-4 h-4 mr-2" /> Add person
            </Button>
          </div>

          {people.map((person, index) => {
            // Someone already on the pass is not offered again.
            const takenIds = people.filter((other) => other.key !== person.key && other.mode === 'existing').map((other) => other.userId);
            return (
              <div key={person.key} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Person {index + 1}</h3>
                  {peopleCount > 1 && (
                    <button
                      type="button"
                      title="Remove this person"
                      onClick={() => removePerson(person.key)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <RadioGroup
                  value={person.mode}
                  onValueChange={(value) => updatePerson(person.key, { mode: value as 'new' | 'existing' })}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id={`person-${person.key}-new`} />
                    <Label htmlFor={`person-${person.key}-new`}>New user</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="existing" id={`person-${person.key}-existing`} />
                    <Label htmlFor={`person-${person.key}-existing`}>Existing user</Label>
                  </div>
                </RadioGroup>

                {person.mode === 'existing' ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <TextField
                      select
                      label="User *"
                      value={person.userId}
                      onChange={(event) => updatePerson(person.key, { userId: event.target.value })}
                      disabled={holdersLoading}
                      error={Boolean(blocked[person.userId])}
                      helperText={
                        blocked[person.userId]
                          ? `This user ${BLOCK_REASON_LABEL[blocked[person.userId]]}`
                          : 'People with a club membership or a pass on this date are greyed out'
                      }
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{ displayEmpty: true }}
                      variant="outlined"
                      fullWidth
                      sx={fieldStyles}
                    >
                      <MenuItem value="" disabled>
                        <em>{holdersLoading ? 'Loading users...' : 'Select user'}</em>
                      </MenuItem>
                      {holders
                        .filter((holder) => !takenIds.includes(String(holder.id)))
                        .map((holder) => {
                          const reason = blocked[String(holder.id)];
                          return (
                            <MenuItem key={holder.id} value={String(holder.id)} disabled={Boolean(reason)}>
                              {holderName(holder)}
                              {holder.mobile ? ` (${holder.mobile})` : ''}
                              {reason ? ` — ${BLOCK_REASON_LABEL[reason]}` : ''}
                            </MenuItem>
                          );
                        })}
                    </TextField>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <TextField
                      label="First name *"
                      value={person.firstName}
                      onChange={(event) => updatePerson(person.key, { firstName: event.target.value })}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      fullWidth
                      sx={fieldStyles}
                    />
                    <TextField
                      label="Last name *"
                      value={person.lastName}
                      onChange={(event) => updatePerson(person.key, { lastName: event.target.value })}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      fullWidth
                      sx={fieldStyles}
                    />
                    <TextField
                      label="Mobile *"
                      value={person.mobile}
                      onChange={(event) => updatePerson(person.key, { mobile: event.target.value.replace(/\D/g, '').slice(0, 10) })}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      fullWidth
                      sx={fieldStyles}
                    />
                    <TextField
                      label="Email *"
                      type="email"
                      value={person.email}
                      onChange={(event) => updatePerson(person.key, { email: event.target.value })}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      fullWidth
                      sx={fieldStyles}
                    />
                    <TextField
                      select
                      label="Gender"
                      value={person.gender}
                      onChange={(event) => updatePerson(person.key, { gender: event.target.value })}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{ displayEmpty: true }}
                      variant="outlined"
                      fullWidth
                      sx={fieldStyles}
                    >
                      <MenuItem value="">
                        <em>Select gender</em>
                      </MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Price and tax come from the plan, for each person */}
        {plan && (
          <section className="bg-white p-6 rounded-lg shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Price</h2>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/settings/vas/membership-plan/setup/edit/${plan.id}`)}
              >
                Edit price &amp; tax
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Price and tax are set up on the Day Pass plan and charged for each person on the pass.{' '}
              {pricePerPerson === 0 && 'This pass is free until a price is set on the plan.'}
              {isComplementary && 'This is a complementary pass: nothing is charged.'}
            </p>
            <dl className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Price per person</dt>
                <dd className="font-medium">₹{pricePerPerson.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">People</dt>
                <dd className="font-medium">× {peopleCount}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="font-medium">₹{base.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">CGST ({toNumber(plan.cgst)}%)</dt>
                <dd className="font-medium">₹{cgstAmount.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">SGST ({toNumber(plan.sgst)}%)</dt>
                <dd className="font-medium">₹{sgstAmount.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Total</dt>
                <dd className="font-semibold text-brand">₹{total.toFixed(2)}</dd>
              </div>
            </dl>
          </section>
        )}

        {/* How it will be paid (like a facility booking's payment method). Prepaid / Pay at Facility: the invoice is
            created as Pending and the payment is marked on the pass's page; Complementary: given free, with a reason. */}
        {plan && isPriced && (
          <section className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h2 className="text-lg font-semibold">
              Payment Method<span className="ml-0.5">*</span>
            </h2>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              {DAY_PASS_PAYMENT_METHODS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`pass-payment-${option.value}`} />
                  <Label htmlFor={`pass-payment-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>

            {isComplementary ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Reason *"
                  value={complementaryReason}
                  onChange={(event) => setComplementaryReason(event.target.value)}
                  placeholder="Enter reason for the complementary pass"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  fullWidth
                  sx={fieldStyles}
                />
              </div>
            ) : (
              paymentMethod && (
                <p className="text-sm text-gray-500">
                  The pass is created with a Pending invoice of ₹{total.toFixed(2)}
                  {paymentMethod === 'pay_at_facility' ? ', to be paid at the facility' : ''}. Mark the payment on the pass's
                  page once it is received; the invoice number is issued then.
                </p>
              )
            )}
          </section>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" className="bg-brand hover:bg-brand-hover text-white" disabled={isSubmitting || !plan}>
            {isSubmitting ? 'Creating...' : `Create Day Pass${peopleCount > 1 ? ` for ${peopleCount} people` : ''}`}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddDayPassPage;
