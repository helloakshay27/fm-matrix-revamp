import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, X, Copy, FileText } from 'lucide-react';
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
    FormLabel,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { getFullUrl, API_CONFIG } from '@/config/apiConfig';
import axios from 'axios';
import { getToken } from '@/utils/auth';

// ─── helpers ────────────────────────────────────────────────────────────────

const getFileType = (filename: string): 'image' | 'pdf' | 'other' => {
    if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(filename)) return 'image';
    if (/\.pdf$/i.test(filename)) return 'pdf';
    return 'other';
};

const getFileDisplayInfo = (filename: string) => {
    const t = getFileType(filename);
    return { type: t, isPdf: t === 'pdf', isImage: t === 'image' };
};

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateMobile = (mobile: string) => /^[0-9]{10}$/.test(mobile);
const validatePinCode = (pin: string) => /^[0-9]{6}$/.test(pin);
const validateName = (name: string) => /^[a-zA-Z\s]+$/.test(name) && name.trim().length >= 2;

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (e) => reject(e);
    });

// ─── interfaces ──────────────────────────────────────────────────────────────

interface ClubMemberResponse {
    id: number;
    user_id: number;
    status: string;
    membership_number: string;
    user_name: string;
    user_email: string;
    user_mobile: string;
    avatar: string | null;
    identification_image: string | null;
    society_flat_id: number | null;
    referred_by: string;
    emergency_contact_name: string;
    access_card_enabled: boolean;
    access_card_id: string | null;
    snag_answers: any[];
    user: {
        id: number;
        firstname: string;
        lastname: string;
        email: string;
        mobile: string;
        gender: string | null;
        birth_date: string | null;
        addresses: any[];
    } | null;
}

interface MemberData {
    id: string;
    userSelectionMode: 'select' | 'manual' | 'created_member';
    selectedUser: string;
    selectedUserId: number | null;
    formData: {
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        houseId: string;
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
    physicalRestrictionsDetails: string;
    hasCurrentMedication: 'yes' | 'no' | '';
    medicationDetails: string;
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
    companyAddress: string;
    corporateInterest: 'yes' | 'no' | '';
    raisedBillToThisUser: boolean;
    billTo: 'user' | 'company' | '';
    billingCompanyName: string;
    billingGstinNo: string;
    billingCompanyAddress: string;
}

// ─── constants ───────────────────────────────────────────────────────────────

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
    '& .MuiInputLabel-root': { '&.Mui-focused': { color: '#C72030' } },
};

const GENDER_OPTIONS = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
];

const createEmptyMember = (idSuffix = ''): MemberData => ({
    id: Date.now().toString() + idSuffix,
    userSelectionMode: 'manual',
    selectedUser: '',
    selectedUserId: null,
    formData: {
        firstName: '', lastName: '', dateOfBirth: '', gender: '',
        email: '', mobile: '', emergencyContactName: '',
        address: '', address_line_two: '', city: '', state: '',
        country: '', pin_code: '', address_type: 'residential',
        residentType: '', relationWithOwner: '', membershipNumber: '',
        accessCardId: '', membershipType: '', referredBy: '', houseId: '',
    },
    idCardFile: null, residentPhotoFile: null, attachmentFiles: [],
    idCardPreview: null, residentPhotoPreview: null, attachmentPreviews: [],
    hasInjuries: '', injuryDetails: '', hasPhysicalRestrictions: '',
    physicalRestrictionsDetails: '', hasCurrentMedication: '',
    medicationDetails: '', pilatesExperience: '', fitnessGoals: [],
    fitnessGoalsOther: '', interestedSessions: [], interestedSessionsOther: '',
    heardAbout: '', motivations: [], updatePreferences: [],
    communicationChannel: [], profession: '', companyName: '',
    companyAddress: '', corporateInterest: '', raisedBillToThisUser: false,
    billTo: '', billingCompanyName: '', billingGstinNo: '',
    billingCompanyAddress: '',
} as any);

// ─── component ───────────────────────────────────────────────────────────────

