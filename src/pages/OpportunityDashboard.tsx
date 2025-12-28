import { useState, useEffect, useCallback } from 'react';
import { cache } from '@/utils/cacheUtils';
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
import EditOpportunityModal from '@/components/EditOpportunityModal';
import { useLayout } from '@/contexts/LayoutContext';
import { FormControl, MenuItem, Select } from '@mui/material';
import { useAppDispatch } from '@/store/hooks';

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

const statusOptions = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" },
]

const OpportunityDashboard = () => {
    const { setCurrentSection } = useLayout();

    const view = localStorage.getItem("selectedView");

    useEffect(() => {
        setCurrentSection(view === "admin" ? "Value Added Services" : "Project Task");
    }, [setCurrentSection]);

    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const baseUrl = localStorage.getItem('baseUrl');

    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedOpportunityId, setSelectedOpportunityId] = useState<number | null>(null);

    // Abstract fetch function to reuse
    const fetchOpportunities = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const cachedResult = await cache.getOrFetch(
                'opportunities_list',
                async () => {
                    const response = await axios.get(getFullUrl('/opportunities.json'), {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    return response.data || [];
                },
                2 * 60 * 1000, // Fresh for 2 minutes
                10 * 60 * 1000 // Stale up to 10 minutes
            );
            setOpportunities(cachedResult.data);
        } catch (err: any) {
            console.error('Error fetching opportunities:', err);
            setError(err.message || 'Failed to fetch opportunities');
            setOpportunities([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchOpportunities();
    }, [fetchOpportunities]);

    const handleStatusChange = async (id: number, status: string) => {
        const payload = {
            opportunity: {
                status,
            },
        };
        try {
            await axios.put(`https://${baseUrl}/opportunities/${id}.json`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Invalidate opportunity caches
            cache.invalidatePattern('opportunities_*');

            fetchOpportunities();
            toast.success("Project status changed successfully");
        } catch (error) {
            console.log(error)
        }
    }

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
            case "status": {
                const statusColorMap = {
                    active: { dot: "bg-emerald-500" },
                    in_progress: { dot: "bg-amber-500" },
                    on_hold: { dot: "bg-gray-500" },
                    completed: { dot: "bg-teal-500" },
                    overdue: { dot: "bg-red-500" },
                };

                const colors = statusColorMap[item.status as keyof typeof statusColorMap] || statusColorMap.active;

                return (
                    <FormControl
                        variant="standard"
                        sx={{ width: 148 }} // same as w-32
                    >
                        <Select
                            value={item.status}
                            onChange={(e) =>
                                handleStatusChange(item.id, e.target.value as string)
                            }
                            disableUnderline
                            renderValue={(value) => (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span className={`inline-block w-2 h-2 rounded-full ${colors.dot}`}></span>
                                    <span>{statusOptions.find(opt => opt.value === value)?.label || value}</span>
                                </div>
                            )}
                            sx={{
                                fontSize: "0.875rem",
                                cursor: "pointer",
                                "& .MuiSelect-select": {
                                    padding: "4px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                },
                            }}
                        >
                            {statusOptions.map((opt) => {
                                const optColors = statusColorMap[opt.value as keyof typeof statusColorMap];
                                return (
                                    <MenuItem key={opt.value} value={opt.value} sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span className={`inline-block w-2 h-2 rounded-full ${optColors?.dot || "bg-gray-500"}`}></span>
                                        <span>{opt.label}</span>
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                );
            }
            case 'created_by':
                return item.created_by?.name || '-';
            case 'created_at':
                return item.created_at ? item.created_at.split('T')[0] : '-';
            case 'action_taken':
                return item.task_created && item.project_management_id
                    ? 'Converted to Project'
                    : item.task_created && item.task_management_id
                        ? 'Converted to Task'
                        : item.task_created && item.milestone_id
                            ? 'Converted to Milestone'
                            : 'Not Converted';
            default:
                return (item as any)[columnKey];
        }
    };

    const renderActions = (item: Opportunity) => (
        <div className="flex justify-between items-center">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                    setSelectedOpportunityId(item.id);
                    setShowEditModal(true);
                }}
                className="text-blue-600 hover:text-blue-800"
            >
                <Edit className="w-4 h-4" />
            </Button>
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

            {selectedOpportunityId && (
                <EditOpportunityModal
                    open={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedOpportunityId(null);
                    }}
                    onSuccess={fetchOpportunities}
                    opportunityId={selectedOpportunityId}
                />
            )}
        </div>
    );
};

export default OpportunityDashboard;
