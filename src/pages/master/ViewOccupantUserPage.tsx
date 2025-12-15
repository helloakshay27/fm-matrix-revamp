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
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import axios from 'axios';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from 'sonner';

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
    access: string[]
}

const attendanceColumns: ColumnConfig[] = [
    {
        key: "date",
        label: "Date",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "day",
        label: "Day",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "punched_in_time",
        label: "Punched In Time",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "punched_out_time",
        label: "Punched Out Time",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "duration",
        label: "Duration",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
]

export const ViewOccupantUserPage = () => {
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

    const [attendanceData, setAttendanceData] = useState([])
    const [attendanceLoading, setAttendanceLoading] = useState(false)
    const [paginationData, setPaginationData] = useState({
        current_page: 1,
        total_count: 0,
        total_pages: 0,
    })
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
        access: []
    });

    const userId = JSON.parse(localStorage.getItem('user'))?.id;

    const fetchAttendance = async (page = 1) => {
        try {
            setAttendanceLoading(true);
            const response = await axios.get(`https://${baseUrl}/pms/attendances/${id}.json?page=${page}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setAttendanceData(response.data.attendances || []);
            setPaginationData({
                current_page: response.data.pagination?.current_page || 1,
                total_count: response.data.pagination?.total_count || 0,
                total_pages: response.data.pagination?.total_pages || 1,
            });
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch attendance data');
            setAttendanceData([]);
        } finally {
            setAttendanceLoading(false);
        }
    };

    useEffect(() => {
        if (id && baseUrl && token) {
            fetchAttendance(1);
        }
    }, [id, baseUrl, token])

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
                access: userData.access_to_array || []
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

    const renderCell = (item, columnKey) => {
        switch (columnKey) {
            default:
                return item[columnKey] || '-';
        }
    };

    const handlePageChange = async (page: number) => {
        if (page < 1 || page > paginationData.total_pages || page === paginationData.current_page || attendanceLoading) {
            return;
        }

        try {
            await fetchAttendance(page);
        } catch (error) {
            console.error('Error changing page:', error);
            toast.error('Failed to load page data. Please try again.');
        }
    };

    const renderPaginationItems = () => {
        if (!paginationData.total_pages || paginationData.total_pages <= 0) {
            return null;
        }
        const items = [];
        const totalPages = paginationData.total_pages;
        const currentPage = paginationData.current_page;
        const showEllipsis = totalPages > 7;

        if (showEllipsis) {
            items.push(
                <PaginationItem key={1} className="cursor-pointer">
                    <PaginationLink
                        onClick={() => handlePageChange(1)}
                        isActive={currentPage === 1}
                        aria-disabled={attendanceLoading}
                        className={attendanceLoading ? 'pointer-events-none opacity-50' : ''}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if (currentPage > 4) {
                items.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            } else {
                for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
                    items.push(
                        <PaginationItem key={i} className="cursor-pointer">
                            <PaginationLink
                                onClick={() => handlePageChange(i)}
                                isActive={currentPage === i}
                                aria-disabled={attendanceLoading}
                                className={attendanceLoading ? 'pointer-events-none opacity-50' : ''}
                            >
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                    );
                }
            }

            if (currentPage > 3 && currentPage < totalPages - 2) {
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    items.push(
                        <PaginationItem key={i} className="cursor-pointer">
                            <PaginationLink
                                onClick={() => handlePageChange(i)}
                                isActive={currentPage === i}
                                aria-disabled={attendanceLoading}
                                className={attendanceLoading ? 'pointer-events-none opacity-50' : ''}
                            >
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                    );
                }
            }

            if (currentPage < totalPages - 3) {
                items.push(
                    <PaginationItem key="ellipsis2">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            } else {
                for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
                    if (!items.find((item) => item.key === i.toString())) {
                        items.push(
                            <PaginationItem key={i} className="cursor-pointer">
                                <PaginationLink
                                    onClick={() => handlePageChange(i)}
                                    isActive={currentPage === i}
                                    aria-disabled={attendanceLoading}
                                    className={attendanceLoading ? 'pointer-events-none opacity-50' : ''}
                                >
                                    {i}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }
                }
            }

            if (totalPages > 1) {
                items.push(
                    <PaginationItem key={totalPages} className="cursor-pointer">
                        <PaginationLink
                            onClick={() => handlePageChange(totalPages)}
                            isActive={currentPage === totalPages}
                            aria-disabled={attendanceLoading}
                            className={attendanceLoading ? 'pointer-events-none opacity-50' : ''}
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i} className="cursor-pointer">
                        <PaginationLink
                            onClick={() => handlePageChange(i)}
                            isActive={currentPage === i}
                            aria-disabled={attendanceLoading}
                            className={attendanceLoading ? 'pointer-events-none opacity-50' : ''}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }

        return items;
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

    return (
        <div className="w-full p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <button onClick={() => navigate(-1)} className='flex items-center gap-2'>
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-gray-300"
                    onClick={() => navigate(`/master/user/occupant-users/edit/${id}`)}
                >
                    <Edit2 className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Profile Section */}
                <div className="lg:col-span-4">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6 space-y-6">
                            {/* Profile Picture */}
                            <div className="text-center">
                                <div className="w-40 h-40 mx-auto mb-4 relative">
                                    <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                        <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center">
                                            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center">
                                                <svg className="w-16 h-16 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Left Side Form Controls */}
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Site</Label>
                                    <Select value={formData.site} onValueChange={(value) => handleInputChange('site', value)} disabled>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Site" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sites?.length > 0 ? (
                                                sites.map((site) => (
                                                    <SelectItem key={site.id} value={site.id}>
                                                        {site.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="px-2 py-1 text-sm text-gray-500">
                                                    No sites available
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Base Unit</Label>
                                    <Select value={formData.base_unit} onValueChange={(value) => handleInputChange('base_unit', value)} disabled>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Base Unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.isArray(units) && units?.length > 0 ? (
                                                units.map((unit) => (
                                                    <SelectItem key={unit.id} value={unit.id}>
                                                        {unit?.building?.name} - {unit.unit_name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="px-2 py-1 text-sm text-gray-500">
                                                    No units available
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">User Type</Label>
                                    <Select value={formData.system_user_type} onValueChange={(value) => handleInputChange('system_user_type', value)} disabled>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select User Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pms_admin">Admin (Web & App)</SelectItem>
                                            <SelectItem value="pms_technician">Technician (App)</SelectItem>
                                            <SelectItem value="pms_hse">Head Site Engineer</SelectItem>
                                            <SelectItem value="pms_se">Site Engineer</SelectItem>
                                            <SelectItem value="pms_occupant_admin">Customer Admin</SelectItem>
                                            <SelectItem value="pms_accounts">Accounts</SelectItem>
                                            <SelectItem value="pms_po">Purchase Officer</SelectItem>
                                            <SelectItem value="pms_qc">Quality Control</SelectItem>
                                            <SelectItem value="pms_security">Security</SelectItem>
                                            <SelectItem value="pms_security_supervisor">Security Supervisor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Entity Name</Label>
                                    <Select value={formData.entity_id} onValueChange={(value) => handleInputChange('entity_id', value)} disabled>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Entity" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {entitiesData?.entities?.length > 0 ? (
                                                entitiesData.entities.map((entity: Entity) => (
                                                    <SelectItem key={entity.id} value={entity.id}>
                                                        {entity.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="px-2 py-1 text-sm text-gray-500">
                                                    No entities available
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Email Preference</Label>
                                    <Select value={formData.email_preference} onValueChange={(value) => handleInputChange('email_preference', value)} disabled>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Email Preference" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">All Emails</SelectItem>
                                            <SelectItem value="1">Critical Emails Only</SelectItem>
                                            <SelectItem value="2">No Emails</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Form Section */}
                <div className="lg:col-span-8">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6 space-y-6">
                            {/* Name Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">First Name</Label>
                                    <Input
                                        value={formData.firstname}
                                        onChange={(e) => handleInputChange('firstname', e.target.value)}
                                        className="w-full"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Last Name</Label>
                                    <Input
                                        value={formData.lastname}
                                        onChange={(e) => handleInputChange('lastname', e.target.value)}
                                        className="w-full"
                                        disabled
                                    />
                                </div>
                            </div>

                            {/* Gender and Company Cluster */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Gender</Label>
                                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)} disabled>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Company Cluster</Label>
                                    <Select value={formData.company_cluster} onValueChange={(value) => handleInputChange('company_cluster', value)} disabled>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Cluster" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Select Cluster" disabled>Select Cluster</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Mobile and Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Mobile</Label>
                                    <Input
                                        value={formData.mobile}
                                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                                        className="w-full"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Email</Label>
                                    <Input
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full"
                                        disabled
                                    />
                                </div>
                            </div>

                            {/* User Type Radio Buttons */}
                            <div className="space-y-2">
                                <RadioGroup
                                    value={formData.user_type}
                                    onValueChange={(value) => handleInputChange('user_type', value)}
                                    className="flex gap-6"
                                    disabled
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="internal" id="internal" />
                                        <Label htmlFor="internal" className="text-sm">Internal</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="external" id="external" />
                                        <Label htmlFor="external" className="text-sm">External</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Employee and Last Working Day */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Employee</Label>
                                    <Input
                                        value={formData.employee_id}
                                        onChange={(e) => handleInputChange('employee_id', e.target.value)}
                                        placeholder="Employee ID"
                                        className="w-full"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Last Working Day</Label>
                                    <Input
                                        value={formData.last_working_day}
                                        onChange={(e) => handleInputChange('last_working_day', e.target.value)}
                                        placeholder="Last Working Day"
                                        className="w-full"
                                        disabled
                                    />
                                </div>
                            </div>

                            {/* Department and Designation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Department</Label>
                                    <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)} disabled>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.isArray(department) && department?.length > 0 ? (
                                                department.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.id}>
                                                        {dept.department_name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="px-2 py-1 text-sm text-gray-500">
                                                    No departments available
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Designation</Label>
                                    <Input
                                        value={formData.designation}
                                        onChange={(e) => handleInputChange('designation', e.target.value)}
                                        className="w-full"
                                        disabled
                                    />
                                </div>
                            </div>

                            {/* Role and Vendor Company */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Role</Label>
                                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)} disabled>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.isArray(roles) && roles?.length > 0 ? (
                                                roles.map((role) => (
                                                    <SelectItem key={role.id} value={role.id}>
                                                        {role.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="px-2 py-1 text-sm text-gray-500">
                                                    No roles available
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Vendor Company Name</Label>
                                    <Select value={formData.vendor_company} onValueChange={(value) => handleInputChange('vendor_company', value)} disabled>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Vendor Company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.isArray(suppliers) && suppliers?.length > 0 ? (
                                                suppliers.map((supplier) => (
                                                    <SelectItem key={supplier.id} value={supplier.id}>
                                                        {supplier.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="px-2 py-1 text-sm text-gray-500">
                                                    No vendors available
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Access Level and Access */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Access Level</Label>
                                    <Select value={formData.access_level} onValueChange={(value) => handleInputChange('access_level', value)} disabled>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Access Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Company">Company</SelectItem>
                                            <SelectItem value="Site">Site</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Access</Label>
                                    <div className="mt-2 flex items-center gap-1 flex-wrap">
                                        {
                                            formData.access.map((access, index) => (
                                                <Badge key={index} variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                                                    {access}
                                                </Badge>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Daily Helpdesk Report Checkbox */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="daily-helpdesk"
                                    checked={formData.daily_helpdesk_report}
                                    onCheckedChange={(checked) => handleInputChange('daily_helpdesk_report', Boolean(checked))}
                                    disabled
                                />
                                <Label htmlFor="daily-helpdesk" className="text-sm text-gray-700">
                                    Daily Helpdesk Report Email
                                </Label>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mt-6">
                <EnhancedTable
                    data={attendanceData}
                    columns={attendanceColumns}
                    renderCell={renderCell}
                    hideTableSearch={true}
                    hideColumnsButton={true}
                    loading={attendanceLoading}
                />

                {paginationData.total_pages > 1 && (
                    <div className="flex justify-center mt-6">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => handlePageChange(Math.max(1, paginationData.current_page - 1))}
                                        className={paginationData.current_page === 1 || attendanceLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    />
                                </PaginationItem>
                                {renderPaginationItems()}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => handlePageChange(Math.min(paginationData.total_pages, paginationData.current_page + 1))}
                                        className={paginationData.current_page === paginationData.total_pages || attendanceLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    );
};