import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchRoles, fetchSuppliers, fetchUnits, getUserDetails } from '@/store/slices/fmUserSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { fetchAllowedSites } from '@/store/slices/siteSlice';
import { fetchAllowedCompanies } from '@/store/slices/projectSlice';
import { fetchDepartmentData } from '@/store/slices/departmentSlice';
import { Entity, fetchEntities } from '@/store/slices/entitiesSlice';

interface FormData {
    firstname: string;
    lastname: string;
    gender: string;
    mobile: string;
    email: string;
    company_name: string;
    entity_id: string;
    designation: string;
    employee_id: string;
    user_type: string;
    face_added: boolean;
    app_downloaded: string;
    access_level: string;
    daily_helpdesk_report: boolean;
    site: string;
    base_unit: string;
    system_user_type: string;
    department: string;
    role: string;
    vendor_company: string;
    company_cluster: string;
    last_working_day: string;
    email_preference: string;
    access: string[];
    club_member_enabled: boolean;
    access_card_enabled: boolean;
    start_date: string;
    end_date: string;
    membership_number: string;
    access_card_id: string;
}

export const ViewGuestUserPage = () => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');

    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { data: entitiesData, loading: entitiesLoading } = useAppSelector((state) => state.entities);
    const { data: suppliers, loading: suppliersLoading } = useAppSelector((state) => state.fetchSuppliers);
    const { data: units, loading: unitsLoading } = useAppSelector((state) => state.fetchUnits);
    const { data: department, loading: departmentLoading } = useAppSelector((state) => state.department);
    const { data: roles, loading: roleLoading } = useAppSelector((state) => state.fetchRoles);
    const { sites } = useAppSelector((state) => state.site);

    const [formData, setFormData] = useState<FormData>({
        firstname: '',
        lastname: '',
        gender: '',
        mobile: '',
        email: '',
        company_name: '',
        entity_id: '',
        designation: '',
        employee_id: '',
        user_type: '',
        face_added: false,
        app_downloaded: 'No',
        access_level: '',
        daily_helpdesk_report: false,
        site: '',
        base_unit: '',
        system_user_type: 'admin',
        department: '',
        role: 'admin',
        vendor_company: '',
        company_cluster: '',
        last_working_day: '',
        email_preference: '',
        access: [],
        club_member_enabled: false,
        access_card_enabled: false,
        start_date: '',
        end_date: '',
        membership_number: '',
        access_card_id: '',
    });

    const userId = JSON.parse(localStorage.getItem('user'))?.id;

    useEffect(() => {
        dispatch(fetchEntities());
        dispatch(fetchSuppliers({ baseUrl, token }));
        dispatch(fetchUnits({ baseUrl, token }));
        dispatch(fetchDepartmentData());
        dispatch(fetchRoles({ baseUrl, token }));
        dispatch(fetchAllowedSites(userId));
        dispatch(fetchAllowedCompanies());
    }, [dispatch, baseUrl, token, userId]);

    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        gender: '',
        mobile: '',
        email: '',
        company_name: '',
        entity_id: '',
        user_type: '',
        face_added: false,
        app_downloaded: 'No',
        access_level: '',
        daily_helpdesk_report: false,
        site: '',
        base_unit: '',
        system_user_type: 'admin',
        department: '',
        role: 'admin',
        vendor_company: '',
        company_cluster: '',
        last_working_day: '',
        site_id: '',
        unit_id: '',
        department_id: '',
        supplier_id: '',
        access_to_array: [],
        urgency_email_enabled: false,
        club_member: [] as any[],
        lock_user_permission: {
            designation: '',
            employee_id: '',
            access_level: '',
            daily_pms_report: false,
            lock_role_id: '',
            last_working_date: '',
        }
    })

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await dispatch(getUserDetails({ baseUrl, token, id: Number(id) })).unwrap()
                setUserData(response)
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser();
    }, []);

    console.log(formData)

    useEffect(() => {
        if (userData) {
            const clubMemberData = userData.club_member && userData.club_member.length > 0 ? userData.club_member[0] : null;
            
            setFormData({
                firstname: userData.firstname || '',
                lastname: userData.lastname || '',
                gender: userData.gender || '',
                mobile: userData.mobile || '',
                email: userData.email || '',
                company_name: userData.company_name || '',
                entity_id: userData.entity_id || '',
                designation: userData.lock_user_permission?.designation || '',
                employee_id: userData.lock_user_permission?.employee_id || '',
                user_type: userData.user_type || '',
                face_added: userData.face_added || false,
                app_downloaded: userData.app_downloaded || 'No',
                access_level: userData.lock_user_permission?.access_level || 'Site',
                daily_helpdesk_report: userData.lock_user_permission?.daily_pms_report,
                site: userData.site_id || '',
                base_unit: userData.unit_id,
                system_user_type: userData.user_type,
                department: userData.department_id,
                role: userData.lock_user_permission?.lock_role_id,
                vendor_company: userData.supplier_id,
                company_cluster: '',
                last_working_day: userData.lock_user_permission?.last_working_date,
                email_preference: userData.urgency_email_enabled?.toString(),
                access: userData.access_to_array || [],
                club_member_enabled: clubMemberData?.club_member_enabled || false,
                access_card_enabled: clubMemberData?.access_card_enabled || false,
                start_date: clubMemberData?.start_date || '',
                end_date: clubMemberData?.end_date || '',
                membership_number: clubMemberData?.membership_number || '',
                access_card_id: clubMemberData?.access_card_id || '',
            });
        } else {
            console.log('userData not found for id:', id);
        }
    }, [userData, id]);

    const handleInputChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
        console.log(`Updating ${field} to:`, value);
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (entitiesLoading || suppliersLoading || unitsLoading || departmentLoading || roleLoading) {
        return (
            <div className="w-full p-6 space-y-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading user details...</div>
                </div>
            </div>
        );
    }

    const getUserTypeLabel = (type: string) => {
        const types = {
            'pms_admin': 'Admin (Web & App)',
            'pms_technician': 'Technician (App)',
            'pms_hse': 'Head Site Engineer',
            'pms_se': 'Site Engineer',
            'pms_occupant': 'Occupant',
            'pms_occupant_admin': 'Customer Admin',
            'pms_accounts': 'Accounts',
            'pms_po': 'Purchase Officer',
            'pms_qc': 'Quality Control',
            'pms_security': 'Security',
            'pms_security_supervisor': 'Security Supervisor',
        };
        return types[type] || type;
    };

    const getEmailPreferenceLabel = (pref: string) => {
        const prefs = {
            '0': 'All Emails',
            '1': 'Critical Emails Only',
            '2': 'No Emails',
        };
        return prefs[pref] || pref;
    };

    const getSiteName = (siteId: string) => {
        const site = sites?.find(s => String(s.id) === siteId);
        return site?.name || '-';
    };

    const getRoleName = (roleId: string) => {
        const role = Array.isArray(roles) ? roles.find(r => String(r.id) === roleId) : null;
        return role?.name || '-';
    };

    return (
        <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center border-2 border-gray-200">
                                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                                {formData.firstname} {formData.lastname}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm text-gray-600">
                                    {formData.email}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => navigate(`/club-management/users/guest/edit/${id}`)}
                            className="bg-[#C72030] hover:bg-[#A01020] text-white"
                        >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <Card className="w-full bg-transparent shadow-none border-none">
                        <div className="figma-card-header">
                            <div className="flex items-center gap-3">
                                <div className="figma-card-icon-wrapper">
                                    <svg className="figma-card-icon" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                </div>
                                <h3 className="figma-card-title">Personal Information</h3>
                            </div>
                        </div>
                        <div className="figma-card-content">
                            <div className="task-info-enhanced">
                                <div className="task-info-row">
                                    <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                        First Name
                                    </span>
                                    <span className="task-info-separator-enhanced">:</span>
                                    <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                        {formData.firstname || '-'}
                                    </span>
                                </div>
                                
                                <div className="task-info-row">
                                    <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                        Last Name
                                    </span>
                                    <span className="task-info-separator-enhanced">:</span>
                                    <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                        {formData.lastname || '-'}
                                    </span>
                                </div>
                                
                                <div className="task-info-row">
                                    <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                        Gender
                                    </span>
                                    <span className="task-info-separator-enhanced">:</span>
                                    <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                        {formData.gender || '-'}
                                    </span>
                                </div>
                                
                                <div className="task-info-row">
                                    <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                        Mobile
                                    </span>
                                    <span className="task-info-separator-enhanced">:</span>
                                    <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                        {formData.mobile || '-'}
                                    </span>
                                </div>
                                
                                <div className="task-info-row">
                                    <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                        Email
                                    </span>
                                    <span className="task-info-separator-enhanced">:</span>
                                    <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                        {formData.email || '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Club Member Details */}
                    {formData.membership_number && (
                        <Card className="w-full bg-transparent shadow-none border-none">
                            <div className="figma-card-header">
                                <div className="flex items-center gap-3">
                                    <div className="figma-card-icon-wrapper">
                                        <svg className="figma-card-icon" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                                        </svg>
                                    </div>
                                    <h3 className="figma-card-title">Club Member Details</h3>
                                </div>
                            </div>
                            <div className="figma-card-content">
                                <div className="task-info-enhanced">
                                    <div className="task-info-row">
                                        <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                            Club Member
                                        </span>
                                        <span className="task-info-separator-enhanced">:</span>
                                        <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                            <Badge variant={formData.club_member_enabled ? "default" : "secondary"}>
                                                {formData.club_member_enabled ? 'Enabled' : 'Disabled'}
                                            </Badge>
                                        </span>
                                    </div>
                                    
                                    <div className="task-info-row">
                                        <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                            Access Card
                                        </span>
                                        <span className="task-info-separator-enhanced">:</span>
                                        <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                            <Badge variant={formData.access_card_enabled ? "default" : "secondary"}>
                                                {formData.access_card_enabled ? 'Enabled' : 'Disabled'}
                                            </Badge>
                                        </span>
                                    </div>
                                    
                                    <div className="task-info-row">
                                        <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                            Start Date
                                        </span>
                                        <span className="task-info-separator-enhanced">:</span>
                                        <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                            {formData.start_date ? new Date(formData.start_date).toLocaleDateString('en-GB') : '-'}
                                        </span>
                                    </div>
                                    
                                    <div className="task-info-row">
                                        <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                            End Date
                                        </span>
                                        <span className="task-info-separator-enhanced">:</span>
                                        <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                            {formData.end_date ? new Date(formData.end_date).toLocaleDateString('en-GB') : '-'}
                                        </span>
                                    </div>
                                    
                                    <div className="task-info-row">
                                        <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                            Membership Number
                                        </span>
                                        <span className="task-info-separator-enhanced">:</span>
                                        <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                            {formData.membership_number || '-'}
                                        </span>
                                    </div>
                                    
                                    <div className="task-info-row">
                                        <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                            Access Card ID
                                        </span>
                                        <span className="task-info-separator-enhanced">:</span>
                                        <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                            {formData.access_card_id || '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* User Details */}
                    {/* <Card className="w-full bg-transparent shadow-none border-none">
                        <div className="figma-card-header">
                            <div className="flex items-center gap-3">
                                <div className="figma-card-icon-wrapper">
                                    <svg className="figma-card-icon" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                                    </svg>
                                </div>
                                <h3 className="figma-card-title">User Details</h3>
                            </div>
                        </div>
                        <div className="figma-card-content">
                            <div className="task-info-enhanced">
                                <div className="task-info-row">
                                    <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                        Employee ID
                                    </span>
                                    <span className="task-info-separator-enhanced">:</span>
                                    <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                        {formData.employee_id || '-'}
                                    </span>
                                </div>
                                
                                <div className="task-info-row">
                                    <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                        Role
                                    </span>
                                    <span className="task-info-separator-enhanced">:</span>
                                    <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                        {getRoleName(formData.role)}
                                    </span>
                                </div>
                                
                                <div className="task-info-row">
                                    <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                        Access Level
                                    </span>
                                    <span className="task-info-separator-enhanced">:</span>
                                    <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                        {formData.access_level || '-'}
                                    </span>
                                </div>
                                
                                <div className="task-info-row">
                                    <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                        Access
                                    </span>
                                    <span className="task-info-separator-enhanced">:</span>
                                    <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                        <div className="flex items-center gap-1 flex-wrap">
                                            {formData.access.length > 0 ? (
                                                formData.access.map((access, index) => (
                                                    <Badge key={index} variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                                                        {access}
                                                    </Badge>
                                                ))
                                            ) : '-'}
                                        </div>
                                    </span>
                                </div>
                                
                                <div className="task-info-row">
                                    <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                        Daily Helpdesk Report
                                    </span>
                                    <span className="task-info-separator-enhanced">:</span>
                                    <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                        <Badge variant={formData.daily_helpdesk_report ? "default" : "secondary"}>
                                            {formData.daily_helpdesk_report ? 'Enabled' : 'Disabled'}
                                        </Badge>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card> */}
                </div>

                {/* Right Column - System Information */}
                <div className="space-y-6">
                    {/* System Information */}
                    {/* <Card className="w-full bg-transparent shadow-none border-none">
                        <div className="figma-card-header">
                            <div className="flex items-center gap-3">
                                <div className="figma-card-icon-wrapper">
                                    <svg className="figma-card-icon" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                                    </svg>
                                </div>
                                <h3 className="figma-card-title">System Information</h3>
                            </div>
                        </div>
                        <div className="figma-card-content">
                            <div className="task-info-enhanced">
                                <div className="task-info-row">
                                    <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                        Site
                                    </span>
                                    <span className="task-info-separator-enhanced">:</span>
                                    <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                        {getSiteName(formData.site)}
                                    </span>
                                </div>
                                
                                <div className="task-info-row">
                                    <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                        User Type
                                    </span>
                                    <span className="task-info-separator-enhanced">:</span>
                                    <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                        {getUserTypeLabel(formData.system_user_type)}
                                    </span>
                                </div>
                                
                                <div className="task-info-row">
                                    <span className="task-info-label-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 500, fontSize: "16px" }}>
                                        Email Preference
                                    </span>
                                    <span className="task-info-separator-enhanced">:</span>
                                    <span className="task-info-value-enhanced" style={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px" }}>
                                        {getEmailPreferenceLabel(formData.email_preference)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card> */}
                </div>
            </div>
        </div>
    );
};