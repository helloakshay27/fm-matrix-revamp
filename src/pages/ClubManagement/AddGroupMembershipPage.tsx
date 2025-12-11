import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, X, Copy } from 'lucide-react';
import { toast } from 'sonner';
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    FormLabel
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { getFullUrl, getAuthenticatedFetchOptions, API_CONFIG } from '@/config/apiConfig';
import { getToken } from '@/utils/auth';

// Interfaces
interface OccupantUserResponse {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    company_id: number;
    site_id: number;
    user_type: string;
    lock_user_permission?: {
        id: number;
        account_id: number;
        user_type: string;
        access_level: string;
        access_to: string[];
        status: string;
        designation?: string;
    };
    unit_name?: string;
    company?: string;
}

interface UserResponse {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    flat?: string;
    tower?: string;
    unit?: {
        name: string;
    };
    building?: {
        name: string;
    };
}

interface ResidentTypeResponse {
    id: number;
    name: string;
}

interface RelationResponse {
    id: number;
    name: string;
}

interface MembershipPlan {
    id: number;
    name: string;
    price: string;
    user_limit: string;
    renewal_terms: string;
    plan_amenities?: PlanAmenity[];
}

interface PlanAmenity {
    id: number;
    facility_setup_id: number;
    access: string;
    facility_setup_name?: string;
    facility_setup?: {
        id: number;
        name: string;
    };
}

interface Amenity {
    value: number;
    name: string;
    price?: string;
}

// Field styles for Material-UI components
const fieldStyles = {
    height: '45px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    '& .MuiOutlinedInput-root': {
        height: '45px',
        '& fieldset': {
            borderColor: '#ddd',
        },
        '&:hover fieldset': {
            borderColor: '#C72030',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#C72030',
        },
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': {
            color: '#C72030',
        },
    },
};

const GENDER_OPTIONS = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
];

const RESIDENT_TYPE_OPTIONS = [
    { value: 'Owner', label: 'Owner' },
    { value: 'Tenant', label: 'Tenant' },
    { value: 'Family Member', label: 'Family Member' }
];

