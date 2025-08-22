import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, BadgeCheck, Users, Hash, CalendarCheck2 } from 'lucide-react';
import formSchema from './lmc_form.json';

interface LMCUserRef { id: number; name: string; email: string; mobile?: string | null; employee_type?: string | null }
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
    selected_krcc_categories?: string[]; // categories selected in the LMC
}

interface Checkpoint { question: string; answer: string }

// Friendly titles for each schema section
const SECTION_TITLE_MAP: Record<string, string> = {
    'KrccRequirementComingFrom.car': 'Drive a 4 Wheeler',
    'KrccRequirementComingFrom.bike': 'Ride a 2 Wheeler',
    'KrccRequirementComingFrom.electrical': 'Work on Electrical System',
    'KrccRequirementComingFrom.height': 'Work at Height',
    'KrccRequirementComingFrom.workUnderground': 'Work underground',
    'KrccRequirementComingFrom.rideBicycle': 'Ride a Bicycle',
    'KrccRequirementComingFrom.operateMHE': 'Operate MHE',
    'KrccRequirementComingFrom.liftMaterialManually': 'Lift Material Manually',
    // Base sections
    'form': 'FORM',
    'final_page_form': 'FINAL',
    'KrccRequirementComingFrom.noneOfTheAbove': 'None of the above',
};

const LMCUserDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const passedRow = location.state?.row || {};
    const lmcId = params?.id || passedRow?.id;

    const [detail, setDetail] = useState<LMCDetailApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Flatten form schema into key->question map and section header recognition
    const { questionMap, sectionHeaders } = useMemo(() => {
        const qMap: Record<string, string> = {};
        const headers: string[] = [];
        const schema: any = formSchema;
        Object.entries(schema).forEach(([sectionKey, sectionValue]: any) => {
            const groupObj = sectionValue as Record<string, { question: string; answers: string[] }>;
            Object.entries(groupObj).forEach(([fieldKey, meta]) => {
                qMap[fieldKey] = meta.question;
            });
            // Derive a human readable header from section key
            headers.push(sectionKey.replace(/_/g, ' ').toUpperCase());
        });
        return { questionMap: qMap, sectionHeaders: headers };
    }, []);

    useEffect(() => {
        if (!lmcId) return;
        const fetchDetail = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            if (!baseUrl || !token) { setError('Missing base URL or token'); return; }
            setLoading(true); setError(null);
            try {
                const res = await fetch(`https://${baseUrl}/lmcs/${lmcId}.json`, { headers: { Authorization: `Bearer ${token}` } });
                if (!res.ok) throw new Error(`Failed (${res.status})`);
                const json: LMCDetailApiResponse = await res.json();
                // Log raw keys once for diagnostics (will remove later)
                if (typeof window !== 'undefined') {
                    console.log('[LMC] Raw LMC detail keys:', Object.keys(json));
                    // Attempt to surface similarly named properties in case API uses a different naming
                    const possible = Object.entries(json).filter(([k]) => k.toLowerCase().includes('krcc'));
                    if (possible.length) console.log('[LMC] Possible KRCC related props:', possible.map(([k,v]) => ({ k, type: typeof v, value: v })));
                }
                // Normalize unexpected API key naming (backend sent 'selected_krcc_categories=' instead of 'selected_krcc_categories')
                const weirdKey = (json as any)['selected_krcc_categories='];
                if (weirdKey && !(json as any).selected_krcc_categories) {
                    (json as any).selected_krcc_categories = weirdKey;
                    if (typeof window !== 'undefined') {
                        console.log('[LMC] Normalized selected_krcc_categories= -> selected_krcc_categories', weirdKey);
                    }
                }
                setDetail(json);
            } catch (e: any) { setError(e.message || 'Failed to load LMC'); }
            finally { setLoading(false); }
        };
        fetchDetail();
    }, [lmcId]);

    // Build grouped checkpoints list based on selected categories (always include 'form' & 'final_page_form')
    const groupedCheckpoints = useMemo(() => {
        const schema: any = formSchema as any;
        const alwaysInclude = ['form', 'final_page_form'];
        const selectedRaw = detail?.selected_krcc_categories || [];
        const normalizedSelected = selectedRaw
            .map(c => (typeof c === 'string' ? c.trim() : c))
            .filter(Boolean) as string[];
        const seen = new Set<string>();
        const ordered: string[] = [];
        // Always include base categories first
        alwaysInclude.forEach(c => { if (!seen.has(c)) { seen.add(c); ordered.push(c); } });
        // Then include selected in the order received
        normalizedSelected.forEach(c => { if (!seen.has(c)) { seen.add(c); ordered.push(c); } });

        const formDetails = detail?.form_details || {};
        const groups = ordered.map(catKey => {
            const section = schema[catKey];
            if (!section) {
                console.warn('[LMC] Missing schema for category (exact key not found):', catKey);
                return { category: catKey, items: [] as Checkpoint[], missing: true };
            }
            const items: Checkpoint[] = Object.entries(section).map(([fieldKey, meta]: any) => {
                const answerRaw = formDetails[fieldKey];
                const answer = (answerRaw === undefined || answerRaw === null || answerRaw === '') ? '—' : String(answerRaw);
                return { question: meta.question, answer };
            });
            return { category: catKey, items, missing: false };
        });
        // Debug summary
        // Using console.log instead of console.debug because some production builds strip or hide debug level
        if (typeof window !== 'undefined') {
            console.log('[LMC] Categories to render:', ordered, 'Detail categories:', normalizedSelected, 'Groups:', groups.map(g => ({ c: g.category, count: g.items.length })));
        }
        return groups;
    }, [detail]);

    const lmcUser = detail?.lmc_user;
    const createdBy = detail?.created_by;
    const createdAt = detail?.created_at;

    const formatDate = (iso?: string | null) => {
        if (!iso) return '—';
        try { return new Date(iso).toLocaleDateString('en-GB'); } catch { return '—'; }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header with back button */}
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
            </div>

            {/* Personal Details */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
                    <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">PERSONAL DETAILS</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <span className="text-gray-500 text-sm">First Name</span>
                            <p className="text-gray-900 font-medium">{lmcUser?.name?.split(' ')[0] || '—'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Last Name</span>
                            <p className="text-gray-900 font-medium">{lmcUser?.name?.split(' ').slice(1).join(' ') || '—'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Email ID</span>
                            <p className="text-gray-900 font-medium">{lmcUser?.email || '—'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* LMC Details - Done By */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
                    <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
                        <BadgeCheck className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">LMC DETAILS</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <span className="text-gray-500 text-sm">LMC Done By (Unique ID)</span>
                            <p className="text-gray-900 font-medium">{createdBy?.id || '—'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Name</span>
                            <p className="text-gray-900 font-medium">{createdBy?.name || '—'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Email</span>
                            <p className="text-gray-900 font-medium">{createdBy?.email || '—'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Mobile Number</span>
                            <p className="text-gray-900 font-medium">{createdBy?.mobile || '—'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Circle</span>
                            <p className="text-gray-900 font-medium">—</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Function</span>
                            <p className="text-gray-900 font-medium">—</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Role</span>
                            <p className="text-gray-900 font-medium">—</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* LMC Details - Done On (with Unique Number) */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
                    <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">LMC DONE ON</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <span className="text-gray-500 text-sm">Name</span>
                            <p className="text-gray-900 font-medium">{lmcUser?.name || '—'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Vendor Name</span>
                            <p className="text-gray-900 font-medium">—</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Email</span>
                            <p className="text-gray-900 font-medium">{lmcUser?.email || '—'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Mobile Number</span>
                            <p className="text-gray-900 font-medium">{lmcUser?.mobile || '—'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Unique Number</span>
                            <p className="text-gray-900 font-medium">{detail?.id || '—'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* LMC Date & Checkpoints */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
                    <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
                        <CalendarCheck2 className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">LMC DATE: {formatDate(createdAt)}</h2>
                </div>
                <div className="p-6">
                    <div className="mb-4 font-semibold">Checkpoints:</div>
                    {groupedCheckpoints.map(group => (
                        <div key={group.category} className="mb-6 border rounded-lg">
                            <div className="px-4 py-2 border-b bg-gray-100 text-sm font-semibold flex items-center gap-2">
                                <span className="text-[#C72030]">{SECTION_TITLE_MAP[group.category] || group.category.replace(/KrccRequirementComingFrom\./,'').replace(/_/g,' ').toUpperCase()}</span>
                               
                            </div>
                            <div className="p-4">
                                {group.items.length > 0 ? (
                                    <ul className="space-y-4">
                                        {group.items.map((cp, idx) => (
                                            <li key={idx}>
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
                        <div className="text-gray-500">{loading ? 'Loading checkpoints...' : 'No checkpoints available.'}</div>
                    )}
                    {error && <div className="text-sm text-red-600 mt-4">{error}</div>}
                </div>
            </div>
        </div>
    );
};

export default LMCUserDetail;
