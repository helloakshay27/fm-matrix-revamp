import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';

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

    const fetchChecklists = async () => {
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                console.error('Base URL or token not found in localStorage');
                return;
            }

            const response = await fetch(
                `https://${baseUrl}/pms/admin/snag_checklists/permit_checklist.json`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch checklists');
            }

            const data = await response.json();
            if (data.status === 'success') {
                console.log('Checklist data:', data.checklists);
                setChecklists(data.checklists);
            }
        } catch (error) {
            console.error('Error fetching checklists:', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchChecklists();
    }, []);

    if (isLoading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">PERMIT CHECKLIST</h1>
                <Button
                    onClick={handleAddChecklist}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Checklist
                </Button>
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
            />
        </div>
    );
};

export default PermitChecklistList;