export const EditGroupMembershipStep2Page = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [cardAllocated, setCardAllocated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [members, setMembers] = useState<MemberData[]>([createEmptyMember('0')]);
    const [clubMembers, setClubMembers] = useState<ClubMemberResponse[]>([]);
    const [loadingClubMembers, setLoadingClubMembers] = useState(false);
    const [flatOptions, setFlatOptions] = useState<{ id: number; name: string }[]>([]);
    const [flatsLoading, setFlatsLoading] = useState(false);

    useEffect(() => {
        loadClubMembers();
        loadMemberData();
        fetchFlats();
    }, [id]);

    const loadClubMembers = async () => {
        setLoadingClubMembers(true);
        try {
            const baseUrl = API_CONFIG.BASE_URL;
            const token = API_CONFIG.TOKEN;
            const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/club_members.json`);
            url.searchParams.append('access_token', token || '');
            const response = await fetch(url.toString());
            if (!response.ok) throw new Error();
            const data = await response.json();
            setClubMembers(data.club_members || []);
        } catch {
            // silent
        } finally {
            setLoadingClubMembers(false);
        }
    };

    const loadMemberData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const baseUrl = API_CONFIG.BASE_URL;
            const token = API_CONFIG.TOKEN;
            const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/club_member_allocations/${id}.json`);
            url.searchParams.append('access_token', token || '');
            const response = await fetch(url.toString());
            if (!response.ok) throw new Error();
            const data = await response.json();

            const membersArray = data.club_members || data.members || [];
            if (Array.isArray(membersArray) && membersArray.length > 0) {
                const loaded: MemberData[] = membersArray.map((md: any, index: number) => {
                    const mId = Date.now().toString() + index;
                    const userData = md.user || md;
                    const newMember: MemberData = {
                        id: mId,
                        userSelectionMode: 'manual',
                        selectedUser: md.user_id ? md.user_id.toString() : '',
                        selectedUserId: md.user_id || null,
                        formData: {
                            firstName: userData.firstname || md.first_name || '',
                            lastName: userData.lastname || md.last_name || '',
                            email: userData.email || md.user_email || '',
                            mobile: userData.mobile || md.user_mobile || '',
                            dateOfBirth: userData.birth_date || '',
                            gender: userData.gender || '',
                            emergencyContactName: md.emergency_contact_name || '',
                            address: userData.addresses?.[0]?.address || '',
                            address_line_two: userData.addresses?.[0]?.address_line_two || '',
                            city: userData.addresses?.[0]?.city || '',
                            state: userData.addresses?.[0]?.state || '',
                            country: userData.addresses?.[0]?.country || '',
                            pin_code: userData.addresses?.[0]?.pin_code || '',
                            address_type: userData.addresses?.[0]?.address_type || 'residential',
                            residentType: '', relationWithOwner: '',
                            houseId: md.society_flat_id?.toString() || '',
                            membershipNumber: md.membership_number || '',
                            accessCardId: md.access_card_id?.toString() || '',
                            membershipType: '', referredBy: md.referred_by || '',
                        },
                        idCardFile: null, residentPhotoFile: null,
                        attachmentFiles: [],
                        idCardPreview: md.identification_image || null,
                        residentPhotoPreview: md.avatar
                            ? (md.avatar.startsWith('%2F')
                                ? `https://fm-uat-api.lockated.com${decodeURIComponent(md.avatar)}`
                                : md.avatar)
                            : null,
                        attachmentPreviews: [],
                        hasInjuries: '', injuryDetails: '',
                        hasPhysicalRestrictions: '', physicalRestrictionsDetails: '',
                        hasCurrentMedication: '', medicationDetails: '',
                        pilatesExperience: '', fitnessGoals: [], fitnessGoalsOther: '',
                        interestedSessions: [], interestedSessionsOther: '',
                        heardAbout: '', motivations: [], updatePreferences: [],
                        communicationChannel: [], profession: '', companyName: '',
                        companyAddress: '', corporateInterest: '',
                        raisedBillToThisUser: md?.raised_bill_to_user ?? false,
                        billTo: md?.bill_to || '',
                        billingCompanyName: md?.billing_company_name || '',
                        billingGstinNo: md?.billing_gstin || '',
                        billingCompanyAddress: md?.billing_address || '',
                    };

                    // Parse snag_answers
                    if (md.snag_answers && Array.isArray(md.snag_answers)) {
                        const byQ: { [k: number]: string[] } = {};
                        const commentsByQ: { [k: number]: string } = {};
                        md.snag_answers.forEach((a: any) => {
                            const q = Number(a.question_id);
                            if (!byQ[q]) byQ[q] = [];
                            if (a.ans_descr != null) byQ[q].push(String(a.ans_descr));
                            if (a.comments?.trim()) commentsByQ[q] = a.comments;
                        });
                        if (byQ[1]?.[0]) { const v = byQ[1][0].toUpperCase(); newMember.hasInjuries = v === 'YES' ? 'yes' : v === 'NO' ? 'no' : ''; if (commentsByQ[1]) newMember.injuryDetails = commentsByQ[1]; }
                        if (byQ[2]?.[0]) { const v = byQ[2][0].toUpperCase(); newMember.hasPhysicalRestrictions = v === 'YES' ? 'yes' : v === 'NO' ? 'no' : ''; if (commentsByQ[2]) newMember.physicalRestrictionsDetails = commentsByQ[2]; }
                        if (byQ[3]?.[0]) { const v = byQ[3][0].toUpperCase(); newMember.hasCurrentMedication = v === 'YES' ? 'yes' : v === 'NO' ? 'no' : ''; if (commentsByQ[3]) newMember.medicationDetails = commentsByQ[3]; }
                        if (byQ[4]?.[0]) newMember.pilatesExperience = byQ[4][0];
                        if (byQ[5]?.length) newMember.fitnessGoals = byQ[5];
                        if (byQ[6]?.length) newMember.interestedSessions = byQ[6];
                        if (byQ[7]?.[0]) newMember.heardAbout = byQ[7][0];
                        if (byQ[8]?.length) newMember.motivations = byQ[8];
                        if (byQ[9]?.length) newMember.updatePreferences = byQ[9];
                        if (byQ[10]?.length) newMember.communicationChannel = byQ[10];
                        if (byQ[11]?.[0]) newMember.profession = byQ[11][0];
                        if (byQ[12]?.[0]) newMember.companyName = byQ[12][0];
                        if (byQ[13]?.[0]) newMember.companyAddress = byQ[13][0];
                    }
                    // Set cardAllocated from first member
                    if (index === 0 && md.access_card_enabled !== undefined) {
                        setCardAllocated(md.access_card_enabled);
                    }
                    return newMember;
                });
                setMembers(loaded);
            }
        } catch {
            toast.error('Failed to load member data');
        } finally {
            setLoading(false);
        }
    };

    const fetchFlats = async () => {
        setFlatsLoading(true);
        try {
            const response = await axios.get(`https://${localStorage.getItem('baseUrl')}/houses.json`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
            });
            setFlatOptions(Array.isArray(response.data) ? response.data : []);
        } catch {
            setFlatOptions([]);
        } finally {
            setFlatsLoading(false);
        }
    };

    const updateMember = (memberId: string, updates: Partial<MemberData>) => {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, ...updates } : m));
    };

    const handleIdCardUpload = (memberId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => updateMember(memberId, { idCardFile: file, idCardPreview: reader.result as string });
        reader.readAsDataURL(file);
    };

    const handleResidentPhotoUpload = (memberId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => updateMember(memberId, { residentPhotoFile: file, residentPhotoPreview: reader.result as string });
        reader.readAsDataURL(file);
    };

    const handleAttachmentUpload = (memberId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        const newFiles = Array.from(files);
        const member = members.find(m => m.id === memberId);
        if (!member) return;
        const updatedFiles = [...member.attachmentFiles, ...newFiles];
        const newPreviews: string[] = [];
        let done = 0;
        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                done++;
                if (done === newFiles.length) {
                    updateMember(memberId, { attachmentFiles: updatedFiles, attachmentPreviews: [...member.attachmentPreviews, ...newPreviews] });
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeIdCard = (memberId: string) => updateMember(memberId, { idCardFile: null, idCardPreview: null });
    const removeResidentPhoto = (memberId: string) => updateMember(memberId, { residentPhotoFile: null, residentPhotoPreview: null });
    const removeAttachment = (memberId: string, index: number) => {
        const member = members.find(m => m.id === memberId);
        if (!member) return;
        updateMember(memberId, {
            attachmentFiles: member.attachmentFiles.filter((_, i) => i !== index),
            attachmentPreviews: member.attachmentPreviews.filter((_, i) => i !== index),
        });
    };

    const userLimit = 99;

    const handleAddMember = () => {
        const newMember = createEmptyMember(Math.random().toString(36).substr(2, 9));
        setMembers(prev => [...prev, newMember]);
        toast.success(`Member ${members.length + 1} added`);
    };

    const handleRemoveMember = (memberId: string) => {
        if (members.length <= 1) { toast.error('At least one member is required'); return; }
        setMembers(prev => prev.filter(m => m.id !== memberId));
        toast.success('Member removed');
    };

    const copyAddressFromPrevious = (currentIndex: number) => {
        if (currentIndex === 0) return;
        const prev = members[currentIndex - 1];
        const curr = members[currentIndex];
        updateMember(curr.id, {
            formData: { ...curr.formData, address: prev.formData.address, address_line_two: prev.formData.address_line_two, city: prev.formData.city, state: prev.formData.state, country: prev.formData.country, pin_code: prev.formData.pin_code, address_type: prev.formData.address_type },
        });
        toast.success('Address copied from previous member');
    };

    const buildAnswersPayload = (member: MemberData) => {
        const ans: any = {};
        ans['1'] = [{ answer: member.hasInjuries.toUpperCase() || '', comments: member.hasInjuries === 'yes' ? member.injuryDetails : '' }];
        ans['2'] = [{ answer: member.hasPhysicalRestrictions.toUpperCase() || '', comments: member.hasPhysicalRestrictions === 'yes' ? member.physicalRestrictionsDetails : '' }];
        ans['3'] = [{ answer: member.hasCurrentMedication.toUpperCase() || '', comments: member.hasCurrentMedication === 'yes' ? member.medicationDetails : '' }];
        ans['4'] = [{ answer: member.pilatesExperience || '', comments: '' }];
        ans['5'] = member.fitnessGoals.map(g => ({ answer: g, comments: g === 'Other' ? member.fitnessGoalsOther : '' }));
        ans['6'] = member.interestedSessions.map(s => ({ answer: s, comments: s === 'Other' ? member.interestedSessionsOther : '' }));
        ans['7'] = [{ answer: member.heardAbout || '', comments: '' }];
        ans['8'] = member.motivations.map(m => ({ answer: m, comments: '' }));
        ans['9'] = member.updatePreferences.map(p => ({ answer: p, comments: '' }));
        ans['10'] = member.communicationChannel.map(c => ({ answer: c, comments: '' }));
        ans['11'] = [{ answer: member.profession || '', comments: '' }];
        ans['12'] = [{ answer: member.companyName || '', comments: '' }];
        ans['13'] = [{ answer: member.companyAddress || '', comments: '' }];
        return [ans];
    };

    const handleSubmit = async () => {
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            const label = `Member ${i + 1}`;
            if (member.userSelectionMode === 'manual') {
                if (!member.formData.firstName) { toast.error(`${label}: Please enter first name`); return; }
                if (!member.formData.email) { toast.error(`${label}: Please enter email address`); return; }
                if (!validateEmail(member.formData.email)) { toast.error(`${label}: Please enter a valid email address`); return; }
                if (!member.formData.mobile) { toast.error(`${label}: Please enter mobile number`); return; }
                if (!validateMobile(member.formData.mobile)) { toast.error(`${label}: Please enter a valid 10-digit mobile number`); return; }
            }
            if (member.formData.pin_code && !validatePinCode(member.formData.pin_code)) { toast.error(`${label}: Please enter a valid 6-digit PIN code`); return; }
        }

        if (cardAllocated) {
            const ids = members.map(m => m.formData.accessCardId?.trim().toLowerCase()).filter(Boolean);
            if (new Set(ids).size !== ids.length) { toast.error('All Access Card IDs must be unique'); return; }
        }

        setIsSubmitting(true);
        try {
            const membersPayload = await Promise.all(members.map(async (member) => {
                let identificationImageBase64 = '';
                let avatarBase64 = '';
                const attachmentsBase64: string[] = [];

                if (member.idCardFile) identificationImageBase64 = await fileToBase64(member.idCardFile);
                if (member.residentPhotoFile) avatarBase64 = await fileToBase64(member.residentPhotoFile);
                for (const file of member.attachmentFiles) attachmentsBase64.push(await fileToBase64(file));

                const memberObj: any = {
                    firstname: member.formData.firstName,
                    lastname: member.formData.lastName,
                    mobile: member.formData.mobile,
                    email: member.formData.email,
                    gender: member.formData.gender || '',
                    birth_date: member.formData.dateOfBirth || '',
                    club_member: {
                        club_member_enabled: true,
                        access_card_enabled: cardAllocated,
                        access_card_id: cardAllocated ? member.formData.accessCardId : null,
                        society_flat_id: member.formData.houseId || null,
                    },
                    addresses: [{
                        address: member.formData.address,
                        address_line_two: member.formData.address_line_two,
                        city: member.formData.city,
                        state: member.formData.state,
                        country: member.formData.country,
                        pin_code: member.formData.pin_code,
                        address_type: member.formData.address_type || 'residential',
                    }],
                    answers: buildAnswersPayload(member),
                    billing: {
                        raised_bill_to_user: member.raisedBillToThisUser,
                        bill_to: member.billTo || null,
                        ...(member.billTo === 'company' && {
                            billing_company_name: member.billingCompanyName,
                            billing_gstin: member.billingGstinNo,
                            billing_address: member.billingCompanyAddress,
                        }),
                    },
                };

                if (identificationImageBase64) memberObj.identification_image = identificationImageBase64;
                if (avatarBase64) memberObj.avatar = avatarBase64;
                if (attachmentsBase64.length > 0) memberObj.attachments = attachmentsBase64;
                if (member.selectedUserId) memberObj.user_id = member.selectedUserId;

                return memberObj;
            }));

            const payload = {
                club_member_allocation: {
                    members: membersPayload,
                },
            };

            const savedToken = getToken();
            const url = getFullUrl(`/club_member_allocations/${id}.json`);
            const response = await fetch(url, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${savedToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let errorData: any = {};
                try {
                    const ct = response.headers.get('content-type');
                    if (ct?.includes('application/json')) errorData = await response.json();
                    else errorData = { error: await response.text() };
                } catch { errorData = { error: 'Unknown error' }; }

                if (errorData.error?.includes('User is already exist') || errorData.error?.includes('User already exists')) {
                    toast.error('This user already has a club membership');
                } else if (errorData.message) {
                    toast.error(errorData.message);
                } else if (errorData.error) {
                    toast.error(errorData.error);
                } else {
                    toast.error('Failed to update club membership');
                }
                return;
            }

            toast.success('Club membership updated successfully');
            navigate('/club-management/membership/groups');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update membership');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const parseSnagAnswersIntoMember = (snagAnswers: any[], _member: MemberData): Partial<MemberData> => {
        const updates: Partial<MemberData> = {};
        if (!snagAnswers?.length) return updates;
        const byQ: { [k: number]: string[] } = {};
        const commentsByQ: { [k: number]: string } = {};
        snagAnswers.forEach((a: any) => {
            const q = Number(a.question_id);
            if (!byQ[q]) byQ[q] = [];
            if (a.ans_descr != null) byQ[q].push(String(a.ans_descr));
            if (a.comments?.trim()) commentsByQ[q] = a.comments;
        });
        if (byQ[1]?.[0]) { const v = byQ[1][0].toUpperCase(); (updates as any).hasInjuries = v === 'YES' ? 'yes' : v === 'NO' ? 'no' : ''; if (commentsByQ[1]) (updates as any).injuryDetails = commentsByQ[1]; }
        if (byQ[2]?.[0]) { const v = byQ[2][0].toUpperCase(); (updates as any).hasPhysicalRestrictions = v === 'YES' ? 'yes' : v === 'NO' ? 'no' : ''; if (commentsByQ[2]) (updates as any).physicalRestrictionsDetails = commentsByQ[2]; }
        if (byQ[3]?.[0]) { const v = byQ[3][0].toUpperCase(); (updates as any).hasCurrentMedication = v === 'YES' ? 'yes' : v === 'NO' ? 'no' : ''; if (commentsByQ[3]) (updates as any).medicationDetails = commentsByQ[3]; }
        if (byQ[5]?.length) (updates as any).fitnessGoals = byQ[5];
        if (byQ[7]?.[0]) (updates as any).heardAbout = byQ[7][0];
        if (byQ[10]?.length) (updates as any).communicationChannel = byQ[10];
        if (byQ[11]?.[0]) (updates as any).profession = byQ[11][0];
        if (byQ[12]?.[0]) (updates as any).companyName = byQ[12][0];
        if (byQ[13]?.[0]) (updates as any).companyAddress = byQ[13][0];
        return updates;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <Button variant="ghost" onClick={handleBack} className="hover:bg-gray-100">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Edit Club Membership</h1>
                        <p className="text-sm text-gray-500 mt-1">Member Details</p>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C72030]"></div>
                            <p className="text-gray-600">Loading member data...</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
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
                                >
                                    <span className="mr-1">+</span> Add Member ({members.length})
                                </Button>
                            </div>
                        </div>

                        {/* Members List */}
                        {members.map((member, memberIndex) => (
                            <div key={member.id} className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
                                {/* Section 1: User Selection */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-md font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
                                            <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-xs">1</div>
                                            User Selection
                                        </h4>

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

                                    <div className="mb-6">
                                        <FormLabel component="legend" className="text-sm font-medium text-gray-700 mb-2">
                                            Select User Mode
                                        </FormLabel>
                                        <RadioGroup
                                            row
                                            value={member.userSelectionMode}
                                            onChange={(e) => {
                                                const mode = e.target.value as 'select' | 'manual' | 'created_member';
                                                updateMember(member.id, {
                                                    userSelectionMode: mode,
                                                    selectedUser: '',
                                                    selectedUserId: null,
                                                    formData: {
                                                        ...member.formData,
                                                        firstName: '', lastName: '', email: '', mobile: '',
                                                        dateOfBirth: '', gender: '', address: '',
                                                        address_line_two: '', city: '', state: '',
                                                        country: '', pin_code: '', houseId: '',
                                                    },
                                                    idCardPreview: null,
                                                    residentPhotoPreview: null,
                                                    hasInjuries: '', injuryDetails: '',
                                                    hasPhysicalRestrictions: '', physicalRestrictionsDetails: '',
                                                    hasCurrentMedication: '', medicationDetails: '',
                                                    pilatesExperience: '', fitnessGoals: [],
                                                    fitnessGoalsOther: '', interestedSessions: [],
                                                    interestedSessionsOther: '', heardAbout: '',
                                                    motivations: [], updatePreferences: [],
                                                    communicationChannel: [], profession: '',
                                                    companyName: '', companyAddress: '', corporateInterest: '',
                                                });
                                            }}
                                        >
                                            <FormControlLabel
                                                value="created_member"
                                                control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                                                label="Select Created Member"
                                            />
                                            <FormControlLabel
                                                value="manual"
                                                control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                                                label="Enter User Details"
                                            />
                                        </RadioGroup>
                                    </div>

                                    {/* Created Club Members Dropdown */}
                                    {member.userSelectionMode === 'created_member' && (
                                        <div className="mb-6">
                                            <FormControl fullWidth>
                                                <TextField
                                                    select
                                                    label="Select Member *"
                                                    value={member.selectedUser}
                                                    onChange={(e) => {
                                                        const memberId = e.target.value;
                                                        const cm = clubMembers.find(m => m.id.toString() === memberId);
                                                        if (!cm) return;
                                                        const userData = cm.user;
                                                        const address = userData?.addresses?.[0] || {};
                                                        let avatarUrl: string | null = null;
                                                        if (cm.avatar) {
                                                            avatarUrl = cm.avatar.startsWith('%2F')
                                                                ? `https://${localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com'}${decodeURIComponent(cm.avatar)}`
                                                                : cm.avatar;
                                                        }
                                                        const snagUpdates = parseSnagAnswersIntoMember(cm.snag_answers || [], member);
                                                        updateMember(member.id, {
                                                            selectedUser: memberId,
                                                            selectedUserId: cm.user_id,
                                                            formData: {
                                                                ...member.formData,
                                                                firstName: userData?.firstname || '',
                                                                lastName: userData?.lastname || '',
                                                                email: userData?.email || cm.user_email || '',
                                                                mobile: userData?.mobile || cm.user_mobile || '',
                                                                dateOfBirth: userData?.birth_date || '',
                                                                gender: userData?.gender || '',
                                                                address: address.address || '',
                                                                address_line_two: address.address_line_two || '',
                                                                city: address.city || '',
                                                                state: address.state || '',
                                                                country: address.country || '',
                                                                pin_code: address.pin_code || '',
                                                                address_type: address.address_type || 'residential',
                                                                houseId: cm.society_flat_id?.toString() || '',
                                                                emergencyContactName: cm.emergency_contact_name || '',
                                                                membershipNumber: cm.membership_number || '',
                                                                accessCardId: cm.access_card_id || '',
                                                                referredBy: cm.referred_by || '',
                                                            },
                                                            idCardPreview: cm.identification_image || null,
                                                            residentPhotoPreview: avatarUrl,
                                                            ...snagUpdates,
                                                        });
                                                    }}
                                                    sx={fieldStyles}
                                                    disabled={loadingClubMembers}
                                                >
                                                    {loadingClubMembers ? (
                                                        <MenuItem value="">Loading members...</MenuItem>
                                                    ) : clubMembers.length === 0 ? (
                                                        <MenuItem value="">No created members found</MenuItem>
                                                    ) : (
                                                        clubMembers.map((cm) => (
                                                            <MenuItem key={cm.id} value={cm.id.toString()}>
                                                                {cm.user_name?.trim()} — {cm.user_email} ({cm.membership_number})
                                                            </MenuItem>
                                                        ))
                                                    )}
                                                </TextField>
                                            </FormControl>
                                            {member.selectedUser && (
                                                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                                    <span>✓</span> Member data has been auto-populated below. You can edit any fields.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* User Details Form */}
                                    {(member.userSelectionMode === 'manual' || member.userSelectionMode === 'created_member') && (
                                        <div
                                            className="space-y-4"
                                            style={
                                                member.userSelectionMode === 'created_member' && !member.selectedUser
                                                    ? { opacity: 0.45, pointerEvents: 'none', userSelect: 'none' }
                                                    : {}
                                            }
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <TextField
                                                    label="First Name *"
                                                    value={member.formData.firstName}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === '' || /^[a-zA-Z\s]*$/.test(value)) {
                                                            updateMember(member.id, { formData: { ...member.formData, firstName: value } });
                                                        } else {
                                                            toast.error('First name should contain only alphabets');
                                                        }
                                                    }}
                                                    sx={fieldStyles}
                                                    fullWidth
                                                    error={member.formData.firstName !== '' && !validateName(member.formData.firstName)}
                                                    helperText={member.formData.firstName !== '' && !validateName(member.formData.firstName) ? 'First name must be at least 2 characters and contain only alphabets' : ''}
                                                />
                                                <TextField
                                                    label="Last Name"
                                                    value={member.formData.lastName}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === '' || /^[a-zA-Z\s]*$/.test(value)) {
                                                            updateMember(member.id, { formData: { ...member.formData, lastName: value } });
                                                        }
                                                    }}
                                                    sx={fieldStyles}
                                                    fullWidth
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <DatePicker
                                                    label="Date of Birth"
                                                    value={member.formData.dateOfBirth ? dayjs(member.formData.dateOfBirth, 'YYYY-MM-DD') : null}
                                                    onChange={(newValue) => {
                                                        if (newValue) {
                                                            const selected = dayjs(newValue);
                                                            if (selected.isAfter(dayjs())) { toast.error('Date of Birth cannot be a future date'); return; }
                                                            updateMember(member.id, { formData: { ...member.formData, dateOfBirth: selected.format('YYYY-MM-DD') } });
                                                        } else {
                                                            updateMember(member.id, { formData: { ...member.formData, dateOfBirth: '' } });
                                                        }
                                                    }}
                                                    format="DD/MM/YYYY"
                                                    maxDate={dayjs()}
                                                    slotProps={{ textField: { fullWidth: true, sx: fieldStyles } }}
                                                />
                                                <FormControl fullWidth sx={fieldStyles}>
                                                    <InputLabel>Gender</InputLabel>
                                                    <Select
                                                        value={member.formData.gender}
                                                        onChange={(e) => updateMember(member.id, { formData: { ...member.formData, gender: e.target.value } })}
                                                        label="Gender"
                                                    >
                                                        <MenuItem value=""><em>Select Gender</em></MenuItem>
                                                        {GENDER_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                                                    </Select>
                                                </FormControl>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                <TextField
                                                    label="Mobile Number *"
                                                    value={member.formData.mobile}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === '' || /^\d{0,10}$/.test(value)) {
                                                            updateMember(member.id, { formData: { ...member.formData, mobile: value } });
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        if (member.formData.mobile && !validateMobile(member.formData.mobile)) {
                                                            toast.error('Please enter a valid 10-digit mobile number');
                                                        }
                                                    }}
                                                    sx={fieldStyles}
                                                    fullWidth
                                                    type="tel"
                                                    inputProps={{ maxLength: 10, pattern: '[0-9]*', inputMode: 'numeric' }}
                                                    error={member.formData.mobile !== '' && !validateMobile(member.formData.mobile)}
                                                    helperText={member.formData.mobile !== '' && !validateMobile(member.formData.mobile) ? 'Mobile number must be exactly 10 digits' : ''}
                                                />
                                                <TextField
                                                    label="Email Address *"
                                                    type="email"
                                                    value={member.formData.email}
                                                    onChange={(e) => updateMember(member.id, { formData: { ...member.formData, email: e.target.value } })}
                                                    onBlur={() => {
                                                        if (member.formData.email && !validateEmail(member.formData.email)) {
                                                            toast.error('Please enter a valid email address');
                                                        }
                                                    }}
                                                    sx={fieldStyles}
                                                    fullWidth
                                                    error={member.formData.email !== '' && !validateEmail(member.formData.email)}
                                                    helperText={member.formData.email !== '' && !validateEmail(member.formData.email) ? 'Please enter a valid email format' : ''}
                                                />
                                                <FormControl fullWidth sx={fieldStyles}>
                                                    <InputLabel>House</InputLabel>
                                                    <Select
                                                        label="House"
                                                        value={member.formData.houseId || ''}
                                                        onChange={e => updateMember(member.id, { formData: { ...member.formData, houseId: e.target.value } })}
                                                    >
                                                        <MenuItem value=""><em>Select House</em></MenuItem>
                                                        {flatsLoading ? (
                                                            <MenuItem value="" disabled>Loading...</MenuItem>
                                                        ) : flatOptions.map(flat => (
                                                            <MenuItem key={flat.id} value={flat.id}>{flat.name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                {cardAllocated && (
                                                    <TextField
                                                        label="Access Card ID"
                                                        value={member.formData.accessCardId || ''}
                                                        onChange={(e) => updateMember(member.id, { formData: { ...member.formData, accessCardId: e.target.value } })}
                                                        sx={fieldStyles}
                                                        fullWidth
                                                        placeholder="Enter Access Card ID"
                                                        helperText="Assign a unique access card ID for this user"
                                                    />
                                                )}
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
                                        <TextField label="Address" value={member.formData.address} onChange={(e) => updateMember(member.id, { formData: { ...member.formData, address: e.target.value } })} sx={fieldStyles} fullWidth />
                                        <TextField label="Address Line Two" value={member.formData.address_line_two} onChange={(e) => updateMember(member.id, { formData: { ...member.formData, address_line_two: e.target.value } })} sx={fieldStyles} fullWidth />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <TextField label="City" value={member.formData.city} onChange={(e) => updateMember(member.id, { formData: { ...member.formData, city: e.target.value } })} sx={fieldStyles} fullWidth />
                                            <TextField label="State" value={member.formData.state} onChange={(e) => updateMember(member.id, { formData: { ...member.formData, state: e.target.value } })} sx={fieldStyles} fullWidth />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <TextField label="Country" value={member.formData.country} onChange={(e) => updateMember(member.id, { formData: { ...member.formData, country: e.target.value } })} sx={fieldStyles} fullWidth />
                                            <TextField
                                                label="Pin Code"
                                                value={member.formData.pin_code}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value === '' || /^\d{0,6}$/.test(value)) {
                                                        updateMember(member.id, { formData: { ...member.formData, pin_code: value } });
                                                    }
                                                }}
                                                sx={fieldStyles}
                                                fullWidth
                                                type="tel"
                                                inputProps={{ maxLength: 6, pattern: '[0-9]*', inputMode: 'numeric' }}
                                                error={member.formData.pin_code !== '' && !validatePinCode(member.formData.pin_code)}
                                                helperText={member.formData.pin_code !== '' && !validatePinCode(member.formData.pin_code) ? 'Please enter a valid 6-digit PIN code' : ''}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Billing Info */}
                                <div className="mb-8 pt-8 border-t border-gray-200">
                                    <h4 className="text-md font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
                                        <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-xs">3</div>
                                        Billing Info
                                    </h4>
                                    <div className="space-y-4">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={member.raisedBillToThisUser}
                                                    onChange={(e) => updateMember(member.id, { raisedBillToThisUser: e.target.checked, billTo: e.target.checked ? member.billTo : '' })}
                                                    disabled={memberIndex !== 0}
                                                    sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                                                />
                                            }
                                            label="Raised bill to this user"
                                        />
                                        {memberIndex === 0 && member.raisedBillToThisUser && (
                                            <div className="space-y-4">
                                                <RadioGroup
                                                    row
                                                    value={member.billTo}
                                                    onChange={(e) => updateMember(member.id, { billTo: e.target.value as 'user' | 'company' })}
                                                >
                                                    <FormControlLabel value="user" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Bill to User" />
                                                    <FormControlLabel value="company" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Bill to Company" />
                                                </RadioGroup>
                                                {member.billTo === 'user' && (
                                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                                                        <p className="text-sm font-medium text-gray-700">User Information</p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Name</p>
                                                                <p className="text-sm font-medium text-gray-800">{[member.formData.firstName, member.formData.lastName].filter(Boolean).join(' ') || '—'}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Email</p>
                                                                <p className="text-sm font-medium text-gray-800">{member.formData.email || '—'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {member.billTo === 'company' && (
                                                    <div className="space-y-4">
                                                        <TextField label="Company Name" value={member.billingCompanyName} onChange={(e) => updateMember(member.id, { billingCompanyName: e.target.value })} sx={fieldStyles} fullWidth />
                                                        <TextField label="GSTIN No." value={member.billingGstinNo} onChange={(e) => updateMember(member.id, { billingGstinNo: e.target.value })} sx={fieldStyles} fullWidth />
                                                        <TextField label="Address" value={member.billingCompanyAddress} onChange={(e) => updateMember(member.id, { billingCompanyAddress: e.target.value })} sx={fieldStyles} fullWidth />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Section 4: Upload Documents */}
                                <div className="mb-8 pt-8 border-t border-gray-200">
                                    <h4 className="text-md font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
                                        <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-xs">4</div>
                                        Upload Documents
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        {/* ID Card */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">ID Card</label>
                                            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${member.idCardFile || member.idCardPreview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-[#C72030]'}`}>
                                                {(member.idCardFile || member.idCardPreview) ? (
                                                    <div>
                                                        {member.idCardPreview && getFileDisplayInfo(member.idCardFile?.name || member.idCardPreview).isImage && (
                                                            <img src={member.idCardPreview} alt="ID Card" className="max-h-40 mx-auto rounded mb-3" />
                                                        )}
                                                        {member.idCardPreview && getFileDisplayInfo(member.idCardFile?.name || member.idCardPreview).isPdf && (
                                                            <div className="flex flex-col items-center justify-center mb-3">
                                                                <div className="w-14 h-14 flex items-center justify-center border-2 border-red-300 rounded-lg bg-red-50 mb-2">
                                                                    <FileText className="w-8 h-8 text-red-600" />
                                                                </div>
                                                                <span className="text-xs text-red-600 font-semibold">PDF Document</span>
                                                            </div>
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
                                                        <input type="file" accept="image/*,.pdf" onChange={(e) => handleIdCardUpload(member.id, e)} className="hidden" id={`id-card-${member.id}`} />
                                                        <label htmlFor={`id-card-${member.id}`}>
                                                            <Button variant="outline" className="cursor-pointer" asChild><span>Choose File</span></Button>
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Member Photo */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Member Photo</label>
                                            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${member.residentPhotoFile || member.residentPhotoPreview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-[#C72030]'}`}>
                                                {(member.residentPhotoFile || member.residentPhotoPreview) ? (
                                                    <div>
                                                        {member.residentPhotoPreview && getFileDisplayInfo(member.residentPhotoFile?.name || member.residentPhotoPreview).isImage && (
                                                            <img src={member.residentPhotoPreview} alt="Photo" className="max-h-40 mx-auto rounded mb-3" />
                                                        )}
                                                        {member.residentPhotoPreview && getFileDisplayInfo(member.residentPhotoFile?.name || member.residentPhotoPreview).isPdf && (
                                                            <div className="flex flex-col items-center justify-center mb-3">
                                                                <div className="w-14 h-14 flex items-center justify-center border-2 border-red-300 rounded-lg bg-red-50 mb-2">
                                                                    <FileText className="w-8 h-8 text-red-600" />
                                                                </div>
                                                                <span className="text-xs text-red-600 font-semibold">PDF Document</span>
                                                            </div>
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
                                                        <input type="file" accept="image/*,.pdf" onChange={(e) => handleResidentPhotoUpload(member.id, e)} className="hidden" id={`photo-${member.id}`} />
                                                        <label htmlFor={`photo-${member.id}`}>
                                                            <Button variant="outline" className="cursor-pointer" asChild><span>Choose File</span></Button>
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Other Documents */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-700 mb-4">Other Documents</h3>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#C72030] transition-colors">
                                            <div className="text-center mb-4">
                                                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500 mb-2">Upload Additional Documents</p>
                                                <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={(e) => handleAttachmentUpload(member.id, e)} className="hidden" id={`other-documents-${member.id}`} multiple />
                                                <label htmlFor={`other-documents-${member.id}`}>
                                                    <Button variant="outline" className="cursor-pointer" asChild><span>Choose Files</span></Button>
                                                </label>
                                                <p className="text-xs text-gray-400 mt-2">You can select multiple files</p>
                                            </div>
                                            {member.attachmentFiles.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Documents ({member.attachmentFiles.length})</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                        {member.attachmentFiles.map((file, index) => (
                                                            <div key={index} className="relative border border-gray-200 rounded-lg p-2 group">
                                                                {file.type.startsWith('image/') && member.attachmentPreviews[index] ? (
                                                                    <div className="mb-2">
                                                                        <img src={member.attachmentPreviews[index]} alt={`Document ${index + 1}`} className="w-full h-24 object-cover rounded" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="mb-2 h-24 bg-gray-100 rounded flex items-center justify-center">
                                                                        <div className="text-center">
                                                                            <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                                                                            <span className="text-xs text-gray-500">{file.type.includes('pdf') ? 'PDF' : 'DOC'}</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <p className="text-xs text-gray-600 truncate mb-1" title={file.name}>{file.name}</p>
                                                                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
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

                                {/* Section 5: Health & Wellness */}
                                <div className="mb-8 pt-8 border-t border-gray-200">
                                    <h4 className="text-md font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
                                        <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-xs">5</div>
                                        Health & Wellness Information
                                    </h4>
                                    <div className="space-y-6">
                                        <div>
                                            <FormLabel component="legend" className="text-sm font-medium mb-2">Do you have any existing injuries or medical conditions?</FormLabel>
                                            <RadioGroup row value={member.hasInjuries} onChange={(e) => updateMember(member.id, { hasInjuries: e.target.value as 'yes' | 'no' })}>
                                                <FormControlLabel value="yes" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Yes" />
                                                <FormControlLabel value="no" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="No" />
                                            </RadioGroup>
                                            {member.hasInjuries === 'yes' && (
                                                <TextField label="Please specify" value={member.injuryDetails} onChange={(e) => updateMember(member.id, { injuryDetails: e.target.value })} multiline rows={3} fullWidth sx={{ '& .MuiOutlinedInput-root': { height: 'auto !important', padding: '2px !important', display: 'flex' }, '& .MuiInputBase-input': { resize: 'none !important' } }} />
                                            )}
                                        </div>
                                        <div>
                                            <FormLabel component="legend" className="text-sm font-medium mb-2">Do you have any physical restrictions?</FormLabel>
                                            <RadioGroup row value={member.hasPhysicalRestrictions} onChange={(e) => updateMember(member.id, { hasPhysicalRestrictions: e.target.value as 'yes' | 'no' })}>
                                                <FormControlLabel value="yes" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Yes" />
                                                <FormControlLabel value="no" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="No" />
                                            </RadioGroup>
                                            {member.hasPhysicalRestrictions === 'yes' && (
                                                <TextField label="Please justify" value={member.physicalRestrictionsDetails} onChange={(e) => updateMember(member.id, { physicalRestrictionsDetails: e.target.value })} multiline rows={3} fullWidth sx={{ '& .MuiOutlinedInput-root': { height: 'auto !important', padding: '2px !important', display: 'flex' }, '& .MuiInputBase-input': { resize: 'none !important' } }} />
                                            )}
                                        </div>
                                        <div>
                                            <FormLabel component="legend" className="text-sm font-medium mb-2">Are you currently under medication?</FormLabel>
                                            <RadioGroup row value={member.hasCurrentMedication} onChange={(e) => updateMember(member.id, { hasCurrentMedication: e.target.value as 'yes' | 'no' })}>
                                                <FormControlLabel value="yes" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Yes" />
                                                <FormControlLabel value="no" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="No" />
                                            </RadioGroup>
                                            {member.hasCurrentMedication === 'yes' && (
                                                <TextField label="Please justify" value={member.medicationDetails} onChange={(e) => updateMember(member.id, { medicationDetails: e.target.value })} multiline rows={3} fullWidth sx={{ '& .MuiOutlinedInput-root': { height: 'auto !important', padding: '2px !important', display: 'flex' }, '& .MuiInputBase-input': { resize: 'none !important' } }} />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Section 6: Activity Interests */}
                                <div className="mb-8 pt-8 border-t border-gray-200">
                                    <h4 className="text-md font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
                                        <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-xs">6</div>
                                        Activity Interests
                                    </h4>
                                    <div className="space-y-6">
                                        <div>
                                            <FormLabel component="legend" className="text-sm font-medium mb-3">Primary Fitness Goals:</FormLabel>
                                            <div className="space-y-1">
                                                {['General Fitness', 'Strength Training', 'Pilates', 'Mobility & Flexibility', 'Weight Management', 'Stress Relief / Lifestyle Wellness'].map((goal) => (
                                                    <FormControlLabel
                                                        key={goal}
                                                        control={
                                                            <Checkbox
                                                                size="small"
                                                                checked={member.fitnessGoals.includes(goal)}
                                                                onChange={(e) => {
                                                                    updateMember(member.id, {
                                                                        fitnessGoals: e.target.checked
                                                                            ? [...member.fitnessGoals, goal]
                                                                            : member.fitnessGoals.filter(g => g !== goal),
                                                                    });
                                                                }}
                                                                sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                                                            />
                                                        }
                                                        label={<span className="text-sm">{goal}</span>}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 7: Lifestyle & Communication */}
                                <div className="mb-8 pt-8 border-t border-gray-200">
                                    <h4 className="text-md font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
                                        <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-xs">7</div>
                                        Lifestyle & Communication
                                    </h4>
                                    <div className="space-y-6">
                                        <div>
                                            <FormLabel component="legend" className="text-sm font-medium mb-2">How did you hear about us?</FormLabel>
                                            <FormControl fullWidth sx={fieldStyles}>
                                                <Select value={member.heardAbout} onChange={(e) => updateMember(member.id, { heardAbout: e.target.value })} displayEmpty>
                                                    <MenuItem value=""><em>Select an option</em></MenuItem>
                                                    <MenuItem value="Instagram">Instagram</MenuItem>
                                                    <MenuItem value="Friend / Referral">Friend / Referral</MenuItem>
                                                    <MenuItem value="Event">Event</MenuItem>
                                                    <MenuItem value="Other">Other</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div>
                                            <FormLabel component="legend" className="text-sm font-medium mb-2">Preferred Communication Channel:</FormLabel>
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
                                                                    updateMember(member.id, {
                                                                        communicationChannel: e.target.checked
                                                                            ? [...current, channel]
                                                                            : current.filter(c => c !== channel),
                                                                    });
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

                                {/* Section 8: Occupation */}
                                <div className="pt-8 border-t border-gray-200">
                                    <h4 className="text-md font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
                                        <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-xs">8</div>
                                        Occupation & Demographics
                                    </h4>
                                    <div className="space-y-4">
                                        <TextField label="Profession / Industry" value={member.profession} onChange={(e) => updateMember(member.id, { profession: e.target.value })} sx={fieldStyles} fullWidth />
                                        <TextField label="Company Name" value={member.companyName} onChange={(e) => updateMember(member.id, { companyName: e.target.value })} sx={fieldStyles} fullWidth />
                                        <TextField label="Company Address" value={member.companyAddress || ''} onChange={(e) => updateMember(member.id, { companyAddress: e.target.value })} sx={fieldStyles} fullWidth />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Submit Buttons */}
                        <div className="flex justify-center gap-3 pt-6 border-t border-gray-200">
                            <Button variant="outline" onClick={handleBack}>Back</Button>
                            <Button variant="outline" onClick={() => navigate('/club-management/membership/groups')} disabled={isSubmitting}>Cancel</Button>
                            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#C72030] hover:bg-[#A01020] text-white">
                                {isSubmitting ? 'Updating...' : 'Update'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </LocalizationProvider>
    );
};

export default EditGroupMembershipStep2Page;
