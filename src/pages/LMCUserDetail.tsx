import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BadgeCheck, Users, CalendarCheck2 } from 'lucide-react';
import formSchema from './lmc_form.json';

interface LMCUserRef {
    id: number;
    name: string;
    email: string;
    mobile?: string | null;
    employee_id?: string | number | null;
    employee_type?: string | null;
    circle_name?: string | null;
    department_name?: string | null;
    role_name?: string | null;
    company_name?: string | null;
}
interface LMCDetailApiResponse {
    id: number;
    user_id: number;
    created_by_id?: number;
    validity_date?: string | null;
    form_details?: Record<string, string> | null;
    status?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    url?: string | null;
    lmc_user?: LMCUserRef | null;
    created_by?: LMCUserRef | null;
    selected_krcc_categories?: string[];
}
interface Checkpoint { question: string; answer: string }
const SECTION_TITLE_MAP: Record<string, string> = {
    'KrccRequirementComingFrom.car': 'Drive a 4 Wheeler',
    'KrccRequirementComingFrom.bike': 'Ride a 2 Wheeler',
    'KrccRequirementComingFrom.electrical': 'Work on Electrical System',
    'KrccRequirementComingFrom.height': 'Work at Height',
    'KrccRequirementComingFrom.workUnderground': 'Work underground',
    'KrccRequirementComingFrom.rideBicycle': 'Ride a Bicycle',
    'KrccRequirementComingFrom.operateMHE': 'Operate MHE',
    'KrccRequirementComingFrom.liftMaterialManually': 'Lift Material Manually',
    'form': 'LMC Form',
    'final_page_form': 'Common LMC Form',
    'KrccRequirementComingFrom.noneOfTheAbove': 'None of the above',
};

const LMCUserDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const passedRow = (location.state as any)?.row || {};
    const lmcId = params?.id || passedRow?.id;

    const [detail, setDetail] = useState<LMCDetailApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!lmcId) return;
        const fetchDetail = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            if (!baseUrl || !token) { setError('Missing base URL or token'); return; }
            setLoading(true); setError(null);
            try {
                const cleanBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
                const res = await fetch(`${cleanBaseUrl}/lmcs/${lmcId}.json`, { headers: { Authorization: `Bearer ${token}` } });
                if (!res.ok) throw new Error(`Failed (${res.status})`);
                const json: LMCDetailApiResponse = await res.json();
                const weirdKey = (json as any)['selected_krcc_categories='];
                if (weirdKey && !(json as any).selected_krcc_categories) {
                    (json as any).selected_krcc_categories = weirdKey;
                }
                setDetail(json);
            } catch (e: any) { setError(e.message || 'Failed to load LMC'); }
            finally { setLoading(false); }
        };
        fetchDetail();
    }, [lmcId]);

    const groupedCheckpoints = useMemo(() => {
        const schema: any = formSchema as any;
        const alwaysInclude = ['form', 'final_page_form'];
        const selectedRaw = detail?.selected_krcc_categories || [];
        const normalizedSelected = selectedRaw.map(c => (typeof c === 'string' ? c.trim() : c)).filter(Boolean) as string[];
        const seen = new Set<string>();
        const ordered: string[] = [];
        alwaysInclude.forEach(c => { if (!seen.has(c)) { seen.add(c); ordered.push(c); } });
        normalizedSelected.forEach(c => { if (!seen.has(c)) { seen.add(c); ordered.push(c); } });
        const formDetails = detail?.form_details || {};
        return ordered.map(catKey => {
            const section = schema[catKey];
            if (!section) {
                return { category: catKey, items: [] as Checkpoint[], missing: true };
            }
            const items: Checkpoint[] = Object.entries(section).map(([fieldKey, meta]: any) => {
                const answerRaw = (formDetails as any)[fieldKey];
                const answer = (answerRaw === undefined || answerRaw === null || answerRaw === '') ? '—' : String(answerRaw);
                return { question: meta.question, answer };
            });
            return { category: catKey, items, missing: false };
        });
    }, [detail]);

    const lmcUser = detail?.lmc_user;
    const createdBy = detail?.created_by;
    const createdAt = detail?.created_at;

    const formatDate = (iso?: string | null) => {
        if (!iso) return '—';
        try { return new Date(iso).toLocaleDateString('en-GB'); } catch { return '—'; }
    };

    // Loading & error states align with ServiceDetailsPage style
    if (loading) {
        return (
            <div className="p-6 bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4" />
                    <p className="text-gray-700">Loading LMC details...</p>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="p-4 sm:p-6">
                <div className="flex justify-center items-center py-8">
                    <div className="text-red-600">Error: {error}</div>
                </div>
            </div>
        );
    }
    if (!detail) {
        return (
            <div className="p-4 sm:p-6">
                <div className="flex justify-center items-center py-8">
                    <div className="text-gray-600">No LMC details found</div>
                </div>
            </div>
        );
    }

    const buildFieldRows = (fields: { label: string; value: any }[]) => {
        const midpoint = Math.ceil(fields.length / 2);
        const left = fields.slice(0, midpoint);
        const right = fields.slice(midpoint);
        const renderCol = (col: typeof fields) => (
            <div className="space-y-3">
                {col.map(f => (
                    <div key={f.label} className="flex">
                        <span className="text-gray-500 w-48 md:w-40">{f.label}</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium break-words">{(f.value === undefined || f.value === null || f.value === '') ? '—' : String(f.value)}</span>
                    </div>
                ))}
            </div>
        );
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 text-[15px] p-4 gap-6">
                {renderCol(left)}
                {renderCol(right)}
            </div>
        );
    };

    const doneByFields = [
        { label: 'LMC Done By (Unique ID)', value: createdBy?.id },
        { label: 'Name', value: createdBy?.name },
        { label: 'Email', value: createdBy?.email },
        { label: 'Mobile Number', value: createdBy?.mobile },
        { label: 'Employee ID', value: createdBy?.employee_id },
        { label: 'Employee Type', value: createdBy?.employee_type },
        { label: 'Circle', value: createdBy?.circle_name },
        { label: 'Function', value: createdBy?.department_name },
        { label: 'Role', value: createdBy?.role_name },
    ];
    const doneOnFields = [
        { label: 'Name', value: lmcUser?.name },
        { label: 'Vendor Name', value: lmcUser?.company_name },
        { label: 'Email', value: lmcUser?.email },
        { label: 'Mobile Number', value: lmcUser?.mobile },
        { label: 'Unique Number', value: lmcUser?.id },
        { label: 'Employee ID', value: lmcUser?.employee_id },
        { label: 'Employee Type', value: lmcUser?.employee_type },
    ];

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 hover:text-gray-800 mb-4 text-base"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="mb-3">
                        <h1 className="text-2xl font-bold text-[#1a1a1a] truncate">LMC DETAILS</h1>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border text-[15px] mb-6">
                <div className="flex p-4 items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-xs mr-3">
                        <BadgeCheck className="w-5 h-5 text-[#C72030]" />
                    </div>
                    <h2 className="text-lg font-bold">LMC DETAILS - DONE BY</h2>
                </div>
                {buildFieldRows(doneByFields)}
            </div>

            <div className="bg-white rounded-lg border text-[15px] mb-6">
                <div className="flex p-4 items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-xs mr-3">
                        <Users className="w-5 h-5 text-[#C72030]" />
                    </div>
                    <h2 className="text-lg font-bold">LMC DONE ON</h2>
                </div>
                {buildFieldRows(doneOnFields)}
            </div>

            <div className="bg-white rounded-lg border text-[15px] mb-6">
                <div className="flex p-4 items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-xs mr-3">
                        <CalendarCheck2 className="w-5 h-5 text-[#C72030]" />
                    </div>
                        <h2 className="text-lg font-bold">CHECKPOINTS</h2>
                </div>
                <div className="p-4">
                    <div className="flex mb-6">
                        <span className="text-gray-500 w-48 md:w-40">LMC Date</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{formatDate(createdAt)}</span>
                    </div>
                    {groupedCheckpoints.map(group => (
                        <div key={group.category} className="mb-6 border rounded-lg">
                            <div className="px-4 py-2 border-b bg-gray-50 text-sm font-semibold flex items-center gap-2">
                                <span className="text-[#C72030]">{SECTION_TITLE_MAP[group.category] || group.category.replace(/KrccRequirementComingFrom\./, '').replace(/_/g, ' ').toUpperCase()}</span>
                            </div>
                            <div className="p-4">
                                {group.items.length > 0 ? (
                                    <ul className="space-y-4">
                                        {group.items.map((cp, idx) => (
                                            <li key={idx} className="text-sm">
                                                <div className="font-medium">- {cp.question}</div>
                                                <div className="text-gray-700">Ans: {cp.answer}</div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-gray-500 text-sm">No questions defined.</div>
                                )}
                            </div>
                        </div>
                    ))}
                    {groupedCheckpoints.length === 0 && (
                        <div className="text-gray-500 text-sm">No checkpoints available.</div>
                    )}
                    {error && <div className="text-sm text-red-600 mt-4">{error}</div>}
                </div>
            </div>
        </div>
    );
};

export default LMCUserDetail;
