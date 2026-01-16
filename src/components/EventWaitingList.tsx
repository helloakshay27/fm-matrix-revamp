import { FileText, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from './enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

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

const EventWaitingList = () => {
    const { id: eventId } = useParams();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');
    const navigate = useNavigate()

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRegisteredUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://${baseUrl}/pms/admin/events/${eventId}/registered_users.json`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Assuming the response data contains a registered_users array or is the array itself
            const users = response.data.registered_users || response.data || [];
            setData(users);
        } catch (error) {
            console.error('Error fetching registered users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegisteredUsers();
    }, []);

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

        if (columnKey === 'mobile') {
            return item?.user?.mobile;
        }

        if (columnKey === 'email') {
            return item?.user?.email;
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
            <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
                <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                    <FileText size={16} />
                </div>
                <span className="font-semibold text-lg text-gray-800">Requestor Details</span>
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
                />
            )}
        </div>
    );
};

export default EventWaitingList;