const RELATION_OPTIONS = [
    { value: 'Self', label: 'Self' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Son', label: 'Son' },
    { value: 'Daughter', label: 'Daughter' },
    { value: 'Brother', label: 'Brother' },
    { value: 'Sister', label: 'Sister' },
    { value: 'Other', label: 'Other' }
];

const MEMBERSHIP_TYPE_OPTIONS = [
    { value: 'Day Pass', label: 'Day Pass' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Quarterly', label: 'Quarterly' },
    { value: 'Annual', label: 'Annual' },
    { value: 'Corporate', label: 'Corporate' }
];

const REFERRED_BY_OPTIONS = [
    { value: 'Friend', label: 'Friend' },
    { value: 'Hotel', label: 'Hotel' },
    { value: 'Social Media', label: 'Social Media' },
    { value: 'Partner Brand', label: 'Partner Brand' },
    { value: 'Trainer', label: 'Trainer' },
    { value: 'Other', label: 'Other' }
];

// Member interface for multi-member form
interface MemberData {
    id: string;
    userSelectionMode: 'select' | 'manual';
    selectedUser: string;
    selectedUserId: number | null;
    formData: {
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        gender: string;
        email: string;
        mobile: string;
        emergencyContactName: string;
        address: string;
        address_line_two: string;
        city: string;
        state: string;
        country: string;
        pin_code: string;
        address_type: string;
        residentType: string;
        relationWithOwner: string;
        membershipNumber: string;
        accessCardId: string;
        membershipType: string;
        referredBy: string;
    };
    idCardFile: File | null;
    residentPhotoFile: File | null;
    attachmentFiles: File[];
    idCardPreview: string | null;
    residentPhotoPreview: string | null;
    attachmentPreviews: string[];
    hasInjuries: 'yes' | 'no' | '';
    injuryDetails: string;
    hasPhysicalRestrictions: 'yes' | 'no' | '';
    hasCurrentMedication: 'yes' | 'no' | '';
    pilatesExperience: string;
    fitnessGoals: string[];
    fitnessGoalsOther: string;
    interestedSessions: string[];
    interestedSessionsOther: string;
    heardAbout: string;
    motivations: string[];
    updatePreferences: string[];
    communicationChannel: string[];
    profession: string;
    companyName: string;
    corporateInterest: 'yes' | 'no' | '';
}

export const AddGroupMembershipPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Get ID from URL for edit mode
    const isEditMode = !!id;

    // Form state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clubMembership, setClubMembership] = useState(true); // Always enabled
    const [cardAllocated, setCardAllocated] = useState(false);
    const [accessLevel, setAccessLevel] = useState('Site'); // Default access level

    // Multi-member state - shared pool with card-specific visibility
    const [members, setMembers] = useState<MemberData[]>(() => {
        const initialMember: MemberData = {
            id: '1',
            userSelectionMode: 'select',
            selectedUser: '',
            selectedUserId: null,
            formData: {
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                gender: '',
                email: '',
                mobile: '',
                emergencyContactName: '',
                address: '',
                address_line_two: '',
                city: '',
                state: '',
                country: '',
                pin_code: '',
                address_type: 'residential',
                residentType: '',
                relationWithOwner: '',
                membershipNumber: '',
                accessCardId: '',
                membershipType: '',
                referredBy: '',
            },
            idCardFile: null,
            residentPhotoFile: null,
            attachmentFiles: [],
            idCardPreview: null,
            residentPhotoPreview: null,
            attachmentPreviews: [],
            hasInjuries: '',
            injuryDetails: '',
            hasPhysicalRestrictions: '',
            hasCurrentMedication: '',
            pilatesExperience: '',
            fitnessGoals: [],
            fitnessGoalsOther: '',
            interestedSessions: [],
            interestedSessionsOther: '',
            heardAbout: '',
            motivations: [],
            updatePreferences: [],
            communicationChannel: [],
            profession: '',
            companyName: '',
            corporateInterest: '',
        };
        return [initialMember];
    });

    // Track which members are visible in each card
    const [userMemberIds, setUserMemberIds] = useState<string[]>(['1']);
    const [addressMemberIds, setAddressMemberIds] = useState<string[]>(['1']);
    const [documentMemberIds, setDocumentMemberIds] = useState<string[]>(['1']);
    const [healthMemberIds, setHealthMemberIds] = useState<string[]>(['1']);
    const [activityMemberIds, setActivityMemberIds] = useState<string[]>(['1']);
    const [lifestyleMemberIds, setLifestyleMemberIds] = useState<string[]>(['1']);
    const [occupationMemberIds, setOccupationMemberIds] = useState<string[]>(['1']);

    // Get members for specific card
    const getUserMembers = () => members.filter(m => userMemberIds.includes(m.id));
    const getAddressMembers = () => members.filter(m => addressMemberIds.includes(m.id));
    const getDocumentMembers = () => members.filter(m => documentMemberIds.includes(m.id));
    const getHealthMembers = () => members.filter(m => healthMemberIds.includes(m.id));
    const getActivityMembers = () => members.filter(m => activityMemberIds.includes(m.id));
    const getLifestyleMembers = () => members.filter(m => lifestyleMemberIds.includes(m.id));
    const getOccupationMembers = () => members.filter(m => occupationMemberIds.includes(m.id));

    // Dropdown data
    const [users, setUsers] = useState<OccupantUserResponse[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Get site and company from localStorage
    const getSiteIdFromStorage = () => {
        return localStorage.getItem('selectedSiteId') ||
            new URLSearchParams(window.location.search).get('site_id');
    };

    const getCompanyIdFromStorage = () => {
        return localStorage.getItem('selectedCompanyId') ||
            new URLSearchParams(window.location.search).get('company_id');
    };

    // Helper function to convert file to base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result as string;
                // Remove the data URL prefix (e.g., "data:image/png;base64,")
                const base64Data = base64String.split(',')[1];
                resolve(base64Data);
            };
            reader.onerror = error => reject(error);
        });
    };

    // Shared membership details (common for all members)
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [membershipType, setMembershipType] = useState('');
    const [referredBy, setReferredBy] = useState('');
    const [emergencyContactName, setEmergencyContactName] = useState('');

    // Step management
    const [currentStep, setCurrentStep] = useState(1);

    // Membership Plan & Add-ons
    const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
    const [allAmenities, setAllAmenities] = useState<Amenity[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [editablePlanCost, setEditablePlanCost] = useState<string>('');
    const [discountPercentage, setDiscountPercentage] = useState<string>('0');
    const [cgstPercentage, setCgstPercentage] = useState<string>('9');
    const [sgstPercentage, setSgstPercentage] = useState<string>('9');

    // Add updateMember function after state declarations
    const updateMember = (memberId: string, updates: Partial<MemberData>) => {
        setMembers(prevMembers =>
            prevMembers.map(member =>
                member.id === memberId
                    ? { ...member, ...updates }
                    : member
            )
        );
    };

    // Load users on component mount
    useEffect(() => {
        loadUsers();
        loadMembershipPlans();
        loadAmenities();

        // Load membership data if in edit mode
        if (isEditMode && id) {
            loadMembershipData(id);
        }
    }, [id, isEditMode]);

    // Load membership plans
    const loadMembershipPlans = async () => {
        setLoadingPlans(true);
        try {
            const baseUrl = API_CONFIG.BASE_URL;
            const token = API_CONFIG.TOKEN;

            const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/membership_plans.json`);
            url.searchParams.append('access_token', token || '');

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch membership plans');
            }

            const data = await response.json();
            setMembershipPlans(data.plans || []);
        } catch (error) {
            console.error('Error loading membership plans:', error);
            toast.error('Failed to load membership plans');
        } finally {
            setLoadingPlans(false);
        }
    };

    // Load amenities
    const loadAmenities = async () => {
        try {
            const baseUrl = API_CONFIG.BASE_URL;
            const token = API_CONFIG.TOKEN;

            const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/membership_plans/amenitiy_list.json`);
            url.searchParams.append('access_token', token || '');

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch amenities');
            }

            const data = await response.json();
            setAllAmenities(data.ameneties || []);
        } catch (error) {
            console.error('Error loading amenities:', error);
            toast.error('Failed to load amenities');
        }
    };

    // Load membership data for edit mode
    const loadMembershipData = async (membershipId: string) => {
        setLoading(true);
        try {
            const baseUrl = API_CONFIG.BASE_URL;
            const token = API_CONFIG.TOKEN;

            const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/club_members/${membershipId}.json`);
            url.searchParams.append('access_token', token || '');

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch membership details');
            }

            const data = await response.json();
            console.log('Loaded membership data:', data);

            // Populate form with existing data using updateMember
            updateMember(members[0].id, {
                userSelectionMode: 'select', // Always use select mode for edit
                selectedUser: data.user_id?.toString() || '',
                selectedUserId: data.user_id,
                formData: {
                    firstName: data.user_name?.split(' ')[0] || '',
                    lastName: data.user_name?.split(' ').slice(1).join(' ') || '',
                    email: data.user_email || '',
                    mobile: data.user_mobile || '',
                    dateOfBirth: data.date_of_birth || '',
                    gender: data.gender || '',
                    emergencyContactName: data.emergency_contact_name || '',
                    address: data.user?.addresses[0]?.address || '',
                    address_line_two: data.user?.addresses[0]?.address_line_two || '',
                    city: data.user?.addresses[0]?.city || '',
                    state: data.user?.addresses[0]?.state || '',
                    country: data.user?.addresses[0]?.country || '',
                    pin_code: data.user?.addresses[0]?.pin_code || '',
                    address_type: data.user?.addresses[0]?.address_type || 'residential',
                    residentType: '',
                    relationWithOwner: '',
                    membershipNumber: data.membership_number || '',
                    accessCardId: data.access_card_id || '',
                    membershipType: data.membership_type || '',
                    referredBy: data.referred_by || '',
                }
            });

            // Set dates
            if (data.start_date) {
                setStartDate(dayjs(data.start_date));
            }
            if (data.end_date) {
                setEndDate(dayjs(data.end_date));
            }

            // Set access card
            setCardAllocated(data.access_card_enabled || false);

            // Set membership plan
            if (data.membership_plan_id) {
                setSelectedPlanId(data.membership_plan_id);
            }

            // Set custom amenities
            if (data.custom_amenities && Array.isArray(data.custom_amenities)) {
                const amenityIds = data.custom_amenities.map((a: any) => a.facility_setup_id);
                setSelectedAddOns(amenityIds);
            }

            // Set payment details
            if (data.member_payment_detail) {
                const paymentDetail = data.member_payment_detail;
                setEditablePlanCost(paymentDetail.base_amount || '');
                if (paymentDetail.discount) {
                    // Calculate discount percentage from discount amount
                    const baseAmount = parseFloat(paymentDetail.base_amount) || 0;
                    if (baseAmount > 0) {
                        const discountAmt = parseFloat(paymentDetail.discount) || 0;
                        const discountPct = (discountAmt / baseAmount) * 100;
                        setDiscountPercentage(discountPct.toString());
                    }
                }
                if (paymentDetail.cgst) {
                    // Calculate CGST percentage
                    const subtotalAmount = parseFloat(paymentDetail.base_amount) || 0;
                    if (subtotalAmount > 0) {
                        const cgstAmt = parseFloat(paymentDetail.cgst) || 0;
                        const cgstPct = (cgstAmt / subtotalAmount) * 100;
                        setCgstPercentage(cgstPct.toString());
                    }
                }
                if (paymentDetail.sgst) {
                    // Calculate SGST percentage
                    const subtotalAmount = parseFloat(paymentDetail.base_amount) || 0;
                    if (subtotalAmount > 0) {
                        const sgstAmt = parseFloat(paymentDetail.sgst) || 0;
                        const sgstPct = (sgtAmt / subtotalAmount) * 100;
                        setSgstPercentage(sgstPct.toString());
                    }
                }
            }

            // Set health & wellness information from answers using updateMember
            const memberUpdates: Partial<MemberData> = {};

            if (data.answers && Array.isArray(data.answers) && data.answers.length > 0) {
                const answersObj = data.answers[0];

                // Question 1: Injuries
                if (answersObj['1']) {
                    const answer1 = answersObj['1'][0];
                    memberUpdates.hasInjuries = answer1.answer?.toLowerCase() === 'yes' ? 'yes' : answer1.answer?.toLowerCase() === 'no' ? 'no' : '';
                    if (answer1.comments) {
                        memberUpdates.injuryDetails = answer1.comments;
                    }
                }

                // Question 2: Physical restrictions
                if (answersObj['2']) {
                    const answer2 = answersObj['2'][0];
                    memberUpdates.hasPhysicalRestrictions = answer2.answer?.toLowerCase() === 'yes' ? 'yes' : answer2.answer?.toLowerCase() === 'no' ? 'no' : '';
                }

                // Question 3: Current medication
                if (answersObj['3']) {
                    const answer3 = answersObj['3'][0];
                    memberUpdates.hasCurrentMedication = answer3.answer?.toLowerCase() === 'yes' ? 'yes' : answer3.answer?.toLowerCase() === 'no' ? 'no' : '';
                }

                // Question 4: Pilates experience
                if (answersObj['4']) {
                    const answer4 = answersObj['4'][0];
                    memberUpdates.pilatesExperience = answer4.answer || '';
                }

                // Question 5: Fitness goals
                if (answersObj['5']) {
                    const goals = answersObj['5'].map((ans: any) => ans.answer).filter(Boolean);
                    memberUpdates.fitnessGoals = goals;
                    const otherGoal = answersObj['5'].find((ans: any) => ans.answer === 'Other');
                    if (otherGoal && otherGoal.comments) {
                        memberUpdates.fitnessGoalsOther = otherGoal.comments;
                    }
                }

                // Question 6: Interested sessions
                if (answersObj['6']) {
                    const sessions = answersObj['6'].map((ans: any) => ans.answer).filter(Boolean);
                    memberUpdates.interestedSessions = sessions;
                    const otherSession = answersObj['6'].find((ans: any) => ans.answer === 'Other');
                    if (otherSession && otherSession.comments) {
                        memberUpdates.interestedSessionsOther = otherSession.comments;
                    }
                }

                // Question 7: How did you hear about the club
                if (answersObj['7']) {
                    const answer7 = answersObj['7'][0];
                    memberUpdates.heardAbout = answer7.answer || '';
                }

                // Question 8: Motivations
                if (answersObj['8']) {
                    const motivations = answersObj['8'].map((ans: any) => ans.answer).filter(Boolean);
                    memberUpdates.motivations = motivations;
                }

                // Question 9: Update preferences
                if (answersObj['9']) {
                    const preferences = answersObj['9'].map((ans: any) => ans.answer).filter(Boolean);
                    memberUpdates.updatePreferences = preferences;
                }

                // Question 10: Communication channels
                if (answersObj['10']) {
                    const channels = answersObj['10'].map((ans: any) => ans.answer).filter(Boolean);
                    memberUpdates.communicationChannel = channels;
                }

                // Question 11: Profession
                if (answersObj['11']) {
                    const answer11 = answersObj['11'][0];
                    memberUpdates.profession = answer11.answer || '';
                }

                // Question 12: Company name
                if (answersObj['12']) {
                    const answer12 = answersObj['12'][0];
                    memberUpdates.companyName = answer12.answer || '';
                }

                // Question 13: Corporate interest
                if (answersObj['13']) {
                    const answer13 = answersObj['13'][0];
                    memberUpdates.corporateInterest = answer13.answer?.toLowerCase() === 'yes' ? 'yes' : answer13.answer?.toLowerCase() === 'no' ? 'no' : '';
                }
            } else if (data.snag_answers && Array.isArray(data.snag_answers)) {
                // New format: snag_answers is an array of answers with `question_id` and `ans_descr`
                const snagByQ: { [key: number]: string[] } = {};
                data.snag_answers.forEach((a: any) => {
                    const q = Number(a.question_id);
                    if (!snagByQ[q]) snagByQ[q] = [];
                    if (a.ans_descr !== undefined && a.ans_descr !== null) snagByQ[q].push(String(a.ans_descr));
                });

                // Map fields using snagByQ
                if (snagByQ[1] && snagByQ[1].length > 0) {
                    const val = snagByQ[1][0].toLowerCase();
                    memberUpdates.hasInjuries = val === 'yes' ? 'yes' : val === 'no' ? 'no' : '';
                }
                if (snagByQ[2] && snagByQ[2].length > 0) {
                    const val = snagByQ[2][0].toLowerCase();
                    memberUpdates.hasPhysicalRestrictions = val === 'yes' ? 'yes' : val === 'no' ? 'no' : '';
                }
                if (snagByQ[3] && snagByQ[3].length > 0) {
                    const val = snagByQ[3][0].toLowerCase();
                    memberUpdates.hasCurrentMedication = val === 'yes' ? 'yes' : val === 'no' ? 'no' : '';
                }
                if (snagByQ[4] && snagByQ[4].length > 0) {
                    memberUpdates.pilatesExperience = snagByQ[4][0] || '';
                }
                if (snagByQ[5] && snagByQ[5].length > 0) {
                    memberUpdates.fitnessGoals = snagByQ[5].map((s) => s);
                }
                if (snagByQ[6] && snagByQ[6].length > 0) {
                    memberUpdates.interestedSessions = snagByQ[6].map((s) => s);
                }
                if (snagByQ[7] && snagByQ[7].length > 0) {
                    memberUpdates.heardAbout = snagByQ[7][0] || '';
                }
                if (snagByQ[8] && snagByQ[8].length > 0) {
                    memberUpdates.motivations = snagByQ[8].map((s) => s);
                }
                if (snagByQ[9] && snagByQ[9].length > 0) {
                    memberUpdates.updatePreferences = snagByQ[9].map((s) => s);
                }
                if (snagByQ[10] && snagByQ[10].length > 0) {
                    memberUpdates.communicationChannel = snagByQ[10].map((s) => s);
                }
                if (snagByQ[11] && snagByQ[11].length > 0) {
                    memberUpdates.profession = snagByQ[11][0] || '';
                }
                if (snagByQ[12] && snagByQ[12].length > 0) {
                    memberUpdates.companyName = snagByQ[12][0] || '';
                }
                if (snagByQ[13] && snagByQ[13].length > 0) {
                    const val = snagByQ[13][0].toLowerCase();
                    memberUpdates.corporateInterest = val === 'yes' ? 'yes' : val === 'no' ? 'no' : '';
                }
            }

            // Apply all member updates at once
            if (Object.keys(memberUpdates).length > 0) {
                updateMember(members[0].id, memberUpdates);
            }

            // Set existing image previews for the member (but not the files, as they're already on server)
            const imageUpdates: Partial<MemberData> = {};
            if (data.identification_image) {
                imageUpdates.idCardPreview = data.identification_image;
            }

            if (data.avatar) {
                // Handle avatar URL format
                const avatarUrl = data.avatar?.startsWith('%2F')
                    ? `https://fm-uat-api.lockated.com${decodeURIComponent(data.avatar)}`
                    : data.avatar;
                imageUpdates.residentPhotoPreview = avatarUrl;
            }

            if (Object.keys(imageUpdates).length > 0) {
                updateMember(members[0].id, imageUpdates);
            }

            toast.success('Membership data loaded');
        } catch (error) {
            console.error('Error loading membership data:', error);
            toast.error('Failed to load membership data');
        } finally {
            setLoading(false);
        }
    };

    // Load users from API
    const loadUsers = async () => {
        setLoadingUsers(true);
        try {
            const url = getFullUrl('/pms/account_setups/occupant_users.json');
            const options = getAuthenticatedFetchOptions('GET');
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error('Failed to fetch occupant users');
            }

            const data = await response.json();

            if (data.occupant_users && Array.isArray(data.occupant_users)) {
                setUsers(data.occupant_users);
            } else {
                console.error('Unexpected API response format:', data);
                toast.error('Failed to load users');
            }
        } catch (error) {
            console.error('Error loading users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoadingUsers(false);
        }
    };

    // Handle user selection - now handled inline in JSX onChange handlers

    // Handle file uploads
    // File upload handlers for member-specific files
    const handleIdCardUpload = (memberId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                updateMember(memberId, {
                    idCardFile: file,
                    idCardPreview: reader.result as string
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResidentPhotoUpload = (memberId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                updateMember(memberId, {
                    residentPhotoFile: file,
                    residentPhotoPreview: reader.result as string
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAttachmentUpload = (memberId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files);
            const member = members.find(m => m.id === memberId);
            if (!member) return;

            const updatedAttachments = [...member.attachmentFiles, ...newFiles];
            const newPreviews: string[] = [];

            // Create previews for new files
            let filesProcessed = 0;
            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result as string);
                    filesProcessed++;

                    if (filesProcessed === newFiles.length) {
                        updateMember(memberId, {
                            attachmentFiles: updatedAttachments,
                            attachmentPreviews: [...member.attachmentPreviews, ...newPreviews]
                        });
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    // Remove files
    const removeIdCard = (memberId: string) => {
        updateMember(memberId, {
            idCardFile: null,
            idCardPreview: null
        });
    };

    const removeResidentPhoto = (memberId: string) => {
        updateMember(memberId, {
            residentPhotoFile: null,
            residentPhotoPreview: null
        });
    };

    const removeAttachment = (memberId: string, index: number) => {
        const member = members.find(m => m.id === memberId);
        if (!member) return;

        updateMember(memberId, {
            attachmentFiles: member.attachmentFiles.filter((_, i) => i !== index),
            attachmentPreviews: member.attachmentPreviews.filter((_, i) => i !== index)
        });
    };


    // Build answers payload structure from member data
    const buildAnswersPayload = (member: MemberData) => {
        const answersObj: any = {};

        // Question 1: Existing injuries or medical conditions
        answersObj['1'] = [
            {
                answer: member.hasInjuries.toUpperCase() || '',
                comments: member.hasInjuries === 'yes' ? member.injuryDetails : ''
            }
        ];

        // Question 2: Physical restrictions
        answersObj['2'] = [
            {
                answer: member.hasPhysicalRestrictions.toUpperCase() || '',
                comments: ''
            }
        ];

        // Question 3: Current medication
        answersObj['3'] = [
            {
                answer: member.hasCurrentMedication.toUpperCase() || '',
                comments: ''
            }
        ];

        // Question 4: Pilates experience
        answersObj['4'] = [
            {
                answer: member.pilatesExperience || '',
                comments: ''
            }
        ];

        // Question 5: Primary Fitness Goals (multiple answers)
        answersObj['5'] = member.fitnessGoals.map((goal) => ({
            answer: goal,
            comments: goal === 'Other' ? member.fitnessGoalsOther : ''
        }));

        // Question 6: Interested Sessions (multiple answers)
        answersObj['6'] = member.interestedSessions.map((session) => ({
            answer: session,
            comments: session === 'Other' ? member.interestedSessionsOther : ''
        }));

        // Question 7: How did you hear about the club
        answersObj['7'] = [
            {
                answer: member.heardAbout || '',
                comments: ''
            }
        ];

        // Question 8: Motivations (multiple answers)
        answersObj['8'] = member.motivations.map((motivation) => ({
            answer: motivation,
            comments: ''
        }));

        // Question 9: Update preferences (multiple answers)
        answersObj['9'] = member.updatePreferences.map((preference) => ({
            answer: preference,
            comments: ''
        }));

        // Question 10: Communication channel (multiple answers)
        answersObj['10'] = member.communicationChannel.map((channel) => ({
            answer: channel,
            comments: ''
        }));

        // Question 11: Profession
        answersObj['11'] = [
            {
                answer: member.profession || '',
                comments: ''
            }
        ];

        // Question 12: Company name
        answersObj['12'] = [
            {
                answer: member.companyName || '',
                comments: ''
            }
        ];

        // Question 13: Corporate interest
        answersObj['13'] = [
            {
                answer: member.corporateInterest.toUpperCase() || '',
                comments: ''
            }
        ];

        return [answersObj];
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Validate all members (not just "active" ones)
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            const memberLabel = `Member ${i + 1}`;

            // Validate user selection
            if (member.userSelectionMode === 'select' && !member.selectedUserId) {
                toast.error(`${memberLabel}: Please select a user`);
                return;
            }

            if (member.userSelectionMode === 'manual') {
                if (!member.formData.firstName || !member.formData.lastName) {
                    toast.error(`${memberLabel}: Please enter first name and last name`);
                    return;
                }
                if (!member.formData.email) {
                    toast.error(`${memberLabel}: Please enter email address`);
                    return;
                }
                if (!validateEmail(member.formData.email)) {
                    toast.error(`${memberLabel}: Please enter a valid email address`);
                    return;
                }
                if (!member.formData.mobile) {
                    toast.error(`${memberLabel}: Please enter mobile number`);
                    return;
                }
                if (!validateMobile(member.formData.mobile)) {
                    toast.error(`${memberLabel}: Please enter a valid 10-digit mobile number`);
                    return;
                }
            }

            // Validate PIN code if provided
            if (member.formData.pin_code && !validatePinCode(member.formData.pin_code)) {
                toast.error(`${memberLabel}: Please enter a valid 6-digit PIN code`);
                return;
            }

            // Mandatory file validations - only for add mode
            if (!isEditMode) {
                if (!member.idCardFile) {
                    toast.error(`${memberLabel}: Please upload ID card (mandatory)`);
                    return;
                }

                if (!member.residentPhotoFile) {
                    toast.error(`${memberLabel}: Please upload resident photo (mandatory)`);
                    return;
                }
            }

            if (cardAllocated && !member.formData.accessCardId) {
                toast.error(`${memberLabel}: Please enter access card ID`);
                return;
            }
        }

        // Note: Date and emergency contact validations are already done in handleNext, 
        // but we keep them here as a safety check
        if (!startDate || !endDate) {
            toast.error('Please ensure start and end dates are selected');
            return;
        }

        if (endDate.isBefore(startDate)) {
            toast.error('End date must be after start date');
            return;
        }

        if (emergencyContactName && !validateMobile(emergencyContactName)) {
            toast.error('Please enter a valid 10-digit emergency contact number');
            return;
        }

        setIsSubmitting(true);
        try {
            const siteId = getSiteIdFromStorage();
            const companyId = getCompanyIdFromStorage();

            // Find group leader (first member with mobile)
            const groupLeader = members.find(m => m.formData.mobile) || members[0];

            // Build members array for payload - include ALL members
            const membersPayload = await Promise.all(members.map(async (member) => {
                // Convert files to base64
                let identificationImageBase64 = '';
                let avatarBase64 = '';
                const attachmentsBase64: string[] = [];

                if (member.idCardFile) {
                    identificationImageBase64 = await fileToBase64(member.idCardFile);
                }

                if (member.residentPhotoFile) {
                    avatarBase64 = await fileToBase64(member.residentPhotoFile);
                }

                if (member.attachmentFiles.length > 0) {
                    for (const file of member.attachmentFiles) {
                        const base64 = await fileToBase64(file);
                        attachmentsBase64.push(base64);
                    }
                }

                // Build member object
                const memberObj: any = {
                    firstname: member.formData.firstName,
                    lastname: member.formData.lastName,
                    mobile: member.formData.mobile,
                    email: member.formData.email,
                    gender: member.formData.gender || '',
                    birth_date: member.formData.dateOfBirth || '',
                    user_type: 'ClubMember',
                    club_member: {
                        club_member_enabled: true,
                        access_card_enabled: cardAllocated,
                        access_card_id: cardAllocated ? member.formData.accessCardId : null,
                        emergency_contact_name: emergencyContactName
                    },
                    addresses: [
                        {
                            address: member.formData.address,
                            address_line_two: member.formData.address_line_two,
                            city: member.formData.city,
                            state: member.formData.state,
                            country: member.formData.country,
                            pin_code: member.formData.pin_code,
                            address_type: member.formData.address_type || 'residential'
                        }
                    ],
                    permissions: [
                        {
                            account_id: parseInt(companyId),
                            user_type: 'pms_occupant',
                            access_level: accessLevel,
                            access_to: [parseInt(siteId)],
                            status: 'pending'
                        }
                    ],
                    answers: buildAnswersPayload(member),
                    custom_amenities: selectedAddOns.map(addOnId => ({
                        facility_setup_id: addOnId,
                        access: true
                    }))
                };

                // Add files if present
                if (identificationImageBase64) {
                    memberObj.identification_image = identificationImageBase64;
                }
                if (avatarBase64) {
                    memberObj.avatar = avatarBase64;
                }
                if (attachmentsBase64.length > 0) {
                    memberObj.attachments = attachmentsBase64;
                }

                // If user was selected, add user_id
                if (member.userSelectionMode === 'select' && member.selectedUserId) {
                    memberObj.user_id = member.selectedUserId;
                }

                return memberObj;
            }));

            // Prepare group membership payload
            const payload: any = {
                club_member_allocation: {
                    membership_plan_id: selectedPlanId,
                    pms_site_id: parseInt(siteId),
                    preferred_start_date: startDate ? startDate.format('YYYY-MM-DD') : null,
                    start_date: startDate ? startDate.format('YYYY-MM-DD') : null,
                    end_date: endDate ? endDate.format('YYYY-MM-DD') : null,
                    referred_by: referredBy,
                    total_members: members.length,
                    group_leader_mobile: groupLeader.formData.mobile,
                    allocation_payment_detail_attributes: {
                        base_amount: parseFloat(editablePlanCost) || 0,
                        discount: discountAmount,
                        cgst: cgstAmount,
                        sgst: sgstAmount,
                        total_tax: cgstAmount + sgstAmount,
                        total_amount: totalCost,
                        landed_amount: totalCost,
                        payment_status: 'success',
                        payment_mode: 'online'
                    },
                    members: membersPayload
                }
            };

            const savedToken = getToken();

            // Use group allocation endpoint
            const url = getFullUrl(isEditMode ? `/club_member_allocations/${id}.json` : '/club_member_allocations.json');
            const options: RequestInit = {
                method: isEditMode ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${savedToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            };

            console.log('Submitting payload:', JSON.stringify(payload, null, 2));

            const response = await fetch(url, options);

            if (!response.ok) {
                let errorData: any = {};
                const contentType = response.headers.get('content-type');

                try {
                    // Try to parse as JSON first
                    if (contentType && contentType.includes('application/json')) {
                        errorData = await response.json();
                    } else {
                        // If not JSON, read as text
                        const errorText = await response.text();
                        errorData = { error: errorText };
                    }
                } catch (parseError) {
                    // If parsing fails, try to read as text
                    const errorText = await response.text();
                    errorData = { error: errorText };
                }

                console.error('API Error Response:', errorData);

                // Handle specific error messages
                if (errorData.error === "User is already exist" || errorData.error === "User already exists") {
                    toast.error('This user already has a club membership');
                } else if (errorData.error && errorData.error.includes('User has already been taken')) {
                    toast.error('This user already has a club membership');
                } else if (typeof errorData.error === 'string' && errorData.error.includes('already')) {
                    toast.error('This user already exists in the system');
                } else if (errorData.message) {
                    toast.error(errorData.message);
                } else if (errorData.error) {
                    toast.error(errorData.error);
                } else {
                    toast.error(`Failed to ${isEditMode ? 'update' : 'create'} club membership`);
                }

                setIsSubmitting(false);
                return;
            }

            const data = await response.json();
            console.log(`Club membership ${isEditMode ? 'updated' : 'created'} successfully:`, data);

            toast.success(`Club membership ${isEditMode ? 'updated' : 'added'} successfully`);
            navigate('/club-management/membership');
        } catch (error) {
            console.error('Error adding membership:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to add membership');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoBack = () => {
        navigate('/club-management/membership');
    };

    // Add validation helper functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateMobile = (mobile: string): boolean => {
        const mobileRegex = /^[0-9]{10}$/;
        return mobileRegex.test(mobile);
    };

    const validatePinCode = (pinCode: string): boolean => {
        const pinCodeRegex = /^[0-9]{6}$/;
        return pinCodeRegex.test(pinCode);
    };

    // Handle next step with proper validation
    const handleNext = () => {
        // Validation for step 1 (Membership Plan Selection)
        if (!selectedPlanId) {
            toast.error('Please select a membership plan');
            return;
        }

        // Validate shared membership details
        if (!startDate) {
            toast.error('Please select start date (mandatory)');
            return;
        }

        if (!endDate) {
            toast.error('Please select end date (mandatory)');
            return;
        }

        // Validate that end date is after start date
        if (endDate && startDate && endDate.isBefore(startDate)) {
            toast.error('End date must be after start date');
            return;
        }

        // Validate emergency contact if provided
        if (emergencyContactName && !validateMobile(emergencyContactName)) {
            toast.error('Please enter a valid 10-digit emergency contact number');
            return;
        }

        // Move to next step
        setCurrentStep(2);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle back to step 1
    const handleBackToStep1 = () => {
        setCurrentStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Get selected plan
    const selectedPlan = membershipPlans.find(plan => plan.id === selectedPlanId);

    // Get user limit from selected plan (parse as number since API returns string)
    const userLimit = parseInt(selectedPlan?.user_limit || '1');

    // Update editable cost when plan is selected
    React.useEffect(() => {
        if (selectedPlan) {
            setEditablePlanCost(selectedPlan.price);
        }
    }, [selectedPlan]);

    // Get plan amenity IDs
    const planAmenityIds = selectedPlan?.plan_amenities?.map(pa => pa.facility_setup_id) || [];

    // Get available add-ons (amenities not in plan)
    const availableAddOns = allAmenities.filter(amenity => !planAmenityIds.includes(amenity.value));

    // Create new member template
    const createNewMember = (): MemberData => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        userSelectionMode: 'select',
        selectedUser: '',
        selectedUserId: null,
        formData: {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
            email: '',
            mobile: '',
            emergencyContactName: '',
            address: '',
            address_line_two: '',
            city: '',
            state: '',
            country: '',
            pin_code: '',
            address_type: 'residential',
            residentType: '',
            relationWithOwner: '',
            membershipNumber: '',
            accessCardId: '',
            membershipType: '',
            referredBy: '',
        },
        idCardFile: null,
        residentPhotoFile: null,
        attachmentFiles: [],
        idCardPreview: null,
        residentPhotoPreview: null,
        attachmentPreviews: [],
        hasInjuries: '',
        injuryDetails: '',
        hasPhysicalRestrictions: '',
        hasCurrentMedication: '',
        pilatesExperience: '',
        fitnessGoals: [],
        fitnessGoalsOther: '',
        interestedSessions: [],
        interestedSessionsOther: '',
        heardAbout: '',
        motivations: [],
        updatePreferences: [],
        communicationChannel: [],
        profession: '',
        companyName: '',
        corporateInterest: '',
    });

    // Replace the card-specific add/remove functions with a single unified approach
    const handleAddMember = () => {
        if (members.length >= userLimit) {
            toast.error(`Maximum ${userLimit} members allowed for this plan`);
            return;
        }
        const newMember = createNewMember();
        setMembers([...members, newMember]);
        toast.success(`Member ${members.length + 1} added`);
    };

    const handleRemoveMember = (memberId: string) => {
        if (members.length <= 1) {
            toast.error('At least one member is required');
            return;
        }
        setMembers(members.filter(m => m.id !== memberId));
        toast.success('Member removed');
    };

    // Copy address data only from previous member
    const copyAddressFromPrevious = (currentMemberIndex: number) => {
        if (currentMemberIndex === 0) return;
        const previousMember = members[currentMemberIndex - 1];
        const currentMember = members[currentMemberIndex];

        updateMember(currentMember.id, {
            formData: {
                ...currentMember.formData,
                address: previousMember.formData.address,
                address_line_two: previousMember.formData.address_line_two,
                city: previousMember.formData.city,
                state: previousMember.formData.state,
                country: previousMember.formData.country,
                pin_code: previousMember.formData.pin_code,
                address_type: previousMember.formData.address_type,
            }
        });
        toast.success('Address copied from previous member');
    };

    // Copy all data from previous member
    const copyAllDataFromPrevious = (currentMemberIndex: number) => {
        if (currentMemberIndex === 0) return;
        const previousMember = members[currentMemberIndex - 1];
        const currentMember = members[currentMemberIndex];

        updateMember(currentMember.id, {
            userSelectionMode: previousMember.userSelectionMode,
            selectedUser: previousMember.selectedUser,
            selectedUserId: previousMember.selectedUserId,
            formData: { ...previousMember.formData },
            hasInjuries: previousMember.hasInjuries,
            injuryDetails: previousMember.injuryDetails,
            hasPhysicalRestrictions: previousMember.hasPhysicalRestrictions,
            hasCurrentMedication: previousMember.hasCurrentMedication,
            pilatesExperience: previousMember.pilatesExperience,
            fitnessGoals: [...previousMember.fitnessGoals],
            fitnessGoalsOther: previousMember.fitnessGoalsOther,
            interestedSessions: [...previousMember.interestedSessions],
            interestedSessionsOther: previousMember.interestedSessionsOther,
            heardAbout: previousMember.heardAbout,
            motivations: [...previousMember.motivations],
            updatePreferences: [...previousMember.updatePreferences],
            communicationChannel: [...previousMember.communicationChannel],
            profession: previousMember.profession,
            companyName: previousMember.companyName,
            corporateInterest: previousMember.corporateInterest,
        });
        toast.success('All data copied from previous member');
    };

    // Calculate total cost with discount
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

    // Auto-populate end date when membership type or start date changes
    useEffect(() => {
        if (startDate && membershipType) {
            let newEndDate: Dayjs | null = null;
            
            switch (membershipType) {
                case 'Day Pass':
                    newEndDate = startDate.add(1, 'day');
                    break;
                case 'Monthly':
                    newEndDate = startDate.add(1, 'month');
                    break;
                case 'Quarterly':
                    newEndDate = startDate.add(3, 'month');
                    break;
                case 'Annual':
                    newEndDate = startDate.add(1, 'year');
                    break;
                case 'Corporate':
                    newEndDate = startDate.add(1, 'year');
                    break;
                default:
                    newEndDate = null;
            }
            
            if (newEndDate) {
                setEndDate(newEndDate);
            }
        }
    }, [startDate, membershipType]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={handleGoBack}
                            className="hover:bg-gray-100"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold text-[#1a1a1a]">
                                {isEditMode ? 'Edit Club Membership' : 'Add Club Membership'}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {isEditMode ? 'Update membership details' : 'Create a new club membership'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C72030]"></div>
                            <p className="text-gray-600">Loading membership data...</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Step 2: Member Details Forms */}
                        {currentStep === 2 && (
                            <>
                                {/* Header with Add Member Button */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-[#1a1a1a]">Group Members</h2>
                                            <p className="text-sm text-gray-500 mt-1">Add and manage all members in this group</p>
                                        </div>
                                        <Button
                                            onClick={handleAddMember}
                                            size="sm"
                                            className="bg-[#C72030] hover:bg-[#A01020] text-white"
                                            disabled={members.length >= userLimit}
                                        >
                                            <span className="mr-1">+</span> Add Member ({members.length}/{userLimit})
                                        </Button>
                                    </div>
                                </div>

                                {/* Members List - Each member has all sections */}
                                {members.map((member, memberIndex) => (
                                    <div key={member.id} className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
                                        {/* Member Header */}
                                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-[#C72030] text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                                                    {memberIndex + 1}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-[#1a1a1a]">
                                                        {member.formData.firstName && member.formData.lastName
                                                            ? `${member.formData.firstName} ${member.formData.lastName}`
                                                            : `Member ${memberIndex + 1}`}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {member.formData.email || 'No email provided'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {members.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveMember(member.id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <X className="w-4 h-4 mr-1" /> Remove
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Section 1: User Selection */}
                                        <div className="mb-8">
                                            <h4 className="text-md font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
                                                <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-xs">1</div>
                                                User Selection
                                            </h4>

                                            {/* User Selection Mode */}
                                            <div className="mb-6">
                                                <FormLabel component="legend" className="text-sm font-medium text-gray-700 mb-2">
                                                    Select User Mode
                                                </FormLabel>
                                                <RadioGroup
                                                    row
                                                    value={member.userSelectionMode}
                                                    onChange={(e) => {
                                                        const mode = e.target.value as 'select' | 'manual';
                                                        updateMember(member.id, {
                                                            userSelectionMode: mode,
                                                            selectedUser: '',
                                                            selectedUserId: null,
                                                            formData: {
                                                                ...member.formData,
                                                                firstName: '',
                                                                lastName: '',
                                                                email: '',
                                                                mobile: '',
                                                                dateOfBirth: '',
                                                                gender: '',
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        value="select"
                                                        control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                                                        label="Select User"
                                                    />
                                                    <FormControlLabel
                                                        value="manual"
                                                        control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                                                        label="Enter User Details"
                                                    />
                                                </RadioGroup>
                                            </div>

                                            {/* User Selection Dropdown */}
                                            {member.userSelectionMode === 'select' && (
                                                <div className="mb-6">
                                                    <FormControl fullWidth>
                                                        <TextField
                                                            select
                                                            label="User *"
                                                            value={member.selectedUser}
                                                            onChange={(e) => {
                                                                const userId = e.target.value;
                                                                const userIdNum = parseInt(userId);
                                                                const user = users.find(u => u.id === userIdNum);

                                                                if (user) {
                                                                    updateMember(member.id, {
                                                                        selectedUser: userId,
                                                                        selectedUserId: userIdNum,
                                                                        formData: {
                                                                            ...member.formData,
                                                                            firstName: user.firstname,
                                                                            lastName: user.lastname,
                                                                            email: user.email,
                                                                            mobile: user.mobile,
                                                                        }
                                                                    });
                                                                }
                                                            }}
                                                            sx={fieldStyles}
                                                            disabled={loadingUsers}
                                                        >
                                                            {loadingUsers ? (
                                                                <MenuItem value="">Loading users...</MenuItem>
                                                            ) : users.length === 0 ? (
                                                                <MenuItem value="">No users available</MenuItem>
                                                            ) : (
                                                                users.map((user) => (
                                                                    <MenuItem key={user.id} value={user.id.toString()}>
                                                                        {user.firstname} {user.lastname} - {user.email}
                                                                    </MenuItem>
                                                                ))
                                                            )}
                                                        </TextField>
                                                    </FormControl>
                                                </div>
                                            )}

                                            {/* Manual User Details */}
                                            {member.userSelectionMode === 'manual' && (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <TextField
                                                            label="First Name *"
                                                            value={member.formData.firstName}
                                                            onChange={(e) => updateMember(member.id, { formData: { ...member.formData, firstName: e.target.value } })}
                                                            sx={fieldStyles}
                                                            fullWidth
                                                            error={member.formData.firstName !== '' && member.formData.firstName.length < 2}
                                                            helperText={member.formData.firstName !== '' && member.formData.firstName.length < 2 ? 'Name must be at least 2 characters' : ''}
                                                        />
                                                        <TextField
                                                            label="Last Name *"
                                                            value={member.formData.lastName}
                                                            onChange={(e) => updateMember(member.id, { formData: { ...member.formData, lastName: e.target.value } })}
                                                            sx={fieldStyles}
                                                            fullWidth
                                                            error={member.formData.lastName !== '' && member.formData.lastName.length < 2}
                                                            helperText={member.formData.lastName !== '' && member.formData.lastName.length < 2 ? 'Name must be at least 2 characters' : ''}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <DatePicker
                                                            label="Date of Birth"
                                                            value={member.formData.dateOfBirth ? dayjs(member.formData.dateOfBirth, 'YYYY-MM-DD') : null}
                                                            onChange={(newValue) => {
                                                                if (newValue) {
                                                                    updateMember(member.id, { formData: { ...member.formData, dateOfBirth: newValue.format('YYYY-MM-DD') } });
                                                                } else {
                                                                    updateMember(member.id, { formData: { ...member.formData, dateOfBirth: '' } });
                                                                }
                                                            }}
                                                            format="DD/MM/YYYY"
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true,
                                                                    sx: fieldStyles,
                                                                },
                                                            }}
                                                        />
                                                        <FormControl fullWidth sx={fieldStyles}>
                                                            <InputLabel>Gender</InputLabel>
                                                            <Select
                                                                value={member.formData.gender}
                                                                onChange={(e) => updateMember(member.id, { formData: { ...member.formData, gender: e.target.value } })}
                                                                label="Gender"
                                                            >
                                                                <MenuItem value="">
                                                                    <em>Select Gender</em>
                                                                </MenuItem>
                                                                {GENDER_OPTIONS.map((option) => (
                                                                    <MenuItem key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <TextField
                                                            label="Mobile Number *"
                                                            value={member.formData.mobile}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Only allow numbers and limit to 10 digits
                                                                if (value === '' || /^\d{0,10}$/.test(value)) {
                                                                    updateMember(member.id, { formData: { ...member.formData, mobile: value } });
                                                                }
                                                            }}
                                                            sx={fieldStyles}
                                                            fullWidth
                                                            type="tel"
                                                            inputProps={{ 
                                                                maxLength: 10,
                                                                pattern: '[0-9]*',
                                                                inputMode: 'numeric'
                                                            }}
                                                            error={member.formData.mobile !== '' && !validateMobile(member.formData.mobile)}
                                                            helperText={member.formData.mobile !== '' && !validateMobile(member.formData.mobile) ? 'Please enter a valid 10-digit mobile number' : ''}
                                                        />
                                                        <TextField
                                                            label="Email Address *"
                                                            type="email"
                                                            value={member.formData.email}
                                                            onChange={(e) => updateMember(member.id, { formData: { ...member.formData, email: e.target.value } })}
                                                            sx={fieldStyles}
                                                            fullWidth
                                                            error={member.formData.email !== '' && !validateEmail(member.formData.email)}
                                                            helperText={member.formData.email !== '' && !validateEmail(member.formData.email) ? 'Please enter a valid email address' : ''}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Section 2: Address Details */}
                                        <div className="mb-8 pt-8 border-t border-gray-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-md font-semibold text-[#1a1a1a] flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-xs">2</div>
                                                    Address Details
                                                </h4>
                                                {memberIndex > 0 && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => copyAddressFromPrevious(memberIndex)}
                                                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Copy className="w-4 h-4 mr-1" /> Copy from Member {memberIndex}
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <TextField
                                                    label="Address"
                                                    value={member.formData.address}
                                                    onChange={(e) => updateMember(member.id, { formData: { ...member.formData, address: e.target.value } })}
                                                    sx={fieldStyles}
                                                    fullWidth
                                                />
                                                <TextField
                                                    label="Address Line Two"
                                                    value={member.formData.address_line_two}
                                                    onChange={(e) => updateMember(member.id, { formData: { ...member.formData, address_line_two: e.target.value } })}
                                                    sx={fieldStyles}
                                                    fullWidth
                                                />
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <TextField
                                                        label="City"
                                                        value={member.formData.city}
                                                        onChange={(e) => updateMember(member.id, { formData: { ...member.formData, city: e.target.value } })}
                                                        sx={fieldStyles}
                                                        fullWidth
                                                    />
                                                    <TextField
                                                        label="State"
                                                        value={member.formData.state}
                                                        onChange={(e) => updateMember(member.id, { formData: { ...member.formData, state: e.target.value } })}
                                                        sx={fieldStyles}
                                                        fullWidth
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <TextField
                                                        label="Country"
                                                        value={member.formData.country}
                                                        onChange={(e) => updateMember(member.id, { formData: { ...member.formData, country: e.target.value } })}
                                                        sx={fieldStyles}
                                                        fullWidth
                                                    />
                                                    <TextField
                                                        label="Pin Code"
                                                        value={member.formData.pin_code}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            // Only allow numbers and limit to 6 digits
                                                            if (value === '' || /^\d{0,6}$/.test(value)) {
                                                                updateMember(member.id, { formData: { ...member.formData, pin_code: value } });
                                                            }
                                                        }}
                                                        sx={fieldStyles}
                                                        fullWidth
                                                        type="tel"
                                                        inputProps={{ 
                                                            maxLength: 6,
                                                            pattern: '[0-9]*',
                                                            inputMode: 'numeric'
                                                        }}
                                                        error={member.formData.pin_code !== '' && !validatePinCode(member.formData.pin_code)}
                                                        helperText={member.formData.pin_code !== '' && !validatePinCode(member.formData.pin_code) ? 'Please enter a valid 6-digit PIN code' : ''}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 3: Upload Documents */}
                                        <div className="mb-8 pt-8 border-t border-gray-200">
                                            <h4 className="text-md font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
                                                <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-xs">3</div>
                                                Upload Documents {!isEditMode && <span className="text-red-500">*</span>}
                                            </h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                {/* ID Card Upload */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        ID Card {!isEditMode && <span className="text-red-500">*</span>}
                                                    </label>
                                                    <div className={`border-2 border-dashed rounded-lg p-6 text-center ${member.idCardFile || member.idCardPreview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-[#C72030]'}`}>
                                                        {(member.idCardFile || member.idCardPreview) ? (
                                                            <div>
                                                                {member.idCardPreview && (
                                                                    <img src={member.idCardPreview} alt="ID Card" className="max-h-40 mx-auto rounded mb-3" />
                                                                )}
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm text-gray-600">{member.idCardFile?.name || 'Existing ID Card'}</span>
                                                                    <Button variant="ghost" size="sm" onClick={() => removeIdCard(member.id)} className="text-red-600">
                                                                        <X className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                                                <p className="text-sm text-gray-500 mb-2">Upload ID Card</p>
                                                                <input type="file" accept="image/*" onChange={(e) => handleIdCardUpload(member.id, e)} className="hidden" id={`id-card-${member.id}`} />
                                                                <label htmlFor={`id-card-${member.id}`}>
                                                                    <Button variant="outline" className="cursor-pointer" asChild><span>Choose File</span></Button>
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Member Photo Upload */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Member Photo {!isEditMode && <span className="text-red-500">*</span>}
                                                    </label>
                                                    <div className={`border-2 border-dashed rounded-lg p-6 text-center ${member.residentPhotoFile || member.residentPhotoPreview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-[#C72030]'}`}>
                                                        {(member.residentPhotoFile || member.residentPhotoPreview) ? (
                                                            <div>
                                                                {member.residentPhotoPreview && (
                                                                    <img src={member.residentPhotoPreview} alt="Photo" className="max-h-40 mx-auto rounded mb-3" />
                                                                )}
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm text-gray-600">{member.residentPhotoFile?.name || 'Existing Photo'}</span>
                                                                    <Button variant="ghost" size="sm" onClick={() => removeResidentPhoto(member.id)} className="text-red-600">
                                                                        <X className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                                                <p className="text-sm text-gray-500 mb-2">Upload Photo</p>
                                                                <input type="file" accept="image/*" onChange={(e) => handleResidentPhotoUpload(member.id, e)} className="hidden" id={`photo-${member.id}`} />
                                                                <label htmlFor={`photo-${member.id}`}>
                                                                    <Button variant="outline" className="cursor-pointer" asChild><span>Choose File</span></Button>
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Other Documents - Multiple Upload */}
                                            <div className="mb-6">
                                                <h3 className="text-sm font-medium text-gray-700 mb-4">Other Documents</h3>
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#C72030] transition-colors">
                                                    <div className="text-center mb-4">
                                                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                                        <p className="text-sm text-gray-500 mb-2">Upload Additional Documents</p>
                                                        <input
                                                            type="file"
                                                            accept="image/*,.pdf,.doc,.docx"
                                                            onChange={(e) => handleAttachmentUpload(member.id, e)}
                                                            className="hidden"
                                                            id={`other-documents-${member.id}`}
                                                            multiple
                                                        />
                                                        <label htmlFor={`other-documents-${member.id}`}>
                                                            <Button variant="outline" className="cursor-pointer" asChild>
                                                                <span>Choose Files</span>
                                                            </Button>
                                                        </label>
                                                        <p className="text-xs text-gray-400 mt-2">You can select multiple files</p>
                                                    </div>

                                                    {/* Display uploaded documents */}
                                                    {member.attachmentFiles.length > 0 && (
                                                        <div className="mt-4">
                                                            <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Documents ({member.attachmentFiles.length})</h4>
                                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                                {member.attachmentFiles.map((file, index) => (
                                                                    <div key={index} className="relative border border-gray-200 rounded-lg p-2 group">
                                                                        {/* Preview for images */}
                                                                        {file.type.startsWith('image/') && member.attachmentPreviews[index] ? (
                                                                            <div className="mb-2">
                                                                                <img
                                                                                    src={member.attachmentPreviews[index]}
                                                                                    alt={`Document ${index + 1}`}
                                                                                    className="w-full h-24 object-cover rounded"
                                                                                />
                                                                            </div>
                                                                        ) : (
                                                                            <div className="mb-2 h-24 bg-gray-100 rounded flex items-center justify-center">
                                                                                <div className="text-center">
                                                                                    <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                                                                                    <span className="text-xs text-gray-500">
                                                                                        {file.type.includes('pdf') ? 'PDF' : 'DOC'}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <p className="text-xs text-gray-600 truncate mb-1" title={file.name}>
                                                                            {file.name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-400">
                                                                            {(file.size / 1024).toFixed(1)} KB
                                                                        </p>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => removeAttachment(member.id, index)}
                                                                            className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 4: Health & Wellness */}
                                        <div className="mb-8 pt-8 border-t border-gray-200">
                                            <h4 className="text-md font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
                                                <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-xs">4</div>
                                                Health & Wellness Information
                                            </h4>

                                            <div className="space-y-6">
                                                <div>
                                                    <FormLabel component="legend" className="text-sm font-medium mb-2">
                                                        Do you have any existing injuries or medical conditions?
                                                    </FormLabel>
                                                    <RadioGroup row value={member.hasInjuries} onChange={(e) => updateMember(member.id, { hasInjuries: e.target.value as 'yes' | 'no' })}>
                                                        <FormControlLabel value="yes" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Yes" />
                                                        <FormControlLabel value="no" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="No" />
                                                    </RadioGroup>
                                                    {member.hasInjuries === 'yes' && (
                                                        <TextField
                                                            label="Please specify"
                                                            value={member.injuryDetails}
                                                            onChange={(e) => updateMember(member.id, { injuryDetails: e.target.value })}
                                                            multiline
                                                            rows={3}
                                                            fullWidth
                                                            sx={{ mt: 2 }}
                                                        />
                                                    )}
                                                </div>

                                                <div>
                                                    <FormLabel component="legend" className="text-sm font-medium mb-2">
                                                        Do you have any physical restrictions?
                                                    </FormLabel>
                                                    <RadioGroup row value={member.hasPhysicalRestrictions} onChange={(e) => updateMember(member.id, { hasPhysicalRestrictions: e.target.value as 'yes' | 'no' })}>
                                                        <FormControlLabel value="yes" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Yes" />
                                                        <FormControlLabel value="no" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="No" />
                                                    </RadioGroup>
                                                </div>

                                                <div>
                                                    <FormLabel component="legend" className="text-sm font-medium mb-2">
                                                        Are you currently under medication?
                                                    </FormLabel>
                                                    <RadioGroup row value={member.hasCurrentMedication} onChange={(e) => updateMember(member.id, { hasCurrentMedication: e.target.value as 'yes' | 'no' })}>
                                                        <FormControlLabel value="yes" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Yes" />
                                                        <FormControlLabel value="no" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="No" />
                                                    </RadioGroup>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 5: Activity Interests */}
                                        <div className="mb-8 pt-8 border-t border-gray-200">
                                            <h4 className="text-md font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
                                                <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-xs">5</div>
                                                Activity Interests
                                            </h4>

                                            <div className="space-y-6">
                                                <div>
                                                    <FormLabel component="legend" className="text-sm font-medium mb-3">
                                                        Primary Fitness Goals:
                                                    </FormLabel>
                                                    <div className="space-y-1">
                                                        {['General Fitness', 'Strength Training', 'Pilates', 'Mobility & Flexibility', 'Weight Management', 'Stress Relief / Lifestyle Wellness'].map((goal) => (
                                                            <FormControlLabel
                                                                key={goal}
                                                                control={
                                                                    <Checkbox
                                                                        size="small"
                                                                        checked={member.fitnessGoals.includes(goal)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                updateMember(member.id, { fitnessGoals: [...member.fitnessGoals, goal] });
                                                                            } else {
                                                                                updateMember(member.id, { fitnessGoals: member.fitnessGoals.filter(g => g !== goal) });
                                                                            }
                                                                        }}
                                                                        sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                                                                    />
                                                                }
                                                                label={<span className="text-sm">{goal}</span>}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <FormLabel component="legend" className="text-sm font-medium mb-3">
                                                        Have you practiced Pilates before?
                                                    </FormLabel>
                                                    <FormControl fullWidth sx={fieldStyles}>
                                                        <Select
                                                            value={member.pilatesExperience}
                                                            onChange={(e) => updateMember(member.id, { pilatesExperience: e.target.value })}
                                                            displayEmpty
                                                        >
                                                            <MenuItem value=""><em>Select Experience Level</em></MenuItem>
                                                            <MenuItem value="Never">Never</MenuItem>
                                                            <MenuItem value="Beginner">Beginner</MenuItem>
                                                            <MenuItem value="Intermediate">Intermediate</MenuItem>
                                                            <MenuItem value="Advanced">Advanced</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 6: Lifestyle & Communication */}
                                        <div className="mb-8 pt-8 border-t border-gray-200">
                                            <h4 className="text-md font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
                                                <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-xs">6</div>
                                                Lifestyle & Communication
                                            </h4>

                                            <div className="space-y-6">
                                                <div>
                                                    <FormLabel component="legend" className="text-sm font-medium mb-2">
                                                        How did you hear about us?
                                                    </FormLabel>
                                                    <FormControl fullWidth sx={fieldStyles}>
                                                        <Select
                                                            value={member.heardAbout}
                                                            onChange={(e) => updateMember(member.id, { heardAbout: e.target.value })}
                                                            displayEmpty
                                                        >
                                                            <MenuItem value=""><em>Select an option</em></MenuItem>
                                                            <MenuItem value="Instagram">Instagram</MenuItem>
                                                            <MenuItem value="Friend / Referral">Friend / Referral</MenuItem>
                                                            <MenuItem value="Event">Event</MenuItem>
                                                            <MenuItem value="Other">Other</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>

                                                <div>
                                                    <FormLabel component="legend" className="text-sm font-medium mb-2">
                                                        Preferred Communication Channel:
                                                    </FormLabel>
                                                    <div className="space-y-1">
                                                        {['WhatsApp', 'Email', 'SMS'].map((channel) => (
                                                            <FormControlLabel
                                                                key={channel}
                                                                control={
                                                                    <Checkbox
                                                                        size="small"
                                                                        checked={member.communicationChannel.includes(channel)}
                                                                        onChange={(e) => {
                                                                            const current = member.communicationChannel;
                                                                            if (e.target.checked) {
                                                                                updateMember(member.id, { communicationChannel: [...current, channel] });
                                                                            } else {
                                                                                updateMember(member.id, { communicationChannel: current.filter(c => c !== channel) });
                                                                            }
                                                                        }}
                                                                        sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                                                                    />
                                                                }
                                                                label={<span className="text-sm">{channel}</span>}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 7: Occupation */}
                                        <div className="pt-8 border-t border-gray-200">
                                            <h4 className="text-md font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
                                                <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-xs">7</div>
                                                Occupation & Demographics
                                            </h4>

                                            <div className="space-y-4">
                                                <TextField
                                                    label="Profession / Industry"
                                                    value={member.profession}
                                                    onChange={(e) => updateMember(member.id, { profession: e.target.value })}
                                                    sx={fieldStyles}
                                                    fullWidth
                                                />
                                                <TextField
                                                    label="Company Name"
                                                    value={member.companyName}
                                                    onChange={(e) => updateMember(member.id, { companyName: e.target.value })}
                                                    sx={fieldStyles}
                                                    fullWidth
                                                />
                                                <div>
                                                    <FormLabel component="legend" className="text-sm font-medium mb-2">
                                                        Interested in corporate/group plans?
                                                    </FormLabel>
                                                    <RadioGroup row value={member.corporateInterest} onChange={(e) => updateMember(member.id, { corporateInterest: e.target.value as 'yes' | 'no' })}>
                                                        <FormControlLabel value="yes" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Yes" />
                                                        <FormControlLabel value="no" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="No" />
                                                    </RadioGroup>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Submit Buttons */}
                                <div className="flex justify-between gap-3 pt-6 border-t border-gray-200">
                                    <Button variant="outline" onClick={handleBackToStep1}>Back</Button>
                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={handleGoBack} disabled={isSubmitting}>Cancel</Button>
                                        <Button onClick={handleSubmit} disabled={isSubmitting || !selectedPlanId} className="bg-[#C72030] hover:bg-[#A01020] text-white">
                                            {isSubmitting ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update' : 'Submit')}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 1: Membership Plan & Add-ons */}
                        {currentStep === 1 && (
                            <>
                                {/* Card 9: Membership Plan Selection */}
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
                                                    onClick={() => setSelectedPlanId(plan.id)}
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

                                                    {/* Plan Amenities */}
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

                                {/* Card 10: Add-on Amenities */}
                                {selectedPlanId && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-2">Additional Amenities (Add-ons)</h2>
                                        <p className="text-sm text-gray-500 mb-6">Select additional amenities not included in your plan</p>

                                        {availableAddOns.length === 0 ? (
                                            <div className="text-center py-6 bg-gray-50 rounded-lg">
                                                <p className="text-gray-500 text-sm">All available amenities are already included in your selected plan.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {availableAddOns.map((amenity) => (
                                                    <div key={amenity.value} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    size="small"
                                                                    checked={selectedAddOns.includes(amenity.value)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedAddOns([...selectedAddOns, amenity.value]);
                                                                        } else {
                                                                            setSelectedAddOns(selectedAddOns.filter(id => id !== amenity.value));
                                                                        }
                                                                    }}
                                                                    sx={{
                                                                        color: '#C72030',
                                                                        '&.Mui-checked': {
                                                                            color: '#C72030',
                                                                        },
                                                                    }}
                                                                />
                                                            }
                                                            label={<span className="text-sm font-medium">{amenity.name}</span>}
                                                        />
                                                        <span className="text-sm font-semibold text-[#C72030]">
                                                            +₹{amenity.price || '0'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                 {/* Shared Membership Details */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Shared Membership Details</h2>
                                    
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormControl fullWidth sx={fieldStyles}>
                                                <InputLabel>Membership Type</InputLabel>
                                                <Select value={membershipType} onChange={(e) => setMembershipType(e.target.value)} label="Membership Type">
                                                    <MenuItem value=""><em>Select Type</em></MenuItem>
                                                    {MEMBERSHIP_TYPE_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                                                </Select>
                                            </FormControl>

                                            <FormControl fullWidth sx={fieldStyles}>
                                                <InputLabel>Referred By</InputLabel>
                                                <Select value={referredBy} onChange={(e) => setReferredBy(e.target.value)} label="Referred By">
                                                    <MenuItem value=""><em>Select</em></MenuItem>
                                                    {REFERRED_BY_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </div>

                                        <TextField
                                            label="Emergency Contact"
                                            value={emergencyContactName}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Only allow numbers and limit to 10 digits
                                                if (value === '' || /^\d{0,10}$/.test(value)) {
                                                    setEmergencyContactName(value);
                                                }
                                            }}
                                            sx={fieldStyles}
                                            fullWidth
                                            type="tel"
                                            placeholder="Phone Number"
                                            inputProps={{ 
                                                maxLength: 10,
                                                pattern: '[0-9]*',
                                                inputMode: 'numeric'
                                            }}
                                            error={emergencyContactName !== '' && !validateMobile(emergencyContactName)}
                                            helperText={emergencyContactName !== '' && !validateMobile(emergencyContactName) ? 'Please enter a valid 10-digit phone number' : ''}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={cardAllocated}
                                                    onChange={(e) => setCardAllocated(e.target.checked)}
                                                    sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                                                />
                                            }
                                            label="Access Card Allocated"
                                        />
                                    </div>
                                </div>

                                {/* Card 11: Cost Summary */}
                                {selectedPlanId && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Cost Summary</h2>

                                        <div className="space-y-4">
                                            {/* Membership Plan Cost - Editable */}
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

                                                {/* Discount Section */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    <label className="text-sm text-gray-600">Discount (%):</label>
                                                    <div className="flex items-center gap-1 flex-1">
                                                        <TextField
                                                            value={discountPercentage}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Only allow non-negative numbers between 0 and 100
                                                                if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                                                                    setDiscountPercentage(value);
                                                                }
                                                            }}
                                                            type="number"
                                                            size="small"
                                                            inputProps={{ 
                                                                min: 0,
                                                                max: 100,
                                                                step: 0.01
                                                            }}
                                                            sx={{
                                                                ...fieldStyles,
                                                                width: '100px',
                                                                '& .MuiOutlinedInput-root': {
                                                                    height: '40px',
                                                                }
                                                            }}
                                                        />
                                                        <span className="text-sm text-gray-600 ml-2">Amount: ₹{discountAmount.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                                                <p className="text-sm font-medium text-gray-700">Subtotal</p>
                                                <p className="text-lg font-semibold text-gray-900">₹{subtotal.toFixed(2)}</p>
                                            </div>

                                            {/* Tax Section */}
                                            <div className="space-y-3 pb-3 border-b border-gray-200">
                                                {/* CGST */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <label className="text-sm text-gray-600">CGST (%):</label>
                                                        <TextField
                                                            value={cgstPercentage}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Only allow non-negative numbers between 0 and 100
                                                                if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                                                                    setCgstPercentage(value);
                                                                }
                                                            }}
                                                            type="number"
                                                            size="small"
                                                            inputProps={{ 
                                                                min: 0,
                                                                max: 100,
                                                                step: 0.01
                                                            }}
                                                            sx={{
                                                                ...fieldStyles,
                                                                width: '80px',
                                                                '& .MuiOutlinedInput-root': {
                                                                    height: '36px',
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-700">₹{cgstAmount.toFixed(2)}</p>
                                                </div>

                                                {/* SGST */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <label className="text-sm text-gray-600">SGST (%):</label>
                                                        <TextField
                                                            value={sgstPercentage}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Only allow non-negative numbers between 0 and 100
                                                                if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                                                                    setSgstPercentage(value);
                                                                }
                                                            }}
                                                            type="number"
                                                            size="small"
                                                            inputProps={{ 
                                                                min: 0,
                                                                max: 100,
                                                                step: 0.01
                                                            }}
                                                            sx={{
                                                                ...fieldStyles,
                                                                width: '80px',
                                                                '& .MuiOutlinedInput-root': {
                                                                    height: '36px',
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-700">₹{sgstAmount.toFixed(2)}</p>
                                                </div>
                                            </div>

                                            {/* Total */}
                                            <div className="flex items-center justify-between pt-2">
                                                <p className="text-base font-bold text-gray-900">Total Amount (Inc. Tax)</p>
                                                <p className="text-2xl font-bold text-[#C72030]">₹{totalCost.toFixed(2)}</p>
                                            </div>

                                            {/* Renewal Info */}
                                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                                <p className="text-xs text-blue-800">
                                                    <span className="font-medium">Renewal Terms:</span> This membership will auto-renew every {selectedPlan?.renewal_terms} unless cancelled.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Submit Button */}
                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                    <Button
                                        variant="outline"
                                        onClick={handleGoBack}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleNext}
                                        className="bg-[#C72030] hover:bg-[#A01020] text-white"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </LocalizationProvider>
    );
};

export default AddGroupMembershipPage;
