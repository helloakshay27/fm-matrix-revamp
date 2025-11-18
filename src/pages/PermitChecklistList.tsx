import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { toast } from 'sonner';

interface PermitChecklist {
    id: number;
    name: string;
    active: number;
    snag_audit_category_id: number;
    category: string;
    questions_count: number;
}

export const PermitChecklistList = () => {
    const { setCurrentSection } = useLayout();
    const navigate = useNavigate();

    React.useEffect(() => {
        setCurrentSection('Safety');
    }, [setCurrentSection]);

    const handleAddChecklist = () => {
        navigate('/safety/permit-checklist/add');
    };

    const handleViewDetails = (id: number) => {
        navigate(`/safety/permit/checklist/details/${id}`);
    };

    const [checklists, setChecklists] = React.useState<PermitChecklist[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchChecklists = async () => {
        try {
            setIsLoading(true);
            setError(null);

            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (!baseUrl || !token) {
                const errorMsg = 'Authentication credentials not found. Please login again.';
                console.error(errorMsg);
                setError(errorMsg);
                toast.error(errorMsg);
                setIsLoading(false);
                return;
            }

            // Ensure baseUrl has the correct format
            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
            }

            const url = `${baseUrl}/pms/admin/snag_checklists/permit_checklist.json`;
            console.log('Fetching checklists from:', url);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch checklists: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (data.status === 'success' && data.checklists) {
                setChecklists(data.checklists);
                console.log(`Successfully loaded ${data.checklists.length} checklists`);
            } else {
                console.warn('Unexpected API response format:', data);
                setChecklists([]);
            }
        } catch (error: any) {
            const errorMsg = error.message || 'Failed to fetch checklists';
            console.error('Error fetching checklists:', error);
            setError(errorMsg);
            toast.error(errorMsg);
            setChecklists([]);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchChecklists();
    }, []);

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                    <p className="text-gray-600">Loading checklists...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={fetchChecklists} className="bg-purple-600 hover:bg-purple-700">
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">PERMIT CHECKLIST</h1>

            </div>

            {/* Enhanced Table */}
            <EnhancedTable
                data={checklists}
                columns={[
                    {
                        key: 'sr_no',
                        label: 'Sr. No.',
                        sortable: false,
                        defaultVisible: true,
                        draggable: false
                    },
                    {
                        key: 'name',
                        label: 'Name',
                        sortable: true,
                        defaultVisible: true,
                        draggable: true
                    },
                    {
                        key: 'category',
                        label: 'Category',
                        sortable: true,
                        defaultVisible: true,
                        draggable: true
                    },
                    {
                        key: 'questions_count',
                        label: 'No. of Questions',
                        sortable: true,
                        defaultVisible: true,
                        draggable: true
                    }
                ]}
                renderCell={(item, columnKey) => {
                    if (columnKey === 'sr_no') {
                        return <div className="text-center">{checklists.indexOf(item) + 1}</div>;
                    }
                    return <div className="text-center">{item[columnKey as keyof PermitChecklist]}</div>;
                }}
                renderActions={(item) => (
                    <Button
                        onClick={() => handleViewDetails(item.id)}
                        variant="ghost"
                        size="sm"
                        className="p-2 hover:bg-gray-100"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                )}
                enableSearch={true}
                searchPlaceholder="Search checklists..."
                pagination={false}
                pageSize={20}
                storageKey="permit-checklist-list"
                enableExport={true}
                exportFileName="permit-checklists"
                leftActions={(<Button
                    onClick={handleAddChecklist}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Checklist
                </Button>)}
            />
        </div>
    );
};

export default PermitChecklistList;
