import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';
import { toast } from 'sonner';
import {
    TextField,
    FormControlLabel,
    Checkbox,
    Tooltip,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { API_CONFIG, getFullUrl } from '@/config/apiConfig';
import { getToken } from '@/utils/auth';
import axios from 'axios';

interface MembershipPlan {
    id: number;
    name: string;
    price: string;
    user_limit: string;
    renewal_terms: string;
    cgst?: string;
    sgst?: string;
    plan_amenities?: PlanAmenity[];
}

interface PlanAmenity {
    id: number;
    facility_setup_id: number;
    access: string;
    facility_setup_name?: string;
    facility_setup?: { id: number; name: string };
}

interface Amenity {
    value: number;
    name: string;
    price?: string;
    active?: number;
}

const fieldStyles = {
    height: '45px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    '& .MuiOutlinedInput-root': {
        height: '45px',
        '& fieldset': { borderColor: '#ddd' },
        '&:hover fieldset': { borderColor: '#C72030' },
        '&.Mui-focused fieldset': { borderColor: '#C72030' },
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': { color: '#C72030' },
    },
};

const validateMobile = (mobile: string): boolean => /^[0-9]{10}$/.test(mobile);

export const EditGroupMembershipStep1Page = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [referredBy, setReferredBy] = useState('');
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [cardAllocated, setCardAllocated] = useState(false);
    const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
    const [allAmenities, setAllAmenities] = useState<Amenity[]>([]);
    const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [editablePlanCost, setEditablePlanCost] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('0');
    const [cgstPercentage, setCgstPercentage] = useState('0');
    const [sgstPercentage, setSgstPercentage] = useState('0');

    useEffect(() => {
        loadMembershipPlans();
        loadAmenities();
        if (id) loadMembershipData(id);
    }, [id]);

    const loadMembershipPlans = async () => {
        setLoadingPlans(true);
        try {
            const baseUrl = API_CONFIG.BASE_URL;
            const token = API_CONFIG.TOKEN;
            const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/membership_plans.json`);
            url.searchParams.append('access_token', token || '');
            url.searchParams.append('q[active_eq]', 'true');
            const response = await fetch(url.toString());
            if (!response.ok) throw new Error('Failed to fetch plans');
            const data = await response.json();
            setMembershipPlans(data.plans || []);
        } catch {
            toast.error('Failed to load membership plans');
        } finally {
            setLoadingPlans(false);
        }
    };

    const loadAmenities = async () => {
        try {
            const baseUrl = API_CONFIG.BASE_URL;
            const token = API_CONFIG.TOKEN;
            const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/membership_plans/amenitiy_list.json`);
            url.searchParams.append('access_token', token || '');
            const response = await fetch(url.toString());
            if (!response.ok) throw new Error('Failed to fetch amenities');
            const data = await response.json();
            const active = (data.ameneties || []).filter((a: Amenity) => a.active === 1);
            setAllAmenities(active);
        } catch {
            toast.error('Failed to load amenities');
        }
    };

    const loadMembershipData = async (membershipId: string) => {
        setLoading(true);
        try {
            const baseUrl = API_CONFIG.BASE_URL;
            const token = API_CONFIG.TOKEN;
            const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/club_member_allocations/${membershipId}.json`);
            url.searchParams.append('access_token', token || '');
            const response = await fetch(url.toString());
            if (!response.ok) throw new Error('Failed to fetch membership');
            const data = await response.json();

            if (data.start_date) setStartDate(dayjs(data.start_date));
            if (data.end_date) setEndDate(dayjs(data.end_date));
            if (data.referred_by) setReferredBy(data.referred_by);
            if (data.club_members?.[0]?.emergency_contact_name) {
                setEmergencyContactName(data.club_members[0].emergency_contact_name);
            }
            if (data.membership_plan_id) setSelectedPlanId(data.membership_plan_id);

            if (data.allocation_payment_detail) {
                const pd = data.allocation_payment_detail;
                setEditablePlanCost(pd.base_amount?.toString() || '');
                const base = parseFloat(pd.base_amount) || 0;
                if (base > 0) {
                    if (pd.discount) setDiscountPercentage(((parseFloat(pd.discount) / base) * 100).toString());
                    if (pd.cgst) setCgstPercentage(((parseFloat(pd.cgst) / base) * 100).toString());
                    if (pd.sgst) setSgstPercentage(((parseFloat(pd.sgst) / base) * 100).toString());
                }
            }

            // Load card allocation and add-ons from first member
            if (data.club_members?.[0]) {
                const firstMember = data.club_members[0];
                if (firstMember.access_card_enabled !== undefined) {
                    setCardAllocated(firstMember.access_card_enabled);
                }
                if (firstMember.custom_amenities && Array.isArray(firstMember.custom_amenities)) {
                    const ids = firstMember.custom_amenities
                        .filter((a: any) => a.access === true)
                        .map((a: any) => a.facility_setup_id);
                    setSelectedAddOns(ids);
                }
            }

            toast.success('Membership data loaded');
        } catch {
            toast.error('Failed to load membership data');
        } finally {
            setLoading(false);
        }
    };

    const selectedPlan = membershipPlans.find(p => p.id === selectedPlanId);

    const planCost = parseFloat(editablePlanCost) || 0;
    const discountAmount = (planCost * (parseFloat(discountPercentage) || 0)) / 100;
    const planCostAfterDiscount = planCost - discountAmount;
    const addOnsCost = selectedAddOns.reduce((total, addOnId) => {
        const addOn = allAmenities.find(a => a.value === addOnId);
        return total + (parseFloat(addOn?.price || '0') || 0);
    }, 0);
    const subtotal = planCostAfterDiscount + addOnsCost;
    const cgstAmount = (subtotal * (parseFloat(cgstPercentage) || 0)) / 100;
    const sgstAmount = (subtotal * (parseFloat(sgstPercentage) || 0)) / 100;
    const totalCost = subtotal + cgstAmount + sgstAmount;

    const handleNext = async () => {
        if (!selectedPlanId) { toast.error('Please select a membership plan'); return; }
        if (!startDate) { toast.error('Please select start date'); return; }
        if (!endDate) { toast.error('Please select end date'); return; }
        if (endDate.isBefore(startDate)) { toast.error('End date must be after start date'); return; }
        if (emergencyContactName && emergencyContactName.trim() !== '' && !validateMobile(emergencyContactName)) {
            toast.error('Emergency contact must be a valid 10-digit phone number');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = getToken();
            const url = getFullUrl(`/club_member_allocations/${id}/change_plan.json`);
            const payload = {
                new_membership_plan_id: selectedPlanId,
                start_date: startDate.format('YYYY-MM-DD'),
                end_date: endDate.format('YYYY-MM-DD'),
                payment: {
                    base_amount: planCost,
                    discount: discountAmount,
                    discount_percent: parseFloat(discountPercentage) || 0,
                    cgst: cgstAmount,
                    sgst: sgstAmount,
                    total_tax: cgstAmount + sgstAmount,
                    total_amount: totalCost,
                    landed_amount: totalCost,
                },
            };
            await axios.post(url, payload, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            navigate("/club-management/membership/groups");
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
        } catch (error: any) {
            const msg = error?.response?.data?.error || error?.response?.data?.message || 'Failed to update membership plan';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <Button variant="ghost" onClick={handleGoBack} className="hover:bg-gray-100">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Edit Club Membership</h1>
                        <p className="text-sm text-gray-500 mt-1">Step 1 of 2 — Plan & Membership Details</p>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C72030]"></div>
                            <p className="text-gray-600">Loading membership data...</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Plan Selection */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-2">Select Membership Plan</h2>
                            <p className="text-sm text-gray-500 mb-6">Choose a plan that suits your needs</p>

                            {loadingPlans ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
                                </div>
                            ) : membershipPlans.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No membership plans available. Please contact administrator.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {membershipPlans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            onClick={() => {
                                                setSelectedPlanId(plan.id);
                                                setEditablePlanCost(plan.price);
                                                setCgstPercentage(plan.cgst || '0');
                                                setSgstPercentage(plan.sgst || '0');
                                                setDiscountPercentage('0');
                                            }}
                                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedPlanId === plan.id
                                                ? 'border-[#C72030] bg-red-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-[#1a1a1a]">{plan.name}</h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <p className="text-sm text-gray-500">
                                                            {plan.renewal_terms && plan.renewal_terms.charAt(0).toUpperCase() + plan.renewal_terms.slice(1)} Membership
                                                        </p>
                                                        {plan.user_limit && (
                                                            <>
                                                                <span className="text-gray-300">•</span>
                                                                <p className="text-sm text-gray-500">
                                                                    Max {plan.user_limit} {parseInt(plan.user_limit) === 1 ? 'Member' : 'Members'}
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-[#C72030]">₹{plan.price}</p>
                                                    <p className="text-xs text-gray-500">per {plan.renewal_terms}</p>
                                                </div>
                                            </div>

                                            {plan.plan_amenities && plan.plan_amenities.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <p className="text-sm font-medium text-gray-700 mb-2">Included Amenities:</p>
                                                    <div className="flex items-center gap-4 flex-wrap">
                                                        {plan.plan_amenities.map((amenity) => (
                                                            <div key={amenity.id} className="flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                                <span className="text-sm text-gray-600">
                                                                    {amenity.facility_setup_name || amenity.facility_setup?.name || `Amenity #${amenity.facility_setup_id}`}
                                                                </span>
                                                                <Tooltip
                                                                    title={
                                                                        <div className="text-xs">
                                                                            {Array.isArray((amenity as any).facility_setup_assesories) && (amenity as any).facility_setup_assesories.length > 0 && (
                                                                                <div className="mb-1">
                                                                                    <div className="font-semibold">Accessories:</div>
                                                                                    <div>{((amenity as any).facility_setup_assesories as string[]).join(', ')}</div>
                                                                                </div>
                                                                            )}
                                                                            {(amenity as any).slot_limit != null && (amenity as any).frequency && (
                                                                                <div className="mt-1">
                                                                                    <div className="font-semibold">Slot Limit:</div>
                                                                                    <div>{(amenity as any).slot_limit} {(amenity as any).frequency}</div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    }
                                                                    arrow
                                                                >
                                                                    <span className="inline-flex items-center text-gray-500 cursor-pointer">
                                                                        <Info className="w-3.5 h-3.5" />
                                                                    </span>
                                                                </Tooltip>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {selectedPlanId === plan.id && (
                                                <div className="mt-3 flex items-center gap-2 text-[#C72030]">
                                                    <div className="w-5 h-5 rounded-full bg-[#C72030] flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm font-medium">Selected</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Shared Membership Details */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Shared Membership Details</h2>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                                    <DatePicker
                                        label="Start Date *"
                                        value={startDate}
                                        onChange={(newValue) => setStartDate(newValue as Dayjs | null)}
                                        format="DD/MM/YYYY"
                                        slotProps={{ textField: { fullWidth: true, sx: fieldStyles } }}
                                    />
                                    <DatePicker
                                        label="End Date *"
                                        value={endDate}
                                        onChange={(newValue) => setEndDate(newValue as Dayjs | null)}
                                        format="DD/MM/YYYY"
                                        slotProps={{ textField: { fullWidth: true, sx: fieldStyles } }}
                                    />
                                </div>

                                <TextField
                                    label="Emergency Contact (Optional)"
                                    value={emergencyContactName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || /^\d{0,10}$/.test(value)) {
                                            setEmergencyContactName(value);
                                        }
                                    }}
                                    onBlur={() => {
                                        if (emergencyContactName && emergencyContactName.trim() !== '' && !validateMobile(emergencyContactName)) {
                                            toast.warning('Emergency contact should be a valid 10-digit phone number');
                                        }
                                    }}
                                    sx={fieldStyles}
                                    fullWidth
                                    type="tel"
                                    placeholder="10-digit Phone Number"
                                    inputProps={{ maxLength: 10, pattern: '[0-9]*', inputMode: 'numeric' }}
                                    error={emergencyContactName !== '' && !validateMobile(emergencyContactName)}
                                    helperText={
                                        emergencyContactName !== '' && !validateMobile(emergencyContactName)
                                            ? 'Emergency contact must be exactly 10 digits'
                                            : ''
                                    }
                                />
                            </div>

                            {cardAllocated && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-2">
                                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-blue-800">
                                        Access Card ID is now required for each user. Each user will have their own unique access card ID in the User Information section below.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Cost Summary */}
                        {selectedPlanId && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Cost Summary</h2>

                                <div className="space-y-4">
                                    <div className="pb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">{selectedPlan?.name}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {selectedPlan?.renewal_terms && selectedPlan.renewal_terms.charAt(0).toUpperCase() + selectedPlan.renewal_terms.slice(1)} Membership
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-[#C72030]">₹{selectedPlan?.price}</p>
                                                <p className="text-xs text-gray-500">per {selectedPlan?.renewal_terms}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mb-3">
                                            <label className="text-sm text-gray-600">Discount (%):</label>
                                            <div className="flex items-center gap-1 flex-1">
                                                <TextField
                                                    value={discountPercentage}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                                                            setDiscountPercentage(value);
                                                        }
                                                    }}
                                                    type="number"
                                                    size="small"
                                                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                                                    sx={{ ...fieldStyles, width: '100px', '& .MuiOutlinedInput-root': { height: '40px' } }}
                                                />
                                                <span className="text-sm text-gray-600 ml-2">Amount: ₹{discountAmount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                                        <p className="text-sm font-medium text-gray-700">Subtotal</p>
                                        <p className="text-lg font-semibold text-gray-900">₹{subtotal.toFixed(2)}</p>
                                    </div>

                                    <div className="space-y-3 pb-3 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm text-gray-600">CGST ({cgstPercentage}%):</label>
                                            <p className="text-sm font-medium text-gray-700">₹{cgstAmount.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm text-gray-600">SGST ({sgstPercentage}%):</label>
                                            <p className="text-sm font-medium text-gray-700">₹{sgstAmount.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <p className="text-base font-bold text-gray-900">Total Amount (Inc. Tax)</p>
                                        <p className="text-2xl font-bold text-[#C72030]">₹{totalCost.toFixed(2)}</p>
                                    </div>

                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-xs text-blue-800">
                                            <span className="font-medium">Renewal Terms:</span> This membership will auto-renew every {selectedPlan?.renewal_terms} unless cancelled.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-center gap-3 pt-6 border-t border-gray-200">
                            <Button variant="outline" onClick={handleGoBack} disabled={isSubmitting}>Cancel</Button>
                            <Button onClick={handleNext} disabled={isSubmitting} className="bg-[#C72030] hover:bg-[#A01020] text-white">
                                {isSubmitting ? 'Saving...' : 'Save & Continue'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </LocalizationProvider>
    );
};

export default EditGroupMembershipStep1Page;
