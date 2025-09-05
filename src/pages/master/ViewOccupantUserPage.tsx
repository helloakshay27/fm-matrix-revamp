import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Mail, Phone, Building2, Shield, ChevronDown, ChevronUp } from 'lucide-react';

interface LockUserPermission {
    id?: number;
    status?: string;
    active?: boolean;
    access_level?: string;
    access_to?: string[];
    access_to_names?: string[];
    designation?: string;
    department_name?: string;
    employee_id?: string;
    department?: {
        id?: number;
        department_name?: string;
    };
    role_name?: string;
    base_unit_name?: string;
    ownership?: string;
    is_internal?: boolean;
    internal_external?: string; // sometimes text
    last_working_day?: string;
    sites_with_entities?: string[];
}

interface OccupantUserDetail {
    id: number;
    firstname?: string;
    lastname?: string;
    email?: string;
    mobile?: string;
    gender?: string;
    company_name?: string;
    entity_name?: string;
    birth_date?: string;
    created_at?: string;
    user_type?: string;
    site_name?: string;
    cluster_name?: string; // company cluster
    source_type?: string;
    daily_helpdesk_report_email?: boolean;
    lock_user_permission?: LockUserPermission;
}

export const ViewOccupantUserPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<OccupantUserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [basicExpanded, setBasicExpanded] = useState(true);
    const [contactExpanded, setContactExpanded] = useState(true);
    const [accessExpanded, setAccessExpanded] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            try {
                setLoading(true);
                setError(null);
                const baseUrl = localStorage.getItem('baseUrl') || 'app.gophygital.work';
                const token = localStorage.getItem('token') || '';
                const url = `https://${baseUrl}/pms/users/${id}/user_show.json`;
                const resp = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
                const data = resp.data?.user || resp.data;
                setUser(data as OccupantUserDetail);
            } catch (e) {
                console.error('Error loading occupant user', e);
                setError('Failed to load occupant user');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const CollapsibleSection: React.FC<{ title: string; icon: any; isExpanded: boolean; onToggle: () => void; hasData?: boolean; children: React.ReactNode; }> = ({
        title,
        icon: Icon,
        isExpanded,
        onToggle,
        hasData = true,
        children,
    }) => (
        <Card className="mb-6 border border-[#D9D9D9]">
            <CardHeader onClick={onToggle} className="cursor-pointer bg-[#F6F4EE] border-b border-[#D9D9D9]">
                <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center">
                            <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-[#1A1A1A] font-semibold uppercase">{title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {!hasData && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">No data</span>
                        )}
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                    </div>
                </CardTitle>
            </CardHeader>
            {isExpanded && <CardContent className="p-6 bg-[#F6F7F7]">{children}</CardContent>}
        </Card>
    );

    if (loading) {
        return (
            <div className="p-6 bg-white min-h-screen">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Loading occupant user...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="p-6 bg-white min-h-screen">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error || 'Occupant user not found'}</p>
                        <Button variant="outline" onClick={() => navigate('/master/user/occupant-users')}>Back to List</Button>
                    </div>
                </div>
            </div>
        );
    }

    const fullName = `${user.firstname || ''} ${user.lastname || ''}`.trim();
    const accessNames = user.lock_user_permission?.access_to_names || [];
    const accessList = (accessNames.length ? accessNames : (user.lock_user_permission?.access_to || []));
    const sitesWithEntities = user.lock_user_permission?.sites_with_entities || (user as any)?.sites_with_entities || [];
    const internalExternal = typeof user.lock_user_permission?.is_internal === 'boolean'
        ? (user.lock_user_permission?.is_internal ? 'Internal' : 'External')
        : (user.lock_user_permission?.internal_external || '-');

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <nav className="flex items-center text-sm text-gray-600 mb-4">
                    <span>Master</span>
                    <span className="mx-2">{'>'}</span>
                    <span>Occupant Users</span>
                    <span className="mx-2">{'>'}</span>
                    <span>Details</span>
                </nav>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                        {/* <h1 className="text-2xl font-bold text-[#1a1a1a]">{fullName || `User #${user.id}`}</h1>
                        <p className="text-sm text-gray-500">ID: {user.id}</p> */}
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={() => navigate(`/master/user/occupant-users/edit/${user.id}`)} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90">Edit</Button>
                        <Button variant="outline" onClick={() => navigate('/master/user/occupant-users')}>Back to List</Button>
                    </div>
                </div>
            </div>

            {/* Sections */}
            <CollapsibleSection title="BASIC DETAILS" icon={User} isExpanded={basicExpanded} onToggle={() => setBasicExpanded(!basicExpanded)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div><span className="text-sm text-gray-600">Name</span><p className="font-medium">: {fullName || '-'}</p></div>
                        <div><span className="text-sm text-gray-600">User Type</span><p className="font-medium">: {user.user_type || '-'}</p></div>
                        <div><span className="text-sm text-gray-600">Designation</span><p className="font-medium">: {user.lock_user_permission?.designation || '-'}</p></div>
                    </div>
                    <div className="space-y-4">
                        <div><span className="text-sm text-gray-600">Department</span><p className="font-medium">: {user.lock_user_permission?.department_name || user.lock_user_permission?.department?.department_name || '-'}</p></div>
                        <div><span className="text-sm text-gray-600">Employee ID</span><p className="font-medium">: {user.lock_user_permission?.employee_id || '-'}</p></div>
                        <div><span className="text-sm text-gray-600">Status</span><p className="font-medium">: {user.lock_user_permission?.status || '-'}</p></div>
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="CONTACT" icon={Phone} isExpanded={contactExpanded} onToggle={() => setContactExpanded(!contactExpanded)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div><span className="text-sm text-gray-600">Email</span><p className="font-medium break-all">: {user.email || '-'}</p></div>
                        <div><span className="text-sm text-gray-600">Mobile</span><p className="font-medium">: {user.mobile || '-'}</p></div>
                    </div>
                    <div className="space-y-4">
                        <div><span className="text-sm text-gray-600">Gender</span><p className="font-medium">: {user.gender || '-'}</p></div>
                        <div><span className="text-sm text-gray-600">Birth Date</span><p className="font-medium">: {user.birth_date || '-'}</p></div>
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="ORGANIZATION" icon={Building2} isExpanded={true} onToggle={() => {}}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div><span className="text-sm text-gray-600">Site</span><p className="font-medium">: {user.site_name || '-'}</p></div>
                        <div><span className="text-sm text-gray-600">Entity</span><p className="font-medium">: {user.entity_name || '-'}</p></div>
                        <div><span className="text-sm text-gray-600">Base Unit</span><p className="font-medium">: {user.lock_user_permission?.base_unit_name || '-'}</p></div>
                    </div>
                    <div className="space-y-4">
                        <div><span className="text-sm text-gray-600">Company Cluster</span><p className="font-medium">: {user.cluster_name || '-'}</p></div>
                        <div><span className="text-sm text-gray-600">Ownership</span><p className="font-medium">: {user.lock_user_permission?.ownership || '-'}</p></div>
                        <div><span className="text-sm text-gray-600">Role</span><p className="font-medium">: {user.lock_user_permission?.role_name || '-'}</p></div>
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="EMPLOYMENT" icon={User} isExpanded={true} onToggle={() => {}}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div><span className="text-sm text-gray-600">Type</span><p className="font-medium">: {internalExternal}</p></div>
                        <div><span className="text-sm text-gray-600">Last Working Day</span><p className="font-medium">: {user.lock_user_permission?.last_working_day || '-'}</p></div>
                        <div><span className="text-sm text-gray-600">Source Type</span><p className="font-medium">: {user.source_type || '-'}</p></div>
                    </div>
                    <div className="space-y-4">
                        <div><span className="text-sm text-gray-600">Company</span><p className="font-medium">: {user.company_name || '-'}</p></div>
                        <div><span className="text-sm text-gray-600">Designation</span><p className="font-medium">: {user.lock_user_permission?.designation || '-'}</p></div>
                        <div><span className="text-sm text-gray-600">Department</span><p className="font-medium">: {user.lock_user_permission?.department_name || user.lock_user_permission?.department?.department_name || '-'}</p></div>
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="ACCESS" icon={Shield} isExpanded={accessExpanded} onToggle={() => setAccessExpanded(!accessExpanded)} hasData>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div><span className="text-sm text-gray-600">Access Level</span><p className="font-medium">: {user.lock_user_permission?.access_level || '-'}</p></div>
                        <div>
                            <span className="text-sm text-gray-600">Access</span>
                            <div className="mt-1 flex flex-wrap gap-2">
                                {accessList.length > 0 ? (
                                    accessList.map((a, idx) => (
                                        <span key={idx} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">{a}</span>
                                    ))
                                ) : (
                                    <span className="font-medium">: -</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <span className="text-sm text-gray-600">Access To</span>
                            <div className="mt-1 flex flex-wrap gap-2">
                                {accessList.length > 0 ? (
                                    accessList.map((a, idx) => (
                                        <span key={idx} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">{a}</span>
                                    ))
                                ) : (
                                    <span className="font-medium">: -</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">Sites with Entities</span>
                            <div className="mt-1 flex flex-wrap gap-2">
                                {Array.isArray(sitesWithEntities) && sitesWithEntities.length > 0 ? (
                                    sitesWithEntities.map((swe: any, idx: number) => (
                                        <span key={idx} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{String(swe)}</span>
                                    ))
                                ) : (
                                    <span className="font-medium">: -</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="PREFERENCES" icon={Mail} isExpanded={true} onToggle={() => {}}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div><span className="text-sm text-gray-600">Daily Helpdesk Report Email</span><p className="font-medium">: {user.daily_helpdesk_report_email ? 'Yes' : 'No'}</p></div>
                    </div>
                </div>
            </CollapsibleSection>
        </div>
    );
};

export default ViewOccupantUserPage;
