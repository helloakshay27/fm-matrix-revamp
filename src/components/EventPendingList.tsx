import { FileText, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from './enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { fetchEventById } from '@/store/slices/eventSlice';

const columns: ColumnConfig[] = [
    {
        key: 'action',
        label: 'Action',
        sortable: false,
        draggable: false
    },
    {
        key: 'full_name',
        label: 'Requestor Name',
        sortable: true,
        draggable: true
    },
    {
        key: 'mobile',
        label: 'Requestor Number',
        sortable: true,
        draggable: true
    },
    {
        key: 'email',
        label: 'Requestor Mail',
        sortable: true,
        draggable: true
    },
    {
        key: 'organisation',
        label: 'Organisation',
        sortable: true,
        draggable: true
    },
    {
        key: 'created_at',
        label: 'Request Date',
        sortable: true,
        draggable: true
    },
    {
        key: 'status',
        label: 'Status',
        sortable: true,
        draggable: true
    }
];

const EventPendingList = () => {
    const { id: eventId } = useParams();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [eventData, setEventData] = useState<any>({});

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await dispatch(fetchEventById({ id: eventId, baseUrl, token })).unwrap();
                setEventData(response)
            } catch (error) {
                console.log(error)
                toast.error("Failed to fetch event")
            }
        }

        fetchEvent();
    }, [])

    const fetchRegisteredUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://${baseUrl}/pms/admin/events/${eventId}/registered_users.json?q[status_eq]=pending`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const users = response.data.registered_users || response.data || [];
            setData(users);
            setSelectedItems([]); // Clear selection after fetch
        } catch (error) {
            console.error('Error fetching registered users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegisteredUsers();
    }, []);

    const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
        if (selectedItems.length === 0) return;

        setIsUpdating(true);
        try {
            // Bulk update API call
            await axios.get(`https://${baseUrl}/pms/admin/events/${eventId}/update_approval_status.json`, {
                params: {
                    'event_user_ids[]': selectedItems,
                    status: status
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                paramsSerializer: {
                    indexes: null, // this will format as event_user_ids[]=1&event_user_ids[]=2
                }
            });

            toast.success(`Selected users have been ${status} successfully.`);
            fetchRegisteredUsers(); // Refresh the list
        } catch (error: any) {
            console.error(`Error updating status to ${status}:`, error);
            toast.error(error?.response?.data?.error || `An error occurred while trying to ${status === 'approved' ? 'approve' : 'deny'} users.`);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(data.map(item => String(item.id)));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (itemId: string, checked: boolean) => {
        if (checked) {
            setSelectedItems(prev => [...prev, itemId]);
        } else {
            setSelectedItems(prev => prev.filter(id => id !== itemId));
        }
    };

    const renderCell = (item: any, columnKey: string) => {
        if (columnKey === 'action') {
            return (
                <Button variant="ghost" size="sm" onClick={() => navigate(`users/${item.id}`)}>
                    <Eye className="w-4 h-4" />
                </Button>
            );
        }

        if (columnKey === 'full_name') {
            return item?.user?.firstname + " " + item?.user?.lastname;
        }

        if (columnKey === 'email') {
            return item?.user?.email;
        }

        if (columnKey === 'mobile') {
            return item?.user?.mobile;
        }

        if (columnKey === 'organisation') {
            return item?.user?.organization?.name;
        }

        if (columnKey === 'created_at' && item.created_at) {
            return new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
            }).format(new Date(item.created_at));
        }

        if (columnKey === 'status') {
            return item.status.charAt(0).toUpperCase() + item.status.slice(1);
        }

        return item[columnKey] || "-";
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-[#F6F4EE] p-4 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                        <FileText size={16} />
                    </div>
                    <span className="font-semibold text-lg text-gray-800">Requestor Details</span>
                </div>
                {
                    data.length > 0 && (
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white px-8 h-10 disabled:opacity-50"
                                onClick={() => handleStatusUpdate('rejected')}
                                disabled={selectedItems.length === 0 || isUpdating || eventData.total_registed_count === eventData.capacity}
                            >
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Deny
                            </Button>
                            <Button
                                className="!bg-[#00A651] !hover:bg-[#008C44] !text-black px-8 h-10 disabled:opacity-50"
                                onClick={() => handleStatusUpdate('approved')}
                                disabled={selectedItems.length === 0 || isUpdating || eventData.total_registed_count === eventData.capacity}
                            >
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Approve
                            </Button>
                        </div>
                    )
                }
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
                </div>
            ) : (
                <EnhancedTable
                    data={data}
                    columns={columns}
                    renderCell={renderCell}
                    hideColumnsButton={true}
                    hideTableSearch={true}
                    selectable={true}
                    enableSelection={true}
                    selectedItems={selectedItems}
                    onSelectAll={handleSelectAll}
                    onSelectItem={handleSelectItem}
                    getItemId={(item: any) => String(item.id)}
                />
            )}
        </div>
    );
};

export default EventPendingList;