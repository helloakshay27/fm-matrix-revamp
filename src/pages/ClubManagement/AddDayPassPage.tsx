import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket } from 'lucide-react';
import { MenuItem, TextField } from '@mui/material';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { apiClient } from '@/utils/apiClient';
import { getApiErrorMessage } from './apiErrorMessage';

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

  const [holderMode, setHolderMode] = useState<'new' | 'existing'>('new');
  const [holders, setHolders] = useState<HolderOption[]>([]);
  const [holdersLoading, setHoldersLoading] = useState(false);
  const [selectedHolder, setSelectedHolder] = useState('');
  const [newHolder, setNewHolder] = useState({ firstName: '', lastName: '', mobile: '', email: '', gender: '' });

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

  // People who can be given a pass, loaded when "Existing user" is chosen.
  useEffect(() => {
    if (holderMode !== 'existing' || holders.length > 0) return;
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
  }, [holderMode, holders.length]);

  // Price and tax are set up on the plan (Membership Plan), not typed in per pass.
  const base = toNumber(plan?.price);
  const cgstAmount = (base * toNumber(plan?.cgst)) / 100;
  const sgstAmount = (base * toNumber(plan?.sgst)) / 100;
  const total = base + cgstAmount + sgstAmount;

  const holderName = (holder: HolderOption) =>
    holder.name || `${holder.firstname || ''} ${holder.lastname || ''}`.trim() || `User ${holder.id}`;

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
    if (holderMode === 'existing') {
      if (!selectedHolder) {
        toast.error('Please select the pass holder');
        return false;
      }
      return true;
    }
    if (!newHolder.firstName.trim() || !newHolder.lastName.trim()) {
      toast.error('Please enter the first and last name');
      return false;
    }
    if (!/^\d{10}$/.test(newHolder.mobile.trim())) {
      toast.error('Please enter a 10 digit mobile number');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(newHolder.email.trim())) {
      toast.error('Please enter a valid email');
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

      // The pass is created through the allocation route: that bills it, and the payment is marked afterwards on the
      // pass's own page (Mark Payment), like a club membership allocation.
      const member: Record<string, unknown> =
        holderMode === 'existing'
          ? { user_id: Number(selectedHolder), club_member: { club_member_enabled: true } }
          : {
              firstname: newHolder.firstName.trim(),
              lastname: newHolder.lastName.trim(),
              mobile: newHolder.mobile.trim(),
              email: newHolder.email.trim(),
              gender: newHolder.gender || undefined,
              club_member: { club_member_enabled: true },
              ...(companyId
                ? {
                    permissions: [
                      { account_id: companyId, user_type: 'pms_occupant', access_level: 'Site', access_to: [siteId], status: 'approved' },
                    ],
                  }
                : {}),
            };

      const response = await apiClient.post(
        '/club_member_allocations.json',
        {
          club_member_allocation: {
            pms_site_id: siteId,
            membership_plan_id: plan.id,
            start_date: passDate,
            end_date: passDate,
            name: `Day Pass ${passDate}`,
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
              payment_status: 'pending',
            },
            members: [member],
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

        {/* Price and tax come from the plan */}
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
              Price and tax are set up on the Day Pass plan. {base === 0 && 'This pass is free until a price is set on the plan.'}
            </p>
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Price</dt>
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

        {/* Pass holder */}
        <section className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Pass holder</h2>
          <RadioGroup value={holderMode} onValueChange={(value) => setHolderMode(value as 'new' | 'existing')} className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="holder-new" />
              <Label htmlFor="holder-new">New user</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="holder-existing" />
              <Label htmlFor="holder-existing">Existing user</Label>
            </div>
          </RadioGroup>

          {holderMode === 'existing' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <TextField
                select
                label="User *"
                value={selectedHolder}
                onChange={(event) => setSelectedHolder(event.target.value)}
                disabled={holdersLoading}
                helperText="Someone with an active club membership cannot be given a day pass"
                InputLabelProps={{ shrink: true }}
                SelectProps={{ displayEmpty: true }}
                variant="outlined"
                fullWidth
                sx={fieldStyles}
              >
                <MenuItem value="" disabled>
                  <em>{holdersLoading ? 'Loading users...' : 'Select user'}</em>
                </MenuItem>
                {holders.map((holder) => (
                  <MenuItem key={holder.id} value={String(holder.id)}>
                    {holderName(holder)}
                    {holder.mobile ? ` (${holder.mobile})` : ''}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <TextField
                label="First name *"
                value={newHolder.firstName}
                onChange={(event) => setNewHolder({ ...newHolder, firstName: event.target.value })}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
                sx={fieldStyles}
              />
              <TextField
                label="Last name *"
                value={newHolder.lastName}
                onChange={(event) => setNewHolder({ ...newHolder, lastName: event.target.value })}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
                sx={fieldStyles}
              />
              <TextField
                label="Mobile *"
                value={newHolder.mobile}
                onChange={(event) => setNewHolder({ ...newHolder, mobile: event.target.value.replace(/\D/g, '').slice(0, 10) })}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
                sx={fieldStyles}
              />
              <TextField
                label="Email *"
                type="email"
                value={newHolder.email}
                onChange={(event) => setNewHolder({ ...newHolder, email: event.target.value })}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
                sx={fieldStyles}
              />
              <TextField
                select
                label="Gender"
                value={newHolder.gender}
                onChange={(event) => setNewHolder({ ...newHolder, gender: event.target.value })}
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
        </section>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" className="bg-brand hover:bg-brand-hover text-white" disabled={isSubmitting || !plan}>
            {isSubmitting ? 'Creating...' : 'Create Day Pass'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddDayPassPage;
