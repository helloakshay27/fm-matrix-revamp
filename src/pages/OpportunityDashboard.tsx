import { useState, useEffect } from 'react';
import { Edit2, ChevronDown } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { getFullUrl } from '@/config/apiConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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

    useEffect(() => {
        const token = localStorage.getItem('token');
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
        fetchOpportunities();
    }, []);

    const handleOptionSelect = async (option: string, id: number) => {
        const token = localStorage.getItem('token');
        const payload = {
            opportunity: {
                status: option,
            },
        };
        try {
            await axios.put(getFullUrl(`/opportunities/${id}.json`), payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.dismiss();
            toast.success('Status updated successfully');

            // Update the opportunities list locally
            setOpportunities((prevOpportunities) =>
                prevOpportunities.map((opp) => (opp.id === id ? { ...opp, status: option } : opp))
            );
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const renderRow = (item: Opportunity) => {
        const [dropdownOpen, setDropdownOpen] = useState(false);

        return {
            id: (
                <button
                    onClick={() => navigate(`/opportunity/${item.id}`)}
                    className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                    OP-{item.id}
                </button>
            ),
            title: item.title
                .replace(/@\[(.*?)\]\(\d+\)/g, '@$1')
                .replace(/#\[(.*?)\]\(\d+\)/g, '#$1'),
            status: (
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-1 px-2 py-1 text-sm border rounded"
                    >
                        <StatusBadge status={item.status} />
                        <ChevronDown size={14} />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow z-10 min-w-max">
                            {globalStatusOptions.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        handleOptionSelect(opt, item.id);
                                        setDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ),
            created_by: item.created_by.name,
            created_at: item.created_at.split('T')[0],
            action_taken: item.task_created && item.project_management_id
                ? 'Converted to Project'
                : item.project_created && item.task_management_id
                    ? 'Converted to Task'
                    : item.task_created && item.milestone_id
                        ? 'Converted to Milestone'
                        : 'Not Converted',
        };
    };

    const renderActions = (item: Opportunity) => (
        <div className="flex justify-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/opportunity/${item.id}`)}
                className="text-blue-600 hover:text-blue-800"
            >
                <Edit2 className="w-4 h-4" />
            </Button>
        </div>
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
                renderRow={renderRow}
                renderActions={renderActions}
                enableSearch={true}
                enableSelection={false}
                storageKey="opportunity-table"
                pagination={true}
                pageSize={10}
                loading={loading}
                emptyMessage="No opportunities found"
                onRowClick={(item) => navigate(`/opportunity/${item.id}`)}
            />
        </div>
    );
};

export default OpportunityDashboard;
