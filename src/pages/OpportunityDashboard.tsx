import { useState, useEffect } from 'react';
import { Edit2, ChevronDown, Plus, Edit, Eye } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { getFullUrl } from '@/config/apiConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AddOpportunityModal from '@/components/AddOpportunityModal';

// Types
interface Opportunity {
    id: number;
    title: string;
    project_management_id?: number;
    task_management_id?: number;
    milestone_id?: number;
    status: string;
    created_by: {
        name: string;
    };
    created_at: string;
    task_created?: boolean;
    project_created?: boolean;
}

// Status options
const globalStatusOptions = ['open', 'in_progress', 'completed', 'on_hold', 'rejected'];

// Column configuration
const columns: ColumnConfig[] = [
    { key: 'id', label: 'ID', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'title', label: 'Title', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'created_by', label: 'Created By', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'created_at', label: 'Created On', sortable: true, hideable: true, draggable: true, defaultVisible: true },
    { key: 'action_taken', label: 'Action Taken', sortable: true, hideable: true, draggable: true, defaultVisible: true },
];



const OpportunityDashboard = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Abstract fetch function to reuse
    const fetchOpportunities = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(getFullUrl('/opportunities.json'), {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOpportunities(response.data || []);
        } catch (err: any) {
            console.error('Error fetching opportunities:', err);
            setError(err.message || 'Failed to fetch opportunities');
            setOpportunities([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOpportunities();
    }, []);


    const renderCell = (item: Opportunity, columnKey: string) => {
        switch (columnKey) {
            case 'id':
                return (
                    <button
                        onClick={() => navigate(`/opportunity/${item.id}`)}
                        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                        OP-{item.id}
                    </button>
                );
            case 'title':
                return item.title
                    .replace(/@\[(.*?)\]\(\d+\)/g, '@$1')
                    .replace(/#\[(.*?)\]\(\d+\)/g, '#$1');
            case 'status':
                return item.status;
            case 'created_by':
                return item.created_by?.name || '-';
            case 'created_at':
                return item.created_at ? item.created_at.split('T')[0] : '-';
            case 'action_taken':
                return item.task_created && item.project_management_id
                    ? 'Converted to Project'
                    : item.project_created && item.task_management_id
                        ? 'Converted to Task'
                        : item.task_created && item.milestone_id
                            ? 'Converted to Milestone'
                            : 'Not Converted';
            default:
                return (item as any)[columnKey];
        }
    };

    const renderActions = (item: Opportunity) => (
        <div className="flex justify-between items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/vas/opportunity/${item.id}`)}
                className="text-blue-600 hover:text-blue-800"
            >
                <Eye className="w-4 h-4" />
            </Button>
        </div>
    );

    const leftActions = (
        <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
        >
            <Plus className="w-4 h-4" /> Add Opportunity
        </Button>
    );

    if (error) {
        return (
            <div className="m-4">
                <div className="flex items-center justify-center py-12 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-600">Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="opportunity-wrapper p-6">
            <EnhancedTable
                data={opportunities}
                columns={columns}
                renderCell={renderCell}
                renderActions={renderActions}
                leftActions={leftActions}
                enableSearch={true}
                enableSelection={false}
                storageKey="opportunity-table"
                pagination={true}
                pageSize={10}
                loading={loading}
                emptyMessage="No opportunities found"
            />

            <AddOpportunityModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={fetchOpportunities}
            />
        </div>
    );
};

export default OpportunityDashboard;
